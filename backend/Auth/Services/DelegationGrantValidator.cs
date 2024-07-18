using System.Linq;
using System.Threading.Tasks;
using Auth.Entitys;
using IdentityServer4.Models;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;

namespace Auth.Services
{
    public class DelegationGrantValidator: IExtensionGrantValidator
    {
        private readonly UserManager<ApplicationUser> userManager;

        public DelegationGrantValidator(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }

        public string GrantType => "delegation";

        public async Task ValidateAsync(ExtensionGrantValidationContext context)
        {

            var subject = context.Request.Raw.Get("subject");
            var user=await userManager.FindByIdAsync(subject);
            if (await userManager.IsLockedOutAsync(user))
            {
                context.Result = new GrantValidationResult(TokenRequestErrors.InvalidGrant);
                return;
            }

            context.Result = new GrantValidationResult(subject, GrantType);
        }
    }
}