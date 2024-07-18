using System;
using System.Net.Http;
using System.Threading.Tasks;
using Auth.Protos.Internal;
using Grpc.Core;
using Grpc.Net.Client;
using Protos.ProfileApi.V1;
using Protos.TradeApi.V1;

namespace TelegramService.Services
{
    public class GrpcClients
    {
        public Internal.InternalClient AuthClient { get; private set; }
        public ProfileApi.ProfileApiClient ProfileClient { get; private set; }
        public TradeApi.TradeApiClient TradeClient { get; private set; }
        private readonly IConfig config;
        private string token;

        public void UpdateToken(string token)
        {
            this.token = token;
            Init(token);
        }
        public GrpcClients(IConfig config, string token)
        {
            this.config = config;
            this.token = token;
            Init(token);
        }

        private void Init(string token)
        {
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            var httpClientHandler = new HttpClientHandler();
            httpClientHandler.ServerCertificateCustomValidationCallback = 
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            var httpClient = new HttpClient(httpClientHandler);
            
            var callCredentials = CallCredentials.FromInterceptor((context, metadata) =>
            {
                metadata.Add("Authorization", $"Bearer {token}");
                return Task.CompletedTask;
            });

            
            var channelOptions = new GrpcChannelOptions
            {
                HttpClient = httpClient,
                
            };
            var channel = GrpcChannel.ForAddress($"http://{config.AuthHostInternal}:{config.AuthHttp2PortInternal}", channelOptions);
            AuthClient = new Internal.InternalClient(channel);
            
            var channelCredentials = ChannelCredentials.Create( new SslCredentials(), callCredentials);
            channelOptions = new GrpcChannelOptions
            {
                HttpClient = httpClient,
                Credentials = channelCredentials
            };
            GrpcChannel.ForAddress(config.BackendGrpcUrl, channelOptions);
            ProfileClient = new ProfileApi.ProfileApiClient(channel);
            
            channel = GrpcChannel.ForAddress(config.BackendGrpcUrl, channelOptions);
            TradeClient = new TradeApi.TradeApiClient(channel);
        }
    }
}