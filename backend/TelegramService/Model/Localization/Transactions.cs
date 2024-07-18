using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class Transactions: TelegramService.Model.Localization.Base<Transactions.Keys>
    {
        public enum Keys
        {
            InTrans,
            OutTrans,
            Page,
            NoTrans,
            PrevPage,
            NextPage,
            Address,
            Amount,
            Confirmations,
            Created,
            Fee,
            
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.OutTrans] = "Исходящие транзакции",
                    [Keys.InTrans]="Входящие транзакции",
                    [Keys.Page]="Страница:",
                    [Keys.NoTrans]="Нет транзакций.",
                    [Keys.PrevPage]="Предыдущая страница",
                    [Keys.NextPage]="Следующая страница",
                    [Keys.Address]="Адрес:",
                    [Keys.Amount]="Сумма:",
                    [Keys.Confirmations]="Подтверждения:",
                    [Keys.Created]="Создана:",
                    [Keys.Fee]="Комиссия:",
                    
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.OutTrans] = "Output transactions",
                    [Keys.InTrans]="Input transactions",
                    [Keys.Page]="Page:",
                    [Keys.NoTrans]="No transactions.",
                    [Keys.PrevPage]="Previous page",
                    [Keys.NextPage]="Next page",
                    [Keys.Address]="Address:",
                    [Keys.Amount]="Amount:",
                    [Keys.Confirmations]="Confirmations:",
                    [Keys.Created]="Created at:",
                    [Keys.Fee]="Fee:",
                }
            };
            return data;
        }
        public Transactions(IMenu menu) : base(menu)
        {
        }
    }
}