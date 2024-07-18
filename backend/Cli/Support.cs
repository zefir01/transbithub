using System;
using System.Linq;
using System.Threading.Tasks;
using Auth.Entitys;
using CoreLib;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Cli
{
    public class Support
    {
        private readonly IServiceProvider provider;
        private readonly UserManager<ApplicationUser> userManager;

        public Support(IServiceProvider provider, UserManager<ApplicationUser> userManager)
        {
            this.provider = provider;
            this.userManager = userManager;
        }

        public async Task<int> CreateSupport(string username, string password)
        {
            var user = new ApplicationUser
            {
                UserName = username,
                CreatedAt = DateTime.Now.ToUniversalTime()
            };
            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                string error = result.Errors.Select(p => p.Description).Aggregate((a, b) => { return a + "\n" + b; });
                Console.WriteLine("Cant register user: " + error);
                return 1;
            }

            await userManager.AddToRoleAsync(user, "support");
            var db = provider.GetRequiredService<DataDBContext>();
            var data = new UserData(Guid.Parse(user.Id), user.UserName, false, Catalog.Currencies.RUB, db)
            {
                IsSupport = true
            };
            await db.UserDatas.AddAsync(data);
            await db.SaveChangesAsync();
            Console.WriteLine("OK");
            return 0;
        }

        public async Task<int> RemoveSupport(string username)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                Console.WriteLine("User not found.");
                return 1;
            }

            await userManager.DeleteAsync(user);
            Console.WriteLine("OK");
            return 0;
        }

        public async Task<int> ListSupport()
        {
            var users = await userManager.GetUsersInRoleAsync("support");
            if (!users.Any())
                Console.WriteLine("No users.");
            foreach (var user in users)
            {
                Console.WriteLine(user.UserName);
            }
            return 0;
        }
    }
}