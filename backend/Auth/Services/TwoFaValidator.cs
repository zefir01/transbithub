using System.Linq;
using System.Threading.Tasks;
using Auth.Entitys;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Auth.Services
{
    public class TwoFaValidator : ICustomTokenRequestValidator
    {
        private readonly ILogger<TwoFaValidator> logger;
        private readonly UserManager<ApplicationUser> userManager;

        public TwoFaValidator(ILogger<TwoFaValidator> logger, UserManager<ApplicationUser> userManager)
        {
            this.logger = logger;
            this.userManager = userManager;
        }

        private void Error(CustomTokenRequestValidationContext context, string error, string description = "")
        {
            if (string.IsNullOrEmpty(description))
                description = error;

            context.Result.Error = error;
            context.Result.ErrorDescription = description;
            context.Result.IsError = true;
            logger.LogError(error);
        }

        public async Task ValidateAsync(CustomTokenRequestValidationContext context)
        {
            if (context.Result.ValidatedRequest.GrantType != "password")
                return;
            if (context.Result.ValidatedRequest.Client.ClientId != "browser" &&
                context.Result.ValidatedRequest.Client.ClientId != "telegram")
                return;
            if (context.Result.IsError)
                return;

            var username = context.Result.ValidatedRequest.UserName;
            var user = await userManager.FindByNameAsync(username);

            if (!user.TwoFactorEnabled)
                return;
            if (!context.Result.ValidatedRequest.Raw.AllKeys.Contains("two_fa"))
            {
                Error(context, "Need two_fa pin.");
                return;
            }

            int i = context.Result.ValidatedRequest.Raw.AllKeys.ToList().IndexOf("two_fa");
            string token = context.Result.ValidatedRequest.Raw.Get(i);

            if (string.IsNullOrEmpty(token))
            {
                Error(context, "Need two_fa pin.");
                return;
            }

            bool res = await userManager.VerifyTwoFactorTokenAsync(user, "TOTP", token);
            if (!res)
                Error(context, "Invalid 2FA pin.");
        }
    }
}