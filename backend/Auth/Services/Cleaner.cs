using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Auth.Services
{
    public class Cleaner : IHostedService, IDisposable
    {
        private const int DelayMin = 30;
        private Timer timer;
        private IServiceProvider provider;

        public Cleaner(IServiceProvider provider)
        {
            this.provider = provider;
        }

        private async void Cleanup(object state)
        {
            using (var scope = provider.CreateScope())
            {
                var db = scope.ServiceProvider.GetService<IdentityDbContext>();
                var grants = await db.PersistedGrants.Where(p => p.Expiration < DateTime.UtcNow)
                    .ToListAsync();
                foreach (var g in grants)
                    db.PersistedGrants.Remove(g);
                await db.SaveChangesAsync();
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            timer = new Timer(Cleanup, null, TimeSpan.Zero, TimeSpan.FromMinutes(DelayMin));
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            timer?.Dispose();
        }
    }
}