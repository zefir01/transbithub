using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class CreatePromiseOptions: TelegramService.Model.Localization.Base<CreatePromiseOptions.Keys>
    {
        public enum Keys
        {
            Name,
            Header,
            CurrencyError,
            Average,
            InCrypto,
            InFiat,
            IsCrypto,
            Yes,
            Change,
            FiatCorrect,
            SelectFiat,
            RateCorrect,
            SelectRate,
            
        }

        public CreatePromiseOptions(IMenu menu) : base(menu)
        {
        }
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Дополнительно",
                    [Keys.Header] = "Укажите дополнительные настройки.",
                    [Keys.CurrencyError]="Валюта не распознана.",
                    [Keys.Average]="Среднее",
                    [Keys.InCrypto]="В криптовалюте",
                    [Keys.InFiat]="В фиатной валюте",
                    [Keys.IsCrypto]="Указать сумму Промиса в криптовалюте, или в фиатной валюте ?",
                    [Keys.Yes]="Да",
                    [Keys.Change]="Изменить",
                    [Keys.FiatCorrect]="Фиатная валюта <b>{0}</b> ?",
                    [Keys.SelectFiat]="Выберите валюту из списка или введите трех буквенный код валюты.",
                    [Keys.RateCorrect]="Курс <b>{0}</b> ?",
                    [Keys.SelectRate]="Выберите курс из списка:",
                    
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Additionally",
                    [Keys.Header] = "Specify additional settings.",
                    [Keys.CurrencyError]="Currency not recognized.",
                    [Keys.Average]="Average",
                    [Keys.InCrypto]="In cryptocurrency",
                    [Keys.InFiat]="In fiat currency",
                    [Keys.IsCrypto]="Specify the amount of the Promise in cryptocurrency, or in fiat currency?",
                    [Keys.Yes]="Yes",
                    [Keys.Change]="Change",
                    [Keys.FiatCorrect]="Is fiat currency <b>{0}</b> ?",
                    [Keys.SelectFiat]="Select a currency from the list or enter a three-letter currency code.",
                    [Keys.RateCorrect]="Is rate <b>{0}</b> ?",
                    [Keys.SelectRate]="Select a rate from the list:",
                }
            };
            return data;
        }
    }
}