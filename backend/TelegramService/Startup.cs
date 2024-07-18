using System;
using System.Globalization;
using System.Reflection;
using System.Runtime.Serialization;
using Grpc.Core;
using Grpc.Core.Interceptors;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TelegramService.Services;

namespace TelegramService
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
            services.AddDbContext<TgmDbContext>(builder =>
            {
                builder.UseNpgsql(config.TelegramConnection, builder => { builder.EnableRetryOnFailure(); });
            });
            services.AddScoped<ITgmDbContext, TgmDbContext>();
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