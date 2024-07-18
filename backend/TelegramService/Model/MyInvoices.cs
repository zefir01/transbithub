using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using IdentityServer4.Extensions;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult= System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using Enum = System.Enum;

namespace TelegramService.Model
{
    public class MyInvoices : BaseMenu
    {
        private class State : StateBase
        {
            public uint Page { get; set; }
        }

        private IList<Invoice> invoices = new List<Invoice>();
        private uint page = 1;
        private const uint PageSize = 30;
        private readonly InvoiceView invoiceView;
        private readonly UserInfo userInfo;
        private readonly Localization.MyInvoices s;
        private Variables vars;

        public MyInvoices(BaseMenu parent, ILogger logger, IConfig config) : base(parent)
        {
            s = new Localization.MyInvoices(Menu);
            invoiceView = new InvoiceView(this, logger, config);
            userInfo = new UserInfo(this);
        }

        private int NewInvoicesCount => Events.Where(p => p.InvoiceNew!=null).Select(p => p.InvoiceNew.Id)
            .Distinct().Count();

        public override string Name => NewInvoicesCount == 0
            ? s.Get(Localization.MyInvoices.Keys.Name)
            : s.Get(Localization.MyInvoices.Keys.Name1, NewInvoicesCount.ToString());

        public override bool HideNavigation => Menu.Profile.IsAnonymous;

        public override string Header => s.Get(Localization.MyInvoices.Keys.Header);

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                List<ICommand> list = new List<ICommand>();
                if (page > 1)
                    list.Add(new Command(s.Get(Localization.MyInvoices.Keys.PrevPage), 0));
                if (invoices.Count == PageSize)
                    list.Add(new Command(s.Get(Localization.MyInvoices.Keys.NextPage), 1));
                return list;
            }
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            if (command.Id == 0)
                page--;
            if (command.Id == 1)
                page++;
            return await Print();
        }

        protected override async AsyncResult OnCommand(string command)
        {
            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await base.OnCommand(command);
            switch (arr[1])
            {
                case "invoice":
                    invoiceView.Invoice = invoices.First(p => p.Id == ulong.Parse(arr[2]));
                    return await invoiceView.Print();
                case "user":
                    await userInfo.SetUser(arr[2]);
                    return await userInfo.Print();
                case "deleteInvoice":
                {
                    bool isParsed = ulong.TryParse(arr[2], out var id);
                    if (!isParsed)
                        throw new Exception(s.Get(Localization.MyInvoices.Keys.InvalidId));
                    await Clients.TradeClient.DeleteInvoiceAsync(new DeleteInvoiceRequest
                    {
                        InvoiceId = id
                    });
                    var invoice = invoices.First(p => p.Id == id);
                    invoices.Remove(invoice);
                    return await Print();
                }
            }

            return await Print();
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            if (!Enum.TryParse<Catalog.Currencies>(message.Text.ToUpper(), out var cur))
                return await PrintError();
            Currency = cur;
            return await Print();
        }

        private string GetInvoiceInfoShort(Invoice invoice, bool isNew)
        {
            var info = new InvoiceInfo(invoice, Currency, vars);
            string msg = s.Get(Localization.MyInvoices.Keys.Id, invoice.Id.ToString()) +
                         (isNew ? s.Get(Localization.MyInvoices.Keys.New) : "") +
                         (invoice.Status == Invoice.Types.InvoiceStatus.Payed ? s.Get(Localization.MyInvoices.Keys.Paid) : "") +
                         s.Get(Localization.MyInvoices.Keys.From, invoice.Owner.Username);
            if (invoice.IsPrivate)
            {
                msg += s.Get(Localization.MyInvoices.Keys.FiatAmount,
                    info.PiecePriceFiat.ToString(CultureInfo.InvariantCulture),
                    Currency.ToString());
                msg += s.Get(Localization.MyInvoices.Keys.CryptoAmount,
                    info.PiecePriceCrypto.ToString(CultureInfo.InvariantCulture));
            }
            else
            {
                msg += s.Get(Localization.MyInvoices.Keys.PiecePriceFiat,
                    info.PiecePriceFiat.ToString(CultureInfo.InvariantCulture), Currency.ToString());
                msg += s.Get(Localization.MyInvoices.Keys.PiecePriceCrypto,
                    info.PiecePriceCrypto.ToString(CultureInfo.InvariantCulture));
            }

            msg += s.Get(Localization.MyInvoices.Keys.CreatedAt,
                invoice.CreatedAt.ToDateTime().ToString(CultureInfo.InvariantCulture));
            if (!invoice.RefundIsNull)
                msg += s.Get(Localization.MyInvoices.Keys.Comment1,
                    s.Get(Localization.MyInvoices.Keys.Refund, invoice.RefundPaymentId.ToString(),
                        invoice.PiecesMax.ToString()));
            else if (invoice.Comment.IsNullOrEmpty())
                msg += s.Get(Localization.MyInvoices.Keys.Comment);
            else
                msg += s.Get(Localization.MyInvoices.Keys.Comment1, invoice.Comment);
            msg += s.Get(Localization.MyInvoices.Keys.ValidTo,
                invoice.CreatedAt.ToDateTime().AddMinutes(invoice.TtlMinutes).ToString(CultureInfo.InvariantCulture));
            return msg;
        }

        private Result GetResult(Invoice invoice, bool isBackInsert)
        {
            bool isNew = Events.Any(p => p.InvoiceNew!=null && p.InvoiceNew.Id == invoice.Id);
            string msg = GetInvoiceInfoShort(invoice, isNew);
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.MyInvoices.Keys.GotoInvoice),
                $"cmd invoice {invoice.Id}");
            InlineKeyboardButton btn1 =
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.MyInvoices.Keys.Delete),
                    $"cmd deleteInvoice {invoice.Id}");
            var btn2 = InlineKeyboardButton.WithCallbackData(s.Get(Localization.MyInvoices.Keys.Partner),
                $"cmd user {invoice.Owner.Id}");
            var list = new List<InlineKeyboardButton>
            {
                btn
            };
            if (invoice.IsPrivate)
                list.Add(btn1);
            list.Add(btn2);
            arr.Add(list);
            if (isBackInsert)
                arr.Add(BackBtn.BackHome(this));
            var keyboard = new InlineKeyboardMarkup(arr);
            var res = new Result(this, msg, keyboard);
            return res;
        }

        protected override AsyncResult Content()
        {
            List<Result> results = new List<Result>();
            if (!invoices.Any())
            {
                results.Add(new Result(this, s.Get(Localization.MyInvoices.Keys.NoInvoices),
                    BackBtn.BackHome(this).ToKeyboard()));
                return Task.FromResult(results);
            }

            for (int i = 0; i < invoices.Count; i++)
                results.Add(GetResult(invoices[i], invoices.Count - 1 == i));
            return Task.FromResult(results);
        }

        private async Task GetInvoices()
        {
            this.invoices = new List<Invoice>();
            var req = new GetInvoicesRequest
            {
                IsOwner = false,
                Count = page * PageSize,
                Id = default,
                IsOwnerHasValue = true,
                IsPrivate = true,
                IsPrivateHasValue = true,
                LastId = 0,
                ToUser = ""
            };
            req.Statuses.Add(Invoice.Types.InvoiceStatus.Active);
            req.Statuses.Add(Invoice.Types.InvoiceStatus.PendingPay);
            var resp = await Clients.TradeClient.GetInvoicesAsync(req);
            var invoices = resp.Invoices.ToList();
            invoices = invoices.Skip((int)((page - 1) * PageSize)).Take((int)PageSize).ToList();
            this.invoices = invoices;
        }

        private async Task GetVars()
        {
            vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
        }

        public override async AsyncResult OnStart()
        {
            await GetInvoices();
            await GetVars();
            return await Print();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Page = page,
            });
        }

        public override async Task SetState(StateBase state)
        {
            var t = state as State;
            // ReSharper disable once PossibleNullReferenceException
            page = t.Page;
            await GetInvoices();
            await GetVars();
        }
    }
}