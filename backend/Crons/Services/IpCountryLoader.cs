using System;
using System.IO;
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
    public class IpCountryLoader : IHostedService
    {
        private readonly IServiceProvider provider;
        private readonly ILogger<IpCountryLoader> logger;

        public IpCountryLoader(IServiceProvider provider, ILogger<IpCountryLoader> logger)
        {
            this.provider = provider;
            this.logger = logger;
        }

        private async Task Load()
        {
            logger.LogDebug("Start load countries ips");
            //https://lite.ip2location.com/database/ip-country
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
            
            if (await db.IpCountries.AnyAsync())
                return;
            var lines = await File.ReadAllLinesAsync("IP2LOCATION-LITE-DB1.CSV");
            foreach (var line in lines)
            {
                IpCountry ent;
                try
                {
                    ent = new IpCountry(line);
                }
                catch (InvalidDataException)
                {
                    continue;
                }

                await db.IpCountries.AddAsync(ent);
            }

            await db.SaveChangesAsync();
            logger.LogWarning("Ip-Country loaded.");
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await Load();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}