using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class InvoiceView : TelegramService.Model.Localization.Base<InvoiceView.Keys>
    {
        public enum Keys
        {
            Name,
            Header,
            InternalError,
            Yes,
            No,
            ID,
            New,
            Payed,
            From,
            Private,
            CreatedAt,
            Comment,
            Comment1,
            Amount,
            FiatAmount,
            CryptoAmount,
            PiecePrice,
            PiecePriceFiat,
            PiecePriceCrypto,
            Pieces,
            MinCrypto,
            MaxCrypto,
            MinFiat,
            MaxFiat,
            TotalPayedCrypto,
            TotalPayedFiat,
            PaymentsCount,
            BalanceError,
            BalanceError1,
            PayBalance,
            PayLn,
            PayPieces,
            PayPiecesLn,
            Delete,
            Partner,
            NotFound,
            InvalidPieces,
            PiecesErr1,
            PiecesErr2,
            ValidTo,
            PayBestDeal,
            ListAds,
            Pieces1,
            Rate,
            Contact,
            Refund,
            BuyPieces,
        }

        public InvoiceView(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Управление счетом",
                    [Keys.Header] = "Введите количество покупаемых частей или трехбуквенный код валюты для отображения в другой валюте.",
                    [Keys.InternalError] = "Внутренняя ошибка.",
                    [Keys.Yes] = "Да",
                    [Keys.No] = "Нет",
                    [Keys.ID] = "<b>Номер:</b> {0}\n",
                    [Keys.New] = "<code>Новый</code>\n",
                    [Keys.Payed] = "<code>Оплачен</code>\n",
                    [Keys.From] = "<b>От:</b> {0}\n",
                    [Keys.Private] = "<b>Приватный:</b> {0}\n",
                    [Keys.CreatedAt] = "<b>Создан:</b> {0}\n",
                    [Keys.Comment] = "<b>Комментарий:\n</b>",
                    [Keys.Comment1] = "<b>Комментарий:\n</b> {0}\n",
                    [Keys.Amount] = "<b>Сумма:</b> {0} BTC\n",
                    [Keys.FiatAmount] = "<b>Сумма в фиатной валюте:</b> {0} {1}\n",
                    [Keys.CryptoAmount] = "<b>Сумма в криптовалюте:</b> {0} BTC\n",
                    [Keys.PiecePrice] = "<b>Цена за часть:</b> {0} BTC\n",
                    [Keys.PiecePriceFiat] = "<b>Цена за часть в фиатной валюте:</b> {0} {1}\n",
                    [Keys.PiecePriceCrypto] = "<b>Цена за часть в криптовалюте:</b> {0} BTC\n",
                    [Keys.Pieces] = "<b>Части:</b> {0}-{1}\n",
                    [Keys.Pieces1] = "<b>Части:</b> {0}\n",
                    [Keys.MinCrypto] = "<b>Минимальная сумма в криптовалюте:</b> {0} BTC\n",
                    [Keys.MaxCrypto] = "<b>Максимальная сумма в криптовалюте:</b> {0} BTC\n",
                    [Keys.MinFiat] = "<b>Минимальная сумма в фиатной валюте:</b> {0} {1}\n",
                    [Keys.MaxFiat] = "<b>Максимальная сумма в фиатной валюте:</b> {0} {1}\n",
                    [Keys.TotalPayedCrypto] = "<b>Всего оплачено в криптовалюте:</b> {0} BTC\n",
                    [Keys.TotalPayedFiat] = "<b>Всего оплачено в фиатной валюте:</b> {0} {1}\n",
                    [Keys.PaymentsCount] = "<b>Количество платежей:</b> {0}\n",
                    [Keys.BalanceError] = "<code>Недостаточно средств для оплаты с баланса. Пополните баланс.</code>\n",
                    [Keys.BalanceError1] =
                        "<code>Недостаточно средств для оплаты {0} частей. Пополните счет или уменьшите количество частей.</code>\n",
                    [Keys.PayBalance] = "Оплатить с баланса",
                    [Keys.PayLn]="Оплатить через Lightning Network",
                    [Keys.PayPieces] = "Оплатить частей: {0}",
                    [Keys.PayPiecesLn] = "Оплатить частей: {0} через Lightning Network",
                    [Keys.Delete] = "Удалить",
                    [Keys.Partner] = "Партнер",
                    [Keys.NotFound] = "Счет не найден.",
                    [Keys.InvalidPieces] = "Число не распознано. Попробуйте еще раз.",
                    [Keys.PiecesErr1] =
                        "Количество покупаемых частей не должно быть меньше минимального количества частей в счете.",
                    [Keys.PiecesErr2] =
                        "Количество покупаемых частей не должно быть больше максимального количества частей в счете.",
                    [Keys.ValidTo]="<b>Действует до:</b> {0}",
                    [Keys.PayBestDeal]="Оплатить через сделку по лучшей цене",
                    [Keys.ListAds]="Выбрать объявление из списка",
                    [Keys.Rate]="Рейтинг:",
                    [Keys.Contact]="Связаться с продавцом",
                    [Keys.Refund]="Возврат средств по платежу: {0} Части: {1}\n",
                    [Keys.BuyPieces]="\n<b>Покупаемых частей:</b> {0}\n"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Invoice control",
                    [Keys.Header] = "Enter the quantity of purchased parts or the three-letter currency code to display in another currency.",
                    [Keys.InternalError] = "Internal error.",
                    [Keys.Yes] = "Yes",
                    [Keys.No] = "No",
                    [Keys.ID] = "<b>Id:</b> {0}\n",
                    [Keys.New] = "<code>New</code>\n",
                    [Keys.Payed] = "<code>Paid</code>\n",
                    [Keys.From] = "<b>From:</b> {0}\n",
                    [Keys.Private] = "<b>Private:</b> {0}\n",
                    [Keys.CreatedAt] = "<b>CreatedAt:</b> {0}\n",
                    [Keys.Comment] = "<b>Comment:\n</b>",
                    [Keys.Comment1] = "<b>Comment:\n</b> {0}\n",
                    [Keys.Amount] = "<b>Amount:</b> {0} BTC\n",
                    [Keys.FiatAmount] = "<b>Fiat amount:</b> {0} {1}\n",
                    [Keys.CryptoAmount] = "<b>Cryptocurrency amount:</b> {0} BTC\n",
                    [Keys.PiecePrice] = "<b>Price per piece:</b> {0} BTC\n",
                    [Keys.PiecePriceFiat] = "<b>Price per piece in fiat currency:</b> {0} {1}\n",
                    [Keys.PiecePriceCrypto] = "<b>Price per piece in cryptocurrency:</b> {0} BTC\n",
                    [Keys.Pieces] = "<b>Pieces:</b> {0}-{1}\n",
                    [Keys.Pieces1] = "<b>Pieces:</b> {0}\n",
                    [Keys.MinCrypto] = "<b>Minimum amount in cryptocurrency:</b> {0} BTC\n",
                    [Keys.MaxCrypto] = "<b>Maximum amount in cryptocurrency:</b> {0} BTC\n",
                    [Keys.MinFiat] = "<b>Minimum amount in fiat currency:</b> {0} {1}\n",
                    [Keys.MaxFiat] = "<b>Maximum amount in fiat currency:</b> {0} {1}\n",
                    [Keys.TotalPayedCrypto] = "<b>Total paid in cryptocurrency:</b> {0} BTC\n",
                    [Keys.TotalPayedFiat] = "<b>Total paid in fiat currency:</b> {0} {1}\n",
                    [Keys.PaymentsCount] = "<b>Number of payments:</b> {0}\n",
                    [Keys.BalanceError] = "<code>Insufficient funds to pay the invoice from balance. Fund your balance.</code>\n",
                    [Keys.BalanceError1] =
                        "<code>Insufficient funds to pay for {0} pieces. Fund your account or reduce the number of pieces.</code>\n",
                    [Keys.PayBalance] = "Pay from balance",
                    [Keys.PayLn]="Pay via Lightning Network",
                    [Keys.PayPieces] = "Pay pieces: {0}",
                    [Keys.PayPiecesLn] = "Оплатить частей: {0} via Lightning Network",
                    [Keys.Delete] = "Delete",
                    [Keys.Partner] = "Partner",
                    [Keys.NotFound] = "Invoice not found.",
                    [Keys.InvalidPieces] = "The number was not recognized. Try again.",
                    [Keys.PiecesErr1] =
                        "The number of purchased pieces must not be less than the minimum number of pieces on the invoice.",
                    [Keys.PiecesErr2] =
                        "The number of purchased pieces must not exceed the maximum number of pieces in the invoice.",
                    [Keys.PayBestDeal]="Pay by deal with the best price",
                    [Keys.ListAds]="Select an ad from the list",
                    [Keys.Rate]="Rate:",
                    [Keys.Contact]="Contact seller",
                    [Keys.Refund]="Refund for payment: {0} Pieces: {1}\n",
                    [Keys.BuyPieces]="\n<b>Purchased pieces:</b> {0}\n"
                }
            };
            return data;
        }
    }
}