using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class Promises: TelegramService.Model.Localization.Base<Promises.Keys>
    {
        public enum Keys
        {
            Title,
            Header
        }

        public Promises(IMenu menu) : base(menu)
        {
        }
        
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Title] = "Промисы",
                    [Keys.Header] = "Здесь вы можете создавать и принимать Промисы.\nДля принятия Промиса, вы можете переслать его этому боту в любой момент в любом меню.",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Title] = "Promises",
                    [Keys.Header] = "Here you can create and accept Promises.\nTo accept a Promise, you can forward it to this bot at any time in any menu.",
                }
            };
            return data;
        }
    }
}