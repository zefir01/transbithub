using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Auth.Services
{
    public class UpperCaseValidator<TUser> : IPasswordValidator<TUser>
        where TUser : IdentityUser
    {
#pragma warning disable 1998
        public async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user, string password)
#pragma warning restore 1998
        {
            if (password.ToLower() == password)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "UpperCasePassword",
                    Description = "The password must contain upper case letters."
                });
            }

            return IdentityResult.Success;
        }
    }

    public class LowerCaseValidator<TUser> : IPasswordValidator<TUser>
        where TUser : IdentityUser
    {
#pragma warning disable 1998
        public async Task<IdentityResult> ValidateAsync(UserManager<TUser> manager, TUser user, string password)
#pragma warning restore 1998
        {
            if (password.ToUpper() == password)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "LowerCasePassword",
                    Description = "The password must contain lower case letters."
                });
            }

            return IdentityResult.Success;
        }
    }
}