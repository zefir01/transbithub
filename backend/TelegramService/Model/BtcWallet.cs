using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult= System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class BtcWallet : BaseMenu
    {
        private readonly InBtc inBtc;
        private readonly OutBtc outBtc;
        private readonly Transactions transactionsOut;
        private readonly Transactions transactionsIn;
        private Protos.TradeApi.V1.Balance balance;
        private readonly Localization.Wallet s;

        public BtcWallet(BaseMenu parent) : base(parent)
        {
            inBtc = new InBtc(this);
            outBtc = new OutBtc(this);
            transactionsOut = new Transactions(this, true);
            transactionsIn = new Transactions(this, false);
            s = new Localization.Wallet(Menu);
        }

        public override bool HideNavigation => true;
        public override string Name => "Bitcoin Network";

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
                var res = new Result(this, s.Get(Localization.Wallet.Keys.NoBalances),
                    BackBtn.BackHome(this).ToKeyboard());
                return new List<Result> {res};
            }
            

            string str = $"<b>{s.Get(Localization.Wallet.Keys.Crypto)}</b> BTC\n" +
                         $"<b>{s.Get(Localization.Wallet.Keys.Balance)}</b> {balance.Confirmed.FromPb()}\n" +
                         $"<b>{s.Get(Localization.Wallet.Keys.Deposited)}</b> {balance.Deposited.FromPb()}\n" +
                         $"<b>{s.Get(Localization.Wallet.Keys.NotConfirmed)}</b> {balance.UnConfirmed.FromPb()}\n";
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.Wallet.Keys.Receive), $"cmd in BTC");
            var btn1 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.Wallet.Keys.Send), $"cmd out BTC");
            var btn2 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.Wallet.Keys.InTrans),
                $"cmd trans in BTC");
            var btn3 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.Wallet.Keys.OutTrans),
                $"cmd trans out BTC");
            if (balance.Confirmed.FromPb() > 0)
            {
                arr.Add(new List<InlineKeyboardButton>
                    {
                        btn, btn1
                    }
                );
            }
            else
            {
                arr.Add(new List<InlineKeyboardButton>
                    {
                        btn
                    }
                );
            }

            arr.Add(new List<InlineKeyboardButton>
                {
                    btn2, btn3
                }
            );

            arr.Add(BackBtn.BackHome(this));

            var keyboard = new InlineKeyboardMarkup(arr);
            list.Add(new Result(this, str, keyboard));


            return list;
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result!=null)
                return result;

            result = await IsHome(command);
            if (result!=null)
                return result;
            
            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await PrintError();
            if (arr[1] == "in" || arr[1] == "out")
            {
                switch (arr[2])
                {
                    case "BTC":
                        if (arr[1] == "in")
                        {
                            return await inBtc.Print();
                        }

                        if (arr[1] == "out")
                        {
                            return await outBtc.Print();
                        }

                        break;
                    default:
                        return await PrintError();
                }
            }

            if (arr[1] == "trans")
            {
                bool isOut = arr[2] == "out";
                var c = isOut ? transactionsOut : transactionsIn;
                return await c.Print();
            }

            return await PrintError();
        }
    }
}