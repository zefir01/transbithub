using System;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Auth.Entitys;
using Backend.Protos.Internal;
using Dawn;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Grpc.Net.Client;
using IdentityServer4;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityServer4.Stores;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Protos.ProfileApi.V1;
using Shared;


namespace Auth.Services
{
    [Authorize(Policy = "profile_security")]
    public class Profile : ProfileApi.ProfileApiBase
    {
        private readonly ILogger<Profile> logger;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly Config config;
        private readonly IdentityDbContext db;
        private readonly ITokenService tokenService;
        private readonly IPersistedGrantStore persistedGrantService;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly MarketingRegister marketingRegister;

        public Profile(ILogger<Profile> logger, UserManager<ApplicationUser> userManager, Config config,
            IdentityDbContext db, ITokenService tokenService, IPersistedGrantStore persistedGrantService, RoleManager<IdentityRole> roleManager, MarketingRegister marketingRegister)
        {
            this.logger = logger;
            this.userManager = userManager;
            this.config = config;
            this.db = db;
            this.tokenService = tokenService;
            this.persistedGrantService = persistedGrantService;
            this.roleManager = roleManager;
            this.marketingRegister = marketingRegister;
        }


        [AllowAnonymous]
        public override async Task<Empty> RegisterUser(RegisterRequest request,
            ServerCallContext context)
        {
            logger.LogDebug("RegisterUser " + request);
            //await ValidateRecaptcha("register", request.RecaptchaToken, context.Peer);

            var user = await userManager.FindByNameAsync(request.Username);
            if (user != null)
            {
                logger.LogInformation($"User {request.Username} already registered.");
                throw new UserException("This user already registered");
            }

            user = new ApplicationUser
            {
                UserName = request.Username,
                CreatedAt = DateTime.Now.ToUniversalTime()
            };
            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                string error = result.Errors.Select(p => p.Description).Aggregate((a, b) => { return a + "\n" + b; });
                logger.LogWarning("Cant register user. " + error);
                throw new UserException(error);
            }

            await userManager.AddToRoleAsync(user, "user");

            string ip = context.GetHttpContext().Connection.RemoteIpAddress.ToString();
            using var channel = GrpcChannel.ForAddress(config.BackendApi);
            var client = new InternalApi.InternalApiClient(channel);
            await client.CreateUserDataAsync(new CreateUserDataRequest
            {
                IsAnonymous = user.IsAnonymous,
                UserId = user.Id,
                UserName = user.UserName,
                Lang = request.Lang,
                Ip = ip
            });


            logger.LogInformation($"User {request.Username} registered.");
            return new Empty();
        }

        private async Task Check2FA(ApplicationUser user, string pin)
        {
            if (!user.TwoFactorEnabled)
                return;
            if (string.IsNullOrEmpty(pin))
                throw new UserException("Need twoFa.");
            var res = await userManager.VerifyTwoFactorTokenAsync(user, "TOTP", pin);
            if (!res)
                throw new UserException("Invalid 2FA code.");
        }

        private async Task<ApplicationUser> GetUserAsync(ServerCallContext context)
        {
            var id = context.GetHttpContext().User.Claims.FirstOrDefault(p => p.Type == "sub")?.Value;
            if (id.IsNullOrEmpty())
                return null;
            var user = await userManager.FindByIdAsync(id);
            return user;
        }

        private void SendEmail(string recipient, string subject, string body)
        {
            string smtpServer = config.SmtpServer;
            int port = int.Parse(config.SmtpPort);
            string username = config.SmtpUser;
            string password = config.SmtpPass;
            string from = config.SmtpFrom;

            var smtpClient = new SmtpClient(smtpServer, port)
            {
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = false
            };

            var msg = new MailMessage(from, recipient, subject, body);
            msg.IsBodyHtml = true;

            smtpClient.Send(msg);
        }

        public override async Task<Empty> ChangeEmail(ChangeEmailRequest request,
            ServerCallContext context)
        {
            Validators.Argument(request.NewEmail, nameof(request.NewEmail)).EmailValidate();
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);
            //http://www.binaryintellect.net/articles/6c463905-ed70-4b61-a05d-94083bfbec66.aspx
            //TODO change email confirmation
            var user = await GetUserAsync(context);
            await Check2FA(user, request.TwoFa);

            await userManager.SetEmailAsync(user, request.NewEmail);
            string confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);

            string body = "";
            using (StreamReader sr = new StreamReader("EmailConfirmationTemplate.html"))
            {
                // Read the stream to a string, and write the string to the console.
                body = await sr.ReadToEndAsync();
            }

            body = body.Replace("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                confirmationToken);
            var token64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(confirmationToken));
            var user64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(user.Id));
            string url = $"https://{config.SiteName}/confirm_email?token={token64}&user={user64}";
            body = body.Replace("blablabla", url);

            SendEmail(request.NewEmail, "TransBitHub email confirmation.", body);
            return new Empty();
        }

        public override async Task<Empty> ConfirmEmail(ConfirmEmailRequest request, ServerCallContext context)
        {
            Validators.Argument(request.Token, nameof(request.Token)).MaxLength(1000);
            var user = await GetUserAsync(context);
            var res = await userManager.ConfirmEmailAsync(user, request.Token);
            res.ThrowIfError();
            return new Empty();
        }

        public override async Task<Empty> ChangePassword(ChangePasswordRequest request,
            ServerCallContext context)
        {
            Validators.Argument(request.OldPassword, nameof(request.OldPassword)).MaxLength(300);
            Validators.Argument(request.NewPassword, nameof(request.NewPassword)).MaxLength(300);
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);
            var user = await GetUserAsync(context);
            await Check2FA(user, request.TwoFa);
            var res = await userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            res.ThrowIfError();
            return new Empty();
        }

        public override async Task<GetTwoFACodeResponse> GetTwoFACode(Empty request, ServerCallContext context)
        {
            string code;
            var user = await GetUserAsync(context);
            if (user.TwoFactorEnabled)
                throw new UserException("Two-factor authentication already enabled.");
            if (!string.IsNullOrEmpty(user.TwoFaSecret))
                code = user.TwoFaSecret;
            else
                code = await userManager.GenerateTwoFactorTokenAsync(user, "TOTP");
            return new GetTwoFACodeResponse {Code = code};
        }

        public override async Task<Empty> EnabledTwoFA(EnabledTwoFARequest request, ServerCallContext context)
        {
            Validators.Argument(request.Pin, nameof(request.Pin)).NotEmpty().MaxLength(6);
            Validators.Argument(request.Password, nameof(request.Password)).NotEmpty().MaxLength(300);
            var user = await GetUserAsync(context);
            if (user.TwoFactorEnabled)
                throw new UserException("2FA already enabled.");
            if (!await userManager.CheckPasswordAsync(user, request.Password))
                throw new UserException("Incorrect password.");
            if (!await userManager.VerifyTwoFactorTokenAsync(user, "TOTP", request.Pin))
                throw new UserException("Incorrect pincode.");

            await userManager.SetTwoFactorEnabledAsync(user, true);
            return new Empty();
        }

        public override async Task<Empty> DisableTwoFa(DisableTwoFaRequest request, ServerCallContext context)
        {
            Validators.Argument(request.Pin, nameof(request.Pin)).NotEmpty().MaxLength(6);
            Validators.Argument(request.Password, nameof(request.Password)).NotEmpty().MaxLength(300);

            var user = await GetUserAsync(context);
            if (!user.TwoFactorEnabled)
                throw new UserException("2FA not enabled.");
            if (!await userManager.CheckPasswordAsync(user, request.Password))
                throw new UserException("Incorrect password.");
            var res = await userManager.VerifyTwoFactorTokenAsync(user, "TOTP", request.Pin);
            if (!res)
                throw new UserException("Invalid 2FA code.");
            var res2 = await userManager.SetTwoFactorEnabledAsync(user, false);
            if (!res2.Succeeded)
                throw new UserException(res2.Errors.Select(p => p.Description)
                    .Aggregate((a, b) => { return a + "\n" + b; }));
            user.TwoFaSecret = null;
            var res3 = await userManager.UpdateAsync(user);
            if (!res3.Succeeded)
                throw new UserException(res3.Errors.Select(p => p.Description)
                    .Aggregate((a, b) => { return a + "\n" + b; }));
            return new Empty();
        }

        public override async Task<GetMySessionsResponse> GetMySessions(Empty request, ServerCallContext context)
        {
            var user = await GetUserAsync(context);

            var sessions = db.PersistedGrants.Where(p => p.SubjectId == user.Id).ToList();

            foreach (var s in sessions)
            {
                s.CreationTime = DateTime.SpecifyKind(s.CreationTime, DateTimeKind.Utc);
                s.LastModifed = DateTime.SpecifyKind(s.LastModifed, DateTimeKind.Utc);
                if (s.Expiration.HasValue)
                    s.Expiration = DateTime.SpecifyKind(s.Expiration.Value, DateTimeKind.Utc);
            }


            var events = db.SignIns.Where(p => p.Username == user.UserName).ToList();

            var resp = new GetMySessionsResponse();
            resp.Sessions.AddRange(
                sessions.Select(p =>
                    new Session
                    {
                        ClientName = p.ClientId,
                        CreatedAt = p.CreationTime.ToPb(),
                        ExpiredAt = p.Expiration.ToTimestampPb(),
                        Ip = p.RemoteIp,
                        LastOnline = p.LastModifed.ToPb(),
                        Id = p.GetHashCode().ToString()
                    })
            );
            resp.Events.AddRange(
                events.Select(p => new SessionEvent
                {
                    ClientName = p.ClientName,
                    Ip = p.Ip,
                    Time = p.CreatedAt.ToPb(),
                    Event = p.Result
                })
            );
            return resp;
        }

        public override async Task<Empty> KillSession(KillSessionRequest request, ServerCallContext context)
        {
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);
            var user = await GetUserAsync(context);
            await Check2FA(user, request.TwoFa);
            var sessions = db.PersistedGrants.Where(p => p.SubjectId == user.Id).ToList();
            var toKill = sessions.FirstOrDefault(p => p.GetHashCode() == Int32.Parse(request.Id));
            if (toKill == null)
                throw new UserException($"Session id={request.Id} not found.");
            db.PersistedGrants.Remove(toKill);
            await db.SaveChangesAsync(context.CancellationToken);

            return new Empty();
        }

        private void SendEmailTest(string recipient, string subject, string body)
        {
            const string smtpServer = "smtp.gmail.com";
            const int port = 587;
            const string username = "petr.marketlab@gmail.com";
            const string password = "Batman01";

            const string from = "petr.marketlab@gmail.com";

            var smptClient = new SmtpClient(smtpServer, port)
            {
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var msg = new MailMessage(from, recipient, subject, body);
            msg.IsBodyHtml = true;

            smptClient.Send(msg);
        }

        [AllowAnonymous]
        public override async Task<Empty> PasswordRecovery(PasswordRecoveryRequest request,
            ServerCallContext context)
        {
            Validators.Argument(request.Email, nameof(request.Email)).NotEmpty().MaxLength(300);
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);

            string token;
            ApplicationUser user;

            //await ValidateRecaptcha("register", request.RecaptchaToken, context.Peer);

            MailAddress email;
            try
            {
                email = new MailAddress(request.Email);
            }
            catch (Exception)
            {
                throw new UserException("Invalid email address.");
            }

            user = await db.Users.FirstOrDefaultAsync(p =>
                p.EmailConfirmed && p.Email == email.Address, cancellationToken: context.CancellationToken);
            if (user == null)
                throw new UserException($"User with email: {request.Email} not found.");
            if (!user.EmailConfirmed)
                user = null;
            await Check2FA(user, request.TwoFa);


            token = await userManager.GenerateUserTokenAsync(user, "Default", "passwordRecovery");

            string body = "";
            using (StreamReader sr = new StreamReader("PasswordRecoveryEmailTemplate.html"))
            {
                // Read the stream to a string, and write the string to the console.
                body = await sr.ReadToEndAsync();
            }

            body = body.Replace("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", token);
            var token64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
            var email64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(email.ToString()));
            string url = $"https://{config.SiteName}/resetpassword/{token64}/{email64}";
            body = body.Replace("blablabla", url);

            SendEmail(email.ToString(), "GlobalBitcoins password recovery.", body);

            return new Empty();
        }

        public bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                    RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    var domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
            catch (ArgumentException)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
                    @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-0-9a-z]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        [AllowAnonymous]
        public override async Task<Empty> PasswordRecoveryConfirm(PasswordRecoveryConfirmRequest request,
            ServerCallContext context)
        {
            Validators.Argument(request.Email, nameof(request.Email)).NotEmpty().MaxLength(300);
            Validators.Argument(request.Token, nameof(request.Token)).NotEmpty().MaxLength(1000);
            Validators.Argument(request.NewPassword, nameof(request.NewPassword)).NotEmpty().MaxLength(300);

            ApplicationUser user;

            if (!IsValidEmail(request.Email))
                throw new UserException("Invalid email address.");
            user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
                throw new UserException($"User with email: {request.Email} not found.");

            var res = await userManager.VerifyUserTokenAsync(user, "Default", "passwordRecovery", request.Token);
            if (!res)
                throw new UserException("Error in token verification.");

            foreach (var validator in userManager.PasswordValidators)
            {
                var r = await validator.ValidateAsync(userManager, user, request.NewPassword);
                if (!r.Succeeded)
                    throw new UserException(string.Join("\n", r.Errors.Select(p => p.Description)));
            }

            await userManager.RemovePasswordAsync(user);
            await userManager.AddPasswordAsync(user, request.NewPassword);

            return new Empty();
        }

        public override async Task<CreateReferenceTokenResponse> CreateReferenceToken(
            CreateReferenceTokenRequest request, ServerCallContext context)
        {
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);

            var user = await GetUserAsync(context);

            await Check2FA(user, request.TwoFa);

            var identityUser = new IdentityServerUser(user.Id)
            {
                DisplayName = user.UserName,
                AuthenticationTime = DateTime.UtcNow,
                IdentityProvider = IdentityServerConstants.LocalIdentityProvider
            };

            var tokenCreationRequest = new TokenCreationRequest
            {
                Subject = identityUser.CreatePrincipal(), IncludeAllIdentityClaims = true
            };
            tokenCreationRequest.ValidatedRequest = new ValidatedRequest {Subject = tokenCreationRequest.Subject};
            tokenCreationRequest.ValidatedRequest.SetClient(Clients.Get().First(p => p.ClientId == "api"));
            //tokenCreationRequest.Resources = new IdentityServer4.Models.Resources(
            //    MyResources.GetIdentityResources().ToList(),
            //    MyResources.GetApiResources().ToList());
            tokenCreationRequest.ValidatedResources = new ResourceValidationResult(
                new Resources(
                    MyResources.GetIdentityResources().ToList(),
                    MyResources.GetApiResources().ToList(),
                    new[] {new ApiScope("trade")}
                ));

            var tokens = db.PersistedGrants.Where(p => p.Type == "reference_token" && p.SubjectId == user.Id)
                .ToList();
            db.RemoveRange(tokens);
            await db.SaveChangesAsync(context.CancellationToken);

            var accessTokenObj = await tokenService.CreateAccessTokenAsync(tokenCreationRequest);
            accessTokenObj.Issuer = $"https://{config.SiteName}";
            string accessToken = await tokenService.CreateSecurityTokenAsync(accessTokenObj);

            user.ReferenceToken = accessToken;
            user.ReferenceTokenCreatedAt = accessTokenObj.CreationTime;
            await userManager.UpdateAsync(user);


            //var RefreshTokenObj = await _tokenCreationService.CreateAccessTokenAsync(Request);
            //RefreshTokenObj.Type = "refresh";
            //RefreshToken = await _tokenCreationService.CreateSecurityTokenAsync(RefreshTokenObj);

            //string TokenValue = "{\"access_token\": \"" + AccessToken + "\", \"refresh_token\" : \"" + RefreshToken + "\", \"identity_token\" : \"" + IdentityToken + "\"}";

            //https://github.com/IdentityServer/IdentityServer4/issues/356


            return new CreateReferenceTokenResponse
            {
                Token = accessToken
            };
        }

        public override async Task<GetMyReferenceTokenResponse> GetMyReferenceToken(Empty request,
            ServerCallContext context)
        {
            var user = await GetUserAsync(context);
            string token = "";
            if (!string.IsNullOrEmpty(user.ReferenceToken))
            {
                if ((DateTime.UtcNow - user.ReferenceTokenCreatedAt.Value).TotalMinutes > 60)
                {
                    string temp = user.ReferenceToken.Substring(user.ReferenceToken.Length - 3);
                    for (int i = 0; i < user.ReferenceToken.Length; i++)
                        token += "*";
                    token += temp;
                }
                else
                    token = user.ReferenceToken;
            }

            return new GetMyReferenceTokenResponse
            {
                Token = token
            };
        }

        public override async Task<Empty> RemoveReferenceToken(RemoveReferenceTokenRequest request,
            ServerCallContext context)
        {
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);
            var user = await GetUserAsync(context);
            await Check2FA(user, request.TwoFa);

            var tokens = db.PersistedGrants.Where(p => p.Type == "reference_token" && p.SubjectId == user.Id)
                .ToList();
            db.RemoveRange(tokens);
            await db.SaveChangesAsync(context.CancellationToken);
            user.ReferenceToken = "";
            user.ReferenceTokenCreatedAt = DateTime.MinValue;
            await userManager.UpdateAsync(user);
            return new Empty();
        }

        public override async Task<Empty> RemoveAccount(RemoveAccountRequest request,
            ServerCallContext context)
        {
            Validators.Argument(request.Password, nameof(request.Password)).NotEmpty().MaxLength(300);
            Validators.Argument(request.TwoFa, nameof(request.TwoFa)).MaxLength(6);

            var user = await GetUserAsync(context);
            await Check2FA(user, request.TwoFa);
            if(!await userManager.CheckPasswordAsync(user, request.Password))
                throw new UserException("invalid password.");
            using (var channel = GrpcChannel.ForAddress(config.BackendApi))
            {
                var client = new InternalApi.InternalApiClient(channel);
                await client.DeleteUserDataAsync(new DeleteUserDataRequest
                {
                    UserId = user.Id,
                });
            }

            foreach (var client1 in Clients.Get())
            {
                await persistedGrantService.RemoveAllAsync(new PersistedGrantFilter
                {
                    ClientId = client1.ClientId,
                    SubjectId = user.Id
                });
            }

            await userManager.SetLockoutEnabledAsync(user, true);
            await userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);

            return new Empty();
        }

        [AllowAnonymous]
        public override async Task<RegisterAnonymousResponse> RegisterAnonymous(RegisterAnonymousRequest request,
            ServerCallContext context)
        {
            var tokens = await userManager.RegisterAnonymous(context, config, marketingRegister, request.Lang);
            return new RegisterAnonymousResponse
            {
                AccessToken = tokens.AccessToken,
                RefreshToken = tokens.RefreshToken
            };
        }
    }
}