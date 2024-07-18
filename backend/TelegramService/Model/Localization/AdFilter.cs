using System.Collections.Generic;
using TelegramService.Model.Localization;

// ReSharper disable StringLiteralTypo
// ReSharper disable InconsistentNaming

namespace TelegramService.Model.Localization
{
    public class AdFilter : Base<AdFilter.Keys>
    {
        public enum Keys
        {
            Buy,
            Sell,
            Title,
            buy,
            sell,
            Statement1,
            Statement2,
            Statement3,
            Statement4,
            Statement5,
            Yes,
            No,
            SendGeo,
            CountryList,
            CountryQ,
            CountryEnterMethod,
            SendLocation,
            SelectCountryList,
            CurrencyQ,
            SelectFiatCurrencyList,
            EnterAmount,
            PaymentTypeQ,
            PaymentTypeList,
            InvalidAmount,
            InvalidGeo,
            InvalidCommand,
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Buy] = "Купить",
                    [Keys.Sell] = "Продать",
                    [Keys.Title] = "Поиск объявлений о {0} критовалюты.\n",
                    [Keys.buy] = "покупке",
                    [Keys.sell] = "продаже",
                    [Keys.Statement1] = "{0} криптовалюту в стране ...",
                    [Keys.Statement2] = "{0} криптовалюту в стране <b>{1}</b> за ...",
                    [Keys.Statement3] = "{0} криптовалюту в стране <b>{1}</b> за <b>{2}</b> через ...",
                    [Keys.Statement4] =
                        "{0} криптовалюту в стране <b>{1}</b> за <b>{2}</b> через <b>{3}</b> на сумму ...",
                    [Keys.Statement5] =
                        "{0} криптовалюту в стране <b>{1}</b> за <b>{2}</b> через <b>{3}</b> на сумму <b>{4}</b>",
                    [Keys.Yes] = "Да",
                    [Keys.No] = "Нет",
                    [Keys.SendGeo] = "Отправка геопозиции",
                    [Keys.CountryList] = "Выбор из списка всех стран",
                    [Keys.CountryQ] = "{0} в стране {1} ?",
                    [Keys.CountryEnterMethod] = "Выберите предпочитаемый способ ввода страны:",
                    [Keys.SendLocation] = "Отправьте геопозицию в нужной стране.",
                    [Keys.SelectCountryList] = "Выберите страну из списка:",
                    [Keys.CurrencyQ] = "Валюта {0} ?",
                    [Keys.SelectFiatCurrencyList] = "Выберите валюту из списка:",
                    [Keys.EnterAmount] = "Введите сумму в фиатной валюте или 0 для поиска без учета суммы:",
                    [Keys.PaymentTypeQ] = "Способ оплаты {0} ?",
                    [Keys.PaymentTypeList] = "Выберите способ оплаты из списка:",
                    [Keys.InvalidAmount] = "Сумма не распознана. Попробуйте еще раз.",
                    [Keys.InvalidGeo] = "Неверный тип сообщения. Отправьте геопозицию.",
                    [Keys.InvalidCommand] = "Неверная команда."
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Buy] = "Buy",
                    [Keys.Sell] = "Sell",
                    [Keys.Title] = "Search for cryptocurrency {0} advertisements.",
                    [Keys.buy] = "buy",
                    [Keys.sell] = "sell",
                    [Keys.Statement1] = "{0} cryptocurrency in the country ...",
                    [Keys.Statement2] = "{0} cryptocurrency in the country <b>{1}</b> for ...",
                    [Keys.Statement3] = "{0} cryptocurrency in the country <b>{1}</b> for {2} through ...",
                    [Keys.Statement4] =
                        "{0} cryptocurrency in the country <b>{1}</b> for {2} through <b>{3}</b> in the amount of ...",
                    [Keys.Statement5] =
                        "{0} cryptocurrency in the country <b>{1}</b> for {2} through <b>{3}</b> in the amount of {4}",
                    [Keys.Yes] = "Yes",
                    [Keys.No] = "No",
                    [Keys.SendGeo] = "Send location",
                    [Keys.CountryList] = "Select from all countries list",
                    [Keys.CountryQ] = "{0} in country {1} ?",
                    [Keys.CountryEnterMethod] = "Choose your preferred country entry method:",
                    [Keys.SendLocation] = "Send the geo position to the desired country.",
                    [Keys.SelectCountryList] = "Select a country from the list:",
                    [Keys.CurrencyQ] = "Is currency a {0} ?",
                    [Keys.SelectFiatCurrencyList] = "Select a currency from the list:",
                    [Keys.EnterAmount] = "Enter the amount in fiat currency or 0 to search without amount:",
                    [Keys.PaymentTypeQ] = "Is payment type a {0} ?",
                    [Keys.PaymentTypeList] = "Select a payment method from the list:",
                    [Keys.InvalidAmount] = "Amount not recognized. Try again.",
                    [Keys.InvalidGeo] = "Invalid message type. Send a geo position.",
                    [Keys.InvalidCommand] = "Invalid command."
                }
            };
            return data;
        }

        public AdFilter(IMenu menu) : base(menu)
        {
        }
    }
}