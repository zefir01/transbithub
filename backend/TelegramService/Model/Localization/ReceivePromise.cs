using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class ReceivePromise : TelegramService.Model.Localization.Base<ReceivePromise.Keys>
    {
        public enum Keys
        {
            Name,
            Header1,
            Header2,
            FormatError,
            Password,
            ToBalance,
            ToBalance1,
            Success,
            NotFound
        }

        public ReceivePromise(IMenu menu) : base(menu)
        {
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Принять Промис",
                    [Keys.Header1] = "Скопируйте Промис сюда.",
                    [Keys.Header2] = "<b>Промис:</b>\n{0}",
                    [Keys.FormatError] = "Неверный формат Промиса.",
                    [Keys.Password] = "Введите пароль от Промиса:",
                    [Keys.ToBalance] = "Зачислить на баланс",
                    [Keys.ToBalance1] = "Зачислить Промис на баланс ?",
                    [Keys.Success] = "Промис успешно зачислен на баланс.",
                    [Keys.NotFound] = "Промис не найден или уже использован."
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Name] = "Receive Promise",
                    [Keys.Header1] = "Copy the Promise here.",
                    [Keys.Header2] = "<b>Promise:</b>\n{0}",
                    [Keys.FormatError] = "Invalid Promise format.",
                    [Keys.Password] = "Enter your Promise password:",
                    [Keys.ToBalance] = "Add to balance",
                    [Keys.ToBalance1] = "Add Promise to balance?",
                    [Keys.Success] = "The Promise was successfully added to the balance.",
                    [Keys.NotFound] = "Promise not found or already used."
                }
            };
            return data;
        }
    }
}