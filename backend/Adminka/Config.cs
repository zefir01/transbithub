using Auth;
using Microsoft.Extensions.Configuration;

namespace Adminka
{
    public class Config: CoreLib.Config, IIdentityDbConfig
    {
        public Config(IConfiguration configuration) : base(configuration)
        {
            string host = configuration["IDENTITY_HOST"] ?? "postgres-identity";
            string port = configuration["IDENTITY_PORT"] ?? "5432";
            string db = configuration["IDENTITY_DB"] ?? "globalbitcoins_identity";
            string user = configuration["IDENTITY_USER"] ?? "globalbitcoins";
            string pass = configuration["IDENTITY_PASS"] ?? "globalbitcoins";
            IdentityConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=1024;";
        }

        public string IdentityConnection { get; }
    }
}