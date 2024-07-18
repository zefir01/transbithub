using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Aggregator.Services;
using Aggregator.Services.BitZlato;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Manager = Aggregator.Services.Paxful.Manager;

namespace Aggregator
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
            using (var db = new DataDbContext(config, null))
            {
                if (config.Migrate)
                {
                    var m= db.Database.GetPendingMigrations();
                    if (m.Any())
                    {
                        Console.WriteLine(@"Starting migrations.");
                        db.Database.Migrate();
                        Console.WriteLine(@"Ending migrations.");
                    }
                }
            }
            
            var def = CultureInfo.CreateSpecificCulture(CultureInfo.InvariantCulture.Name);
            var ru = CultureInfo.CreateSpecificCulture("ru-RU");
            def.DateTimeFormat = ru.DateTimeFormat;
            def.DateTimeFormat.DateSeparator = ".";
            CultureInfo.DefaultThreadCurrentCulture = def;
            
            services.AddDbContext<DataDbContext>(builder =>
            {
                builder.UseNpgsql(config.DataConnection, builder =>
                    {
                        builder.EnableRetryOnFailure();
                        builder.MigrationsAssembly("Backend");
                    })
                    .EnableSensitiveDataLogging();
            });

            services.AddSingleton(config);
            services.AddSingleton<IDataDbConfig>(config);
            services.AddHostedService<Aggregator.Services.BitZlato.Manager>();
            services.AddHostedService<Services.LocalBitcoins.Manager>();
            services.AddHostedService<Manager>();
            services.AddGrpc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.ConfigureExceptionHandler(app.ApplicationServices.GetRequiredService<ILogger<Program>>());
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