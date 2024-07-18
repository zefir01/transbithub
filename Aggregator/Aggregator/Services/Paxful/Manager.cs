using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.Paxful
{
    public class Manager : IHostedService
    {
        private readonly Config config;
        private readonly ILogger<Manager> logger;
        private readonly Client client;
        private readonly IServiceProvider provider;
        private const int TraderUpdateHours = 24;
        private const int AdUpdateHours = 72;
        private const int RateLimitDelayMin = 15;
        private Task? workTask;
        private readonly CancellationTokenSource tokenSource = new();
        private const int PeriodMin = 5;

        public Manager(Config config, ILogger<Manager> logger, IServiceProvider provider)
        {
            this.config = config;
            this.logger = logger;
            this.provider = provider;
            client = new Client(provider);
        }


        private async Task DoWork(CancellationToken cancellationToken)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDbContext>();

            var all = await client.GetAll();
            all = all.Where(p => p.CountryName == null).ToList();
            logger.LogDebug($"Total: {all.Count()}");

            var names = all.Select(p => p.OfferOwnerUsername).Distinct();
            foreach (var name in names)
            {
                while (true)
                {
                    try
                    {
                        var trader =
                            await db.PxTraders.FirstOrDefaultAsync(p => p.Name == name,
                                cancellationToken: cancellationToken);
                        if (trader == null)
                        {
                            var traderJson = await client.GetTrader(name);
                            trader = new Entitys.Trader(traderJson);
                            var traderAds = all.Where(p => p.OfferOwnerUsername == name).Select(p => p.OfferId)
                                .Distinct();
                            foreach (var adId in traderAds)
                            {
                                try
                                {
                                    var adJson = await client.GetById(adId);
                                    if (adJson.CryptoCurrency != "BTC")
                                        continue;
                                    try
                                    {
                                        trader.UpdateAd(adJson);
                                    }
                                    catch (InvalidPaymentTypeException e)
                                    {
                                        logger.LogWarning(e, "Invalid payment type");
                                    }
                                    catch (InvalidCurrencyException e)
                                    {
                                        logger.LogWarning(e, "Invalid currency");
                                    }
                                }
                                catch (OfferNotFoundException e)
                                {
                                    logger.LogWarning(e, "Offer not found");
                                }
                            }

                            await db.PxTraders.AddAsync(trader, cancellationToken);
                        }
                        else
                        {
                            if (DateTime.Now - trader.UpdatedAt > TimeSpan.FromHours(TraderUpdateHours))
                            {
                                var traderJson = await client.GetTrader(name);
                                trader.Update(traderJson, logger);
                            }

                            var d = DateTime.Now.AddHours(-AdUpdateHours);
                            foreach (var ad in trader.PxAds)
                            {
                                if (ad.UpdatedAt < d)
                                {
                                    try
                                    {
                                        var adJson = await client.GetById(ad.PxAdId);
                                        try
                                        {
                                            ad.Update(adJson);
                                        }
                                        catch (InvalidPaymentTypeException e)
                                        {
                                            logger.LogWarning(e, "Invalid payment type");
                                        }
                                        catch (InvalidCurrencyException e)
                                        {
                                            logger.LogWarning(e, "Invalid currency");
                                        }
                                    }
                                    catch (OfferNotFoundException e)
                                    {
                                        logger.LogWarning(e, "Offer not found");
                                    }
                                }
                                else
                                {
                                    var adJson = all.FirstOrDefault(p => p.OfferId == ad.PxAdId);
                                    if (adJson != null)
                                        ad.UpdatePrice(adJson);
                                    else
                                        ad.Disable();
                                }
                            }

                        }
                    }
                    catch (RateLimitException)
                    {
                        await Task.Delay(RateLimitDelayMin * 60 * 1000, cancellationToken);
                        continue;
                    }
                    break;
                }

                await db.SaveChangesAsync(cancellationToken);
            }

            logger.LogDebug("Disabling not founded ads");
            var inBase = db.PxAds.Where(p => p.DisabledAt == null).Select(p => p.PxAdId).ToList();
            var allIds = all.Where(p => p.Active).Select(p => p.OfferId).ToList();
            foreach (var adId in inBase)
            {
                if (allIds.Contains(adId))
                    continue;
                var ad = await db.PxAds.FirstAsync(p => p.PxAdId == adId, cancellationToken: cancellationToken);
                ad.Disable();
            }

            await db.SaveChangesAsync(cancellationToken);
            logger.LogDebug("Work done");
        }

        private async Task Work(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    await DoWork(cancellationToken);
                    await Task.Delay(PeriodMin * 60 * 1000, cancellationToken);
                }
                catch (RateLimitException e)
                {
                    logger.LogWarning(e, "Rate limit");
                    await Task.Delay(RateLimitDelayMin * 60 * 1000, cancellationToken);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Strange error");
                    await Task.Delay(PeriodMin * 60 * 1000, cancellationToken);
                }
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            workTask = Work(tokenSource.Token);
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