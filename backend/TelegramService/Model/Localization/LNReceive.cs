using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class LNReceive : TelegramService.Model.Localization.Base<LNReceive.Keys>
    {
        public enum Keys
        {
            Name,
            Header1,
            Header2,
            Header3,
            IsCrypto,
            InBtc,
            SelectFiat,
            DefaultCurrency,
            Yes,
            SelectCurrency,
            ListCurrency,
            Amount,
            Desc,
            Skip,
            Result,
            
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Создать запрос платежа",
                    [Keys.Header1] = "Создать запрос платежа в валюте ... ",
                    [Keys.Header2] = "Создать запрос платежа в валюте <b>{0}</b> на сумму ...",
                    [Keys.Header3]="Создать запрос платежа в валюте <b>{0}</b> на сумму <b>{1}</b>",
                    [Keys.IsCrypto]="Указать сумму в BTC или в фиатной валюте ?\n",
                    [Keys.InBtc]="В BTC",
                    [Keys.SelectFiat]="Выбрать валюту",
                    [Keys.DefaultCurrency]="Фиатная фалюта {0} ?\n",
                    [Keys.Yes]="Да",
                    [Keys.SelectCurrency]="Выбрать валюту",
                    [Keys.ListCurrency]="Выберите валюту из списка или введите трехбуквенный код валюты.",
                    [Keys.Amount]="Введите сумму в {0}:",
                    [Keys.Desc]="Введите описание платежа (максимум 300 символов, не обязательно):",
                    [Keys.Skip]="Пропустить",
                    [Keys.Result]="Скопируйте запрос платежа или отсканируйте QR код. Срок оплаты: 1 час.\n",
                    
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Create payment request",
                    [Keys.Header1] = "Create payment request in currency ... ",
                    [Keys.Header2] = "Create payment request in currency <b>{0}</b> for amount ...",
                    [Keys.Header3]="Create payment request in currency <b>{0}</b> for amount <b>{1}</b>",
                    [Keys.IsCrypto]="Specify the amount in BTC or in fiat currency?\n",
                    [Keys.InBtc]="In BTC",
                    [Keys.SelectFiat]="Select currency",
                    [Keys.DefaultCurrency]="Fiat currency {0} ?\n",
                    [Keys.Yes]="Yes",
                    [Keys.SelectCurrency]="Select currency",
                    [Keys.ListCurrency]="Select a currency from the list or enter the three-letter currency code.",
                    [Keys.Amount]="Enter amount in {0}:",
                    [Keys.Desc]="Enter a description of the payment (maximum 300 characters, optional):",
                    [Keys.Skip]="Skip",
                    [Keys.Result]="Copy the payment request or scan the QR code. Payment term: 1 hour.\n",
                }
            };
            return data;
        }


        public LNReceive(IMenu menu) : base(menu)
        {
        }
    }
}