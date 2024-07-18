using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramService.Model
{
    public class LNPayments : BaseMenu
    {
        private uint page;
        private readonly uint pageSize = 10;
        private List<Protos.TradeApi.V1.LNPayment> payments = new List<Protos.TradeApi.V1.LNPayment>();
        private readonly Localization.LNPayments s;

        public LNPayments(BaseMenu parent) : base(parent)
        {
            s = new Localization.LNPayments(Menu);
        }

        private async Task GetPayments()
        {
            var resp = await Clients.TradeClient.LNGetPaymentsAsync(new LNGetPaymentsRequest
            {
                Skip = page * pageSize,
                Take = pageSize
            });
            payments = resp.LNPayments.ToList();
        }

        public override string Name => s.Get(Localization.LNPayments.Keys.Name);
        public override string Header => s.Get(Localization.LNPayments.Keys.Header, (page + 1).ToString());
        public override bool HideNavigation => true;

        public override async Task<List<Result>> OnStart()
        {
            await GetPayments();
            return await Print();
        }

        private string GetPaymentInfo(Protos.TradeApi.V1.LNPayment payment)
        {
            string str = $"<b>ID:</b> {payment.Id}\n" +
                         s.Get(Localization.LNPayments.Keys.Amount,
                             payment.Amount.FromPb().ToString(CultureInfo.InvariantCulture)) +
                         s.Get(Localization.LNPayments.Keys.Desc, payment.Description) +
                         s.Get(Localization.LNPayments.Keys.CreatedAt,
                             payment.CreatedAt.ToDateTime().ToString(CultureInfo.InvariantCulture)) +
                         $"<b>BOLT11:</b> {payment.Bolt11}\n";
            return str;
        }

        protected override Task<List<Result>> Content()
        {
            var a = new List<InlineKeyboardButton>();
            if (page > 0)
                a.Add(InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNPayments.Keys.PrevPage), "cmd back"));
            if (payments.Count == pageSize)
                a.Add(InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNPayments.Keys.NextPage), "cmd next"));
            var arr = new List<List<InlineKeyboardButton>>
            {
                a,
                BackBtn.BackHome(this)
            };
            var results = new List<Result>();
            foreach (var payment in payments)
            {
                var res = new Result(this, GetPaymentInfo(payment), InlineKeyboardMarkup.Empty());
                results.Add(res);
            }

            if (results.Any())
                results.Last().Keyboard = arr.ToKeyboard();
            return Task.FromResult(results);
        }

        protected override async Task<List<Result>> OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
                return result;

            result = await IsHome(command);
            if (result != null)
                return result;

            if (command == "cmd back")
            {
                if (page == 0)
                    return await Print();
                page -= 1;
                return await Print();
            }

            if (command == "cmd next")
            {
                if (payments.Count != pageSize)
                    return await Print();
                page += 1;
                return await Print();
            }

            return await PrintError();
        }
    }
}