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
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using Enum = System.Enum;

namespace TelegramService.Model
{
    public class InvoiceView : BaseMenu
    {
        public class State : StateBase
        {
            public uint Pieces { get; set; }
            public ulong InvoiceId { get; set; }
        }

        private Invoice invoice;

        public Invoice Invoice
        {
            get => invoice;
            set
            {
                invoice = value;
                if (invoice == null)
                    return;
                invoiceId = invoice.Id;
                pieces = invoice.PiecesMin;
                var isNew = GetIsNew();
                if (isNew)
                {
                    var events = Events.Where(p => p.InvoiceNew != null && p.InvoiceNew.Id == invoiceId)
                        .ToList();
                    MarkEventAsRead(events).ConfigureAwait(false).GetAwaiter().GetResult();
                }

                GetBalance().ConfigureAwait(false).GetAwaiter().GetResult();
                GetVars().ConfigureAwait(false).GetAwaiter().GetResult();
                info = new InvoiceInfo(invoice, Currency, vars);
            }
        }

        private Balance balance;

        private uint pieces = 1;
        private string error = "";
        private ulong invoiceId;
        private Variables vars;
        private InvoiceInfo info;
        private readonly AdFilter adFilter;
        private readonly ConversationChat conversationChat;

        private bool IsPiecesAllowed =>
            Invoice != null && !Invoice.IsPrivate && Invoice.PiecesMax != Invoice.PiecesMin;

        private bool IsBalancePayAvailable
        {
            get
            {
                if (invoice.IsPrivate)
                {
                    if (Invoice.IsBaseCrypto)
                    {
                        if (Invoice.Price.FromPb() <= balance.Confirmed.FromPb())
                            return true;
                    }
                    else
                    {
                        if (Invoice.CurrentCryptoPrice.FromPb() <= balance.Confirmed.FromPb())
                            return true;
                    }
                }
                else
                {
                    if (invoice.IsBaseCrypto)
                    {
                        if (invoice.Price.FromPb() * pieces <= balance.Confirmed.FromPb())
                            return true;
                    }
                    else
                    {
                        if (invoice.CurrentCryptoPrice.FromPb() * pieces <= balance.Confirmed.FromPb())
                            return true;
                    }
                }

                return false;
            }
        }


        private Localization.InvoiceView s;

        public InvoiceView(BaseMenu parent, ILogger logger, IConfig config) : base(parent)
        {
            s = new Localization.InvoiceView(Menu);
            paymentView = new InvoicePaymentView(this);
            userInfo = new UserInfo(this);
            adFilter = new AdFilter(this, true, logger, config, true);
            conversationChat = new ConversationChat(this);
        }

        private readonly InvoicePaymentView paymentView;
        private readonly UserInfo userInfo;

        public override bool HideNavigation => true;

        public override string Name => s.Get(Localization.InvoiceView.Keys.Name);

        public override string Header => s.Get(Localization.InvoiceView.Keys.Header);

        protected override async AsyncResult OnCommand(string command)
        {
            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await base.OnCommand(command);
            switch (arr[1])
            {
                case "user":
                    await userInfo.SetUser(arr[2]);
                    return await userInfo.Print();
                case "deleteInvoice":
                {
                    await Clients.TradeClient.DeleteInvoiceAsync(new DeleteInvoiceRequest
                    {
                        InvoiceId = Invoice.Id
                    });
                    return await Parent.Print();
                }
                case "payBalance":
                {
                    var resp = await Clients.TradeClient.PayInvoiceFromBalanceAsync(new PayInvoiceFromBalanceRequest
                    {
                        InvoiceId = Invoice.Id,
                        Pieces = pieces
                    });
                    Invoice = resp.Invoice;
                    paymentView.Payment = resp;
                    return await paymentView.Print();
                }
                case "payLn":
                {
                    var resp = await Clients.TradeClient.PayInvoiceFromLNAsync(new PayInvoiceFromLNRequest
                    {
                        InvoiceId = Invoice.Id,
                        Pieces = pieces
                    });
                    Invoice = resp.Invoice;
                    paymentView.Payment = resp;
                    return await paymentView.Print();
                }
                case "payBestDeal":
                {
                    adFilter.SetInvoice(invoiceId, pieces, true);
                    return await adFilter.Print();
                }
                case "listAds":
                {
                    adFilter.SetInvoice(invoiceId, pieces, false);
                    return await adFilter.Print();
                }
                case "contact":
                {
                    conversationChat.InvoiceId = invoice.Id;
                    return await conversationChat.Print();
                }
            }

            return await Print();
        }

        private async Task GetBalance()
        {
            balance = await Clients.TradeClient.GetBalancesAsync(new Empty());
        }

        private bool GetIsNew()
        {
            var val = Events.Any(p => p.InvoiceNew != null && p.InvoiceNew.Id == Invoice.Id);
            return val;
        }

        private static string YesNo(bool value, Localization.InvoiceView s)
        {
            return value ? s.Get(Localization.InvoiceView.Keys.Yes) : s.Get(Localization.InvoiceView.Keys.No);
        }

        private static string GetUser(Protos.TradeApi.V1.UserInfo user, Localization.InvoiceView s)
        {
            return $"{user.Username} {s.Get(Localization.InvoiceView.Keys.Rate)} {user.ResponseRate.FromPb()}%";
        }

        public static string CreateInvoiceInfo(Invoice invoice, bool isNew, Localization.InvoiceView s, Catalog.Currencies Currency, InvoiceInfo info)
        {
            string msg = s.Get(Localization.InvoiceView.Keys.ID, invoice.Id.ToString()) +
                         (isNew ? s.Get(Localization.InvoiceView.Keys.New) : "") +
                         (invoice.Status == Invoice.Types.InvoiceStatus.Payed ? s.Get(Localization.InvoiceView.Keys.Payed) : "") +
                         s.Get(Localization.InvoiceView.Keys.From, GetUser(invoice.Owner, s)) +
                         s.Get(Localization.InvoiceView.Keys.Private, YesNo(invoice.IsPrivate, s)) +
                         s.Get(Localization.InvoiceView.Keys.CreatedAt,
                             invoice.CreatedAt.ToDateTime().ToString(CultureInfo.InvariantCulture));
            if (invoice.RefundIsNull)
                msg += s.Get(Localization.InvoiceView.Keys.Comment1,
                    s.Get(Localization.InvoiceView.Keys.Refund, invoice.RefundPaymentId.ToString(),
                        invoice.PiecesMax.ToString()));
            else if (invoice.Comment.IsNullOrEmpty())
                msg += s.Get(Localization.InvoiceView.Keys.Comment);
            else
                msg += s.Get(Localization.InvoiceView.Keys.Comment1, invoice.Comment);
            if (invoice.IsPrivate)
            {
                msg += s.Get(Localization.InvoiceView.Keys.FiatAmount,
                    info.PiecePriceFiat.ToString(CultureInfo.InvariantCulture), Currency.ToString());
                msg += s.Get(Localization.InvoiceView.Keys.CryptoAmount,
                    info.PiecePriceCrypto.ToString(CultureInfo.InvariantCulture));
                msg += s.Get(Localization.InvoiceView.Keys.ValidTo,
                    invoice.CreatedAt.ToDateTime().AddMinutes(invoice.TtlMinutes).ToString(CultureInfo.InvariantCulture));
            }
            else
            {
                msg += s.Get(Localization.InvoiceView.Keys.PiecePriceFiat,
                    info.PiecePriceFiat.ToString(CultureInfo.InvariantCulture), Currency.ToString());
                msg += s.Get(Localization.InvoiceView.Keys.PiecePriceCrypto,
                    info.PiecePriceCrypto.ToString(CultureInfo.InvariantCulture));

                if (invoice.PiecesMin != invoice.PiecesMax)
                {
                    msg += s.Get(Localization.InvoiceView.Keys.Pieces, invoice.PiecesMin.ToString(),
                        invoice.PiecesMax.ToString());
                    msg += s.Get(Localization.InvoiceView.Keys.MinFiat,
                        info.AmountFiatMin.ToString(CultureInfo.InvariantCulture), Currency.ToString());
                    msg += s.Get(Localization.InvoiceView.Keys.MaxFiat,
                        info.AmountFiatMax.ToString(CultureInfo.InvariantCulture), Currency.ToString());
                    msg += s.Get(Localization.InvoiceView.Keys.MinCrypto,
                        info.AmountCryptoMin.ToString(CultureInfo.InvariantCulture));
                    msg += s.Get(Localization.InvoiceView.Keys.MaxCrypto,
                        info.AmountCryptoMax.ToString(CultureInfo.InvariantCulture));
                }
                else
                {
                    msg += s.Get(Localization.InvoiceView.Keys.Pieces1, invoice.PiecesMin.ToString());
                }
            }

            if (!invoice.IsPrivate)
            {
                if (!invoice.IsBaseCrypto)
                    msg += s.Get(Localization.InvoiceView.Keys.TotalPayedFiat,
                        info.TotalPaidFiat.ToString(CultureInfo.InvariantCulture),
                        invoice.FiatCurrency);
                msg += s.Get(Localization.InvoiceView.Keys.TotalPayedCrypto,
                    invoice.TotalPayedCrypto.FromPb().ToString(CultureInfo.InvariantCulture));
                msg += s.Get(Localization.InvoiceView.Keys.PaymentsCount, invoice.PaymentsCount.ToString());
            }

            return msg;
        }

        private InlineKeyboardMarkup CreateKeyboard()
        {
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            InlineKeyboardButton payBtn;
            InlineKeyboardButton payLnBtn;
            if (!IsPiecesAllowed)
            {
                payBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.PayBalance),
                    "cmd payBalance");
                payLnBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.PayLn),
                    "cmd payLn");
            }
            else
            {
                payBtn = InlineKeyboardButton.WithCallbackData(
                    s.Get(Localization.InvoiceView.Keys.PayPieces, pieces.ToString()), "cmd payBalance");
                payLnBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.PayPiecesLn),
                    "cmd payLn");
            }

            InlineKeyboardButton delBtn =
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.Delete), "cmd deleteInvoice");

            InlineKeyboardButton payBestDealBtn =
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.PayBestDeal),
                    "cmd payBestDeal");
            InlineKeyboardButton listSuitableDealsBtn =
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.ListAds), "cmd listAds");

            var userBtn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.Partner),
                $"cmd user {invoice.Owner.Id}");
            var firstList2 = new List<InlineKeyboardButton>();
            var firstList3 = new List<InlineKeyboardButton>();
            if (IsBalancePayAvailable && invoice.Status == Invoice.Types.InvoiceStatus.Active)
            {
                var firstList1 = new List<InlineKeyboardButton>();
                firstList1.Add(payBtn);
                arr.Add(firstList1);
                arr.Add(new List<InlineKeyboardButton>
                {
                    payLnBtn
                });
            }

            firstList2.Add(payBestDealBtn);
            firstList3.Add(listSuitableDealsBtn);

            var secondList = new List<InlineKeyboardButton>();
            if (invoice.IsPrivate && invoice.Status == Invoice.Types.InvoiceStatus.Active)
                secondList.Add(delBtn);
            secondList.Add(userBtn);
            arr.Add(firstList2);
            arr.Add(firstList3);
            arr.Add(secondList);
            if (invoice.Owner.Id != Menu.UserId && invoice.RefundIsNull)
            {
                arr.Add(new List<InlineKeyboardButton>
                {
                    InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoiceView.Keys.Contact),
                        "cmd contact")
                });
            }

            arr.Add(BackBtn.BackHome(this));
            var keyboard = new InlineKeyboardMarkup(arr);
            return keyboard;
        }

        protected override AsyncResult Content()
        {
            if (Invoice == null)
            {
                var err = error.IsNullOrEmpty()
                    ? ErrorResult.GetArray(this, s.Get(Localization.InvoiceView.Keys.NotFound))
                    : ErrorResult.GetArray(this, error);
                return Task.FromResult(err);
            }

            string msg = CreateInvoiceInfo(invoice, false, s, Currency, info);
            msg += s.Get(Localization.InvoiceView.Keys.BuyPieces, pieces.ToString());
            List<Result> results = new List<Result>
            {
                new Result(this, msg, InlineKeyboardMarkup.Empty())
            };
            foreach (var image in invoice.Images)
            {
                var res = new Result(this, "", InlineKeyboardMarkup.Empty(), new Photo(Guid.Parse(image)));
                results.Add(res);
            }

            var last = results[^1];
            last.Keyboard = CreateKeyboard();

            return Task.FromResult(results);
        }

        public override async AsyncResult OnStart()
        {
            await GetInvoice(invoiceId);
            await GetVars();
            info = new InvoiceInfo(invoice, Currency, vars);
            return await Print();
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            if (Enum.TryParse<Catalog.Currencies>(message.Text.ToUpper(), out var cur))
            {
                Currency = cur;
                info = new InvoiceInfo(invoice, Currency, vars);
                return await Print();
            }

            if (!IsPiecesAllowed)
                return await PrintError();
            var isParsed = uint.TryParse(message.Text, out var value);
            if (!isParsed)
                return await PrintError();
            if (value < Invoice.PiecesMin)
                return await PrintError(s.Get(Localization.InvoiceView.Keys.PiecesErr1));
            if (value > Invoice.PiecesMax)
                return await PrintError(s.Get(Localization.InvoiceView.Keys.PiecesErr2));
            pieces = value;
            return await Print();
        }

        private async Task GetVars()
        {
            vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                InvoiceId = Invoice?.Id ?? 0,
                Pieces = pieces,
            });
        }

        private async Task GetInvoice(ulong invoiceId)
        {
            Invoice = null;
            error = "";

            var resp = await Clients.TradeClient.GetInvoiceByIdAsync(new GetInvoiceByIdRequest
            {
                InvoiceId = invoiceId
            });
            
            Invoice = resp.Invoices[0];
            if (pieces > Invoice.PiecesMax)
                pieces = Invoice.PiecesMax;
            else if (pieces < Invoice.PiecesMin)
                pieces = Invoice.PiecesMin;
        }

        public override async Task SetState(StateBase state)
        {
            var st = state as State;
            // ReSharper disable once PossibleNullReferenceException
            invoiceId = st.InvoiceId;
            pieces = st.Pieces;
            if (invoice == null && invoiceId != 0)
            {
                await GetInvoice(invoiceId);
                await GetVars();
                info = new InvoiceInfo(invoice, Currency, vars);
            }
        }

        public async Task SetInvoice(ulong id)
        {
            invoiceId = id;
            pieces = 1;
            await GetInvoice(invoiceId);
            await GetVars();
            info = new InvoiceInfo(invoice, Currency, vars);
        }

        public async Task SetInvoice(ulong id, uint pieces)
        {
            invoiceId = id;
            await GetInvoice(invoiceId);
            await GetVars();
            this.pieces = pieces;
            info = new InvoiceInfo(invoice, Currency, vars);
        }

        protected override Task<bool> OnImageLoaded(Guid id)
        {
            return Task.FromResult(Invoice.Images.Contains(id.ToString()));
        }
    }
}