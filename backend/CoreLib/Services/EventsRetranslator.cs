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
using GrpcService1.Protos.Nats;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NATS.Client;
using Shared;
using Event = Protos.TradeApi.V1.Event;

namespace CoreLib.Services
{
    public interface IEventsRetranslator
    {
        Task RegisterStream(IServerStreamWriter<Event> stream, CancellationToken token,
            UserData user, ServerCallContext context);

        void Send(UserEvent evt);
    }

    public class EventsRetranslator : IEventsRetranslator
    {
        private class Sub
        {
            public CancellationToken Token;
            public string UserId;
            public IServerStreamWriter<Event> Stream;
            public bool Error;
        }

        private readonly List<Sub> subs = new List<Sub>();
        private int UserMaxSubscriptions = 30;
        private readonly IServiceProvider serviceProvider;
        private readonly IConnection nats;
        private readonly IAsyncSubscription subscription;
        private readonly object locker = new object();
        private readonly ILogger<EventsRetranslator> logger;

        public EventsRetranslator(IServiceProvider serviceProvider, ILogger<EventsRetranslator> logger,
            INatsConfig config)
        {
            this.serviceProvider = serviceProvider;
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

            subscription = nats.SubscribeAsync("Events", Handler);
        }

        private void Handler(object sender, MsgHandlerEventArgs e)
        {
            Stream stream = new MemoryStream(e.Message.Data);
            EventNats ev = new EventNats();
            ev.MergeFrom(stream);
            List<Sub> sub;
            lock (locker)
            {
                sub = subs.Where(p => p.UserId == ev.Receiver).ToList();
            }

            if (!sub.Any())
                return;
            foreach (var s in sub)
                Send(ev.Event, s).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public async Task RegisterStream(IServerStreamWriter<Event> stream, CancellationToken token,
            UserData user, ServerCallContext context)
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

                var ev = new UserEvent
                {
                    Type = UserEventTypes.BalanceChanged,
                    CreatedAt = DateTime.Now,
                    Balance = user.Balance,
                    Id = 0,
                    Receiver = user
                };

                foreach (var userEvent in new[] {ev}.Concat(user.Events))
                {
                    await Send(userEvent.ToPb(), sub);
                }

                while (!sub.Error && !sub.Token.IsCancellationRequested && !token.IsCancellationRequested)
                {
                    await Task.Delay(Config.RetranslatorKeepAliveDelay, token);
                    var e = new Event
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

        private async Task Send(Event evt, Sub sub)
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


        public void Send(UserEvent evt)
        {
            using var scope = serviceProvider.CreateScope();
            if (evt.Type != UserEventTypes.ImageStored)
            {
                var pb = evt.ToPb();
                EventNats e = new EventNats
                {
                    Receiver = evt.Receiver.UserId,
                    Event = pb
                };
                nats.Publish("Events", e.ToByteArray());
            }
        }
    }
}