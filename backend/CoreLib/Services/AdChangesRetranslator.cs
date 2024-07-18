using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Google.Protobuf;
using Grpc.Core;
using GrpcService1.Protos.Nats;
using Microsoft.Extensions.Logging;
using NATS.Client;
using Protos.TradeApi.V1;
using Shared;

// ReSharper disable MethodSupportsCancellation

namespace CoreLib.Services
{
    public interface IAdChangesRetranslator
    {
        Task RegisterStream(IServerStreamWriter<SubscribeAdvertisementChangesResponse> stream,
            CancellationToken token,
            string userId, long adId);
    }

    public class AdChangesRetranslator : IAdChangesRetranslator
    {
        private class Sub
        {
            public CancellationToken Token;
            public string UserId;
            public long AdId;
            public bool Error;
            public IServerStreamWriter<SubscribeAdvertisementChangesResponse> stream;
        }

        private List<Sub> subs = new List<Sub>();


        readonly SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);

        private int UserMaxSubscriptions = 30;
        private readonly IConnection nats;
        private readonly IAsyncSubscription subscription;
        private readonly object locker = new object();
        private readonly ILogger<AdChangesRetranslator> logger;
        private readonly IServiceProvider provider;

        public AdChangesRetranslator(ILogger<AdChangesRetranslator> logger, INatsConfig config,
            IServiceProvider provider)
        {
            this.logger = logger;
            this.provider = provider;
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

            subscription = nats.SubscribeAsync("AdChanges", Handler);
        }

        private void Handler(object sender, MsgHandlerEventArgs e)
        {
            Stream stream = new MemoryStream(e.Message.Data);
            AdChanged ad = new AdChanged();
            ad.MergeFrom(stream);
            List<Sub> ss;
            lock (locker)
            {
                ss = subs.Where(p => (ulong) p.AdId == ad.AdId).ToList();
            }

            foreach (var sub in ss)
            {
                Send(sub, ad).ConfigureAwait(false).GetAwaiter().GetResult();
                if (ad.Data.AdDeleted)
                    sub.Error = true;
            }
        }

        private async Task Send(Sub sub, AdChanged ad)
        {
            try
            {
                await sub.stream.WriteAsync(ad.Data);
            }
            catch (Exception)
            {
                sub.Error = true;
            }
        }


        public async Task RegisterStream(IServerStreamWriter<SubscribeAdvertisementChangesResponse> stream,
            CancellationToken token,
            string userId, long adId)
        {
            var sub = new Sub
            {
                UserId = userId,
                Token = token,
                AdId = adId,
                stream = stream
            };
            try
            {
                lock (locker)
                {
                    if (subs.Count(p => p.UserId == userId) >= UserMaxSubscriptions)
                        throw new UserException("Maximum subscriptions reached");

                    subs.Add(sub);
                }

                while (!sub.Error && !sub.Token.IsCancellationRequested && !token.IsCancellationRequested)
                {
                    await Task.Delay(Config.RetranslatorKeepAliveDelay, token);
                    var c = new SubscribeAdvertisementChangesResponse
                    {
                        KeepAlive = true
                    };
                    await sub.stream.WriteAsync(c);
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


        public void Notify(AdChangedNotification notification, CancellationToken cancellationToken)
        {
            var ret = new AdChanged
            {
                AdId = (ulong) notification.Payload.Id,
                Data = new SubscribeAdvertisementChangesResponse
                {
                    Advertisement = notification.Payload.ToPb("")
                }
            };
            nats.Publish("AdChanges", ret.ToByteArray());
        }

        public void Notify(AdDeletedNotification notification, CancellationToken cancellationToken)
        {
            var ret = new AdChanged
            {
                AdId = (ulong) notification.Payload,
                Data = new SubscribeAdvertisementChangesResponse
                {
                    AdDeleted = true
                }
            };
            nats.Publish("AdChanges", ret.ToByteArray());
        }
    }
}