using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Shared.Protos;

namespace ApiTest
{
    public class DealsScenario
    {
        private readonly List<User> users;
        private readonly ILogger<DealsScenario> logger;
        static Random rnd = new Random();
        private readonly List<Task> tasks = new List<Task>();

        public DealsScenario(List<User> users, IServiceProvider provider)
        {
            logger = provider.GetService<ILogger<DealsScenario>>();
            this.users = users;
        }

        private async Task CreateRandomDeal(User user)
        {
            var resp = await user.GrpcClients.TradeClient.FindAdvertisementsAsync(new FindAdvertisementsRequest
            {
                Country = "RU",
                CryptoAmount = 0m.ToPb(),
                Currency = "RUB",
                FiatAmount = 0m.ToPb(),
                IsBuy = false,
                PaymentType = "QIWI",
                Skip = 0,
                Take = 100,
                UserId = ""
            });
            var ads = resp.Advertisements.ToList();
            int r = rnd.Next(ads.Count);
            var ad = ads[r];
            var deal = await user.GrpcClients.TradeClient.CreateDealAsync(new CreateDealRequest
            {
                AdvertisementId = ad.Id,
                BtcWallet = "",
                BuyPromise = false,
                CryptoAmount = 0m.ToPb(),
                FiatAmount = 10m.ToPb(),
                PromisePassword = "",
                SellPromise = ""
            });
            logger.LogWarning($"User {user.Profile.Username} deal {deal.Id} created.");
        }

        private async Task UserTask(User user)
        {
            var deals = 0;
            while (deals < 20)
            {
                try
                {
                    await CreateRandomDeal(user);
                    deals++;
                }
                catch (Exception e)
                {
                    logger.LogError("Create deal error.", e);
                }
            }
        }
        
        public async Task CreateAd(User user)
        {
            var req = new AdvertisementData
            {
                AutoPriceDelayIsNull = true,
                Country = "RU",
                PaymentType = "QIWI",
                Equation = "bittrex_usd*1*RUB",
                FiatCurrency = "RUB",
                IsBuy = false,
                IsEnabled = true,
                MaxAmount = 0m.ToPb(),
                MinAmount = 10m.ToPb(),
                Message = "Купи битки",
                MonitorLiquidity = false,
                NotAnonymous = false,
                Trusted = false,
                Title = "Купи битки",
                Window = 15,
            };
            var ad = await user.GrpcClients.TradeClient.CreateAdvertisementAsync(req);
            user.Ads.Add(ad);
            logger.LogDebug($"AD created {ad.Id}");
        }

        public void Run()
        {
            foreach (var user in users)
            {
                var task=Task.Run(async () =>
                {
                    while (user.Ads.Count < 50)
                        await CreateAd(user);
                    logger.LogWarning($"User {user.Profile.Username} ads created.");
                });
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());
            tasks.Clear();

            foreach (var user in users)
            {
                var task = UserTask(user);
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());
        }
    }
}