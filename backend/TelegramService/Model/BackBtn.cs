using System.Collections.Generic;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramService.Model
{
    public static class BackBtn
    {
        private static Localization.BackBtn s;

        public static InlineKeyboardButton Back(BaseMenu baseMenu)
        {
            s = new Localization.BackBtn(baseMenu.Menu);
            return InlineKeyboardButton.WithCallbackData(s.Get(Localization.BackBtn.Keys.Back), "go back");
        }
        public static InlineKeyboardButton Home(BaseMenu baseMenu)
        {
            s = new Localization.BackBtn(baseMenu.Menu);
            return InlineKeyboardButton.WithCallbackData(s.Get(Localization.BackBtn.Keys.Home), "go home");
        }

        public static List<InlineKeyboardButton> BackHome(BaseMenu baseMenu)
        {
            s = new Localization.BackBtn(baseMenu.Menu);
            return new List<InlineKeyboardButton>
            {
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.BackBtn.Keys.Back), "go back"),
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.BackBtn.Keys.Home), "go home")
            };
        }
    }
}