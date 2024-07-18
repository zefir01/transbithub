using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class OutBtc : TelegramService.Model.Localization.Base<OutBtc.Keys>
    {
        public enum Keys
        {
            Name,
            EnterAmount,
            Amount,
            EnterWallet,
            Address,
            Confirm,
            Ok,
            Send,
            Error,
            Error1,
            Error2,
            Error3,
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Вывод биткоинов",
                    [Keys.EnterAmount] = "Введите сумму в биткоинах или 0 для вывода максимально возможной суммы.",
                    [Keys.Amount] = "Сумма:",
                    [Keys.EnterWallet] = "Введите адрес кошелька.",
                    [Keys.Address] = "Адрес:",
                    [Keys.Confirm] = "Подтвердите перевод.",
                    [Keys.Ok] = "Запрос на вывод успешно создан. Ожидайте поступление криптовалюты.",
                    [Keys.Send] = "Отправить",
                    [Keys.Error] = "Ожидается текстовое сообщение.",
                    [Keys.Error1] = "Сумма не распознана. Попробуйте еще раз.",
                    [Keys.Error2] = "Адрес не распознан. Попробуйте еще раз.",
                    [Keys.Error3] =
                        "Ваш баланс меньше комиссии. Вывод биткоинов невозможен. Попробуйте использовать Lightning Network или Промисы."
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Bitcoin withdrawal",
                    [Keys.EnterAmount] = "Enter the amount in bitcoins or 0 to display the maximum possible amount.",
                    [Keys.Amount] = "Amount:",
                    [Keys.EnterWallet] = "Enter wallet address.",
                    [Keys.Address] = "Address:",
                    [Keys.Confirm] = "Confirm the withdrawal.",
                    [Keys.Ok] =
                        "A withdrawal request has been successfully created. Expect the arrival of cryptocurrency.",
                    [Keys.Send] = "Send",
                    [Keys.Error] = "A text message is expected.",
                    [Keys.Error1] = "Amount not recognized. Try again.",
                    [Keys.Error2] = "The address is not recognized. Try again.",
                    [Keys.Error3] =
                        "Your balance is less than the fee. Bitcoin withdrawal is not possible. Try using Lightning Network or Promises."
                }
            };
            return data;
        }

        public OutBtc(IMenu menu) : base(menu)
        {
        }
    }
}