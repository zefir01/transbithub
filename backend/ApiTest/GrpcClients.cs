using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Auth.Protos.Internal;
using Grpc.Core;
using Grpc.Net.Client;
using Grpc.Net.Client.Web;
using Microsoft.Extensions.Logging;
using Protos.ProfileApi.V1;
using Protos.TradeApi.V1;

namespace ApiTest
{
    public class GrpcClients
    {
        public ProfileApi.ProfileApiClient ProfileClient { get; private set; }
        public TradeApi.TradeApiClient TradeClient { get; private set; }
        private readonly Config config;
        private string token;
        private readonly ILogger<GrpcClients> logger;
        private readonly ILoggerFactory loggerFactory;

        public void UpdateToken(string token)
        {
            this.token = token;
            Init(token);
        }

        public GrpcClients(Config config, ILogger<GrpcClients> logger, ILoggerFactory loggerFactory)
        {
            this.config = config;
            this.logger = logger;
            this.loggerFactory = loggerFactory;
            Init(token);
        }

        private void Init(string token)
        {
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2Support", true);
            var callCredentials = CallCredentials.FromInterceptor((context, metadata) =>
            {
                metadata.Add("Authorization", $"Bearer {token}");
                return Task.CompletedTask;
            });

            var channelCredentials = ChannelCredentials.Create(new SslCredentials(), callCredentials);
            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            var channelOptions = new GrpcChannelOptions
            {
                Credentials = channelCredentials,
                //HttpHandler = new GrpcWebHandler(GrpcWebMode.GrpcWebText, handler),
                HttpHandler = handler,
                LoggerFactory = loggerFactory
            };
            var channel = GrpcChannel.ForAddress($"https://{config.Host}:{config.GrpcPort}", channelOptions);
            ProfileClient = new ProfileApi.ProfileApiClient(channel);
            TradeClient = new TradeApi.TradeApiClient(channel);
            logger.LogDebug("Token updated.");
        }
    }
}