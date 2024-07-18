using System;
using System.Linq;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Services;
using Grpc.Core;
using Grpc.Core.Interceptors;
using IdentityServer4.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shared;

namespace Backend
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class MyInterceptor : Interceptor
    {
        private readonly ILogger<MyInterceptor> logger;

        public MyInterceptor(ILogger<MyInterceptor> logger)
        {
            this.logger = logger;
        }

        public override async Task<TResponse> UnaryServerHandler<TRequest, TResponse>(TRequest request,
            ServerCallContext context,
            UnaryServerMethod<TRequest, TResponse> continuation)
        {
            var provider = context.GetHttpContext().RequestServices.GetRequiredService<IServiceProvider>();
            const int retries = 5;
            var db = provider.GetRequiredService<DataDBContext>();

            var ret = await MyExtensions.ConcurrentRetries(
                async (token, db) =>
                {
                    Init(context, db);
                    return await continuation(request, context);
                }, db, retries, context.CancellationToken, logger, context, request.GetType().Name);

            return ret;
        }

        public override Task ServerStreamingServerHandler<TRequest, TResponse>(TRequest request,
            IServerStreamWriter<TResponse> responseStream,
            ServerCallContext context, ServerStreamingServerMethod<TRequest, TResponse> continuation)
        {
            var provider = context.GetHttpContext().RequestServices.GetRequiredService<IServiceProvider>();
            var db = provider.GetRequiredService<DataDBContext>();
            Init(context, db);
            return continuation(request, responseStream, context);
        }

        private void Init(ServerCallContext context, DataDBContext db)
        {
            var config = context.GetHttpContext().RequestServices.GetRequiredService<Config>();
            db.SourceType = SourceType.Grpc;
            db.Context = context;
            db.Config = config;
            db.Calculator = context.GetHttpContext().RequestServices.GetRequiredService<Calculator>();
            db.LndClient= context.GetHttpContext().RequestServices.GetRequiredService<LndClient>();

            var id = GetUserId(context);
            if (id == null)
                return;
            var user = db.UserDatas.FirstOrDefault(p => p.UserId == id);
            if (user == null)
            {
                logger.LogError($"User {id} not found.");
                throw new UserException("User not found.");
            }

            db.User = user;
            context.UserState["user"] = user;
            user.LastOnline.LastOnline = DateTime.Now;
            db.SaveChanges();
        }

        private string GetUserId(ServerCallContext context)
        {
            try
            {
                var id = context.GetHttpContext().User.Claims.FirstOrDefault(p => p.Type == "sub")?.Value;
                if (id.IsNullOrEmpty())
                    return null;
                return id;
            }
            catch
            {
                return "";
            }
        }
    }
}