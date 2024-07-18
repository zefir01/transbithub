using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Protos.TradeApi.V1;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class MyDeals : BaseMenu
    {
        private IList<Event> events;
        private Localization.MyDeals s;
        public DealsList DealsList { get; }

        private new IList<Event> Events
        {
            get
            {
                if (events == null)
                    GetEvents().ConfigureAwait(false).GetAwaiter().GetResult();
                return events;
            }
        }

        public override string Name
        {
            get
            {
                GetEvents().ConfigureAwait(false).GetAwaiter().GetResult();
                var newStatus = Events.Where(p => p.DealStatusChanged != null || p.DealFiatPayed != null)
                    .Select(p => p.DealStatusChanged?.Id ?? p.DealFiatPayed?.Id).Distinct().Count();
                var newMessages = Events.Where(p => p.DealNewMessage != null).Select(p => p.DealNewMessage.Id)
                    .Distinct().Count();
                string str = s.Get(Localization.MyDeals.Keys.MyDeals);
                if (newStatus > 0 || newMessages > 0)
                    str += "(";
                if (newStatus > 0)
                    str += $"{s.Get(Localization.MyDeals.Keys.NewStatus)}{newStatus}";
                if (newStatus > 0 && newMessages > 0)
                    str += " ";
                if (newMessages > 0)
                    str += $"{s.Get(Localization.MyDeals.Keys.NewMessages)}{newMessages}";
                if (newStatus > 0 || newMessages > 0)
                    str += ")";
                return str;
            }
        }

        public override string Header => s.Get(Localization.MyDeals.Keys.Info);

        public MyDeals(BaseMenu parent) : base(parent)
        {
            s = new Localization.MyDeals(Menu);
            DealsList = new DealsList(this);
        }

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                var list = new List<ICommand>
                {
                    new Command($"{s.Get(Localization.MyDeals.Keys.Opened)} {CreateCounts(DealStatus.Opened, Events)}",
                        0),
                    new Command(
                        $"{s.Get(Localization.MyDeals.Keys.Completed)} {CreateCounts(DealStatus.Completed, Events)}",
                        1),
                    new Command(
                        $"{s.Get(Localization.MyDeals.Keys.Canceled)} {CreateCounts(DealStatus.Canceled, Events)}", 2),
                    new Command(
                        $"{s.Get(Localization.MyDeals.Keys.Disputed)} {CreateCounts(DealStatus.Disputed, Events)}", 3)
                };
                if (events.Any(p => p.DealStatusChanged != null || p.DealNew != null || p.DealNewMessage != null))
                    list.Add(new Command(s.Get(Localization.MyDeals.Keys.MarkAsRead), 4));
                return list;
            }
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            switch (command.Id)
            {
                case 0:
                    await DealsList.SetStatus(DealStatus.Opened);
                    break;
                case 1:
                    await DealsList.SetStatus(DealStatus.Completed);
                    break;
                case 2:
                    await DealsList.SetStatus(DealStatus.Canceled);
                    break;
                case 3:
                    await DealsList.SetStatus(DealStatus.Disputed);
                    break;
                case 4:
                {
                    var e = events.Where(p =>
                            p.DealStatusChanged != null || p.DealNew != null || p.DealNewMessage != null)
                        .Select(p => p.Id).ToList();
                    if (e.Any())
                    {
                        var req = new MarkEventsAsReadRequest();
                        req.Id.AddRange(e);
                        await Clients.TradeClient.MarkEventsAsReadAsync(req);
                        await GetEvents();
                    }
                }
                    break;
                default:
                    return await PrintError();
            }

            return await DealsList.Print();
        }

        private string CreateCounts(DealStatus status, IList<Event> events)
        {
            var newStatus = events.Where(p =>
                    p.DealStatusChanged != null || p.DealFiatPayed != null)
                .Select(p => p.DealStatusChanged ?? p.DealFiatPayed).Distinct();
            var newMessages = events.Where(p => p.DealNewMessage != null).Select(p => p.DealNewMessage)
                .Distinct();
            int newStatusCount = newStatus.Count(p => p.Status == status);
            int newMessagesCount = newMessages.Count(p => p.Status == status);
            string str = "";
            if (newStatusCount > 0 || newMessagesCount > 0)
                str += "(";
            if (newStatusCount > 0)
                str += $"{s.Get(Localization.MyDeals.Keys.NewStatus)}{newStatusCount}";
            if (newStatusCount > 0 && newMessagesCount > 0)
                str += " ";
            if (newMessagesCount > 0)
                str += $"{s.Get(Localization.MyDeals.Keys.NewMessages)}{newMessagesCount}";
            if (newStatusCount > 0 || newMessagesCount > 0)
                str += ")";
            return str;
        }

        private async Task GetEvents()
        {
            var resp = await Clients.TradeClient.GetUserEventsAsync(new Empty());
            events = resp.Events;
        }
    }
}