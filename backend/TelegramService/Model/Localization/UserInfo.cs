using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class UserInfo: TelegramService.Model.Localization.Base<UserInfo.Keys>
    {
        public enum Keys
        {
            Info,
            DealsCount,
            AvgDealAmount,
            PartnersCount,
            PositiveRate,
            FirstDeal,
            CreatedAt,
            LastOnline,
            EmailConfirmed,
            Trusted,
            Blocked,
            Delay,
            Median,
            Average,
            Feedbacks,
            NoFeedbacks,
            Positive,
            Negative,
            From,
            PostedAt,
            Text,
            AddTrust,
            RemoveTrusted,
            Block,
            UnBlock,
            User,
            Yes,
            No,
            Site
        }
        
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Info] = "Информация о",
                    [Keys.DealsCount]="Количество сделок:",
                    [Keys.AvgDealAmount]="Средний объем сделки:",
                    [Keys.PartnersCount]="Количество контрагентов:",
                    [Keys.PositiveRate]="Положительных отзывов:",
                    [Keys.FirstDeal]="Первая сделка:",
                    [Keys.CreatedAt]="Учетная запись создана:",
                    [Keys.LastOnline]="В последний раз был онлайн:",
                    [Keys.EmailConfirmed]="Email подтвержден:",
                    [Keys.Trusted]="Доверенный:",
                    [Keys.Blocked]="Заблокирован пользователями:",
                    [Keys.Delay]="Время задержки запуска депонирования платежа:",
                    [Keys.Median]= "<b>Медиана:</b> {0}\n",
                    [Keys.Average]="<b>Среднее:</b> {0}\n",
                    [Keys.Feedbacks]="Последние отзывы:",
                    [Keys.NoFeedbacks]="Нет отзывов.",
                    [Keys.Positive]="Положительный",
                    [Keys.Negative]="Отрицательный",
                    [Keys.From]="От:",
                    [Keys.PostedAt]="Оставлен:",
                    [Keys.Text]="Текст:",
                    [Keys.AddTrust]="Добавить в доверенные",
                    [Keys.RemoveTrusted]="Убрать из доверенных",
                    [Keys.Block]="Заблокировать пользователя",
                    [Keys.UnBlock]="Разблокировать пользователя",
                    [Keys.User]="Пользователь",
                    [Keys.Yes]="Да",
                    [Keys.No]="Нет",
                    [Keys.Site]="<b>Сайт:</b> {0}\n"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Info] = "Information about",
                    [Keys.DealsCount]="Deals count:",
                    [Keys.AvgDealAmount]="Average deals amount:",
                    [Keys.PartnersCount]="Partners count:",
                    [Keys.PositiveRate]="Positive feedback:",
                    [Keys.FirstDeal]="First deal:",
                    [Keys.CreatedAt]="Account created at:",
                    [Keys.LastOnline]="Last online:",
                    [Keys.EmailConfirmed]="Email confirmed:",
                    [Keys.Trusted]="Trusted by:",
                    [Keys.Blocked]="Blocked by:",
                    [Keys.Delay]="Time delay for starting a payment deposit:",
                    [Keys.Median]= "<b>Median:</b> {0}\n",
                    [Keys.Average]="<b>Average:</b> {0}\n",
                    [Keys.Feedbacks]="Last feedbacks:",
                    [Keys.NoFeedbacks]="No feedbacks yet.",
                    [Keys.Positive]="Positive",
                    [Keys.Negative]="Negative",
                    [Keys.From]="From:",
                    [Keys.PostedAt]="Posted at:",
                    [Keys.Text]="Text:",
                    [Keys.AddTrust]="Add to trusted",
                    [Keys.RemoveTrusted]="Remove from trusted",
                    [Keys.Block]="Block user",
                    [Keys.UnBlock]="Unblock user",
                    [Keys.User]="User",
                    [Keys.Yes]="Yes",
                    [Keys.No]="No",
                    [Keys.Site]="<b>Site:</b> {0}\n"
                }
            };
            return data;
        }

        public UserInfo(IMenu menu) : base(menu)
        {
        }
    }
}