using System;
using System.Threading.Tasks;
using AspNetCore.Totp;
using Auth.Entitys;
using Microsoft.AspNetCore.Identity;

namespace Auth.Services
{
    public class TotpSoftwareAuthenticationProvider : IUserTwoFactorTokenProvider<ApplicationUser>
    {
        /// <summary>
        /// Returns a flag indicating whether the token provider can generate a token suitable for two factor authentication token for the specified user.
        /// </summary>
        /// <param name="manager"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<bool> CanGenerateTwoFactorTokenAsync(UserManager<ApplicationUser> manager,
            ApplicationUser user)
        {
            if (await manager.GetTwoFactorEnabledAsync(user))
                return false;
            return true;
        }

        /// <summary>
        /// Generates a token for the specified user and purpose.
        /// </summary>
        /// <param name="purpose">The purpose the token will be used for.</param>
        /// <param name="manager"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<string> GenerateAsync(string purpose, UserManager<ApplicationUser> manager,
            ApplicationUser user)
        {
            user.TwoFaSecret = GetString();
            await manager.UpdateAsync(user);
            return user.TwoFaSecret;
        }

        /// <summary>
        /// Returns a flag indicating whether the specified token is valid for the given user and purpose.
        /// </summary>
        /// <param name="purpose"></param>
        /// <param name="token"></param>
        /// <param name="manager"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public Task<bool> ValidateAsync(string purpose, string token, UserManager<ApplicationUser> manager,
            ApplicationUser user)
        {
            var generator = new TotpGenerator();
            var totpValidator = new TotpValidator(generator);
            bool parsed = int.TryParse(token, out var pin);
            if (!parsed)
                return Task.FromResult(false);
            return Task.FromResult(totpValidator.Validate(user.TwoFaSecret, pin));
        }

        private string GetString()
        {
            const int length = 16;
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[length];
            var random = new Random();

            for (int i = 0; i < length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new string(stringChars);
        }
    }
}