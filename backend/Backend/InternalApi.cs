using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Backend.Protos.Internal;
using Castle.Core.Internal;
using CoreLib;
using CoreLib.Entitys;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Dawn;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Shared;
using Enum = System.Enum;
using Validators = CoreLib.Services.Validators;

namespace Backend
{
    //public class Profile : ProfileApi.ProfileApiBase
    // ReSharper disable once ClassNeverInstantiated.Global
    public class InternalApi : Protos.Internal.InternalApi.InternalApiBase
    {
        private readonly ILogger<InternalApi> logger;
        private readonly Config config;
        private readonly DataDBContext db;

        public InternalApi(ILogger<InternalApi> logger, Config config, DataDBContext db)
        {
            this.logger = logger;
            this.config = config;
            this.db = db;
        }

        /*
        private async Task<Catalog.Countries> GetCountryByIp(string ip)
        {
            try
            {
                HttpClient httpClient;
                var proxyAddr = config.ProxyUrl;
                string url = $"http://api.ipapi.com/api/{ip}?access_key={config.IPApiKey}";
                if (!string.IsNullOrEmpty(proxyAddr))
                {
                    var proxy = new WebProxy(proxyAddr, true);
                    var proxyHttpClientHandler = new HttpClientHandler
                    {
                        Proxy = proxy,
                        UseProxy = true,
                    };
                    httpClient = new HttpClient(proxyHttpClientHandler)
                    {
                        BaseAddress = new Uri(url)
                    };
                }
                else
                {
                    httpClient = new HttpClient
                    {
                        BaseAddress = new Uri(url)
                    };
                }

                var response = await httpClient.GetAsync(url);
                var responseBody = await response.Content.ReadAsStringAsync();
                var r = JsonConvert.DeserializeObject<IpApi>(responseBody);

                if (r.CountryCode.IsNullOrEmpty())
                    throw new ModelException("Get country error.");

                var c = Enum.Parse<Catalog.Countries>(r.CountryCode);
                return c;
            }
            catch
            {
                return Catalog.Countries.RU;
            }
        }
*/
        private async Task<Catalog.Countries> GetCountryByIp(string ipStr)
        {
            var num = BitConverter.ToInt32(IPAddress.Parse(ipStr).GetAddressBytes().Reverse().ToArray(), 0);
            var ent = await db.IpCountries.Where(p => p.From <= num && p.To >= num)
                .OrderBy(p => p.To).FirstOrDefaultAsync();
            if (ent == null)
                return Catalog.Countries.RU;
            return ent.Country;
        }

        public override async Task<Empty> CreateUserData(CreateUserDataRequest request, ServerCallContext context)
        {
            try
            {
                var userId = Guid.Parse(request.UserId);
                var userName = request.UserName;
                var isAnonymous = request.IsAnonymous;
                var lang = request.Lang;
                var ip = request.Ip;
                Validators.Argument(userName, nameof(userName)).NotEmpty().MaxLength(50);
                Validators.Argument(lang, nameof(lang)).MaxLength(2);
                Validators.Argument(ip, nameof(ip)).MaxLength(15);

                Catalog.Countries country;

                if (request.Lang.IsNullOrEmpty())
                    throw new Exception("Empty language.");
                if (request.Lang.ToUpper() == "RU")
                    country = Catalog.Countries.RU;
                else
                {
                    if (!request.Ip.IsNullOrEmpty())
                    {
                        country = await GetCountryByIp(request.Ip);
                    }
                    else
                    {
                        country = Catalog.Countries.US;
                    }
                }

                var currency = Catalog.CountryCurrency[country];
                Catalog.PaymentTypes paymentType;
                if (country == Catalog.Countries.RU)
                    paymentType = Catalog.PaymentTypes.QIWI;
                else
                    paymentType = Catalog.PaymentTypes.ADVCASH;

                var data = new UserData(userId, request.UserName, request.IsAnonymous, currency, db);

                data.LastAdSearchBuy = new UserData.LastAdSearchBuyClass
                {
                    Amount = 0,
                    Country = country,
                    Currency = currency,
                    PaymentType = paymentType,
                    Owner = data
                };
                data.LastAdSearchSell = new UserData.LastAdSearchSellClass
                {
                    Amount = 0,
                    Country = country,
                    Currency = currency,
                    PaymentType = paymentType,
                    Owner = data
                };
                await db.UserDatas.AddAsync(data, context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                logger.LogError(e.Message, e);
                throw;
            }
        }

        public override async Task<Empty> DeleteUserData(DeleteUserDataRequest request, ServerCallContext context)
        {
            try
            {
                var user = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                await user.Delete(context.CancellationToken);
                await db.SaveChangesAsync(context.CancellationToken);
                return new Empty();
            }
            catch (Exception e)
            {
                logger.LogError(e.Message, e);
                throw;
            }
        }

        public override async Task<Empty> SetMarketing(SetMarketingRequest request, ServerCallContext context)
        {
            try
            {
                var user = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == request.UserId,
                    context.CancellationToken);
                if (user == null)
                    return new Empty();
                if (!request.YandexId.IsNullOrEmpty())
                {
                    var conn = user.YmIdsConnections.OrderByDescending(p => p.Id).FirstOrDefault();
                    if (conn == null || conn.YmId.YandexId != request.YandexId)
                    {
                        conn = new YmIdsConnection(user, request.YandexId, db);
                        await db.YmIdsConnections.AddAsync(conn);
                        await db.SaveChangesAsync();
                    }
                }

                return new Empty();
            }
            catch (Exception e)
            {
                logger.LogError(e.Message, e);
                throw;
            }
        }
    }
}