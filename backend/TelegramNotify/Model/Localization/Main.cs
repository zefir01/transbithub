using System.Collections.Generic;
using TelegramService.Model;
using TelegramService.Model.Localization;

namespace TelegramNotify.Model.Localization
{
    public class Main : Base<Main.Keys>
    {
        public enum Keys
        {
            Header,
            DealNew,
            DealStatusChanged,
            DealFiatPayed,
            DealDisputeCreated,
            InvoiceNew,
            InvoicePayed,
            InvoiceDeleted,
            InvoicePaymentNew,
            InvoicePaymentUpdated,
            ConversationNewMessageInvoice,
            ConversationNewMessagePayment,
            DealNewMessage,
            HeaderAuth
        }

        public Main(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Header] =
                        "Здравствуйте. Это бот уведомлений {0}.\nВойдите в вашу учетную запись, для получения уведомлений.",
                    [Keys.DealNew] = "Новая сделка:",
                    [Keys.DealStatusChanged] = "Статус сделки изменен:",
                    [Keys.DealFiatPayed] = "{0} отправлено:",
                    [Keys.DealDisputeCreated] = "Диспут создан:",
                    [Keys.InvoiceNew] = "Вам выставлен счет:",
                    [Keys.InvoicePayed] = "Ваш счет оплачен:",
                    [Keys.InvoiceDeleted] = "Сет удален:",
                    [Keys.InvoicePaymentNew] = "Вы получили платеж:",
                    [Keys.InvoicePaymentUpdated] = "Счет изменен:",
                    [Keys.ConversationNewMessageInvoice] = "Новое сообщение в переписке по счету:",
                    [Keys.ConversationNewMessagePayment] = "Новое сообщение в переписке по платежу:",
                    [Keys.DealNewMessage] = "Новое сообщение в сделке:",
                    [Keys.HeaderAuth] = "Здравствуйте. Это бот уведомлений {0}.\nВы авторизованы как: <b>{1}</b>"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Header] =
                        "Hello. This is {0} notifications bot.\nLog in to your account to receive notifications.",
                    [Keys.DealNew] = "New deal:",
                    [Keys.DealStatusChanged] = "Deal status changed:",
                    [Keys.DealFiatPayed] = "{0} sent:",
                    [Keys.DealDisputeCreated] = "Dispute created:",
                    [Keys.InvoiceNew] = "You got a new invoice:",
                    [Keys.InvoicePayed] = "Your invoice paid:",
                    [Keys.InvoiceDeleted] = "Invoice deleted:",
                    [Keys.InvoicePaymentNew] = "You got a new payment:",
                    [Keys.InvoicePaymentUpdated] = "Invoice updated:",
                    [Keys.ConversationNewMessageInvoice] = "New message in the invoice conversation:",
                    [Keys.ConversationNewMessagePayment] = "New message in the payment conversation:",
                    [Keys.DealNewMessage] = "New message in deal:",
                    [Keys.HeaderAuth] = "Hello. This is {0} notifications bot.\nYou are logged in as: <b>{1}</b>"
                }
            };
            return data;
        }
    }
}