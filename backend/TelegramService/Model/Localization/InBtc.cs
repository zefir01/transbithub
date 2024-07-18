using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class InBtc : TelegramService.Model.Localization.Base<InBtc.Keys>
    {
        public enum Keys
        {
            Name,
            Info1,
            Info2,
            Info3,
            Info4,
            ToStandard,
            ToBech32,
        }

        public InBtc(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Ввод биткоинов",
                    [Keys.Info1] = "Для ввода биткоинов переведите желаемую сумму на адрес: <b>{0}</b>\n",
                    [Keys.Info2] = "Или сканируйте QR код вашим кошельком.\n",
                    [Keys.Info3] = "Или перейдите по ссылке: {0}\n",
                    [Keys.Info4] = "Если адрес не распознается переключитесь на другой тип адреса.\n",
                    [Keys.ToStandard] = "Переключиться на стандартный адрес",
                    [Keys.ToBech32] = "Переключиться на bech32 адрес",
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Depositing bitcoins",
                    [Keys.Info1] = "To depositing bitcoins, transfer the desired amount to the address: <b>{0}</b>\n",
                    [Keys.Info2] = "Or scan the QR code with your wallet.\n",
                    [Keys.Info3] = "Or follow the link: {0}\n",
                    [Keys.Info4] = "If the address is not recognized, switch to another type of address.\n",
                    [Keys.ToStandard] = "Switch to standard address",
                    [Keys.ToBech32] = "Switch to bech32 address",
                }
            };
            return data;
        }
    }
}