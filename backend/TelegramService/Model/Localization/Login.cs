using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class Login : TelegramService.Model.Localization.Base<Login.Keys>
    {
        public enum Keys
        {
            SignIn,
            SignOut,
            StatusNotAuth,
            StatusAuth,
            EnterLogin,
            EnterPassword,
            InvalidPass,
            Enter2Fa,
            Invalid2Fa,
        }


        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.SignIn] = "Войти",
                    [Keys.SignOut] = "Выйти",
                    [Keys.StatusNotAuth] = "Статус: Не авторизован.",
                    [Keys.StatusAuth] = "Статус: авторизован как ",
                    [Keys.EnterLogin] = "Введите имя пользователя:",
                    [Keys.EnterPassword] = "Введите пароль:",
                    [Keys.InvalidPass] = "Неверный логин или пароль.",
                    [Keys.Enter2Fa] = "Введите код двухфакторной авторизации:",
                    [Keys.Invalid2Fa] = "Неверный код двухфакторной авторизации."
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.SignIn] = "Sign in",
                    [Keys.SignOut] = "Sign out",
                    [Keys.StatusNotAuth] = "Status: Not authorized.",
                    [Keys.StatusAuth] = "Status: authorized as ",
                    [Keys.EnterLogin] = "Enter username:",
                    [Keys.EnterPassword] = "Enter password:",
                    [Keys.InvalidPass] = "Wrong login or password.",
                    [Keys.Enter2Fa] = "Enter the two-factor authorization code:",
                    [Keys.Invalid2Fa] = "Invalid two-factor authorization code."
                }
            };
            return data;
        }

        public Login(IMenu menu) : base(menu)
        {
        }
    }
}