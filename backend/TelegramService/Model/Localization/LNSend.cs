using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class LNSend : TelegramService.Model.Localization.Base<LNSend.Keys>
    {
        public enum Keys
        {
            Name,
            Amount,
            Desc,
            CreatedAt,
            Expires,
            EnterInvoice,
            Pay,
            NoFunds,
            EnterAmount,
            Success,
            InvoiceError,
            AmountError,
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Оплатить запрос",
                    [Keys.Amount] = "<b>Сумма:</b> {0} BTC / ~{1} {2}\n",
                    [Keys.Desc] = "<b>Описание:</b> {0}\n",
                    [Keys.CreatedAt] = "<b>Создан:</b> {0}\n",
                    [Keys.Expires] = "<b>Может быть оплачен до</b> {0}\n",
                    [Keys.EnterInvoice] = "Введите запрос платежа:",
                    [Keys.Pay] = "Оплатить",
                    [Keys.NoFunds] = "<code>Недостаточно средств для оплаты.</code>",
                    [Keys.EnterAmount] = "Введите сумму платежа в BTC:\n",
                    [Keys.Success] = "<b>Успешно оплачено.</b>",
                    [Keys.InvoiceError] = "Неверный запрос платежа.",
                    [Keys.AmountError] = "Сумма не распознана.",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Pay request",
                    [Keys.Amount] = "<b>Amount:</b> {0} BTC / ~{1} {2}\n",
                    [Keys.Desc] = "<b>Description:</b> {0}\n",
                    [Keys.CreatedAt] = "<b>Created at:</b> {0}\n",
                    [Keys.Expires] = "<b>May be paid up to</b> {0}\n",
                    [Keys.EnterInvoice] = "Enter your payment request:",
                    [Keys.Pay] = "Pay",
                    [Keys.NoFunds] = "<code>Insufficient funds to pay.</code>",
                    [Keys.EnterAmount] = "Enter the payment amount in BTC:\n",
                    [Keys.Success] = "<b>Successfully paid.</b>",
                    [Keys.InvoiceError] = "Invalid payment request.",
                    [Keys.AmountError] = "The amount was not recognized.",
                }
            };
            return data;
        }

        public LNSend(IMenu menu) : base(menu)
        {
        }
    }
}