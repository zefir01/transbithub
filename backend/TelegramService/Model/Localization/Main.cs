using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class Main: TelegramService.Model.Localization.Base<Main.Keys>
    {
        public enum Keys
        {
            Header
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Header] = "Здравствуйте. Это бот {0}. Здесь вы можете легко и быстро продавать и покупать криптовалюту по самым выгодным ценам."
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Header] = "Hello. This is {0} bot. Here you can easily and quickly sell and buy cryptocurrency at the best prices."
                }
            };
            return data;
        }
        public Main(IMenu menu) : base(menu)
        {
        }
    }
}