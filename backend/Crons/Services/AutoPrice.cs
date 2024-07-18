using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Entitys;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Crons.Services
{
    public class AutoPrice : IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<AutoPrice> logger;
        private Task task;
        private readonly CancellationTokenSource tokenSource = new CancellationTokenSource();
        private const int DelaySec = 10;

        public AutoPrice(IServiceProvider serviceProvider, ILogger<AutoPrice> logger)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
        }

        private static readonly Func<DataDBContext, DateTime, IQueryable<long>> autoPriceEnabled =
            (db, date) => from ad in db.Advertisements
                where ad.AutoPriceDelay.HasValue
                      && ad.Metadata.AutoPriceUpdateTime <= date
                      && ad.Owner.Options.AutoPrice > 0
                      && ad.Metadata.Status != Advertisement.AdMetadata.AdStatus.GlobalDisabled
                      && ad.Metadata.Status != Advertisement.AdMetadata.AdStatus.DisabledByOwner
                      && ad.Metadata.Status != Advertisement.AdMetadata.AdStatus.DisabledByTimetable
                      && !ad.IsDeleted
                select ad.Id;

        private async Task UpdateIds()
        {
            while (!tokenSource.IsCancellationRequested)
            {
                List<long> ids;
                using (var scope = serviceProvider.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                    ids = await autoPriceEnabled(db, DateTime.Now.ToLocalTime()).ToListAsync(tokenSource.Token);
                }

                Parallel.ForEach(ids, async id =>
                {
                    try
                    {
                        await MyExtensions.ConcurrentRetries(async (token, scope) =>
                        {
                            var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                            var ad = await db.Advertisements.FirstOrDefaultAsync(p => p.Id == id, token);
                            if (ad == null)
                                return null;
                            await ad.Metadata.AutoPriceUpdate();
                            await db.SaveChangesAsync(token);
                            return ad;
                        }, serviceProvider, 1, tokenSource.Token, null, "AutoPrice", logger);
                    }
                    catch
                    {
                        // ignored
                    }
                });

                logger.LogWarning("AutoPrice updated.");

                await Task.Delay(TimeSpan.FromSeconds(DelaySec));
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            task = UpdateIds();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            tokenSource.Cancel();
            task.Wait(cancellationToken);
            return Task.CompletedTask;
        }
    }
}