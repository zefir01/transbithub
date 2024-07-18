using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class Invoices: TelegramService.Model.Localization.Base<Invoices.Keys>
    {
        public enum Keys
        {
            Name,
            Name1,
            Header,
            InvalidId,
            NotFound,
            
        }

        public Invoices(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Счета",
                    [Keys.Name1]="Счета Новых:{0}",
                    [Keys.Header]="Здесь вы можете смотреть и оплачивать счета. Перейдите к списку ваших счетов или введите номер счета для перехода к нему.",
                    [Keys.InvalidId]="Некорректный номер счета. Попробуйте еще раз.",
                    [Keys.NotFound]="Счет не найден.",
                    
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Invoices",
                    [Keys.Name1]="Invoices New:{0}",
                    [Keys.Header]="Here you can view and pay invoices. Go to the list of your invoices or enter the invoice number to go to it.",
                    [Keys.InvalidId]="Invalid invoice number. Try again.",
                    [Keys.NotFound]="Invoice not found.",
                }
            };
            return data;
        }
    }
}