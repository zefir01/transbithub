using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class AdInfo: TelegramService.Model.Localization.Base<AdInfo.Keys>
    {
        public enum Keys
        {
            NameSell,
            NameBuy,
            Sell,
            Buy,
            Statement,
            Price,
            PaymentType,
            Seller,
            Buyer,
            Limits,
            Location,
            Window,
            Rate,
            Terms,
            Amount,
            Info,
            Error1,
            Error2,
            Error3,
            Error4,
            Error5,
            Error6,
            Partner
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.NameSell] = "Продажа",
                    [Keys.NameBuy] = "Покупка",
                    [Keys.Sell]="Продать",
                    [Keys.Buy]="Купить",
                    [Keys.Statement]="{0} <b>BTC</b>, используя <b>{1}</b>: <b>{2}</b>, в валюте <b>{3}</b>\n",
                    [Keys.Price]="Цена:",
                    [Keys.PaymentType]="Способ оплаты:",
                    [Keys.Seller]="Продавец:",
                    [Keys.Buyer]="Покупатель:",
                    [Keys.Limits]="Ограничения:",
                    [Keys.Location]="Местоположение:",
                    [Keys.Window]="Окно оплаты:",
                    [Keys.Rate]="Рейтинг:",
                    [Keys.Terms]="Условия сделки:",
                    [Keys.Amount]="Сумма:",
                    [Keys.Info]="Для изменения суммы сделки, отправьте новую сумму в фиатной валюте.",
                    [Keys.Error1]=">Вы не можете совершить сделку с собой.",
                    [Keys.Error2]="Объявление отключено.",
                    [Keys.Error3]="Слишком большая сумма. Введите сумму меньше.",
                    [Keys.Error4]="Слишком маленькая сумма. Введите сумму больше.",
                    [Keys.Error5]="Объявление удалено.",
                    [Keys.Error6]="Неверное значение суммы сделки. Попробуйте еще раз.",
                    [Keys.Partner]="Партнер"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.NameSell] = "Selling",
                    [Keys.NameBuy] = "Buying",
                    [Keys.Sell]="Sell",
                    [Keys.Buy]="Buy",
                    [Keys.Statement]="{0} <b>BTC</b>, use <b>{1}</b>: <b>{2}</b>, in currency <b>{3}</b>\n",
                    [Keys.Price]="Price:",
                    [Keys.PaymentType]="Payment type:",
                    [Keys.Seller]="Seller:",
                    [Keys.Buyer]="Buyer:",
                    [Keys.Limits]="Limits:",
                    [Keys.Location]="Location:",
                    [Keys.Window]="Payment window:",
                    [Keys.Rate]="Rate:",
                    [Keys.Terms]="Terms of the deal:",
                    [Keys.Amount]="Amount:",
                    [Keys.Info]="To change the deal amount, send the new amount in fiat currency.",
                    [Keys.Error1]="You cannot make a deal with yourself.",
                    [Keys.Error2]="Advertisement is disabled.",
                    [Keys.Error3]="Too big amount. Enter the amount less.",
                    [Keys.Error4]="Too small amount. Enter a larger amount.",
                    [Keys.Error5]="Advertisement deleted.",
                    [Keys.Error6]="Invalid deal amount. Try again.",
                    [Keys.Partner]="Partner"
                }
            };
            return data;
        }
        public AdInfo(IMenu menu) : base(menu)
        {
        }
    }
}