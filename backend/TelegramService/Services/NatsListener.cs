using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Google.Protobuf;
using GrpcService1.Protos.Nats;
using Microsoft.Extensions.Hosting;
using NATS.Client;

namespace TelegramService.Services
{
    public class NatsListener : IHostedService
    {
        private readonly IConfig config;
        private IConnection nats;
        private IAsyncSubscription subscription;
        private readonly Manager manager;

        public NatsListener(IConfig config, Manager manager)
        {
            this.config = config;
            this.manager = manager;
        }

        private void Handler(object sender, MsgHandlerEventArgs e)
        {
            Stream stream = new MemoryStream(e.Message.Data);
            EventNats ev = new EventNats();
            ev.MergeFrom(stream);
            if (ev.Event.KeepAlive ||
                ev.Event.Balance != null)
                return;
            manager.OnEvent(ev).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            ConnectionFactory cf = new ConnectionFactory();
            nats = cf.CreateConnection(config.NatsUrl);
            subscription = nats.SubscribeAsync("Events", Handler);
            return Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            subscription.Dispose();
            await nats.DrainAsync();
            nats.Close();
        }
    }
}