using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using JsonWebToken;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.BitZlato
{
    public class ApiClient
    {
        private readonly HttpClient httpClient;
        private readonly ILogger<ApiClient> logger;
        private const int PageSize = 20;
        private readonly Config config;

        
        public static async Task<HttpClient> GetAuthedClient(Config config)
        {
            Random rnd = new();
            var privJwk = Jwk.FromJson(config.BzKey);

            var descriptor = new JwsDescriptor()
            {
                Algorithm = SignatureAlgorithm.EcdsaSha256,
                SigningKey = privJwk,
                IssuedAt = DateTime.UtcNow,
                Audience = "usr",
                JwtId = rnd.Next().ToString("X"),
                // Optionally set kid if you've got more than one key. Provide the correct int value.
                // see: https://tools.ietf.org/html/rfc7515#section-4.1.4
                KeyId = 1.ToString()
            };
            descriptor.AddClaim("email", config.BzEmail);

            var writer = new JwtWriter();
            var token = writer.WriteTokenString(descriptor);

            Console.WriteLine("JWT content:");
            Console.WriteLine(descriptor);
            Console.WriteLine();
            Console.WriteLine("JWT:");
            Console.WriteLine(token);

            HttpClient httpClient = config.GetHttpClient();

            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var who = await httpClient.GetStringAsync("https://bitzlato.bz/api/auth/whoami");

            Console.WriteLine("Who am I:");
            Console.WriteLine(who);

            return httpClient;
        }
        
        public ApiClient(IServiceProvider provider, Config config)
        {
            this.config = config;
            logger = provider.GetRequiredService<ILogger<ApiClient>>();
            httpClient = config.GetHttpClient();
        }

        public async Task<List<Datum>> GetAds(string crypto, string fiat, bool isBuy)
        {
            Dictionary<long, Datum> ads = new Dictionary<long, Datum>();
            BitZlatoApiJson resp;
            long page = 0;
            while ((resp = await RequestAds(page, crypto.ToUpper(), fiat.ToUpper(), isBuy)).Data.Count >= PageSize)
            {
                foreach (var data in resp.Data)
                {
                    ads[data.Id] = data;
                }

                page++;
            }

            return ads.Values.ToList();
        }

        private async Task<BitZlatoApiJson> RequestAds(long page, string crypto, string fiat, bool isBuy)
        {
            for (int i = 0; i < 3; i++)
            {
                try
                {
                    string type = isBuy ? "purchase" : "selling";
                    var url =
                        $"https://bitzlato.com/api/p2p/public/exchange/dsa/?limit={PageSize}&cryptocurrency={crypto}&currency={fiat}&skip={page * PageSize}&type={type}";
                    logger.LogDebug(url);
                    var resp = await httpClient.GetAsync(url);
                    if (!resp.IsSuccessStatusCode)
                    {
                        logger.LogWarning($"BitZlato api request error: {resp.ReasonPhrase} code: {resp.StatusCode}");
                        throw new Exception(resp.ReasonPhrase);
                    }

                    var body = await resp.Content.ReadAsStringAsync();
                    BitZlatoApiJson json;
                    try
                    {
                        json = BitZlatoApiJson.FromJson(body);
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, $"BitZlato api parse error: {e.Message}");
                        throw;
                    }

                    return json;
                }
                catch
                {
                    await Task.Delay(10 * 1000);
                }
            }

            logger.LogError("BitZlato api attempts ended");
            throw new Exception("BitZlato api attempts ended.");
        }
    }
}