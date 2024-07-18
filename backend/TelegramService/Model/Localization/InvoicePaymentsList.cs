using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class InvoicePaymentsList : TelegramService.Model.Localization.Base<InvoicePaymentsList.Keys>
    {
        public enum Keys
        {
            Name,
            Header,
            Id,
            New,
            InvoiceId,
            Pieces,
            FiatAmount,
            CryptoAmount,
            CreatedAt,
            Payment,
            Partner,
            Invoice,
            NoPayments,
            InvalidId,
            NotFound,
            PrevPage,
            NextPage,
            Status,
            StatusPending,
            StatusCanceled,
            StatusPaid,
            Refund
        }

        public InvoicePaymentsList(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Список платежей по счетам",
                    [Keys.Header] =
                        "Список ваших платежей по счетам. Для перехода платежу, введите его номер или выберите из списка.",
                    [Keys.Id] = "<b>Номер:</b> {0}\n",
                    [Keys.New] = "<code>Новый</code>\n",
                    [Keys.InvoiceId] = "<b>Номер счета:</b> {0}\n",
                    [Keys.Pieces] = "<b>Оплачено частей:</b> {0}\n",
                    [Keys.FiatAmount] = "<b>Сумма в фиатной валюте:</b> {0} {1}\n",
                    [Keys.CryptoAmount] = "<b>Сумма в криптовалюте:</b> {0} BTC\n",
                    [Keys.CreatedAt] = "<b>Создан:</b> {0}\n",
                    [Keys.Payment] = "Платеж",
                    [Keys.Partner] = "Партнер",
                    [Keys.Invoice] = "Счет",
                    [Keys.NoPayments] = "Нет платежей",
                    [Keys.InvalidId] = "Некорректный номер платежа. Попробуйте еще раз.",
                    [Keys.NotFound] = "Платеж не найден.",
                    [Keys.PrevPage] = "Предыдущая страница",
                    [Keys.NextPage] = "Следующая страница",
                    [Keys.Status] = "<b>Статус:</b> ",
                    [Keys.StatusPending] = "Ожидает оплаты\n",
                    [Keys.StatusCanceled] = "Отменен\n",
                    [Keys.StatusPaid] = "Оплачен\n",
                    [Keys.Refund]="Возврат средств по платежу: {0} Части: {1}\n"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "List of invoice payments",
                    [Keys.Header] =
                        "List of your payments on invoices. To proceed to a payment, enter its number or select from the list.",
                    [Keys.Id] = "<b>Id:</b> {0}\n",
                    [Keys.New] = "<code>New</code>\n",
                    [Keys.InvoiceId] = "<b>Invoice ID:</b> {0}\n",
                    [Keys.Pieces] = "<b>Paid pieces:</b> {0}\n",
                    [Keys.FiatAmount] = "<b>Fiat amount:</b> {0} {1}\n",
                    [Keys.CryptoAmount] = "<b>Cryptocurrency amount:</b> {0} BTC\n",
                    [Keys.CreatedAt] = "<b>Created at:</b> {0}\n",
                    [Keys.Payment] = "Payment",
                    [Keys.Partner] = "Partner",
                    [Keys.Invoice] = "Invoice",
                    [Keys.NoPayments] = "No payments",
                    [Keys.InvalidId] = "Invalid payment number. Try again.",
                    [Keys.NotFound] = "Payment not found",
                    [Keys.PrevPage] = "Previous page",
                    [Keys.NextPage] = "Next page",
                    [Keys.Status] = "<b>Status:</b> ",
                    [Keys.StatusPending] = "Pending pay\n",
                    [Keys.StatusCanceled] = "Canceled\n",
                    [Keys.StatusPaid] = "Paid\n",
                    [Keys.Refund]="Refund for payment: {0} Pieces: {1}\n"
                }
            };
            return data;
        }
    }
}