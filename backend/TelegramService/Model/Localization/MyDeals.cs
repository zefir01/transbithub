using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class MyDeals : TelegramService.Model.Localization.Base<MyDeals.Keys>
    {
        public enum Keys
        {
            MyDeals,
            NewStatus,
            NewMessages,
            Info,
            Opened,
            Completed,
            Canceled,
            Disputed,
            MarkAsRead
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.MyDeals] = "Мои сделки",
                    [Keys.NewStatus] = "Новый статус:",
                    [Keys.NewMessages] = "Новые сообщения:",
                    [Keys.Info] = "Для просмотра, выберите нужный статус сделок.",
                    [Keys.Opened] = "Открытые",
                    [Keys.Completed] = "Завершенные",
                    [Keys.Canceled] = "Отмененные",
                    [Keys.Disputed] = "Диспуты",
                    [Keys.MarkAsRead] = "Отметить все как прочитанные",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.MyDeals] = "My deals",
                    [Keys.NewStatus] = "New status:",
                    [Keys.NewMessages] = "New messages:",
                    [Keys.Info] = "To view, select the desired status of deals.",
                    [Keys.Opened] = "Opened",
                    [Keys.Completed] = "Completed",
                    [Keys.Canceled] = "Canceled",
                    [Keys.Disputed] = "Disputes",
                    [Keys.MarkAsRead] = "Mark All Read"
                }
            };
            return data;
        }

        public MyDeals(IMenu menu) : base(menu)
        {
        }
    }
}