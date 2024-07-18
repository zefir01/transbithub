using System;
using System.Globalization;
using CoreLib;
using CoreLib.Services;
using Crons.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RatesService = Crons.Services.RatesService;

namespace Crons
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
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            services.AddSingleton(config);
            services.AddSingleton<ILnConfig>(config);
            services.AddSingleton<IDataDbConfig>(config);
            services.AddSingleton<INatsConfig>(config);
            services.AddSingleton<AdChangesRetranslator>();
            services.AddSingleton<PublicInvoiceRetranslator>();
            services.AddSingleton<EventsRetranslator>();
            services.AddSingleton<VariablesRetranslator>();
            services.AddSingleton<DisputesRetranslator>();
            services.AddScoped<RetranslatorBuffer>();
            services.AddScoped<Calculator>();
            services.AddSingleton<Pgp>();
            services.AddHttpClient();
            services.AddDbContext<DataDBContext>(builder => { builder.UseNpgsql(config.DataConnection).EnableSensitiveDataLogging(); });
            services.AddHostedService<IpCountryLoader>();
            services.AddHostedService<RatesService>();
            services.AddHostedService<AutoPrice>();
            services.AddHostedService<DealsCleaner>();
            services.AddHostedService<LnService>();
            services.AddSingleton<LndClient>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
               
            });
        }
    }
}