using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys;
using Google.Protobuf;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using NATS.Client;
using Protos.TradeApi.V1;
using Shared;

namespace CoreLib.Services
{
    public class VariablesRetranslator : IDisposable
    {
        private class Sub
        {
            public CancellationToken Token;
            public string UserId;
            public IServerStreamWriter<Variables> Stream;
            public bool Error;
        }

        private readonly List<Sub> subs = new List<Sub>();
        private readonly int UserMaxSubscriptions = 30;
        private readonly IConnection nats;
        private readonly IAsyncSubscription subscription;
        private readonly object locker = new object();
        private readonly ILogger<VariablesRetranslator> logger;

        public VariablesRetranslator(ILogger<VariablesRetranslator> logger, INatsConfig config)
        {
            this.logger = logger;
            ConnectionFactory cf = new ConnectionFactory();
            while (nats == null)
            {
                try
                {
                    Options opts = ConnectionFactory.GetDefaultOptions();
                    opts.NoRandomize = true;
                    opts.Timeout = 5000;
                    opts.Name = Guid.NewGuid().ToString();
                    opts.Verbose = true;
                    opts.Url = config.NatsUrl;
                    opts.AllowReconnect = true;
                    nats = cf.CreateConnection(opts);
                }
                catch (Exception e)
                {
                    logger.LogError("Nats connection error.", e);
                }
            }

            subscription = nats.SubscribeAsync("Variables", Handler);
        }

        private void Handler(object sender, MsgHandlerEventArgs e)
        {
            List<Sub> ss;
            lock (locker)
            {
                ss = subs.ToList();
            }

            foreach (var sub in ss)
            {
                Stream stream = new MemoryStream(e.Message.Data);
                Variables vars = new Variables();
                vars.MergeFrom(stream);
                Send(vars, sub).ConfigureAwait(false).GetAwaiter().GetResult();
            }
        }

        public async Task RegisterStream(IServerStreamWriter<Variables> stream, DataDBContext db, string userId,
            CancellationToken token,
            ServerCallContext context)
        {
            var sub = new Sub
            {
                UserId = userId,
                Token = token,
                Stream = stream
            };

            try
            {
                lock (locker)
                {
                    if (subs.Count(p => p.UserId == userId) >= UserMaxSubscriptions)
                        throw new UserException("Maximum subscriptions reached");
                    subs.Add(sub);
                }

                var vars = await db.GetVariables(token);
                var pb = vars.ToPb();
                await Send(pb, sub);

                while (!sub.Error && !sub.Token.IsCancellationRequested && !token.IsCancellationRequested)
                {

                    await Task.Delay(Config.RetranslatorKeepAliveDelay, token);
                    var v = new Variables
                    {
                        KeepAlive = true
                    };

                    await sub.Stream.WriteAsync(v);
                }
            }
            finally
            {
                lock (locker)
                {
                    if(subs.Contains(sub))
                        subs.Remove(sub);
                }   
            }
        }

        private async Task Send(Variables variables, Sub sub)
        {
            try
            {
                await sub.Stream.WriteAsync(variables);
            }
            catch (Exception)
            {
                sub.Error = true;
            }
        }


        public void Send(IList<FiatExchangeVariable> fiatVariables, IList<CryptoExchangeVariable> cryptoVariables
            , IList<AvgPrice> avgPrices
        )
        {
            var f = fiatVariables.Select(p => (p.Key.ToString(), p.Value));
            var c = cryptoVariables.Select(p => (p.Key.ToString(), p.Value));
            var a = avgPrices.Select(p => (p.Name, p.Value));
            var r = c.Concat(f).Concat(a).ToList();
            var pb = r.ToPb();
            nats.Publish("Variables", pb.ToByteArray());
        }

        public void Dispose()
        {
            nats?.Dispose();
        }
    }
}