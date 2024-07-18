using System;
using System.Threading;
using System.Threading.Tasks;
using Auth.Entitys;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Auth.Services
{
    public class Initializer : IHostedService
    {
        private readonly ILogger<Initializer> logger;
        private readonly IServiceProvider provider;

        public Initializer(ILogger<Initializer> logger, IServiceProvider provider)
        {
            this.logger = logger;
            this.provider = provider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = provider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            
            if (!await roleManager.RoleExistsAsync("support"))
            {
                logger.LogWarning("Creating roles");
                await roleManager.CreateAsync(new IdentityRole("support"));
                await roleManager.CreateAsync(new IdentityRole("user"));
                await roleManager.CreateAsync(new IdentityRole("admin"));
                foreach (var user in userManager.Users)
                    await userManager.AddToRoleAsync(user, "user");
                logger.LogWarning("Roles created");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}