using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using BitcoinLib.Services.Coins.Bitcoin;
using CoreLib;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BtcService.Services
{
    public class BitcoinBackuper : IHostedService
    {
        private const int delaySeconds = 60;
        private readonly BitcoinService coinService;
        private readonly IServiceProvider provider;
        private readonly Config config;
        private Task workerTask;
        private readonly CancellationTokenSource tokenSource = new CancellationTokenSource();
        private readonly ILogger<BitcoinBackuper> logger;

        public BitcoinBackuper(BitcoinService coinService, IServiceProvider provider, Config config,
            ILogger<BitcoinBackuper> logger)
        {
            this.coinService = coinService;
            this.provider = provider;
            this.config = config;
            this.logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            workerTask = Worker(tokenSource.Token);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            tokenSource.Cancel();
            workerTask.Wait(cancellationToken);
            return Task.CompletedTask;
        }

        private async Task Worker(CancellationToken token)
        {
            while (!tokenSource.IsCancellationRequested)
            {
                await Task.Delay(1000 * delaySeconds, token);
                try
                {
                    await Backup(token);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Bitcoin backup error");
                }
            }
        }

        private async Task Backup(CancellationToken token)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
            var wallet =
                await db.BtcCoreWallets.FirstOrDefaultAsync(p => p.InstanceUrl == config.BtcUrl,
                    cancellationToken: token);
            if (wallet == null)
                return;
            coinService.BackupWallet("/opt/data/backup.dat");
            var bytes = await File.ReadAllBytesAsync("/bitcoin/backup.dat", token);
            wallet.SetBackup(bytes);
            await db.SaveChangesAsync(token);
            File.Delete("/bitcoin/backup.dat");
        }
    }
}