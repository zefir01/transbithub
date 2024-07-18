using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend;
using CoreLib;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ApiTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var config = new Config();
            var serviceProvider = new ServiceCollection()
                .AddLogging(cfg => cfg.AddConsole())
                .Configure<LoggerFilterOptions>(cfg =>
                {
                    cfg.MinLevel = LogLevel.Warning;
                    //cfg.AddFilter("Grpc", LogLevel.Trace);
                })
                .AddDbContext<DataDBContext>(builder => { builder.UseNpgsql(config.DataConnection); })
                .AddSingleton(config)
                .AddSingleton<IDataDbConfig>(config)
                .AddSingleton<UserFactory>()
                .AddTransient<GrpcClients>()
                .BuildServiceProvider();

            var logger = serviceProvider.GetService<ILoggerFactory>()
                .CreateLogger<Program>();
            logger.LogDebug("Starting application");


            /*
         var factory = serviceProvider.GetService<UserFactory>();
         int count = 1;
         var users = await factory.GetAllUsers("Batman01@", count);
         if(!users.Any())
             users = await factory.CreateUsers("Batman01@",count);
         factory.Dispose();
      
         logger.LogWarning("Users loaded.");
         var scenario = new DealsScenario(users, serviceProvider);
         scenario.Run();
         
         var user=new User(serviceProvider, "EB8C8975EC4C4D3E75B2EA1233D4BDF6F25CB2001CF249B0D126F0EF6D32BB50");
         var scenario = new DealsScenario(new List<User>{user}, serviceProvider);
         scenario.Run();

            var factory = serviceProvider.GetService<UserFactory>();
            var users = await factory.CreateUsers("Batman01@", 1);
            logger.LogWarning("Application end.");
         */   
            var user=new User(serviceProvider, "CE5E03882F98EDA3C826DF21CA2510C0CFE58E2F4B23233540C1F21BB3DFFFC3");
            var scenario = new DealsScenario(new List<User>{user}, serviceProvider);
            scenario.Run();
        }
    }
}