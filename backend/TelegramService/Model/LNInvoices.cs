using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramService.Model
{
    public class LNInvoices : BaseMenu
    {
        private uint page;
        private readonly uint pageSize = 10;
        private List<LNInvoice> invoices = new List<LNInvoice>();
        private readonly Localization.LNInvoices s;

        public LNInvoices(BaseMenu parent) : base(parent)
        {
            s = new Localization.LNInvoices(Menu);
        }

        private async Task GetInvoices()
        {
            var resp = await Clients.TradeClient.LNGetInvoicesAsync(new LNGetInvoicesRequest
            {
                Skip = page * pageSize,
                Take = pageSize
            });
            invoices = resp.Invoices.ToList();
        }

        public override string Name => s.Get(Localization.LNInvoices.Keys.Name);
        public override string Header => s.Get(Localization.LNInvoices.Keys.Header, (page + 1).ToString());
        public override bool HideNavigation => true;

        public override async Task<List<Result>> OnStart()
        {
            await GetInvoices();
            return await Print();
        }

        private string GetStatus(LNInvoice invoice)
        {
            if(invoice.IsPaid)
                return s.Get(Localization.LNInvoices.Keys.Paid);
            return s.Get(Localization.LNInvoices.Keys.Unpaid);
        }

        private string GetInvoiceInfo(LNInvoice invoice)
        {
            string str = $"<b>ID:</b> {invoice.Id}\n" +
                         s.Get(Localization.LNInvoices.Keys.Status, GetStatus(invoice)) +
                         s.Get(Localization.LNInvoices.Keys.Amount,
                             invoice.Amount.FromPb().ToString(CultureInfo.InvariantCulture)) +
                         s.Get(Localization.LNInvoices.Keys.CreatedAt,
                             invoice.CreatedAt.ToDateTime().ToString(CultureInfo.InvariantCulture)) +
                         s.Get(Localization.LNInvoices.Keys.Expires,
                             invoice.CreatedAt.ToDateTime().AddMinutes(invoice.ExpiresIn).ToString(CultureInfo.InvariantCulture)) +
                         s.Get(Localization.LNInvoices.Keys.Desc, invoice.Description) +
                         $"<b>BOLT11:</b> {invoice.Bolt11}\n";
            return str;
        }

        protected override Task<List<Result>> Content()
        {
            var a = new List<InlineKeyboardButton>();
            if (page > 0)
                a.Add(InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNInvoices.Keys.PrevPage), "cmd back"));
            if (invoices.Count == pageSize)
                a.Add(InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNInvoices.Keys.NextPage), "cmd next"));
            var arr = new List<List<InlineKeyboardButton>>
            {
                a,
                BackBtn.BackHome(this)
            };
            var results = new List<Result>();
            foreach (var invoice in invoices)
            {
                var res = new Result(this, GetInvoiceInfo(invoice), InlineKeyboardMarkup.Empty());
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
                if (invoices.Count != pageSize)
                    return await Print();
                page += 1;
                return await Print();
            }

            return await PrintError();
        }
    }
}