using System;
using System.Globalization;
using Adminka.Services;
using Auth;
using Auth.Entitys;
using Auth.Services;
using CoreLib;
using CoreLib.Services;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;

namespace Adminka
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
        public void ConfigureServices(IServiceCollection services)
        {
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            IdentityModelEventSource.ShowPII = true;
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            services.AddDbContext<DataDBContext>(builder =>
            {
                builder.UseNpgsql(config.DataConnection, builder =>
                    {
                        builder.EnableRetryOnFailure();
                        builder.MigrationsAssembly("Backend");
                    })
                    .EnableSensitiveDataLogging();
            });
            services.AddDbContext<IdentityDbContext>(builder =>
            {
                builder.UseNpgsql(config.IdentityConnection, builder => { builder.EnableRetryOnFailure(); });
            });
            
            services.AddAuthorization(options =>
            {
                options.AddPolicy("adminka_security", policy =>
                {
                    policy.AddAuthenticationSchemes(IdentityServerAuthenticationDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", "adminka_security");
                    policy.RequireRole("support");
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
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    options.Password.RequiredLength = 8;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequireDigit = true;
                })
                .AddPasswordValidator<UpperCaseValidator<ApplicationUser>>()
                .AddPasswordValidator<LowerCaseValidator<ApplicationUser>>()
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders()
                .AddTokenProvider<TotpSoftwareAuthenticationProvider>("TOTP");
            services.AddGrpc(options =>
            {
                options.EnableDetailedErrors = true;
                options.MaxReceiveMessageSize = 11534336; //11 Мегабайт
                options.Interceptors.Add<MyInterceptor>();
            });
            services.AddStackExchangeRedisCache(options => options.Configuration = config.RedisUrl);
            
            services.AddGrpc();
            
            services.AddSingleton<CoreLib.Config>(config);
            services.AddSingleton<IIdentityDbConfig>(config);
            services.AddSingleton<IDataDbConfig>(config);
            services.AddSingleton<INatsConfig>(config);
            services.AddSingleton<EventsRetranslator>();
            services.AddSingleton<VariablesRetranslator>();
            services.AddSingleton<AdChangesRetranslator>();
            services.AddSingleton<PublicInvoiceRetranslator>();
            services.AddSingleton(x=>new DisputesRetranslator(
                x.GetRequiredService<ILogger<DisputesRetranslator>>(),
                x.GetRequiredService<INatsConfig>(), true));
            services.AddScoped<RetranslatorBuffer>();
            services.AddSingleton(config);
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddHttpContextAccessor();
            services.AddScoped<Calculator>();
            services.AddSingleton<LndClient>();
            services.AddSingleton<ILnConfig>(config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.ConfigureExceptionHandler(app.ApplicationServices.GetService<ILogger<Program>>());
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseGrpcWeb();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<Services.Adminka>().EnableGrpcWeb();
            });
        }
    }
}