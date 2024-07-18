using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class ImageLoader: Base<ImageLoader.Keys>
    {
        public enum Keys
        {
            Loading
        }

        public ImageLoader(IMenu menu) : base(menu)
        {
        }
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Loading]="<code>Изображение загружается на сервер. Пожалуйста ждите.</code>"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Loading]="<code>The image is uploaded to the server. Please, wait.</code>"
                }
            };
            return data;
        }
    }
}