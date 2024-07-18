using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Auth.Entitys;
using Backend.Protos.Internal;
using Castle.Core.Internal;
using Grpc.Core;
using Grpc.Net.Client;
using IdentityModel.Client;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Randomizer;
using Shared;

namespace Auth.Services
{
    public static class Extensions
    {
        private static readonly Random rnd = new Random();

        private static ulong Get64BitRandom()
        {
            // Get a random array of 8 bytes. 
            // As an option, you could also use the cryptography namespace stuff to generate a random byte[8]
            byte[] buffer = new byte[sizeof(ulong)];
            rnd.NextBytes(buffer);
            ulong val = BitConverter.ToUInt64(buffer, 0);
            return val;
        }

        public static async Task<(string AccessToken, string RefreshToken, string UserId)>
            RegisterAnonymous(this UserManager<ApplicationUser> userManager, ServerCallContext context, Config config,
                MarketingRegister marketingRegister, string lang = "")
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true,
                CookieContainer = new CookieContainer()
            };

            var httpClient = new HttpClient(handler);

            ApplicationUser user;
            string name;
            int retry = 0;
            do
            {
                name = "Anonymous" + Get64BitRandom();
                user = await userManager.FindByNameAsync(name);
                retry++;
            } while (user != null && retry < 10);

            if (user != null)
                throw new UserException("Unknown error.");

            user = new ApplicationUser
            {
                UserName = name,
                IsAnonymous = true,
                CreatedAt = DateTime.Now
            };
            string pass = new RandomAlphanumericStringGenerator().GenerateValue(30) + "@111";
            var result = await userManager.CreateAsync(user, pass);
            if (!result.Succeeded)
            {
                string error = result.Errors.Select(p => p.Description)
                    .Aggregate((a, b) => { return a + "\n" + b; });
                throw new UserException("Cant register anonymous user.");
            }

            await userManager.AddToRoleAsync(user, "user");

            using (var channel = GrpcChannel.ForAddress(config.BackendApi))
            {
                string ip = context.GetHttpContext().Connection.RemoteIpAddress.ToString();
                var internalApiClient = new InternalApi.InternalApiClient(channel);
                await internalApiClient.CreateUserDataAsync(new CreateUserDataRequest
                {
                    IsAnonymous = user.IsAnonymous,
                    UserId = user.Id,
                    UserName = user.UserName,
                    Lang = lang,
                    Ip = ip
                });
            }


            var response = await httpClient.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = $"http://localhost:5001/connect/token",

                ClientId = "front",
                ClientSecret = "Urooyu7IeDeikais",
                Scope = "trade profile_security openid offline_access",

                UserName = user.UserName,
                Password = pass
            }, context.CancellationToken);


            if (marketingRegister != null)
                await marketingRegister.Register(user.Id);

            return (response.AccessToken, response.RefreshToken, user.Id);
        }
    }
}