using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.Threading.Tasks;
using Castle.Core.Internal;
using IdentityModel.Client;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Formatting.Elasticsearch;
using Shared;

namespace TelegramService
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            AppDomain currentDomain = AppDomain.CurrentDomain;
            currentDomain.UnhandledException += ProgramLogger.MyHandler<Program>;
            await CreateHostBuilder(args).Build().RunAsync();
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