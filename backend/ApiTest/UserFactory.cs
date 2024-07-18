using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Backend;
using CoreLib;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Protos.ProfileApi.V1;

namespace ApiTest
{
    public class UserFactory : IDisposable
    {
        private readonly GrpcClients grpcClients;
        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
        private readonly ILogger<UserFactory> logger;
        private readonly IServiceProvider provider;
        private readonly DataDBContext db;

        public UserFactory(IServiceProvider provider, ILogger<UserFactory> logger, GrpcClients grpcClients,
            DataDBContext db)
        {
            this.provider = provider;
            this.logger = logger;
            this.grpcClients = grpcClients;
            this.db = db;
        }

        public async Task<User> Register(string username, string password)
        {
            await grpcClients.ProfileClient.RegisterUserAsync(new RegisterRequest
            {
                Username = username,
                Password = password
            });
            logger.LogDebug($"User registered {username}");
            var user = new User(provider, username, password);
            return user;
        }

        public Task<List<User>> GetAllUsers(string defaultPassword, int count = int.MaxValue)
        {
            var users = new List<User>();
            var names = db.UserDatas
                .Where(p => !p.IsAnonymous && p.UserId != "")
                .Select(p => p.UserName).OrderBy(p => p).Take(count).ToList();
            var tasks = new List<Task>();
            foreach (var name in names)
            {
                var task = Task.Run(() =>
                {
                    var user = new User(provider, name, defaultPassword);
                    users.Add(user);
                });
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());

            return Task.FromResult(users);
        }

        public void Dispose()
        {
            cancellationTokenSource.Cancel();
            cancellationTokenSource?.Dispose();
        }

        public async Task<List<User>> CreateUsers(string defaultPassword = "Batman01@", int count = 30)
        {
            var users = new List<User>();
            for (int i = 0; i < count; i++)
            {
                var user = await Register($"Test{i}", defaultPassword);
                users.Add(user);
            }

            return users;
        }
    }
}