using Backend;
using CoreLib;
using Microsoft.Extensions.Configuration;

namespace BtcService
{
    public class Config: IDataDbConfig, INatsConfig
    {
        public string DataConnection { get; }
        public string BtcUrl { get; }
        public string BtcUser { get; }
        public string BtcPass { get; }
        public string NatsUrl { get; }
        public bool DisableBackuper { get; }

        public Config(IConfiguration configuration)
        {
            var host = configuration["DATA_HOST"] ?? "postgres-data";
            var port = configuration["DATA_PORT"] ?? "5432";
            var db = configuration["DATA_DB"] ?? "globalbitcoins_data";
            var user = configuration["DATA_USER"] ?? "globalbitcoins";
            var pass = configuration["DATA_PASS"] ?? "globalbitcoins";
            DataConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=50;";
            BtcUrl = configuration["BTC_URL"];
            BtcUser = configuration["BTC_USER"];
            BtcPass = configuration["BTC_PASS"];
            NatsUrl = configuration["NATS_URL"];
            DisableBackuper = bool.Parse(configuration["DISABLE_BACKUPER"] ?? "true");
        }
    }
}