using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class MyInvoices: TelegramService.Model.Localization.Base<MyInvoices.Keys>
    {
        public enum Keys
        {
            Name,
            Name1,
            Header,
            PrevPage,
            NextPage,
            InvalidId,
            InternalError,
            Id,
            New,
            Paid,
            From,
            Amount,
            FiatAmount,
            CryptoAmount,
            PiecePrice,
            PiecePriceFiat,
            PiecePriceCrypto,
            CreatedAt,
            Comment,
            Comment1,
            ValidTo,
            GotoInvoice,
            Delete,
            Partner,
            NoInvoices,
            Refund,
        }

        public MyInvoices(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name]="Счета выставленные мне",
                    [Keys.Name1]="Счета выставленные мне Новых:{0}",
                    [Keys.Header]="Для смены валюты, отправьте трех буквенный код валюты текстовым сообщением.\nСписок счетов:",
                    [Keys.PrevPage]="Предыдущая страница",
                    [Keys.NextPage]="Следующая страница",
                    [Keys.InvalidId]="Некорректный номер счета. Попробуйте еще раз.",
                    [Keys.InternalError]="Внутренняя ошибка.",
                    [Keys.Id]="<b>Номер:</b> {0}\n",
                    [Keys.New]="<code>Новый</code>\n",
                    [Keys.Paid]="<code>Оплачен</code>\n",
                    [Keys.From]="<b>От:</b> {0}\n",
                    [Keys.Amount]="<b>Сумма:</b> {0} BTC\n",
                    [Keys.FiatAmount]="<b>Сумма в фиатной валюте:</b> {0} {1}\n",
                    [Keys.CryptoAmount]="<b>Сумма в криптовалюте:</b> {0} BTC\n",
                    [Keys.PiecePrice] = "<b>Цена за часть:</b> {0} BTC\n",
                    [Keys.PiecePriceFiat] = "<b>Цена за часть в фиатной валюте:</b> {0} {1}\n",
                    [Keys.PiecePriceCrypto] = "<b>Цена за часть в криптовалюте:</b> {0} BTC\n",
                    [Keys.CreatedAt]="<b>Создан:</b> {0}\n",
                    [Keys.Comment] = "<b>Комментарий:\n</b>",
                    [Keys.Comment1] = "<b>Комментарий:\n</b> {0}\n",
                    [Keys.ValidTo]="<b>Действует до:</b> {0}",
                    [Keys.GotoInvoice]="Перейти",
                    [Keys.Delete]="Удалить",
                    [Keys.Partner]="Партнер",
                    [Keys.NoInvoices]="Нет счетов",
                    [Keys.Refund]="Возврат средств по платежу: {0} Части: {1}\n"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name]="Invoices issued to me",
                    [Keys.Name1]="Invoices billed to me by New:{0}",
                    [Keys.Header]="To change the currency, send the three-letter currency code by text message.\nList of invoices:",
                    [Keys.PrevPage]="Previous page",
                    [Keys.NextPage]="Next page",
                    [Keys.InvalidId]="Invalid invoice number. Try again.",
                    [Keys.InternalError]="Internal error.",
                    [Keys.Id]="<b>Id:</b> {0}\n",
                    [Keys.New]="<code>New</code>\n",
                    [Keys.Paid]="<code>Paid</code>\n",
                    [Keys.From]="<b>From:</b> {0}\n",
                    [Keys.Amount]="<b>Amount:</b> {0} BTC\n",
                    [Keys.FiatAmount]="<b>Fiat amount:</b> {0} {1}\n",
                    [Keys.CryptoAmount]="<b>Cryptocurrency amount:</b> {0} BTC\n",
                    [Keys.PiecePrice] = "<b>Price per piece:</b> {0} BTC\n",
                    [Keys.PiecePriceFiat] = "<b>Price per piece in fiat currency:</b> {0} {1}\n",
                    [Keys.PiecePriceCrypto] = "<b>Price per piece in cryptocurrency:</b> {0} BTC\n",
                    [Keys.CreatedAt]="<b>Created at:</b> {0}\n",
                    [Keys.Comment] = "<b>Comment:\n</b>",
                    [Keys.Comment1] = "<b>Comment:\n</b> {0}\n",
                    [Keys.ValidTo]="<b>Valid until:</b> {0}",
                    [Keys.GotoInvoice]="Go to invoice",
                    [Keys.Delete]="Delete",
                    [Keys.Partner]="Partner",
                    [Keys.NoInvoices]="No invoices.",
                    [Keys.Refund]="Refund for payment: {0} Pieces: {1}\n"
                }
            };
            return data;
        }
    }
}