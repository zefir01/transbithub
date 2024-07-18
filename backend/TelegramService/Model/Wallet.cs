using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class Wallet : BaseMenu
    {
        private Protos.TradeApi.V1.Balance balance;
        private readonly Localization.Wallet s;
        private readonly BtcWallet btcWallet;
        private readonly LNWallet lnWallet;

        public Wallet(BaseMenu parent) : base(parent)
        {
            s = new Localization.Wallet(Menu);
            btcWallet = new BtcWallet(this);
            lnWallet = new LNWallet(this);
        }

        public override string Name => s.Get(Localization.Wallet.Keys.Name);

        public override string Header
        {
            get
            {
                string str = s.Get(Localization.Wallet.Keys.Info);
                return str;
            }
        }

        public override async AsyncResult OnStart()
        {
            await GetBalances();
            var pages = CreatePage();
            pages = (await Print()).Concat(pages).ToList();
            return pages;
        }

        private List<Result> CreatePage()
        {
            List<Result> list = new List<Result>();
            if (balance == null)
            {
                var res = new Result(this, s.Get(Localization.Wallet.Keys.NoBalances),
                    BackBtn.BackHome(this).ToKeyboard());
                return new List<Result> {res};
            }

            string str = $"<b>{s.Get(Localization.Wallet.Keys.Crypto)}</b> BTC\n" +
                         $"<b>{s.Get(Localization.Wallet.Keys.Balance)}</b> {balance.Confirmed.FromPb()}\n" +
                         $"<b>{s.Get(Localization.Wallet.Keys.Deposited)}</b> {balance.Deposited.FromPb()}\n" +
                         $"<b>{s.Get(Localization.Wallet.Keys.NotConfirmed)}</b> {balance.UnConfirmed.FromPb()}\n";
            var btn = InlineKeyboardButton.WithCallbackData("Bitcoin Network", "cmd bitcoin");
            var btn1 = InlineKeyboardButton.WithCallbackData("Lightning Network", "cmd ln");
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>
            {
                new List<InlineKeyboardButton> {btn, btn1},
                BackBtn.BackHome(this)
            };
            list.Add(new Result(this, str, arr.ToKeyboard()));

            return list;
        }

        private async Task GetBalances()
        {
            balance = await Clients.TradeClient.GetBalancesAsync(new Empty());
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

            switch (command)
            {
                case "cmd bitcoin":
                    return await btcWallet.Print();
                case "cmd ln":
                    return await lnWallet.Print();
            }


            return await PrintError();
        }

        public override async AsyncResult NewMessage(Message message)
        {
            return await OnStart();
        }
    }
}