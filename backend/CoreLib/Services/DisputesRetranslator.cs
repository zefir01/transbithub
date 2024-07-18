using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys;
using CoreLib.Entitys.UserDataParts;
using Google.Protobuf;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using NATS.Client;
using Protos.Adminka.V1;
using Shared;
using Dispute = CoreLib.Entitys.Dispute;

namespace CoreLib.Services
{
    public interface IDisputesRetranslator
    {
        Task RegisterStream(IServerStreamWriter<DisputeEvent> stream, CancellationToken token,
            UserData user, DataDBContext db, ServerCallContext context);

        void DisputeUpdated(Dispute dispute);
    }

    public class DisputesRetranslator : IDisputesRetranslator, IDisposable
    {
        private class Sub
        {
            public CancellationToken Token;
            public string UserId;
            public IServerStreamWriter<DisputeEvent> Stream;
            public bool Error;
        }

        private readonly List<Sub> subs = new();
        private int UserMaxSubscriptions = 30;
        private readonly IConnection nats;
        private readonly IAsyncSubscription subscription;
        private readonly object locker = new object();
        private readonly ILogger<DisputesRetranslator> logger;


        public DisputesRetranslator(ILogger<DisputesRetranslator> logger,
            INatsConfig config, bool listen = false)
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

            if (listen)
                subscription = nats.SubscribeAsync("Disputes", Handler);
        }

        private void Handler(object sender, MsgHandlerEventArgs e)
        {
            Stream stream = new MemoryStream(e.Message.Data);
            DisputeEvent ev = new DisputeEvent();
            ev.MergeFrom(stream);
            logger.LogDebug($"Route dispute:\n{ev}");
            List<Sub> sub;
            lock (locker)
            {
                sub = subs.ToList();
            }

            if (!sub.Any())
                return;
            foreach (var s in sub)
                Send(ev, s).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public async Task RegisterStream(IServerStreamWriter<DisputeEvent> stream, CancellationToken token,
            UserData user, DataDBContext db, ServerCallContext context)
        {
            var sub = new Sub
            {
                UserId = user.UserId,
                Token = token,
                Stream = stream
            };

            try
            {
                lock (locker)
                {
                    if (subs.Count(p => p.UserId == user.UserId) >= UserMaxSubscriptions)
                        throw new UserException("Maximum subscriptions reached");

                    subs.Add(sub);
                }

                logger.LogDebug($"New disputes subscription: {user.UserId}");

                var disputes = db.Disputes.Where(p => p.Arbitor == null && p.Deal.Status == DealStatus.Disputed)
                    .ToList();
                foreach (var dispute in disputes)
                {
                    var evt = new DisputeEvent
                    {
                        Dispute = dispute.ToPb()
                    };
                    await Send(evt, sub);
                }

                while (!sub.Error && !sub.Token.IsCancellationRequested && !token.IsCancellationRequested)
                {
                    await Task.Delay(Config.RetranslatorKeepAliveDelay, token);
                    var e = new DisputeEvent
                    {
                        KeepAlive = true
                    };
                    await sub.Stream.WriteAsync(e);
                }
            }
            finally
            {
                lock (locker)
                {
                    if (subs.Contains(sub))
                        subs.Remove(sub);
                }
            }
        }

        private async Task Send(DisputeEvent evt, Sub sub)
        {
            try
            {
                await sub.Stream.WriteAsync(evt);
            }
            catch (Exception)
            {
                sub.Error = true;
            }
        }


        public void DisputeUpdated(Dispute dispute)
        {
            var evt = new DisputeEvent
            {
                Dispute = dispute.ToPb()
            };
            logger.LogDebug($"Sending new dispute:\n{evt}");
            nats.Publish("Disputes", evt.ToByteArray());
        }

        public void Dispose()
        {
            nats?.Dispose();
            subscription?.Dispose();
        }
    }
}