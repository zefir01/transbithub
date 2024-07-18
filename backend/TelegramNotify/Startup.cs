using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TelegramService;
using TelegramService.Services;
using Factory = TelegramNotify.Services.Factory;

namespace TelegramNotify
{
    public class Startup
    {
        private readonly Config config;

        public Startup(IConfiguration conf)
        {
            config = new Config(conf);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            if (config.Migrate)
            {
                using var db = new TgmDbContext(config);
                db.Database.Migrate();
            }

            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            var def = CultureInfo.CreateSpecificCulture(CultureInfo.InvariantCulture.Name);
            var ru = CultureInfo.CreateSpecificCulture("ru-RU");
            def.DateTimeFormat = ru.DateTimeFormat;
            def.DateTimeFormat.DateSeparator = ".";
            CultureInfo.DefaultThreadCurrentCulture = def;

            services.AddSingleton<IFactory, Factory>();
            services.AddSingleton<IConfig>(config);
            services.AddDbContext<TgmNotifyDbContext>(builder =>
            {
                builder.UseNpgsql(config.TelegramConnection, builder => { builder.EnableRetryOnFailure(); });
            });
            services.AddScoped<ITgmDbContext, TgmNotifyDbContext>();
            services.AddSingleton<Manager>();
            services.AddHostedService<NatsListener>();
            services.AddHostedService<Cleaner>();
            
            services.AddControllers();
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

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}