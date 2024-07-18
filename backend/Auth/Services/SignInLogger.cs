using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Auth.Entitys;
using IdentityServer4.Events;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;

namespace Auth.Services
{
    public class SignInLogger : IEventSink
    {
        private enum ActivityStatus
        {
            ClientAuthDone,
            UserAuthDone,
            TokenDone,
            InvalidPassword,
            Invalid2FaPin,
            LockedOut,
            TokenFailure,
            Need2FaFailure
        }

        private class Activity
        {
            public string Id { get; set; }
            public DateTime CreatedAt { get; set; }

            // ReSharper disable once UnusedAutoPropertyAccessor.Local
            public ActivityStatus Status { get; set; }
            public string ClientName { get; set; }
            public string Username { get; set; }
            public string Ip { get; set; }

            // ReSharper disable once UnusedAutoPropertyAccessor.Local
            public string GrantType { get; set; }

            public Activity(string id)
            {
                Id = id;
            }
        }

        private readonly Dictionary<string, Activity> activitys = new Dictionary<string, Activity>();
        private readonly IdentityDbContext db;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly MarketingRegister marketingRegister;
        public SignInLogger(IdentityDbContext db, UserManager<ApplicationUser> userManager, MarketingRegister marketingRegister)
        {
            this.db = db;
            this.userManager = userManager;
            this.marketingRegister = marketingRegister;
        }

        private Activity GetActivity(string id)
        {
            if (!activitys.TryGetValue(id, out var act))
            {
                act = new Activity(id);
                activitys.Add(id, act);
            }

            return act;
        }

        private async Task GetSignIn(Activity act, string result)
        {
            var signin = new SignIn
            {
                Username = act.Username,
                CreatedAt = act.CreatedAt,
                ClientName = act.ClientName,
                Ip = act.Ip,
                Result = result
            };
            activitys.Remove(act.Id);
            await db.SignIns.AddAsync(signin);
            await db.SaveChangesAsync();
        }

        public async Task PersistAsync(Event evt)
        {
            var act = GetActivity(evt.ActivityId);
            if (evt.EventType == EventTypes.Success)
            {
                var e = evt as UserLoginSuccessEvent;
                var token = evt as TokenIssuedSuccessEvent;

                switch (evt.Name)
                {
                    case "Client Authentication Success":
                        act.Status = ActivityStatus.ClientAuthDone;
                        act.CreatedAt = evt.TimeStamp;
                        act.Ip = evt.RemoteIpAddress;
                        break;
                    case "User Login Success":
                        act.Status = ActivityStatus.UserAuthDone;
                        // ReSharper disable once PossibleNullReferenceException
                        act.Username = e.Username;
                        act.ClientName = e.ClientId;
                        break;
                    case "Token Issued Success":
                        if (token.GrantType == "password")
                        {
                            act.Status = ActivityStatus.TokenDone;
                            await GetSignIn(act, "success");
                            if (act.ClientName == "front")
                                await marketingRegister.Register(token.SubjectId);
                        }

                        break;
                }
            }
            else if (evt.EventType == EventTypes.Failure)
            {
                var e = evt as UserLoginFailureEvent;
                var tokenError = evt as TokenIssuedFailureEvent;

                switch (evt.Name)
                {
                    case "Token Issued Failure":
                        act.GrantType = tokenError.GrantType;
                        if (tokenError.GrantType != "password")
                            activitys.Remove(act.Id);
                        else if (tokenError.Error == "Need two_fa pin.")
                        {
                            act.Status = ActivityStatus.Need2FaFailure;
                            activitys.Remove(act.Id);
                        }
                        else if (tokenError.Error == "Invalid 2FA pin.")
                        {
                            act.Status = ActivityStatus.Invalid2FaPin;
                            await GetSignIn(act, "Invalid 2FA pin.");
                        }
                        else
                        {
                            act.Status = ActivityStatus.TokenFailure;
                            activitys.Remove(act.Id);
                        }

                        break;
                    case "User Login Failure":
                        if (e.Message == "locked out")
                        {
                            act.Username = e.Username;
                            act.ClientName = e.ClientId;
                            act.Status = ActivityStatus.LockedOut;
                            await GetSignIn(act, "Locked out");
                        }
                        else if (e.Message == "invalid credentials" || e.Message=="invalid_username_or_password")
                        {
                            act.Status = ActivityStatus.InvalidPassword;
                            act.ClientName = e.ClientId;
                            act.Username = e.Username;

                            await GetSignIn(act, "Invalid credentials");
                        }
                        else
                            activitys.Remove(act.Id);

                        break;
                }
            }
        }
    }
}