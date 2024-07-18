using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class CreatePromise: TelegramService.Model.Localization.Base<CreatePromise.Keys>
    {
        public enum Keys
        {
            Name,
            Average,
            Info,
            InCrypto1,
            InCrypto2,
            Protect,
            ProtectAmount,
            DecimalError,
            AmountError,
            BalanceError,
            Yes,
            No,
            Options,
            IsPass,
            EnterPass,
            EnterAmount,
            Warning,
            
        }

        public CreatePromise(IMenu menu) : base(menu)
        {
        }
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Создать Промис",
                    [Keys.Average] = "Среднее",
                    [Keys.Info]="Для использования Промиса, просто перешлите его этому боту в любом меню или используйте на сайте.\n",
                    [Keys.InCrypto1]="Создать Промис к криптовалюте.",
                    [Keys.InCrypto2]="Создать Промис в эквиваленте <b>{0}</b> используя курс <b>{1}</b>.\n",
                    [Keys.Protect]=" Защитить паролем: <b>{0}</b>.",
                    [Keys.ProtectAmount]=" Защитить паролем: <b>{0}</b>. На сумму: <b>{1}</b>",
                    [Keys.DecimalError]="Для разделения целой и дробной части используйте точку \".\"",
                    [Keys.AmountError]="Сумма не распознана.",
                    [Keys.BalanceError]="Недостаточно средств.",
                    [Keys.Yes]="Да",
                    [Keys.No]="Нет",
                    [Keys.Options]="Дополнительные настройки",
                    [Keys.IsPass]="Защитить Промис паролем?",
                    [Keys.EnterPass]="Введите пароль для защиты Промиса:",
                    [Keys.EnterAmount]="Введите сумму Промиса:",
                    [Keys.Warning]="Обязательно сохраните Промис. Любая команда удалит его из этого чата.\n\n",
                    
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Create Promise",
                    [Keys.Average] = "Average",
                    [Keys.Info]="To use a Promise, simply forward it to this bot in any menu or use it on the website.\n",
                    [Keys.InCrypto1]="Create a Promise to Cryptocurrency.",
                    [Keys.InCrypto2]="Create a Promise equivalent to <b>{0}</b> using the rate <b>{1}</b>.\n",
                    [Keys.Protect]=" Password Protect: <b>{0}</b>.",
                    [Keys.ProtectAmount]=" Password Protect: <b>{0}</b>. For the amount: <b>{1}</b>",
                    [Keys.DecimalError]="Use a dot to separate whole and fractional parts \".\"",
                    [Keys.AmountError]="The amount was not recognized.",
                    [Keys.BalanceError]="Insufficient funds.",
                    [Keys.Yes]="Yes",
                    [Keys.No]="No",
                    [Keys.Options]="Additional settings",
                    [Keys.IsPass]="Password Protect Promise?",
                    [Keys.EnterPass]="Enter your Promise password:",
                    [Keys.EnterAmount]="Enter the Promise amount:",
                    [Keys.Warning]="Be sure to save the Promise. Any command will remove him from this chat.\n\n",
                }
            };
            return data;
        }
    }
}