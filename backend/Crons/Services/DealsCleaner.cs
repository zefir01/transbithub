using System;
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
    public class DealsCleaner : IHostedService
    {
        private const int DelayMin = 1;
        private readonly IServiceProvider provider;
        private readonly ILogger<DealsCleaner> logger;
        private Task task;
        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

        public DealsCleaner(IServiceProvider provider, ILogger<DealsCleaner> logger)
        {
            this.provider = provider;
            this.logger = logger;
        }

        private static readonly Func<DataDBContext, DateTime, IQueryable<Deal>> autoCancelDeals =
            (db, date) => from deal in db.Deals
                where deal.Status == DealStatus.Opened
                      && deal.AutoCancelTime <= date
                select deal;

        private async Task Cleanup()
        {
            while (!cancellationTokenSource.Token.IsCancellationRequested)
            {
                Deal d = null;
                try
                {
                    d = await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var deal = await autoCancelDeals(db, DateTime.Now.ToLocalTime())
                            .FirstOrDefaultAsync(token);
                        if (deal == null)
                            return null;
                        await deal.AdminChangeStatus(DealStatus.Canceled);
                        await db.SaveChangesAsync(token);
                        logger.LogWarning($"Deal {deal.Id} canceled by cleaner.");
                        return deal;
                    }, provider, 5, cancellationTokenSource.Token, null, "Clean deals", logger);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Error in deals cleaner: " + e.Message);
                }

                if (d == null)
                {
                    await Task.Delay(DelayMin * 60 * 1000);
                }
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            task = Cleanup();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            cancellationTokenSource.Cancel();
            task.Wait(cancellationToken);
            return Task.CompletedTask;
        }
    }
}