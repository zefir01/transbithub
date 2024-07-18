using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Humanizer;
using Humanizer.Localisation;
using Protos.TradeApi.V1;
using Shared.Protos;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class UserInfo : BaseMenu
    {
        private Protos.TradeApi.V1.UserInfo userInfo;
        private IList<Feedback> feedbacks;
        private Localization.UserInfo s;
        private bool isTrusted;
        private bool isBlocked;

        public override string Header
        {
            get
            {
                string median = TimeSpan.FromSeconds(userInfo.MedianDelaySeconds)
                    .Humanize(precision: 3, culture: CultureInfo, minUnit: TimeUnit.Minute);
                string avg = TimeSpan.FromSeconds(userInfo.AvgDelaySeconds)
                    .Humanize(precision: 3, culture: CultureInfo, minUnit: TimeUnit.Minute);
                string firstDeal = userInfo.FirstTradeDate.ToDateTime().Year > 2000
                    ? userInfo.FirstTradeDate.ToDateTime().Humanize(culture: CultureInfo)
                    : s.Get(Localization.UserInfo.Keys.No);
                string createdAt = userInfo.CreatedAt.ToDateTime().Humanize(culture: CultureInfo);
                string lastOnline;
                if ((DateTime.Now - userInfo.LastOnline.ToDateTime()).TotalSeconds <= 75)
                    lastOnline = "Online";
                else
                    lastOnline = userInfo.LastOnline.ToDateTime().Humanize(culture: CultureInfo);
                string msg = $"<b>{s.Get(Localization.UserInfo.Keys.Info)} {userInfo.Username}</b>\n" +
                             s.Get(Localization.UserInfo.Keys.Site, userInfo.Site) +
                             $"<b>{s.Get(Localization.UserInfo.Keys.DealsCount)}</b> {userInfo.TradesCount}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.AvgDealAmount)}</b> {userInfo.TradesAvgAmount.FromPb()} BTC\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.PartnersCount)}</b> {userInfo.CounterpartysCount}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.PositiveRate)}</b> {userInfo.ResponseRate.FromPb()}%\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.FirstDeal)}</b> {firstDeal}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.CreatedAt)}</b> {createdAt}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.LastOnline)}</b> {lastOnline}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.Trusted)}</b> {userInfo.TrustedCount}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.Blocked)}</b> {userInfo.BlockedCount}\n" +
                             $"<b>{s.Get(Localization.UserInfo.Keys.Delay)}</b>\n" +
                             s.Get(Localization.UserInfo.Keys.Median, median) +
                             s.Get(Localization.UserInfo.Keys.Average, avg) +
                             $"<b>{s.Get(Localization.UserInfo.Keys.Feedbacks)}</b>\n";
                if (feedbacks == null || !feedbacks.Any())
                    msg += s.Get(Localization.UserInfo.Keys.NoFeedbacks);
                else
                    foreach (var f in feedbacks)
                    {
                        string positive = f.IsPositive
                            ? $"<b>{s.Get(Localization.UserInfo.Keys.Positive)}</b>\n"
                            : $"<b>{s.Get(Localization.UserInfo.Keys.Negative)}</b>\n";
                        string time = f.CreatedAt.ToDateTime().Humanize(culture: CultureInfo);
                        msg += $"<b>{s.Get(Localization.UserInfo.Keys.PostedAt)}</b> {time}\n" +
                               positive +
                               $"<b>{s.Get(Localization.UserInfo.Keys.Text)}</b> {f.Text}\n";
                    }

                return msg;
            }
        }

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                List<ICommand> commands = new List<ICommand>();
                if (userInfo.Id == Menu.UserId)
                    return commands;
                if (!isTrusted)
                    commands.Add(new Command(s.Get(Localization.UserInfo.Keys.AddTrust), 0));
                else
                    commands.Add(new Command(s.Get(Localization.UserInfo.Keys.RemoveTrusted), 1));
                if (!isBlocked)
                    commands.Add(new Command(s.Get(Localization.UserInfo.Keys.Block), 2));
                else
                    commands.Add(new Command(s.Get(Localization.UserInfo.Keys.UnBlock), 3));
                return commands;
            }
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            switch (command.Id)
            {
                case 0:
                {
                    await Clients.TradeClient.AddUserToTrustedAsync(new AddUserToTrustedRequest
                    {
                        UserId = userInfo.Id
                    });
                    await GetUser(userInfo.Id);
                    break;
                }
                case 1:
                {
                    await Clients.TradeClient.RemoveFromTrustedUsersAsync(new RemoveFromTrustedRequest
                    {
                        UserId = userInfo.Id
                    });
                    await GetUser(userInfo.Id);
                    break;
                }
                case 2:
                {
                    await Clients.TradeClient.BlockUserAsync(new BlockUserRequest
                    {
                        UserId = userInfo.Id
                    });
                    await GetUser(userInfo.Id);
                    break;
                }
                case 3:
                {
                    await Clients.TradeClient.UnBlockUserAsync(new UnBlockUserRequest
                    {
                        UserId = userInfo.Id
                    });
                    await GetUser(userInfo.Id);
                    break;
                }
                default:
                    return await PrintError();
            }

            return await Print();
        }

        private string YesNo(bool val)
        {
            return val ? s.Get(Localization.UserInfo.Keys.Yes) : s.Get(Localization.UserInfo.Keys.No);
        }

        public class State : StateBase
        {
            public string UserId { get; set; }
        }

        public UserInfo(BaseMenu parent) : base(parent)
        {
            s = new Localization.UserInfo(Menu);
        }

        public UserInfo(Menu menu) : base(menu)
        {
            s = new Localization.UserInfo(menu);
        }

        public override bool HideNavigation => true;

        public override string Name => $"{s.Get(Localization.UserInfo.Keys.User)}";

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                UserId = userInfo?.Id
            });
        }

        public override async Task SetState(StateBase state)
        {
            var s = state as State;
            await GetUser(s?.UserId);
        }

        private async Task GetUser(string id)
        {
            if (id.IsNullOrEmpty())
                return;
            var resp = await Clients.TradeClient.GetUserInfoAsync(new GetUserInfoRequest
            {
                Id = id
            });
            userInfo = resp.UserInfo;
            var resp1 = await Clients.TradeClient.GetUserFeedbacksAsync(new GetUserFeedbacksRequest
            {
                Count = -10,
                StartId = 0,
                UserId = id,
                IsDealsFeedbacks = true
            });
            feedbacks = resp1.Feedbacks;
            var resp2 = await Clients.TradeClient.IsUserTrustedAsync(new IsUserTrustedRequest
            {
                UserId = id
            });
            isTrusted = resp2.IsTrusted;
            var resp3 = await Clients.TradeClient.IsUserBlockedAsync(new IsUserBlockedRequest
            {
                UserId = id
            });
            isBlocked = resp3.IsBlocked;
        }

        public void SetUser(Protos.TradeApi.V1.UserInfo userInfo)
        {
            this.userInfo = userInfo;
        }

        public async Task SetUser(string id)
        {
            await GetUser(id);
        }
    }
}