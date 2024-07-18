using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class BackBtn : TelegramService.Model.Localization.Base<BackBtn.Keys>
    {
        public enum Keys
        {
            Back,
            Home
        }

        public BackBtn(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Back] = "Назад",
                    [Keys.Home] = "В начало",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Back] = "Back",
                    [Keys.Home] = "To start"
                }
            };
            return data;
        }
    }
}