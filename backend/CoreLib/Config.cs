using Castle.Core.Internal;
using CoreLib.Services;
using Microsoft.Extensions.Configuration;
using NBitcoin;

namespace CoreLib
{
    public interface IDataDbConfig
    {
        string DataConnection { get; }
    }

    public interface INatsConfig
    {
        string NatsUrl { get; }
    }

    public interface ILnConfig
    {
        string LndUrl { get; }
        string LndCertPath { get; }
        string LndMacaroonPath { get; }
    }

    public interface IBtcConfig
    {
        public Network BitcoinNetwork { get; }
    }

    public interface IProxyConfig
    {
        string ProxyUser { get; }
        string ProxyPass { get; }
        string ProxyUrl { get; }
    }

    public class Config : IDataDbConfig, INatsConfig, IProxyConfig, IBtcConfig, ILnConfig
    {
        public string RedisUrl { get; }
        public string BtcServiceUrl { get; }
        public bool Migrate { get; }
        public string AuthHost { get; }
        public string AuthHttpPort { get; }
        public string AuthHttp2Port { get; }
        public string DataConnection { get; }
        public string NatsUrl { get; }
        public string RatesToken { get; }
        public string ProxyUser { get; }
        public string ProxyPass { get; }
        public string ProxyUrl { get; }

        //public string RecaptchaToken { get; }
        public string SmtpServer { get; }
        public string SmtpUser { get; }
        public int SmtpPort { get; }
        public string SmtpPass { get; }
        public string SmtpFrom { get; }
        public string SiteName { get; }
        public string SiteNameOnion { get; }
        public string TelegramBotName { get; }
        public bool DebugBalances { get; }
        public string GpgPublicKey { get; }
        public int RatesDelayMinutes { get; }
        public Network BitcoinNetwork { get; }

        public const decimal Satoshi = 0.00000001m;
        public const decimal InvoiceFee = 1;
        public const decimal MinimalAmountBtc = Satoshi * 100;
        public const decimal AutoPriceFee = Satoshi; //1 satoshi
        public const decimal DealFee = 0.01m;

        public const decimal PromiseFee = 0.001m;
        public const int RetranslatorKeepAliveDelay = 10000;
        public const int DealLnFundingTimeSec = 600;

        //public const string GpgPublicKey = "4B0A6B283A71BA53FB7F9C01A984128512E64677";

        public static Catalog.CryptoExchangeVariables DefaultCryptoExchangeVariables { get; private set; } =
            Catalog.CryptoExchangeVariables.bittrex_usd;


        public Config(IConfiguration configuration)
        {
            Migrate = !configuration["MIGRATE"]?.IsNullOrEmpty() ?? false;

            var host = configuration["DATA_HOST"] ?? "postgres-data";
            var port = configuration["DATA_PORT"] ?? "5432";
            var db = configuration["DATA_DB"] ?? "globalbitcoins_data";
            var user = configuration["DATA_USER"] ?? "globalbitcoins";
            var pass = configuration["DATA_PASS"] ?? "globalbitcoins";
            DataConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=1024;";

            NatsUrl = configuration["NATS_URL"] ?? "nats://nats:4222";

            RatesToken = configuration["RATES_TOKEN"];

            ProxyUser = configuration["PROXY_USER"];
            ProxyPass = configuration["PROXY_PASS"];
            ProxyUrl = configuration["PROXY_URL"];

            //RecaptchaToken = configuration["RECAPTCHA_TOKEN"];

            SmtpServer = configuration["SMTP_SERVER"];
            SmtpPort = int.Parse(configuration["SMTP_PORT"] ?? "25");
            SmtpUser = configuration["SMTP_USER"];
            SmtpPass = configuration["SMTP_PASS"];
            SmtpFrom = configuration["SMTP_FROM"];

            GpgPublicKey = configuration["GPG_PUBLIC_KEY"];

            AuthHost = configuration["AUTH_HOST"] ?? "localhost";
            AuthHttpPort = configuration["AUTH_HTTP_PORT"];
            AuthHttp2Port = configuration["AUTH_HTTP2_PORT"];
            BtcServiceUrl = configuration["BTC_SERVICE_URL"] ?? "http://localhost:50060";

            SiteName = configuration["SITE_NAME"];
            SiteNameOnion = configuration["SITE_NAME_ONION"];
            TelegramBotName = configuration["TELEGRAM_BOT_NAME"];
            DebugBalances = bool.Parse(configuration["DEBUG_BALANCES"] ?? "false");

            RedisUrl = configuration["REDIS_URL"];

            RatesDelayMinutes = int.Parse(configuration["RATES_DELAY_MINUTES"] ?? "60");
            BitcoinNetwork = configuration["BITCOIN_NETWORK"] switch
            {
                "mainnet" => Network.Main,
                _ => Network.TestNet
            };
            LndUrl = configuration["LND_URL"] ?? "https://lnd.docker:1009";
            LndCertPath = configuration["LND_CERT_PATH"] ?? "lnd.cert";
            LndMacaroonPath = configuration["LND_MACAROON_PATH"] ?? "admin.macaroon";
        }

        public string LndUrl { get; }
        public string LndCertPath { get; }
        public string LndMacaroonPath { get; }
    }
}