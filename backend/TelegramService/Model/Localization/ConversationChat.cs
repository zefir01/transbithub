using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class ConversationChat: Base<ConversationChat.Keys>
    {
        public enum Keys
        {
            Name,
            Header,
            Chat,
            You,
            Loading
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Связь с партнером",
                    [Keys.Header] = "Ваши сообщения будут пересланы продавцу.",
                    [Keys.Chat]="<b>Чат:</b>\n",
                    [Keys.You]="Вы",
                    [Keys.Loading]="<b>{0}:</b>\n<code>Изображение загружается на сервер. Пожалуйста ждите.</code>"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Partner contact",
                    [Keys.Header] = "Your messages will be forwarded to the seller.",
                    [Keys.Chat]="<b>Chat:</b>\n",
                    [Keys.You]="You",
                    [Keys.Loading]="<b>{0}:</b>\n<code>The image is uploaded to the server. Please, wait.</code>"
                }
            };
            return data;
        }
        
        public ConversationChat(IMenu menu) : base(menu)
        {
        }
    }
}