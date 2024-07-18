using System.Threading.Tasks;
using Auth.Entitys;
using Auth.Protos.Internal;
using Dawn;
using Grpc.Core;
using Microsoft.AspNetCore.Identity;
using Shared;

namespace Auth.Services
{
    public class Internal : Auth.Protos.Internal.Internal.InternalBase
    {
        private readonly IdentityDbContext db;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly Config config;

        public Internal(IdentityDbContext db, UserManager<ApplicationUser> userManager, Config config)
        {
            this.db = db;
            this.userManager = userManager;
            this.config = config;
        }

        public override async Task<RegisterTelegramUserResponse> RegisterTelegramUser(
            RegisterTelegramUserRequest request, ServerCallContext context)
        {
            Validators.Argument(request.Lang, nameof(request.Lang)).Length(2);
            var tokens = await userManager.RegisterAnonymous(context, config, null, request.Lang);
            var user = await userManager.FindByIdAsync(tokens.UserId);
            user.TelegramId = (int)request.TelegramId;
            return new RegisterTelegramUserResponse
            {
                UserId = user.Id
            };
        }

        public override async Task<UserInfo> GetUserInfo(GetUserInfoRequest request, ServerCallContext context)
        {
            Validators.Argument(request.UserId, nameof(request.UserId)).NotEmpty().MaxLength(100);
            var user = await userManager.FindByIdAsync(request.UserId);
            if (user == null)
                throw new UserException("User not found");
            return new UserInfo
            {
                Email = user.Email ?? "",
                EmailVerified = user.EmailConfirmed,
                EnabledTwoFA = user.TwoFactorEnabled,
            };
        }
    }
}