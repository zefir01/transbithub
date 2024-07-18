using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Aggregator
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler<T>(this IApplicationBuilder app, ILogger<T> logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if(contextFeature != null)
                    { 
                        logger.LogError($"Something went wrong: {contextFeature.Error}");
                        Console.WriteLine(contextFeature.Error.Message);
                        Console.WriteLine(contextFeature.Error.StackTrace);
                    }
                    return Task.CompletedTask;
                });
            });
        }
    }
}