using Backend;
using CoreLib;
using Microsoft.Extensions.Configuration;

namespace ApiTest
{
    public class Config : IDataDbConfig
    {
        public string Host { get; } = "api.test.transbithub.com";
        public string HttpPort { get; } = "443";
        public string GrpcPort { get; } = "443";
        public string DataConnection { get; }

        public Config()
        {
            var host = "localhost";
            var port = "5434";
            var db = "globalbitcoins_data";
            var user = "globalbitcoins";
            var pass = "globalbitcoins";
            DataConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=50;";
        }
    }
}