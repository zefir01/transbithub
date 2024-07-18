using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class InvoicePaymentsList : BaseMenu
    {
        public class State : StateBase
        {
            public uint Page { get; set; }
        }

        private Localization.InvoicePaymentsList s;

        public InvoicePaymentsList(BaseMenu parent, ILogger logger, IConfig config) : base(parent)
        {
            PaymentView = new InvoicePaymentView(this);
            userInfo = new UserInfo(this);
            invoiceView = new InvoiceView(this, logger, config);
            s = new Localization.InvoicePaymentsList(Menu);
        }

        public override string Name => s.Get(Localization.InvoicePaymentsList.Keys.Name);

        public override string Header => s.Get(Localization.InvoicePaymentsList.Keys.Header);

        private uint page = 1;
        private const uint PageSize = 30;
        private List<InvoicePayment> payments = new List<InvoicePayment>();
        public InvoicePaymentView PaymentView { get; }
        private readonly UserInfo userInfo;
        private InvoiceView invoiceView;


        private async Task GetPayments()
        {
            var resp = await Clients.TradeClient.GetInvoicePaymentsAsync(new GetInvoicePaymentsRequest
            {
                Count = page * PageSize,
                IsToMe = false,
                IsToMeHasValue = true,
                LastId = default,
                PaymentId = default
            });
            var payments = resp.Payments.ToList();
            payments = payments.Skip((int)((page - 1) * PageSize)).Take((int)PageSize).ToList();
            this.payments = payments;
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Page = page
            });
        }

        public override async Task SetState(StateBase state)
        {
            var st = state as State;
            // ReSharper disable once PossibleNullReferenceException
            page = st.Page;
            await GetPayments();
        }

        public override async AsyncResult OnStart()
        {
            await GetPayments();
            return await Print();
        }

        private string GetStatus(InvoicePayment payment)
        {
            switch (payment.Status)
            {
                case InvoicePayment.Types.InvoicePaymentStatus.Pending:
                    return s.Get(Localization.InvoicePaymentsList.Keys.StatusPending);
                case InvoicePayment.Types.InvoicePaymentStatus.Canceled:
                    return s.Get(Localization.InvoicePaymentsList.Keys.StatusCanceled);
                case InvoicePayment.Types.InvoicePaymentStatus.Paid:
                    return s.Get(Localization.InvoicePaymentsList.Keys.StatusPaid);
            }

            return "";
        }

        private string GetPaymentInfoShort(InvoicePayment payment, bool isNew)
        {
            string msg = s.Get(Localization.InvoicePaymentsList.Keys.Id, payment.Id.ToString()) +
                         (isNew ? s.Get(Localization.InvoicePaymentsList.Keys.New) : "") +
                         s.Get(Localization.InvoicePaymentsList.Keys.InvoiceId, payment.Invoice.Id.ToString()) +
                         s.Get(Localization.InvoicePaymentsList.Keys.Status) + GetStatus(payment);
            if (payment.IsRefund)
            {
                msg += s.Get(Localization.InvoicePaymentsList.Keys.Refund, payment.Invoice.RefundPaymentId.ToString(),
                    payment.Invoice.PiecesMax.ToString());
            }

            if (!payment.Invoice.IsPrivate)
                msg += s.Get(Localization.InvoicePaymentsList.Keys.Pieces, payment.Pieces.ToString());
            if (payment.Deal != null)
                msg += s.Get(Localization.InvoicePaymentsList.Keys.FiatAmount,
                    payment.Deal.FiatAmount.FromPb().ToString(CultureInfo.InvariantCulture),
                    payment.Invoice.FiatCurrency);

            msg += s.Get(Localization.InvoicePaymentsList.Keys.CryptoAmount,
                payment.CryptoAmount.FromPb().ToString(CultureInfo.InvariantCulture));
            msg += s.Get(Localization.InvoicePaymentsList.Keys.CreatedAt,
                payment.CreatedAt.ToDateTime().ToString(CultureInfo.InvariantCulture));
            return msg;
        }

        private Result GetResult(InvoicePayment payment, bool isBackInsert)
        {
            string msg = GetPaymentInfoShort(payment, false);
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            var paymentBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoicePaymentsList.Keys.Payment),
                $"cmd payment {payment.Id}");
            var userBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoicePaymentsList.Keys.Partner),
                $"cmd user {payment.Invoice.Owner.Id}");
            var invoiceBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoicePaymentsList.Keys.Invoice),
                $"cmd invoice {payment.Invoice.Id}");
            var list = new List<InlineKeyboardButton>
            {
                paymentBtn
            };
            if (!payment.Invoice.IsPrivate)
                list.Add(invoiceBtn);
            list.Add(userBtn);
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
            if (!payments.Any())
            {
                results.Add(new Result(this, s.Get(Localization.InvoicePaymentsList.Keys.NoPayments),
                    BackBtn.BackHome(this).ToKeyboard()));
                return Task.FromResult(results);
            }

            for (int i = 0; i < payments.Count; i++)
                results.Add(GetResult(payments[i], payments.Count - 1 == i));
            return Task.FromResult(results);
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            var isParsed = ulong.TryParse(message.Text, out ulong id);
            if (!isParsed)
                return await PrintError(s.Get(Localization.InvoicePaymentsList.Keys.InvalidId));
            var resp = await Clients.TradeClient.GetInvoicePaymentsAsync(new GetInvoicePaymentsRequest
            {
                Count = 1,
                IsToMe = false,
                IsToMeHasValue = true,
                LastId = default,
                PaymentId = id
            });
            var payments = resp.Payments.ToList();
            if (!payments.Any())
                return await PrintError(s.Get(Localization.InvoicePaymentsList.Keys.NotFound));
            PaymentView.Payment = payments.First();
            return await PaymentView.Print();
        }

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                List<ICommand> list = new List<ICommand>();
                if (page > 1)
                    list.Add(new Command(s.Get(Localization.InvoicePaymentsList.Keys.PrevPage), 0));
                if (payments.Count == PageSize)
                    list.Add(new Command(s.Get(Localization.InvoicePaymentsList.Keys.NextPage), 1));
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
                case "payment":
                {
                    PaymentView.Payment = payments.First(p => p.Id == ulong.Parse(arr[2]));
                    return await PaymentView.Print();
                }
                case "user":
                    await userInfo.SetUser(arr[2]);
                    return await userInfo.Print();
                case "invoice":
                {
                    var payment = payments.First(p => p.Id == ulong.Parse(arr[2]));
                    invoiceView.Invoice = payment.Invoice;
                    return await invoiceView.Print();
                }
            }

            return await Print();
        }
    }
}