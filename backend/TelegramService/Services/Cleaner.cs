using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TelegramService.Services
{
    public class Cleaner : IHostedService
    {
        private readonly ILogger<Cleaner> logger;
        private readonly Manager manager;
        private Task task;
        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
        private const int DelayMin = 1;

        public Cleaner(ILogger<Cleaner> logger, Manager manager)
        {
            this.logger = logger;
            this.manager = manager;
        }

        private async Task Work()
        {
            while (!cancellationTokenSource.IsCancellationRequested)
            {
                try
                {
                    await manager.Clean();
                }
                catch (Exception e)
                {
                    logger.LogError("Error in telegram cleaner: " + e.Message, e);
                }

                await Task.Delay(DelayMin * 60 * 1000, cancellationTokenSource.Token);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            task = Work();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            cancellationTokenSource.Cancel();
            task?.Wait(cancellationToken);
            return Task.CompletedTask;
        }
    }
}