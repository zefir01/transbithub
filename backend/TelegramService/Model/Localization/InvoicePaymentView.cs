using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class InvoicePaymentView : TelegramService.Model.Localization.Base<InvoicePaymentView.Keys>
    {
        public enum Keys
        {
            Name,
            Id,
            InvoiceId,
            Status,
            Pieces,
            FiatAmount,
            BtcPrice,
            CryptoAmount,
            CreatedAt,
            Confirmation,
            NotFound,
            DealFeedback,
            PaymentFeedback,
            ContactSeller,
            ContactBuyer,
            Refund,
            Secret,
            SecretText,
            Cancel,
            Pending,
            Paid,
            Canceled
        }

        public InvoicePaymentView(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Платеж",
                    [Keys.Id] = "<b>Номер:</b> {0}\n",
                    [Keys.InvoiceId] = "<b>Номер счета:</b> {0}\n",
                    [Keys.Status] = "<b>Статус:</b> {0}\n",
                    [Keys.Pieces] = "<b>Оплачено частей:</b> {0}\n",
                    [Keys.FiatAmount] = "<b>Сумма в фиатной валюте:</b> {0} {1}\n",
                    [Keys.BtcPrice] = "<b>Цена за 1 BTC:</b> {0} {1}/BTC\n",
                    [Keys.CryptoAmount] = "<b>Сумма в криптовалюте:</b> {0} BTC\n",
                    [Keys.CreatedAt] = "<b>Создан:</b> {0}\n",
                    [Keys.Confirmation] = "<b>Подтверждение:</b>\n{0}\n",
                    [Keys.NotFound] = "Платеж не найден.",
                    [Keys.DealFeedback] = "Оставить отзыв о сделке",
                    [Keys.PaymentFeedback] = "Оставить отзыв о покупке",
                    [Keys.ContactSeller] = "Связаться с продавцом",
                    [Keys.ContactBuyer] = "Связаться с покупателем",
                    [Keys.Refund] = "Возврат средств по платежу: {0} Части: {1}\n",
                    [Keys.Secret] = "<b>Секрет:</b> {0}\n",
                    [Keys.SecretText] = "<b>Текст:</b> {0}\n",
                    [Keys.Cancel] = "Отменить",
                    [Keys.Pending] = "Ожидается оплата",
                    [Keys.Paid] = "Оплачен",
                    [Keys.Canceled] = "Отменен"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Payment",
                    [Keys.Id] = "<b>Id:</b> {0}\n",
                    [Keys.InvoiceId] = "<b>Invoice id:</b> {0}\n",
                    [Keys.Status] = "<b>Status:</b> {0}\n",
                    [Keys.Pieces] = "<b>Paid pieces:</b> {0}\n",
                    [Keys.FiatAmount] = "<b>Fiat amount:</b> {0} {1}\n",
                    [Keys.BtcPrice] = "<b>Price for 1 BTC:</b> {0} {1}/BTC\n",
                    [Keys.CryptoAmount] = "<b>Cryptocurrency amount:</b> {0} BTC\n",
                    [Keys.CreatedAt] = "<b>Created at:</b> {0}\n",
                    [Keys.Confirmation] = "<b>Confirmation:</b>\n{0}\n",
                    [Keys.NotFound] = "Payment not found.",
                    [Keys.DealFeedback] = "Give feedback about deal",
                    [Keys.PaymentFeedback] = "Give feedback about purchase",
                    [Keys.ContactSeller] = "Contact seller",
                    [Keys.ContactBuyer] = "Contact buyer",
                    [Keys.Refund] = "Refund for payment: {0} Pieces: {1}\n",
                    [Keys.Secret] = "<b>Secret:</b> {0}\n",
                    [Keys.SecretText] = "<b>Text:</b> {0}\n",
                    [Keys.Cancel] = "Cancel",
                    [Keys.Pending] = "Pending pay",
                    [Keys.Paid] = "Paid",
                    [Keys.Canceled] = "Canceled"
                }
            };
            return data;
        }
    }
}