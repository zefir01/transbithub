using CoreLib;
using IdentityServer4.Extensions;
using Microsoft.Extensions.Configuration;

namespace Auth
{
    public interface IIdentityDbConfig
    {
        string IdentityConnection { get; }
    }

    public class Config: IProxyConfig, IIdentityDbConfig
    {
        public bool Migrate { get; }
        public string IdentityConnection { get; }
        public string SmtpServer { get; }
        public string SmtpUser { get; }
        public string SmtpPort { get; }
        public string SmtpPass { get; }
        public string SmtpFrom { get; }
        public string BackendApi { get; }
        public string SiteName { get; }


        public Config(IConfiguration configuration)
        {
            Migrate = !configuration["MIGRATE"]?.IsNullOrEmpty() ?? false;

            string host = configuration["IDENTITY_HOST"] ?? "postgres-identity";
            string port = configuration["IDENTITY_PORT"] ?? "5432";
            string db = configuration["IDENTITY_DB"] ?? "globalbitcoins_identity";
            string user = configuration["IDENTITY_USER"] ?? "globalbitcoins";
            string pass = configuration["IDENTITY_PASS"] ?? "globalbitcoins";
            IdentityConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=1024;";
            SmtpServer = configuration["SMTP_SERVER"];
            SmtpPort = configuration["SMTP_PORT"];
            SmtpUser = configuration["SMTP_USER"];
            SmtpPass = configuration["SMTP_PASS"];
            SmtpFrom = configuration["SMTP_FROM"];
            BackendApi = configuration["BACKEND_API"] ?? "http://localhost:50050";
            SiteName = configuration["SITE_NAME"];
            
            ProxyUser = configuration["PROXY_USER"];
            ProxyPass = configuration["PROXY_PASS"];
            ProxyUrl = configuration["PROXY_URL"];
        }

        public string ProxyUser { get; }
        public string ProxyPass { get; }
        public string ProxyUrl { get; }
    }
}