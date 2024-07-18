using System.Threading.Tasks;
using Auth.Entitys;
using Castle.Core.Internal;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Auth.Services
{
    public class RolesValidator : ICustomTokenRequestValidator
    {
        private readonly ILogger<RolesValidator> logger;
        private readonly UserManager<ApplicationUser> userManager;

        public RolesValidator(ILogger<RolesValidator> logger, UserManager<ApplicationUser> userManager)
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
            if (context.Result.IsError)
                return;
            if (context.Result.ValidatedRequest.GrantType != "password")
                return;
            var username = context.Result.ValidatedRequest.UserName;
            if (username.IsNullOrEmpty())
            {
                Error(context, "invalid_username", "Username must present.");
                return;
            }

            var user = await userManager.FindByNameAsync(username);
            if (context.Result.ValidatedRequest.Client.ClientId != "adminka")
            {
                var isUser = await userManager.IsInRoleAsync(user, "user");
                if (!isUser)
                    Error(context, "invalid_role", "User must have \"user\" role.");
            }
            else
            {
                var isSupport=await userManager.IsInRoleAsync(user, "support");
                if (!isSupport)
                    Error(context, "invalid_role", "User must have \"support\" role.");
            }
        }
    }
}