using System;
using System.Globalization;
using System.Linq;
using Backend.Services;
using CoreLib;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;

namespace Backend
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        private readonly Config config;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            config = new Config(configuration);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        /// <summary>
        /// 
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            IdentityModelEventSource.ShowPII = true;
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            using (var db = new DataDBContext(config, null))
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
                    
                    if (!db.UserDatas.Any(p => p.UserId == ""))
                    {
                        var data = new UserData(Guid.Empty, config.SiteName, false, Catalog.Currencies.USD, db);
                        db.UserDatas.Add(data);
                        db.SaveChanges();
                    }
                }
            }

            services.AddLocalization();
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;

            services.AddSingleton<LndClient>();
            services.AddSingleton<ILnConfig>(config);
            services.AddSingleton<IBtcConfig>(config);
            services.AddSingleton<IDataDbConfig>(config);
            services.AddSingleton<INatsConfig>(config);
            services.AddSingleton<AdChangesRetranslator>();
            services.AddSingleton<PublicInvoiceRetranslator>();
            services.AddSingleton<EventsRetranslator>();
            services.AddSingleton<VariablesRetranslator>();
            services.AddSingleton<DisputesRetranslator>();
            services.AddScoped<RetranslatorBuffer>();
            services.AddSingleton(config);
            services.AddSingleton<Pgp>();
            
            services.AddScoped<Calculator>();
            //IdentityModelEventSource.ShowPII = true;/////////////////////
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddHttpContextAccessor();
            services.AddHttpClient();
            services.AddDbContext<DataDBContext>(builder =>
            {
                builder.UseNpgsql(config.DataConnection, builder =>
                    {
                        builder.EnableRetryOnFailure();
                        builder.MigrationsAssembly("Backend");
                    })
                    .EnableSensitiveDataLogging();
            });
            services.AddStackExchangeRedisCache(options => options.Configuration = config.RedisUrl);
            services.AddControllers();


            services.AddAuthorization(options =>
            {
                options.AddPolicy("profile_security", policy =>
                {
                    policy.AddAuthenticationSchemes(IdentityServerAuthenticationDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", "profile_security");
                    policy.RequireRole("user");
                });
                options.AddPolicy("trade", policy =>
                {
                    policy.AddAuthenticationSchemes(IdentityServerAuthenticationDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", "trade");
                    policy.RequireRole("user");
                });
            });

            services.AddAuthorizationPolicyEvaluator();

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = $"http://{config.AuthHost}:{config.AuthHttpPort}";
                    options.ApiName = "api1";
                    options.ApiSecret = "secret";
                    options.RequireHttpsMetadata = false;
                    options.CacheDuration = TimeSpan.FromMinutes(5);
                    options.EnableCaching = true;
                    options.SaveToken = true;
                    options.IntrospectionDiscoveryPolicy.ValidateIssuerName = false;
                });

            services.AddGrpc(options =>
            {
                options.EnableDetailedErrors = true;
                options.MaxReceiveMessageSize = 11534336; //11 Мегабайт
                options.Interceptors.Add<MyInterceptor>();
            });
            //services.AddGrpc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.ConfigureExceptionHandler(app.ApplicationServices.GetService<ILogger<Program>>());
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            // Configure the Localization middleware
            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture(CultureInfo.InvariantCulture)
            });
            app.UseRequestLocalization();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseGrpcWeb();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<Trade>().EnableGrpcWeb();
                endpoints.MapGrpcService<InternalApi>().RequireHost("*:50050");
                endpoints.MapControllers();
            });
        }
    }
}