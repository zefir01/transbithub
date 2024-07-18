using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Aggregator.Services.Paxful.Json.All;
using Aggregator.Services.Paxful.Json.Error;
using Aggregator.Services.Paxful.Json.OfferJson;
using Aggregator.Services.Paxful.Json.Trader;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Data = Aggregator.Services.Paxful.Json.OfferJson.Data;

namespace Aggregator.Services.Paxful
{
    public class Client
    {
        private readonly Config config;
        private const string BasePath = "https://paxful.com/api";
        private const int Limit = 300;
        private readonly ILogger<Client> logger;

        public Client(IServiceProvider provider)
        {
            config = provider.GetRequiredService<Config>();
            logger = provider.GetRequiredService<ILogger<Client>>();
        }

        class HmacGenerate
        {
            public string GenerateHMAC(string secret, string payload)
            {
                var keyBytes = Encoding.UTF8.GetBytes(secret);
                var hmac = new HMACSHA256 {Key = keyBytes};
                var rawSig = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                return BitConverter.ToString(rawSig).Replace("-", string.Empty).ToLower();
            }
        }

        private async Task<string> Request(string path, string args, CancellationToken token = default)
        {
            string responseFromServer;
            HmacGenerate hmac = new();
            DateTime foo = DateTime.Now;
            long unixTime = ((DateTimeOffset) foo).ToUnixTimeSeconds();
            var body = "apikey=" + config.PaxfulKey + "&nonce=" + unixTime + "&" + args;
            var theKey = "&apiseal=" + hmac.GenerateHMAC(config.PaxfulSecret, body);
            HttpWebRequest request = (HttpWebRequest) WebRequest.Create(BasePath + path);
            if (!config.Proxy.IsNullOrEmpty())
            {
                request.Proxy = new WebProxy(config.Proxy);
            }

            request.Method = "POST";
            string postData = body + theKey;
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentType = "text/plain";
            request.Accept = " application/json";
            request.ContentLength = byteArray.Length;
            await using (Stream dataStream = await request.GetRequestStreamAsync())
            {
                await dataStream.WriteAsync(byteArray, 0, byteArray.Length, token);
                dataStream.Close();
            }

            using HttpWebResponse response = (HttpWebResponse) request.GetResponse();
            if (response.StatusCode != HttpStatusCode.OK)
            {
                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                    throw new RateLimitException();
                throw new Exception("Status code is not OK");
            }

            await using (Stream dataStream = response.GetResponseStream())
            {
                using StreamReader reader = new(dataStream);
                responseFromServer = await reader.ReadToEndAsync();
                reader.Close();
                dataStream.Close();
            }

            response.Close();
            return responseFromServer;
        }

        private async Task<List<Offer>> GetOffers(bool isBuy, string currency)
        {
            long count;
            List<Offer> offers = new();
            All json = null;
            string type = isBuy ? "buy" : "sell";
            do
            {
                logger.LogDebug($"Get all: offset={offers.Count}, limit={Limit}");
                var text = await Request("/offer/all",
                    $"offer_type={type}&currency_code={currency}&limit={Limit}&offset={offers.Count}");
                try
                {
                    json = All.FromJson(text);
                }
                catch (Exception e)
                {
                    CatchError(text, e);
                }

                if (json.Data == null)
                    CatchError(text);

                count = json.Data.Count;
                offers.AddRange(json.Data.Offers);
                logger.LogDebug($"Got offers: {count}");
            } while (count >= 300);

            return offers;
        }

        public async Task<IEnumerable<Offer>> GetAll()
        {
            long count;
            List<Offer> allOffers = new();
            foreach (var curr in Catalog.CurrenciesList)
            {
                while (true)
                {


                    try
                    {
                        var offers = await GetOffers(true, curr);
                        foreach (var offer in offers)
                        {
                            if (!allOffers.Select(p => p.OfferId).Contains(offer.OfferId))
                                allOffers.Add(offer);
                        }

                        offers = await GetOffers(false, curr);
                        foreach (var offer in offers)
                        {
                            if (!allOffers.Select(p => p.OfferId).Contains(offer.OfferId))
                                allOffers.Add(offer);
                        }
                    }
                    catch (RateLimitException)
                    {
                        await Task.Delay(15 * 60 * 1000);
                        continue;
                    }
                    break;
                }
            }

            return allOffers;
        }

        private Error CatchError(string text, Exception? e = null)
        {
            logger.LogError(text);
            try
            {
                var error = Error.FromJson(text);
                if (error.ErrorError.Code == 429)
                    throw new RateLimitException();
                if (error.ErrorError.Code == 1002)
                    throw new OfferNotFoundException();
                throw new Exception($"code: {error.ErrorError.Code} msg: {error.ErrorError.Message}");
            }
            catch (JsonSerializationException ee)
            {
                if (e != null)
                {
                    logger.LogError(e, e.Message);
                    throw e;
                }

                throw;
            }
        }

        public async Task<Data> GetById(string id)
        {
            logger.LogDebug($"Get by id: id={id}");
            var text = await Request("/offer/get", $"offer_hash={id}");
            OfferJson json = null;
            try
            {
                json = OfferJson.FromJson(text);
            }
            catch (Exception e)
            {
                CatchError(text, e);
                throw;
            }

            if (json.Status == "error")
            {
                CatchError(text);
            }

            return json.Data;
        }

        public async Task<Aggregator.Services.Paxful.Json.Trader.Data> GetTrader(string userName)
        {
            logger.LogDebug($"Get trader: userName={userName}");
            var text = await Request("/user/info", $"username={userName}");
            Trader json = null;
            try
            {
                json = Trader.FromJson(text);
            }
            catch (Exception e)
            {
                CatchError(text, e);
            }

            if (json.Status == "error")
            {
                CatchError(text);
            }

            return json.Data;
        }
    }
}