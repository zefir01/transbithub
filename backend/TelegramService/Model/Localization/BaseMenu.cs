using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class BaseMenu : TelegramService.Model.Localization.Base<BaseMenu.Keys>
    {
        public enum Keys
        {
            InvalidCommand,
            Path,
            Back
        }
        

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.InvalidCommand] = "Неверная команда.",
                    [Keys.Path] = "Путь:",
                    [Keys.Back] = "Назад",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.InvalidCommand] = "Invalid command.",
                    [Keys.Path] = "Path:",
                    [Keys.Back] = "Back",
                }
            };
            return data;
        }

        public BaseMenu(IMenu menu) : base(menu)
        {
        }
    }
}