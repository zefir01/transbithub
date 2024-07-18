using System;
using System.Net.Sockets;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Formatting.Elasticsearch;

namespace Aggregator
{
    public class ProgramLogger
    {
        public static void MyHandler<T>(object sender, UnhandledExceptionEventArgs args)
        {
            var loggerConfig = new LoggerConfiguration();
            loggerConfig = GetLoggerConfig<T>(loggerConfig);
            var logger = loggerConfig.CreateLogger();

            if (logger != null && args.ExceptionObject is Exception exception)
            {
                logger.Error(exception, "Console application crashed");

                // It's not necessary to flush if the application isn't terminating.
                if (args.IsTerminating)
                {
                    Log.CloseAndFlush();
                }
            }
        }
        public static LoggerConfiguration GetLoggerConfig<T>(LoggerConfiguration config, HostBuilderContext? ctx = null)
        {
            var levelStr = Environment.GetEnvironmentVariables()["LOG_LEVEL"]?.ToString() ?? "Warning";
            var fluentdHost = Environment.GetEnvironmentVariables()["FLUENTD_HOST"]?.ToString();
            var fluentdPort = Environment.GetEnvironmentVariables()["FLUENTD_UDP_PORT"]?.ToString();
            bool isDisabled = false;
            if (string.IsNullOrEmpty(fluentdHost))
            {
                Console.WriteLine("FLUENTD_HOST empty. Fluentd disabled.");
                isDisabled = true;
            }

            if (string.IsNullOrEmpty(fluentdPort))
            {
                Console.WriteLine("FLUENTD_UDP_PORT empty. Fluentd disabled.");
                isDisabled = true;
            }

            LoggingLevelSwitch levelSwitch = new LoggingLevelSwitch();
            levelSwitch.MinimumLevel = levelStr.ToLower() switch
            {
                "debug" => LogEventLevel.Debug,
                "error" => LogEventLevel.Error,
                "fatal" => LogEventLevel.Fatal,
                "information" => LogEventLevel.Information,
                "verbose" => LogEventLevel.Verbose,
                "warning" => LogEventLevel.Warning,
                _ => throw new ArgumentOutOfRangeException()
            };

            if (isDisabled)
            {
                config.MinimumLevel.ControlledBy(levelSwitch)
                    .Enrich.FromLogContext()
                    .Enrich.WithExceptionDetails()
                    .Enrich.WithProperty("ApplicationName", typeof(T).Assembly.GetName().Name)
                    .Enrich.WithProperty("Environment", ctx?.HostingEnvironment.ToString() ?? "")
                    .WriteTo.Console( outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] ({SourceContext}) {Message}{NewLine}{Exception}");
            }
            else
            {
                config.MinimumLevel.ControlledBy(levelSwitch)
                    .Enrich.FromLogContext()
                    .Enrich.WithExceptionDetails()
                    .Enrich.WithProperty("ApplicationName", typeof(T).Assembly.GetName().Name)
                    .Enrich.WithProperty("Environment", ctx?.HostingEnvironment.ToString() ?? "")
                    .WriteTo.Udp(fluentdHost, int.Parse(fluentdPort!), AddressFamily.InterNetwork,
                        new ElasticsearchJsonFormatter())
                    .WriteTo.Console( outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] ({SourceContext}) {Message}{NewLine}{Exception}");
            }

            return config;
        }
    }
}