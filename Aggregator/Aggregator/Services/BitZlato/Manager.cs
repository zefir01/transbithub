using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Aggregator.Services.BitZlato.Entitys;
using Aggregator.Services.BitZlato.ParseResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.BitZlato
{
    public class Manager : IHostedService
    {
        private readonly ILogger<Manager> logger;
        private readonly IServiceProvider provider;
        private readonly ApiClient apiClient;
        private readonly CancellationTokenSource tokenSource = new();
        private const int PeriodMin = 5;
        private const int TermsUpdatePeriodHours = 3 * 24;
        private const int TradersUpdatePeriodHours = 24;
        private const int FullUpdateHours = 3 * 24;
        private Task? workerTask;
        private readonly Config config;

        public Manager(ILogger<Manager> logger, IServiceProvider provider, Config config)
        {
            this.logger = logger;
            this.provider = provider;
            this.config = config;
            apiClient = new ApiClient(provider, config);
        }

        private async Task ApiUpdate(string crypto, string fiat, bool isBuy, Parser parser)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDbContext>();

            var jsons = await apiClient.GetAds(crypto, fiat, isBuy);
            List<AdResult> adApiResults = new();
            foreach (var json in jsons)
            {
                try
                {
                    var t = new AdResult(json);
                    adApiResults.Add(t);
                }
                catch (InvalidPaymentTypeException e)
                {
                    logger.LogError(e, e.Message);
                }
            }


            foreach (var traderName in adApiResults.Select(p => p.Owner).Distinct().ToList())
            {
                var trader = await db.BzTraders.FirstOrDefaultAsync(p => p.Name == traderName);
                if (trader == null)
                {
                    logger.LogDebug($"New trader {traderName} found.");
                    await parser.GoPage($"https://bitzlato.bz/p2p/users/{traderName}");
                    var parsed = await parser.ParseTraderPage();
                    var traderResult = new TraderResult(
                        traderName,
                        parsed.rating ?? "",
                        parsed.positiveFeedbacks ?? "",
                        parsed.negativeFeedbacks ?? "",
                        parsed.completedDeals ?? "",
                        parsed.canceledDeals ?? "",
                        parsed.loose ?? "",
                        parsed.stats,
                        parsed.years ?? "",
                        parsed.trustedCount ?? ""
                    );
                    var traderApiAds = adApiResults.Where(p => p.Owner == traderName).ToList();
                    trader = new Trader(traderResult, traderApiAds);
                    db.BzTraders.Add(trader);
                    foreach (var ad in trader.BzAds)
                    {
                        await parser.GoPage($"https://bitzlato.bz/p2p/exchange/{ad.AdId}/buy-BTC-RUB");
                        var parsed1 = await parser.ParseAdPage();
                        ad.UpdateTerms(parsed1.terms ?? "");
                        logger.LogDebug($"Trader {trader.Name} ad: {ad.AdId} terms updated.");
                    }

                    logger.LogDebug($"Trader {trader.Name} saved.");
                }
                else
                {
                    logger.LogDebug($"Trader {trader.Name} found.");
                    foreach (var adResult in adApiResults.Where(p => p.Owner == trader.Name).ToList())
                    {
                        var ad = trader.BzAds.FirstOrDefault(p => p.AdId == adResult.Id);
                        if (ad != null)
                            ad.Update(adResult);
                        else
                        {
                            await parser.GoPage($"https://bitzlato.bz/p2p/exchange/{adResult.Id}/buy-BTC-RUB");
                            var parsed1 = await parser.ParseAdPage();
                            ad = new Ad(adResult, trader);
                            ad.UpdateTerms(parsed1.terms ?? "");
                            trader.Ads.Add(ad);
                        }
                    }

                    foreach (var ad in trader.BzAds.Where(p =>
                        p.CryptoCurrency.ToString() == crypto && p.FiatCurrency.ToString() == fiat))
                    {
                        if (!adApiResults.Select(p => p.Id).Contains(ad.AdId))
                            ad.DisabledAt = DateTime.Now;
                    }

                    logger.LogDebug($"Trader {trader.Name} updated.");
                }
                await db.SaveChangesAsync();
            }
        }

        private async Task UpdateAdsTerms()
        {
            logger.LogDebug($"Starting UpdateAdsTerms");
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDbContext>();

            var date = DateTime.Now.AddHours(-TermsUpdatePeriodHours);
            var needUpdate = await db.BzAds.Where(p => p.DisabledAt == null && p.UpdatedAt < date).ToListAsync();
            logger.LogDebug($"Need update {needUpdate.Count} ads");
            if (!needUpdate.Any())
                return;

            using var parser = new Parser(provider.GetRequiredService<ILogger<Parser>>(), config);
            foreach (var ad in needUpdate)
            {
                await parser.GoPage($"https://bitzlato.bz/p2p/exchange/{ad.AdId}/buy-BTC-RUB");
                var parsed1 = await parser.ParseAdPage();
                ad.UpdateTerms(parsed1.terms ?? "");
                await db.SaveChangesAsync();
            }
        }

        private async Task UpdateTraders(string crypto, string fiat, bool isBuy, Parser parser)
        {
            logger.LogDebug($"Starting UpdateTraders");
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDbContext>();

            var date = DateTime.Now.AddHours(-TradersUpdatePeriodHours);
            var needUpdate =
                await db.BzTraders.Where(p => p.UpdatedAt < date && p.Ads.Any(p => p.DisabledAt == null)).ToListAsync();
            logger.LogDebug($"Need update {needUpdate.Count} traders");
            if (!needUpdate.Any())
                return;

            var jsons = await apiClient.GetAds(crypto, fiat, isBuy);
            List<AdResult> adApiResults = new();
            foreach (var json in jsons)
            {
                try
                {
                    var t = new AdResult(json);
                    adApiResults.Add(t);
                }
                catch (InvalidPaymentTypeException e)
                {
                    logger.LogError(e, e.Message);
                }
            }

            foreach (var trader in needUpdate)
            {
                var adResult = adApiResults.Where(p => p.Owner == trader.Name).ToList();
                if (!adResult.Any())
                    continue;
                await parser.GoPage($"https://bitzlato.bz/p2p/users/{trader.Name}");
                var parsed = await parser.ParseTraderPage();
                var traderResult = new TraderResult(
                    trader.Name,
                    parsed.rating ?? "",
                    parsed.positiveFeedbacks ?? "",
                    parsed.negativeFeedbacks ?? "",
                    parsed.completedDeals ?? "",
                    parsed.canceledDeals ?? "",
                    parsed.loose ?? "",
                    parsed.stats,
                    parsed.years ?? "",
                    parsed.trustedCount ?? ""
                );

                trader.Update(traderResult, adResult, logger);

                await db.SaveChangesAsync();
            }
        }

        private async Task Work(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = provider.CreateScope();
                    using var parser = new Parser(provider.GetRequiredService<ILogger<Parser>>(), config);
                    var db = scope.ServiceProvider.GetRequiredService<DataDbContext>();
                    var bzParams = await db.BzParams.FirstOrDefaultAsync(cancellationToken: cancellationToken);
                    var date = DateTime.Now.AddHours(-FullUpdateHours);
                    if (bzParams == null || bzParams.LastFullUpdate < date)
                    {
                        foreach (var crypto in Catalog.CryptoCurrenciesList)
                        {
                            foreach (var fiat in Catalog.CurrenciesList)
                            {
                                await ApiUpdate(crypto, fiat, true, parser);
                                await ApiUpdate(crypto, fiat, false, parser);
                            }
                        }

                        if (bzParams == null)
                        {
                            bzParams = new BzParams();
                            db.BzParams.Add(bzParams);
                        }

                        bzParams.LastFullUpdate = DateTime.Now;
                        await db.SaveChangesAsync(cancellationToken);
                    }
                    else
                    {
                        var cryptos = await db.BzAds.Select(p => p.CryptoCurrency.ToString()).Distinct()
                            .ToListAsync(cancellationToken: cancellationToken);
                        var fiats = await db.BzAds.Select(p => p.FiatCurrency.ToString()).Distinct()
                            .ToListAsync(cancellationToken: cancellationToken);
                        foreach (var crypto in cryptos)
                        {
                            foreach (var fiat in fiats)
                            {
                                await ApiUpdate(crypto, fiat, true, parser);
                                await ApiUpdate(crypto, fiat, false, parser);
                            }
                        }
                    }

                    var cryptos1 = await db.BzAds.Select(p => p.CryptoCurrency.ToString()).Distinct()
                        .ToListAsync(cancellationToken: cancellationToken);
                    var fiats1 = await db.BzAds.Select(p => p.FiatCurrency.ToString()).Distinct()
                        .ToListAsync(cancellationToken: cancellationToken);
                    foreach (var crypto in cryptos1)
                    {
                        foreach (var fiat in fiats1)
                        {
                            await UpdateTraders(crypto, fiat, true, parser);
                            await UpdateTraders(crypto, fiat, false, parser);
                            await UpdateAdsTerms();
                        }
                    }
                }
                catch (Exception e)
                {
                    logger.LogError(e, e.Message);
                }

                await Task.Delay(PeriodMin * 60 * 1000, cancellationToken);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            /*
            var parser = new Parser(provider.GetRequiredService<ILogger<Parser>>(), "http://192.168.100.2:3128");
            await parser.GoPage(
                "https://bitzlato.bz/p2p/exchange/417841/buy-BTC-RUB-%D0%A1%D0%B1%D0%B5%D1%80%D0%B1%D0%B0%D0%BD%D0%BA");
            await parser.ParseAdPage();
            */
            workerTask = Work(tokenSource.Token);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            tokenSource.Cancel();
            workerTask?.Wait(cancellationToken);
            return Task.CompletedTask;
        }
    }
}