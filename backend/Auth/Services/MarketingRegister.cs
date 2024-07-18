using System;
using System.Threading.Tasks;
using Backend.Protos.Internal;
using Castle.Core.Internal;
using Grpc.Net.Client;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Auth.Services
{
    public class MarketingRegister
    {
        private readonly IHttpContextAccessor accessor;
        private readonly Config config;
        private readonly ILogger<MarketingRegister> logger;

        public MarketingRegister(IHttpContextAccessor accessor, Config config, ILogger<MarketingRegister> logger)
        {
            this.accessor = accessor;
            this.config = config;
            this.logger = logger;
        }

        public async Task Register(string userId)
        {
            try
            {
                var context = accessor.HttpContext;
                if (context == null)
                    return;
                var yandexId = context.Request.Cookies["_ym_uid"];
                if (yandexId.IsNullOrEmpty())
                    return;
                using var channel = GrpcChannel.ForAddress(config.BackendApi);
                var client = new InternalApi.InternalApiClient(channel);
                await client.SetMarketingAsync(new SetMarketingRequest
                {
                    UserId = userId,
                    YandexId = yandexId
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error in marketing register: " + e.Message);
            }
        }
    }
}