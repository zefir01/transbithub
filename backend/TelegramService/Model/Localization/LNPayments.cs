using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class LNPayments: TelegramService.Model.Localization.Base<LNPayments.Keys>
    {
        public enum Keys
        {
            Name,
            Header,
            Amount,
            CreatedAt,
            Desc,
            PrevPage,
            NextPage,
            
        }
        
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Платежи",
                    [Keys.Header]="Страница {0}",
                    [Keys.Amount]="<b>Сумма:</b> {0} BTC\n",
                    [Keys.CreatedAt]="<b>Создан:</b> {0}\n",
                    [Keys.Desc]="<b>Описание:</b> {0}\n",
                    [Keys.PrevPage]="Предыдущая страница",
                    [Keys.NextPage]="Следующая страница",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Payments",
                    [Keys.Header]="Page {0}",
                    [Keys.Amount]="<b>Amount:</b> {0} BTC\n",
                    [Keys.CreatedAt]="<b>Created at:</b> {0}\n",
                    [Keys.Desc]="<b>Description:</b> {0}\n",
                    [Keys.PrevPage]="Previous page",
                    [Keys.NextPage]="Next page",
                }
            };
            return data;
        }

        public LNPayments(IMenu menu) : base(menu)
        {
        }
    }
}