using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class DealsList: TelegramService.Model.Localization.Base<DealsList.Keys>
    {
        public enum Keys
        {
            Opened,
            Canceled,
            Completed,
            Disputed,
            Your,
            Page,
            DealsList,
            PrevPage,
            NextPage,
            Partner,
            Amount,
            Price,
            Created,
            Go,
            Partner1,
            Back,
            NoDeals,
            NewMessages,
            NewStatus,
            Yes,
            DealWaitDeposit
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Opened] = "открытые сделки",
                    [Keys.Canceled]="отмененные сделки",
                    [Keys.Completed]="завершенные сделки",
                    [Keys.Disputed]="диспуты",
                    [Keys.Your]="Ваши",
                    [Keys.Page]="Страница",
                    [Keys.DealsList]="Список сделок",
                    [Keys.PrevPage]="Предыдущая страница",
                    [Keys.NextPage]="Следующая страница",
                    [Keys.Partner]="Партнер:",
                    [Keys.Amount]="Сумма:",
                    [Keys.Price]="Цена:",
                    [Keys.Created]="Создана:",
                    [Keys.Go]="Перейти",
                    [Keys.Partner1]="Партнер",
                    [Keys.Back]="Назад",
                    [Keys.NoDeals]="Нет сделок",
                    [Keys.NewMessages]="Новых сообщений:",
                    [Keys.NewStatus]="Новый статус:",
                    [Keys.Yes]="Да",
                    [Keys.DealWaitDeposit] = "Ожидает внесения средств",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Opened] = "opened deals",
                    [Keys.Canceled]="canceled deals",
                    [Keys.Completed]="completed deals",
                    [Keys.Disputed]="disputes",
                    [Keys.Your]="Your",
                    [Keys.Page]="Page",
                    [Keys.DealsList]="Deals list",
                    [Keys.PrevPage]="Previous page",
                    [Keys.NextPage]="Next page",
                    [Keys.Partner]="Partner:",
                    [Keys.Amount]="Amount:",
                    [Keys.Price]="Price:",
                    [Keys.Created]="Created",
                    [Keys.Go]="Go to deal",
                    [Keys.Partner1]="Partner",
                    [Keys.Back]="Back",
                    [Keys.NoDeals]="No deals",
                    [Keys.NewMessages]="New messages:",
                    [Keys.NewStatus]="New status:",
                    [Keys.Yes]="Yes",
                    [Keys.DealWaitDeposit] = "Wait deposit",
                }
            };
            return data;
        }
        public DealsList(IMenu menu) : base(menu)
        {
        }
    }
}