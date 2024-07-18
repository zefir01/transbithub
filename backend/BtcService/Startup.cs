using System;
using BitcoinLib.Services.Coins.Base;
using BitcoinLib.Services.Coins.Bitcoin;
using BtcService.Services;
using CoreLib;
using CoreLib.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BtcService
{
    public class Startup
    {
        private readonly Config config;

        public Startup(IConfiguration configuration)
        {
            config = new Config(configuration);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            services.AddSingleton<BitcoinService>(provider =>
            {
                var service = new BitcoinService(
                    config.BtcUrl,
                    config.BtcUser,
                    config.BtcPass,
                    "",
                    10
                );
                return service;
            });
            services.AddSingleton<IDataDbConfig>(config);
            services.AddSingleton(config);
            services.AddSingleton<INatsConfig>(config);
            services.AddSingleton<AdChangesRetranslator>();
            services.AddSingleton<PublicInvoiceRetranslator>();
            services.AddSingleton<EventsRetranslator>();
            services.AddSingleton<VariablesRetranslator>();
            services.AddSingleton<DisputesRetranslator>();
            services.AddScoped<RetranslatorBuffer>();
            services.AddDbContext<DataDBContext>(builder => { builder.UseNpgsql(config.DataConnection); });
            services.AddHostedService<BtcCoreService>();
            if (!config.DisableBackuper)
                services.AddHostedService<BitcoinBackuper>();
            services.AddGrpc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints => { endpoints.MapGrpcService<Internal>(); });
        }
    }
}