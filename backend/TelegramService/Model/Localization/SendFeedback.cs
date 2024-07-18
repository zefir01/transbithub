using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class SendFeedback : TelegramService.Model.Localization.Base<SendFeedback.Keys>
    {
        public enum Keys
        {
            Title,
            Header,
            Positive,
            Negative
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Title] = "Оставить отзыв",
                    [Keys.Header] = "Напишите текст отзыва и выберите тип.",
                    [Keys.Positive] = "Положительный",
                    [Keys.Negative] = "Отрицательный"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Title] = "Give feedback",
                    [Keys.Header] = "Write your review text and select a type.",
                    [Keys.Positive] = "Positive",
                    [Keys.Negative] = "Negative"
                }
            };
            return data;
        }

        public SendFeedback(IMenu menu) : base(menu)
        {
        }
    }
}