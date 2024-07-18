using System;
using System.CommandLine;
using System.CommandLine.Builder;
using System.CommandLine.Invocation;
using System.CommandLine.Parsing;
using System.Linq;
using System.Threading.Tasks;
using Auth;
using Auth.Entitys;
using Auth.Services;
using CoreLib;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Config = CoreLib.Config;

namespace Cli
{
    public class Cli
    {
        private readonly Support support;
        private readonly Migrations migrations;
        private readonly IServiceProvider provider;

        public Cli()
        {
            IConfiguration configuration = new ConfigurationBuilder()
                .AddJsonFile("launchSettings.json")
                .AddEnvironmentVariables()
                .Build();
            var backendConfig = new Config(configuration);
            var authConfig = new Auth.Config(configuration);


            var collection = new ServiceCollection()
                .AddLogging(cfg => cfg.AddConsole())
                .Configure<LoggerFilterOptions>(cfg =>
                {
                    cfg.MinLevel = LogLevel.Debug;
                    //cfg.AddFilter("Grpc", LogLevel.Trace);
                })
                .AddDbContext<DataDBContext>(builder => { builder.UseNpgsql(backendConfig.DataConnection); })
                .AddSingleton(backendConfig)
                .AddSingleton(authConfig)
                .AddSingleton<IIdentityDbConfig>(authConfig)
                .AddSingleton<ILnConfig>(backendConfig)
                .AddSingleton<IBtcConfig>(backendConfig)
                .AddSingleton<IDataDbConfig>(backendConfig)
                .AddSingleton<INatsConfig>(backendConfig)
                .AddSingleton<IDataDbConfig>(backendConfig)
                .AddSingleton<Support>()
                .AddSingleton<Migrations>()
                .AddScoped<Calculator>()
                .AddDbContext<DataDBContext>(builder =>
                {
                    builder.UseNpgsql(backendConfig.DataConnection, builder =>
                        {
                            builder.EnableRetryOnFailure();
                            builder.MigrationsAssembly("Backend");
                        })
                        .EnableSensitiveDataLogging();
                })
                .AddDbContext<IdentityDbContext>(builder =>
                {
                    builder.UseNpgsql(authConfig.IdentityConnection,
                        builder => { builder.EnableRetryOnFailure(); });
                });
            collection.AddIdentity<ApplicationUser, IdentityRole>(options =>
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
            provider = collection.BuildServiceProvider();
            support = provider.GetRequiredService<Support>();
            migrations = provider.GetRequiredService<Migrations>();
        }

        //https://github.com/dotnet/command-line-api/blob/main/docs/How-To.md#Call-a-method
        //https://github.com/dotnet/command-line-api
        public async Task Run(params string[] args)
        {
            var root = new RootCommand("TransBitHub admin cli");
            var support = new Command("support", "Manage support accounts");
            var migrations = new Command("migrations", "Manage migrations");
            root.AddCommand(support);
            root.AddCommand(migrations);

            var listSupport = new Command("list", "List support accounts");
            listSupport.AddAlias("-l");
            listSupport.Handler = CommandHandler.Create(this.support.ListSupport);
            support.AddCommand(listSupport);

            var createSupport = new Command("create", "Create support account");
            createSupport.AddAlias("-c");
            createSupport.AddArgument(new Argument("username"));
            createSupport.AddArgument(new Argument("password"));
            createSupport.Handler = CommandHandler.Create<string, string>(this.support.CreateSupport);
            support.AddCommand(createSupport);

            var removeSupport = new Command("remove", "Remove support account");
            removeSupport.AddAlias("-r");
            removeSupport.AddArgument(new Argument("username"));
            removeSupport.Handler = CommandHandler.Create<string>(this.support.RemoveSupport);
            support.AddCommand(removeSupport);


            var checkMigrations = new Command("check", "Check migrations needed");
            checkMigrations.AddAlias("-c");
            checkMigrations.Handler = CommandHandler.Create(this.migrations.CheckMigrations);
            migrations.AddCommand(checkMigrations);

            var migrate = new Command("migrate", "Migrate to last version");
            migrate.AddAlias("-m");
            migrate.Handler = CommandHandler.Create(this.migrations.Migrate);
            migrations.AddCommand(migrate);


            var commandLineBuilder = new CommandLineBuilder(root);
            commandLineBuilder.UseDefaults();
            var parser = commandLineBuilder.Build();
            await parser.InvokeAsync(args);
        }
    }
}