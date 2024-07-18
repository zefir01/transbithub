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

namespace CoreLib.Services
{
    public interface IPublicInvoiceRetranslator
    {
        Task RegisterStream(IServerStreamWriter<SubscribePublicInvoiceResponse> stream,
            CancellationToken token,
            string userId, long invoiceId);
    }

    public class PublicInvoiceRetranslator : IPublicInvoiceRetranslator
    {
        private class Sub
        {
            public CancellationToken Token;
            public string UserId;
            public long InvoiceId;
            public bool Error;
            public IServerStreamWriter<SubscribePublicInvoiceResponse> Stream;
        }

        private List<Sub> subs = new List<Sub>();
        readonly SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);
        private int UserMaxSubscriptions = 30;
        private readonly IConnection nats;
        private readonly IAsyncSubscription subscription;
        private readonly object locker = new object();
        private readonly ILogger<PublicInvoiceRetranslator> logger;
        private readonly string subject = "PublicInvoiceChanges";
        private readonly IServiceProvider provider;

        public PublicInvoiceRetranslator(ILogger<PublicInvoiceRetranslator> logger, INatsConfig config, IServiceProvider provider)
        {
            this.logger = logger;
            this.provider = provider;
            ConnectionFactory cf = new ConnectionFactory();
            nats = cf.CreateConnection(config.NatsUrl);
            subscription = nats.SubscribeAsync(subject, Handler);
        }

        private void Handler(object sender, MsgHandlerEventArgs e)
        {
            PublicInvoiceChanged changes = new PublicInvoiceChanged();
            Stream stream = new MemoryStream(e.Message.Data);
            changes.MergeFrom(stream);
            List<Sub> ss;
            lock (locker)
            {
                ss = subs.Where(p => (ulong) p.InvoiceId == changes.InvoiceId).ToList();
            }

            foreach (var sub in ss)
            {
                Send(sub, changes).ConfigureAwait(false).GetAwaiter().GetResult();
                if (changes.IsInvoiceDeleted)
                    sub.Error = true;
            }
        }

        private async Task Send(Sub sub, PublicInvoiceChanged changes)
        {
            try
            {
                await sub.Stream.WriteAsync(changes.Data);
            }
            catch (Exception)
            {
                sub.Error = true;
            }
        }
        
        public async Task RegisterStream(IServerStreamWriter<SubscribePublicInvoiceResponse> stream,
            CancellationToken token,
            string userId, long invoiceId)
        {
            var sub = new Sub
            {
                Token = token,
                UserId = userId,
                InvoiceId = invoiceId,
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

                while (!sub.Error && !sub.Token.IsCancellationRequested && !token.IsCancellationRequested)
                {
                    await Task.Delay(Config.RetranslatorKeepAliveDelay, token);
                    var c = new SubscribePublicInvoiceResponse
                    {
                        KeepAlive = true
                    };
                    await sub.Stream.WriteAsync(c);
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
        
        public void Notify(InvoiceChangedNotification notification, CancellationToken cancellationToken)
        {
            var ret = new PublicInvoiceChanged
            {
                InvoiceId = (ulong)notification.Payload.Id,
                Data = new SubscribePublicInvoiceResponse
                {
                    Invoice = notification.Payload.ToPb("")
                }
            };
            nats.Publish(subject, ret.ToByteArray());
        }
        
        public void Notify(InvoiceDeleteNotification notification, CancellationToken cancellationToken)
        {
            var ret = new PublicInvoiceChanged
            {
                InvoiceId = (ulong)notification.Payload,
                Data = new SubscribePublicInvoiceResponse
                {
                    InvoiceDeleted = true
                }
            };
            nats.Publish(subject, ret.ToByteArray());
        }

    }
}