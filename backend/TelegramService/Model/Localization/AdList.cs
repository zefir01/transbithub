using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class AdList : TelegramService.Model.Localization.Base<AdList.Keys>
    {
        public enum Keys
        {
            Name,
            Path,
            Seller,
            Buyer,
            Price,
            Limits,
            Buy,
            Sell,
            NextPage,
            Back,
            Rate
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Объявления",
                    [Keys.Path] = "Путь:",
                    [Keys.Seller] = "Продавец",
                    [Keys.Buyer] = "Покупатель",
                    [Keys.Price]="Цена:",
                    [Keys.Limits]="Ограничения:",
                    [Keys.Buy]="Купить",
                    [Keys.Sell]="Продать",
                    [Keys.NextPage]="Следующая страница",
                    [Keys.Back]="Назад",
                    [Keys.Rate]="Рейтинг:"
                    
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Advertisements",
                    [Keys.Path] = "Path:",
                    [Keys.Seller] = "Seller",
                    [Keys.Buyer] = "Buyer",
                    [Keys.Price]="Price:",
                    [Keys.Limits]="Limits:",
                    [Keys.Buy]="Buy",
                    [Keys.Sell]="Sell",
                    [Keys.NextPage]="Next page",
                    [Keys.Back]="Back",
                    [Keys.Rate]="Rate:"
                }
            };
            return data;
        }

        public AdList(IMenu menu) : base(menu)
        {
        }
    }
}