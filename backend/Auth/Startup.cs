using System;
using System.Globalization;
using System.Linq;
using Auth.Entitys;
using Auth.Services;
using IdentityServer4.AccessTokenValidation;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared;

namespace Auth
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
            using (var db = new IdentityDbContext(config))
            {
                var m = db.Database.GetPendingMigrations();
                if (m.Any())
                {
                    Console.WriteLine(@"Starting migrations.");
                    db.Database.Migrate();
                    Console.WriteLine(@"Ending migrations.");
                }
            }


            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            services.AddScoped<MarketingRegister>();
            services.AddSingleton(config);
            //IdentityModelEventSource.ShowPII = true;/////////////////////
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddHttpContextAccessor();
            services.AddHttpClient();
            services.AddSingleton<IIdentityDbConfig>(config);
            services.AddDbContext<IdentityDbContext>(builder =>
            {
                builder.UseNpgsql(config.IdentityConnection, builder => { builder.EnableRetryOnFailure(); });
            });
            services.AddScoped<IEventSink, SignInLogger>();
            services.AddHostedService<Cleaner>();
            services.AddScoped<IPersistedGrantStore, PersistedGrantStore>();
            services.AddHostedService<Initializer>();

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

            services.AddIdentityServer(options =>
                {
                    options.Events.RaiseErrorEvents = true;
                    options.Events.RaiseFailureEvents = true;
                    options.Events.RaiseInformationEvents = true;
                    options.Events.RaiseSuccessEvents = true;
                    options.IssuerUri = "https://" + config.SiteName;
                })
                .AddInMemoryApiScopes(new[] {new ApiScope("trade"), new ApiScope("profile_security"), new ApiScope("adminka_security")})
                .AddInMemoryIdentityResources(MyResources.GetIdentityResources())
                .AddInMemoryApiResources(MyResources.GetApiResources())
                .AddDeveloperSigningCredential()
                .AddInMemoryClients(Clients.Get())
                .AddAspNetIdentity<ApplicationUser>()
                .AddProfileService<IdentityWithAdditionalClaimsProfileService>()
                .AddCustomTokenRequestValidator<TwoFaValidator>()
                .AddCustomTokenRequestValidator<RolesValidator>()
                .AddExtensionGrantValidator<DelegationGrantValidator>();
            services.AddAuthorization(options =>
            {
                options.AddPolicy("profile_security", policy =>
                {
                    policy.AddAuthenticationSchemes(IdentityServerAuthenticationDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", "profile_security");
                    policy.RequireRole("user");
                });
            });
            services.AddAuthorizationPolicyEvaluator();

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
                .AddIdentityServerAuthentication(options =>
                {
                    options.Authority = $"http://localhost:5001";
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
            });
            services.AddGrpc();
            services.AddRazorPages();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.ConfigureExceptionHandler(app.ApplicationServices.GetService<ILogger<Program>>());
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseIdentityServer();
            app.UseGrpcWeb();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.All
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<Profile>().EnableGrpcWeb();
                endpoints.MapGrpcService<Internal>().RequireHost("*:5002");
                endpoints.MapRazorPages();
            });
        }
    }
}