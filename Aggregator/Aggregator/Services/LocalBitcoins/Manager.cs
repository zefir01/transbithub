using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Aggregator.Services.LocalBitcoins.Entitys;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.LocalBitcoins
{
    public class Manager : IHostedService
    {
        private readonly IServiceProvider provider;
        private readonly ILogger<Manager> logger;
        private readonly Config config;
        private readonly CancellationTokenSource tokenSource = new();
        private const int DelayMinutes = 5;
        private Task? workTask;

        public Manager(IServiceProvider provider, ILogger<Manager> logger, Config config)
        {
            this.provider = provider;
            this.logger = logger;
            this.config = config;
        }

        private async Task GetAds(CancellationToken token)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDbContext>();
            HttpClient httpClient;
#if DEBUG
            var handler = new HttpClientHandler
            {
                Proxy = new WebProxy(config.Proxy)
            };
            httpClient = new HttpClient(handler);
#else
            httpClient = config.GetHttpClient();
#endif
            httpClient = new HttpClient();
            List<AdListData> ads = new();
            int page = 1;
            LocalBitcoinsJson json;
            do
            {
                var data = await httpClient.GetStringAsync(
                    $"https://localbitcoins.com/buy-bitcoins-online/.json?page={page}", token);
                json = LocalBitcoinsJson.FromJson(data);
                ads.AddRange(json.Data.AdList.Select(p => p.Data));
                logger.LogDebug($"page: {page}");
                page++;
            } while (json.Data.AdCount >= 50);

            ads = ads.Where(p => !p.OnlineProvider.StartsWith("ALTCOIN_")).ToList();

            var traderNames = ads.Select(p => p.Profile.Username).Distinct();
            foreach (var name in traderNames)
            {
                var traderAds = ads.Where(p => p.Profile.Username == name);
                var trader = await db.LbTraders.FirstOrDefaultAsync(p => p.Name == name, cancellationToken: token);
                if (trader == null)
                {
                    trader = new Trader(traderAds, logger);
                    await db.LbTraders.AddAsync(trader, token);
                }
                else
                {
                    trader.Update(traderAds, logger);
                }

                await db.SaveChangesAsync(token);
            }
        }

        private async Task Work()
        {
            while (!tokenSource.IsCancellationRequested)
            {
                try
                {
                    await GetAds(tokenSource.Token);
                }
                catch (Exception e)
                {
                    logger.LogError(e, e.Message);
                }

                await Task.Delay(DelayMinutes * 60 * 1000);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            workTask = Work();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            tokenSource.Cancel();
            workTask?.Wait(cancellationToken);
            return Task.CompletedTask;
        }
    }
}