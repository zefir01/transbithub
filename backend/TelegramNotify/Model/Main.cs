using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;
using TelegramService;
using TelegramService.Model;
using Deal = Protos.TradeApi.V1.Deal;

namespace TelegramNotify.Model
{
    public class Main : BaseMenu
    {
        private readonly Localization.Main s;
        private readonly IConfig config;
        private readonly Login login;
        private readonly TelegramService.Model.Localization.Deal dealLocal;
        private readonly TelegramService.Model.Localization.InvoiceView invoiceViewLocal;
        private readonly TelegramService.Model.Localization.InvoicePaymentView paymentLoc;

        public Main(Menu menu, ILogger logger, IConfig config) : base(menu)
        {
            s = new Localization.Main(menu);

            dealLocal = new(Menu);
            invoiceViewLocal = new(menu);
            paymentLoc = new(menu);
            this.config = config;

            login = new Login(this);
        }

        public override string Name => null;

        public override string Header
        {
            get
            {
                if (Menu.Profile.IsAnonymous)
                    return s.Get(Localization.Main.Keys.Header, config.SiteName);
                return s.Get(Localization.Main.Keys.HeaderAuth, config.SiteName, Menu.Profile.Username);
            }
        }


        public override async Task<List<Result>> NewMessage(Message message)
        {
            return await Print();
        }

        private async Task<Result> CreateInvoiceMsg(string title, Invoice invoice)
        {
            string text = $"<code>{title}</code>\n";
            var vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
            var invoiceInfo = new InvoiceInfo(invoice, Currency, vars);
            text += InvoiceView.CreateInvoiceInfo(invoice, false, invoiceViewLocal, Currency, invoiceInfo);
            var result = new Result(this, text, InlineKeyboardMarkup.Empty());
            return result;
        }

        private async Task<Result> CreatePaymentMsg(string title, InvoicePayment payment)
        {
            string text = $"<code>{title}</code>\n";
            var vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
            text += await InvoicePaymentView.GetPaymentInfo(payment, paymentLoc, vars, Currency);
            var result = new Result(this, text, InlineKeyboardMarkup.Empty());
            return result;
        }

        private Task<Result> CreateDealMsg(string title, Deal deal)
        {
            string text = $"<code>{title}</code> <b>{deal.Id}</b>\n";
            text += TelegramService.Model.Deal.GetDealInfo(deal, dealLocal, CultureInfo, false);
            var result = new Result(this, text, InlineKeyboardMarkup.Empty());
            return Task.FromResult(result);
        }

        protected override async Task<bool> OnEvent(Event evt)
        {
            Result result;
            switch (evt.ContentCase)
            {
                case Event.ContentOneofCase.None:
                    return false;
                case Event.ContentOneofCase.DealNew:
                    result = await CreateDealMsg(s.Get(Localization.Main.Keys.DealNew), evt.DealNew);
                    break;
                case Event.ContentOneofCase.DealStatusChanged:
                    result = await CreateDealMsg(s.Get(Localization.Main.Keys.DealStatusChanged),
                        evt.DealStatusChanged);
                    break;
                case Event.ContentOneofCase.DealNewMessage:
                    result = await CreateDealMsg(s.Get(Localization.Main.Keys.DealNewMessage), evt.DealNewMessage);
                    break;
                case Event.ContentOneofCase.DealFiatPayed:
                    result = await CreateDealMsg(
                        s.Get(Localization.Main.Keys.DealFiatPayed, evt.DealFiatPayed.Advertisement.FiatCurrency),
                        evt.DealFiatPayed);
                    break;
                case Event.ContentOneofCase.DealDisputeCreated:
                    result = await CreateDealMsg(s.Get(Localization.Main.Keys.DealDisputeCreated),
                        evt.DealDisputeCreated);
                    break;
                case Event.ContentOneofCase.Balance:
                    return false;
                case Event.ContentOneofCase.KeepAlive:
                    return false;
                case Event.ContentOneofCase.InvoiceNew:
                    result = await CreateInvoiceMsg(s.Get(Localization.Main.Keys.InvoiceNew), evt.InvoiceNew);
                    break;
                case Event.ContentOneofCase.InvoicePayed:
                    result = await CreateInvoiceMsg(s.Get(Localization.Main.Keys.InvoicePayed), evt.InvoicePayed);
                    break;
                case Event.ContentOneofCase.InvoiceDeleted:
                    result = await CreateInvoiceMsg(s.Get(Localization.Main.Keys.InvoiceDeleted), evt.InvoiceDeleted);
                    break;
                case Event.ContentOneofCase.InvoicePaymentNew:
                    result = await CreatePaymentMsg(s.Get(Localization.Main.Keys.InvoicePaymentNew),
                        evt.InvoicePaymentNew);
                    break;
                case Event.ContentOneofCase.ConversationNewMessage:
                    switch (evt.ConversationNewMessage.ParentCase)
                    {
                        case Conversation.ParentOneofCase.None:
                            return false;
                        case Conversation.ParentOneofCase.Invoice:
                            result = await CreateInvoiceMsg(s.Get(Localization.Main.Keys.ConversationNewMessageInvoice),
                                evt.ConversationNewMessage.Invoice);
                            break;
                        case Conversation.ParentOneofCase.Payment:
                            result = await CreatePaymentMsg(s.Get(Localization.Main.Keys.ConversationNewMessagePayment),
                                evt.ConversationNewMessage.Payment);
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }

                    break;
                case Event.ContentOneofCase.InvoicePaymentUpdated:
                    result = await CreatePaymentMsg(s.Get(Localization.Main.Keys.InvoicePaymentUpdated),
                        evt.InvoicePaymentUpdated);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            await Menu.Queue.PrintResult(result);
            return false;
        }
    }
}