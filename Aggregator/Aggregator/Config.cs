using System.Net;
using System.Net.Http;
using Aggregator.Services;
using Microsoft.Extensions.Configuration;

namespace Aggregator
{
    public interface IDataDbConfig
    {
        string DataConnection { get; }
    }

    public class Config : IDataDbConfig
    {
        public bool Migrate { get; }
        public string DataConnection { get; }
        public string Proxy { get; }
        public bool HeadLess { get; } = true;
        public string PaxfulKey { get; }
        public string PaxfulSecret { get; }
        public string BzEmail { get; }
        public string BzKey { get; }

        public Config(IConfiguration configuration)
        {
            Migrate = !configuration["MIGRATE"]?.IsNullOrEmpty() ?? false;

            var host = configuration["DATA_HOST"] ?? "postgres-aggregator";
            var port = configuration["DATA_PORT"] ?? "5432";
            var db = configuration["DATA_DB"] ?? "globalbitcoins_aggregator";
            var user = configuration["DATA_USER"] ?? "globalbitcoins";
            var pass = configuration["DATA_PASS"] ?? "globalbitcoins";
            DataConnection =
                $"Server={host};Port={port};Database={db};User Id={user};Password={pass};enlist=true;MaxPoolSize=1024;";
            Proxy = configuration["PROXY"] ?? "";
            PaxfulKey = configuration["PAXFUL_KEY"] ?? "RnBhYGyjwm7vX0Ek4gdfUfCQj7hDAV1b";
            PaxfulSecret = configuration["PAXFUL_SECRET"] ?? "4VmxUKlBzIcI0iCh08JwON6PG8pMTaKN";
            /*Prod
             * 9uV3gqnpm8E7g8yjc3ZjpjEh47036CzD
             * wBLiZxgWikR66jRvQ8ITcgxeHhRJTdpw
             */
            BzEmail = configuration["BZ_EMAIL"] ?? "petr.marketlab@gmail.com";
            BzKey = configuration["BZ_KEY"] ??
                    "{\"kty\":\"EC\",\"alg\":\"ES256\",\"crv\":\"P-256\",\"x\":\"HJFxb9rEJmZB9uIPF_Lzhnhi-NoWLIrSprO6nJ5zADk\",\"y\":\"wJ_u0-kfoYRJc8GCePWFv7hPr170GJQ3g2jUHCB1Ofo\",\"d\":\"8oFXVTY7QOVDdXK_nhueus_AfhOcS4j1FkW9UdhxN_M\"}";
            /* Prod
             natarist@protonmail.com
             {"kty":"EC","alg":"ES256","crv":"P-256","x":"fZ-yU2HnTvhnxsBOOStw2xGi45EEp19BoA-n_X1LWF4","y":"bQlXXxfyDj02dRU-XnNvLbinD3EjgGR6rY-jHjVnXc8","d":"2I2vQ2u5S_o5w8DjhWcHkGHMiEd0TktD_5iFkgAlR-g"}
             */
        }

        public HttpClient GetHttpClient()
        {
            HttpClient httpClient;
            if (!Proxy.IsNullOrEmpty())
            {
                HttpClientHandler handler = new()
                {
                    Proxy = new WebProxy(Proxy)
                };
                httpClient = new HttpClient(handler);
            }
            else
                httpClient = new HttpClient();

            return httpClient;
        }
    }
}