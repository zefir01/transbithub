using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class LNInvoices: TelegramService.Model.Localization.Base<LNInvoices.Keys>
    {
        public enum Keys
        {
            Name,
            Header,
            Paid,
            Unpaid,
            Status,
            Amount,
            CreatedAt,
            Expires,
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
                    [Keys.Name] = "Запросы платежей",
                    [Keys.Header]="Страница {0}",
                    [Keys.Paid]="Оплачен",
                    [Keys.Unpaid]="Не оплачен",
                    [Keys.Status]="<b>Статус:</b> {0}\n",
                    [Keys.Amount]="<b>Сумма:</b> {0} BTC\n",
                    [Keys.CreatedAt]="<b>Создан:</b> {0}\n",
                    [Keys.Expires]="<b>Истекает:</b> {0}\n",
                    [Keys.Desc]="<b>Описание:</b> {0}\n",
                    [Keys.PrevPage]="Предыдущая страница",
                    [Keys.NextPage]="Следующая страница",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Payment requests",
                    [Keys.Header]="Page {0}",
                    [Keys.Paid]="Paid",
                    [Keys.Unpaid]="Unpaid",
                    [Keys.Status]="<b>Status:</b> {0}\n",
                    [Keys.Amount]="<b>Amount:</b> {0} BTC\n",
                    [Keys.CreatedAt]="<b>Created at:</b> {0}\n",
                    [Keys.Expires]="<b>Expires at:</b> {0}\n",
                    [Keys.Desc]="<b>Description:</b> {0}\n",
                    [Keys.PrevPage]="Previous page",
                    [Keys.NextPage]="Next page",
                }
            };
            return data;
        }

        public LNInvoices(IMenu menu) : base(menu)
        {
        }
    }
}