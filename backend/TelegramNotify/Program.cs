using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;
using Serilog;
using Shared;

namespace TelegramNotify
{
    public class Program
    {
        public static void Main(string[] args)
        {
            AppDomain currentDomain = AppDomain.CurrentDomain;
            currentDomain.UnhandledException += ProgramLogger.MyHandler<Program>;
            CreateHostBuilder(args).Build().Run();
        }
        

        // Additional configuration is required to successfully run gRPC on macOS.
        // For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog((ctx, config) =>
                {
                    ProgramLogger.GetLoggerConfig<Program>(config);
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>()
                        .ConfigureKestrel(options =>
                        {
                            options.Limits.MinRequestBodyDataRate = null;

                            //for grpc
                            options.Listen(IPAddress.Any, 50070, listenOptions =>
                            {
                                //listenOptions.UseHttps("server.pfx", "1111");
                                listenOptions.Protocols = HttpProtocols.Http2;
                            });
                            //port 50052 for razor pages
                            options.Listen(IPAddress.Any, 50071, listenOptions =>
                            {
                                //listenOptions.UseHttps("server.pfx", "1111");
                                listenOptions.Protocols = HttpProtocols.Http1;
                            });
                        });
                    //.UseNLog();
                });
    }
}