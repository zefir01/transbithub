using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class LNWallet : BaseMenu
    {
        private Protos.TradeApi.V1.Balance balance;
        private readonly Localization.LNWallet s;
        private readonly LNReceive lnReceive;
        private readonly LNSend lnSend;
        private readonly LNInvoices lnInvoices;
        private readonly LNPayments lnPayments;

        public LNWallet(BaseMenu parent) : base(parent)
        {
            s = new Localization.LNWallet(Menu);
            lnReceive = new LNReceive(this);
            lnSend = new LNSend(this);
            lnInvoices = new LNInvoices(this);
            lnPayments=new LNPayments(this);
        }

        public override bool HideNavigation => true;
        public override string Name => "Lightning Network";

        public override async AsyncResult OnStart()
        {
            await GetBalances();
            return await Print();
        }

        private async Task GetBalances()
        {
            balance = await Clients.TradeClient.GetBalancesAsync(new Empty());
        }

        protected override async AsyncResult Content()
        {
            if (balance == null)
                await GetBalances();
            List<Result> list = new List<Result>();
            if (balance==null)
            {
                var res = new Result(this, s.Get(Localization.LNWallet.Keys.NoBalances),
                    BackBtn.BackHome(this).ToKeyboard());
                return new List<Result> {res};
            }

            string str = $"<b>{s.Get(Localization.LNWallet.Keys.Crypto)}</b> BTC\n" +
                         $"<b>{s.Get(Localization.LNWallet.Keys.Balance)}</b> {balance.Confirmed.FromPb()}\n" +
                         $"<b>{s.Get(Localization.LNWallet.Keys.Deposited)}</b> {balance.Deposited.FromPb()}\n" +
                         $"<b>{s.Get(Localization.LNWallet.Keys.NotConfirmed)}</b> {balance.UnConfirmed.FromPb()}\n";
            var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNWallet.Keys.Receive),
                "cmd in");
            var btn1 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNWallet.Keys.Send),
                "cmd out");
            var btn2 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNWallet.Keys.Invoices),
                "cmd invoices");
            var btn3 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNWallet.Keys.Payments),
                "cmd payments");

            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>
            {
                new List<InlineKeyboardButton> {btn, btn1},
                new List<InlineKeyboardButton> {btn2, btn3},
                BackBtn.BackHome(this)
            };
            
            list.Add(new Result(this, str, arr.ToKeyboard()));

            return list;
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
                return result;

            result = await IsHome(command);
            if (result != null)
                return result;

            if (command == "cmd in")
                return await lnReceive.Print();
            if (command == "cmd out")
                return await lnSend.Print();
            if (command == "cmd invoices")
                return await lnInvoices.Print();
            if (command == "cmd payments")
                return await lnPayments.Print();
            return await PrintError();
        }
    }
}