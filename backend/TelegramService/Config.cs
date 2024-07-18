using System;
using Backend;
using Castle.Core.Internal;
using CoreLib;
using Microsoft.Extensions.Configuration;
using NBitcoin;

namespace TelegramService
{
    public interface IConfig : INatsConfig, IBtcConfig
    {
        string TelegramConnection { get; }
        string TelegramToken { get; }
        string AuthHost { get; }
        string AuthHostInternal { get; }
        string AuthHttpPort { get; }
        string AuthHttp2PortInternal { get; }
        string BackendGrpcUrl { get; }
        string ProxyUser { get; }
        string ProxyPass { get; }
        string ProxyUrl { get; }
        string SiteName { get; }
        string WebhookIp { get; }
        string WebHookPem { get; }
        bool Migrate { get; }
        string TelegramBaseUrl { get; }
        string WebhookPath { get; }
    }

    public class Config : IConfig
    {
        public string TelegramConnection { get; }
        public string NatsUrl { get; }
        public string TelegramToken { get; }
        public string AuthHost { get; }
        public string AuthHostInternal { get; }
        public string AuthHttpPort { get; }
        public string AuthHttp2PortInternal { get; }
        public string BackendGrpcUrl { get; }
        public string ProxyUser { get; }
        public string ProxyPass { get; }
        public string ProxyUrl { get; }
        public string SiteName { get; }
        public string WebhookIp { get; }
        public string WebHookPem { get; }
        public bool Migrate { get; }
        public string TelegramBaseUrl { get; }
        public string WebhookPath { get; }

        public Config(IConfiguration configuration)
        {
            Migrate = !configuration["MIGRATE"]?.IsNullOrEmpty() ?? false;
            var host = configuration["TELEGRAM_HOST"] ?? "postgres-telegram";
            var port = configuration["TELEGRAM_PORT"] ?? "5432";
            var db = configuration["TELEGRAM_DB"] ?? "globalbitcoins_telegram";
            var user = configuration["TELEGRAM_USER"] ?? "globalbitcoins";
            var pass = configuration["TELEGRAM_PASS"] ?? "globalbitcoins";
            TelegramConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=1024;";
            NatsUrl = configuration["NATS_URL"];
            TelegramToken = configuration["TELEGRAM_TOKEN"];
            AuthHost = configuration["AUTH_HOST"];
            AuthHostInternal = configuration["AUTH_HOST_INTERNAL"];
            AuthHttpPort = configuration["AUTH_HTTP_PORT"];
            AuthHttp2PortInternal = configuration["AUTH_HTTP2_PORT_INTERNAL"];
            BackendGrpcUrl = configuration["BACKEND_GRPC_URL"];
            ProxyUser = configuration["PROXY_USER"];
            ProxyPass = configuration["PROXY_PASS"];
            ProxyUrl = configuration["PROXY_URL"];
            SiteName = configuration["SITE_NAME"];
            WebhookIp = configuration["WEBHOOK_IP"];
            WebHookPem = configuration["WEBHOOK_PEM"];
            TelegramBaseUrl = configuration["TELEGRAM_BASE_URL"];
            WebhookPath = configuration["WEBHOOK_PATH"];
            
            BitcoinNetwork = configuration["BITCOIN_NETWORK"] switch
            {
                "mainnet" => Network.Main,
                _ => Network.TestNet
            };
        }

        public Network BitcoinNetwork { get; }
    }
}