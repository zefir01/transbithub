using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Humanizer;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class DealsList : BaseMenu
    {
        public class State : StateBase
        {
            public DealStatus Status { get; set; }
            public int Page { get; set; }
        }

        private DealStatus status;
        private IList<Protos.TradeApi.V1.Deal> deals = new List<Protos.TradeApi.V1.Deal>();
        private IList<Event> events = new List<Event>();
        private int page = 1;
        private int pageSize = 30;
        private Localization.DealsList s;
        public Deal DealView { get; }
        private readonly UserInfo userInfo;

        public DealsList(BaseMenu parent) : base(parent)
        {
            s = new Localization.DealsList(Menu);
            DealView = new Deal(this);
            userInfo = new UserInfo(this);
        }

        public override bool HideNavigation => true;

        public override string Header
        {
            get
            {
                string status1 = status switch
                {
                    DealStatus.Opened => s.Get(Localization.DealsList.Keys.Opened),
                    DealStatus.Canceled => s.Get(Localization.DealsList.Keys.Canceled),
                    DealStatus.Completed => s.Get(Localization.DealsList.Keys.Completed),
                    DealStatus.Disputed => s.Get(Localization.DealsList.Keys.Disputed),
                    DealStatus.WaitDeposit=>s.Get(Localization.DealsList.Keys.DealWaitDeposit),
                    _ => throw new ArgumentOutOfRangeException()
                };
                string str = $"{s.Get(Localization.DealsList.Keys.Your)} {status1}\n";
                str += $"{s.Get(Localization.DealsList.Keys.Page)} {page}\n";
                return str;
            }
        }

        public override string Name => s.Get(Localization.DealsList.Keys.DealsList);

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                List<ICommand> list = new List<ICommand>();
                if (page > 1)
                    list.Add(new Command(s.Get(Localization.DealsList.Keys.PrevPage), 0));
                if (deals.Count == pageSize)
                    list.Add(new Command(s.Get(Localization.DealsList.Keys.NextPage), 1));
                return list;
            }
        }

        protected override AsyncResult NewCommand(ICommand command)
        {
            if (command.Id == 0 && page > 1)
                page--;
            if (command.Id == 1)
                page++;
            return Task.FromResult(CreatePage());
        }

        protected override async AsyncResult OnCommand(string command)
        {
            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await base.OnCommand(command);
            switch (arr[1])
            {
                case "deal":
                    var deal = deals.First(p => p.Id == ulong.Parse(arr[2]));
                    await DealView.SetDeal(deal);
                    return await DealView.Print();
                case "user":
                    await userInfo.SetUser(arr[2]);
                    return await userInfo.Print();
            }

            return await Print();
        }

        public async Task SetStatus(DealStatus status)
        {
            this.status = status;
            await GetDeals();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Status = status,
                Page = page
            });
        }

        public override async Task SetState(StateBase state)
        {
            var st = state as State;
            // ReSharper disable once PossibleNullReferenceException
            status = st.Status;
            page = st.Page;
            await GetDeals();
        }

        private async Task GetDeals()
        {
            var req = new GetMyDealsRequest
            {
                LoadCount = page * pageSize
            };
            req.Status.Add(status);
            if(status==DealStatus.Opened)
                req.Status.Add(DealStatus.WaitDeposit);
            var resp = await Clients.TradeClient.GetMyDealsAsync(req);
            deals = resp.Deals;
            var resp1 = Clients.TradeClient.GetUserEvents(new Empty());
            events = resp1.Events;
            var ordered = from d in deals
                select new
                {
                    deal = d,
                    ord = DealOrder(d)
                }
                into dd
                orderby dd.ord, dd.deal.CreatedAt descending
                select dd.deal;
            deals = ordered.ToList();
        }

        private int DealOrder(Protos.TradeApi.V1.Deal deal)
        {
            int newMessagesCount = events.Count(p => p.DealNewMessage != null && p.DealNewMessage.Id == deal.Id);
            int newStatusesCount =
                events.Count(p => p.DealStatusChanged != null && p.DealStatusChanged.Id == deal.Id);
            if (newMessagesCount > 0)
                return 1;
            if (newStatusesCount > 0)
                return 2;
            return 3;
        }

        private Result GetDealInfo(Protos.TradeApi.V1.Deal deal, bool isBackInsert)
        {
            int newMessagesCount = events.Count(p => p.DealNewMessage != null && p.DealNewMessage.Id == deal.Id);
            int newStatusesCount =
                events.Count(p => p.DealStatusChanged != null && p.DealStatusChanged.Id == deal.Id);
            var partner = deal.Initiator.Id == Menu.UserId ? deal.Advertisement.Owner : deal.Initiator;
            string str = $"<b>Id:</b> {deal.Id}\n" +
                         $"<b>{s.Get(Localization.DealsList.Keys.Partner)}</b> {partner.Username}\n" +
                         $"<b>{s.Get(Localization.DealsList.Keys.Amount)}</b> {deal.FiatAmount.FromPb()} {deal.Advertisement.FiatCurrency}\n" +
                         $"<b>{s.Get(Localization.DealsList.Keys.Price)}</b> {deal.Advertisement.Price.FromPb()} {deal.Advertisement.FiatCurrency}/BTC\n" +
                         $"<b>{s.Get(Localization.DealsList.Keys.Created)}</b> {deal.CreatedAt.ToDateTime().Humanize(dateToCompareAgainst: DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified), culture: CultureInfo)}\n";
            if (newMessagesCount > 0)
                str += $"<b>{s.Get(Localization.DealsList.Keys.NewMessages)}</b> <code>{newMessagesCount}</code>";
            if (newStatusesCount > 0)
                str +=
                    $"<b>{s.Get(Localization.DealsList.Keys.NewStatus)}</b> <code>{s.Get(Localization.DealsList.Keys.Yes)}</code>";
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.DealsList.Keys.Go),
                $"cmd deal {deal.Id}");
            var btn1 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.DealsList.Keys.Partner1),
                $"cmd user {partner.Id}");
            arr.Add(new List<InlineKeyboardButton>
                {
                    btn, btn1
                }
            );
            if (isBackInsert)
                arr.Add(BackBtn.BackHome(this));

            var keyboard = new InlineKeyboardMarkup(arr);
            var res = new Result(this, str, keyboard);
            return res;
        }

        private List<Result> CreatePage()
        {
            List<Result> results = new List<Result>();
            if (!deals.Any())
            {
                results.Add(new Result(this, s.Get(Localization.DealsList.Keys.NoDeals),
                    BackBtn.BackHome(this).ToKeyboard()));
                return results;
            }

            for (int i = 0; i < deals.Count; i++)
                results.Add(GetDealInfo(deals[i], deals.Count - 1 == i));
            return results;
        }

        public override async AsyncResult OnStart()
        {
            await GetDeals();
            var pages = CreatePage();
            pages = (await Print()).Concat(pages).ToList();
            return pages;
        }
    }
}