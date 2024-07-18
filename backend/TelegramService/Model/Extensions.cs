using System.Collections.Generic;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramService.Model
{
    public static class Extensions
    {
        public static InlineKeyboardMarkup ToKeyboard(this List<List<InlineKeyboardButton>> arr)
        {
            var keyboard = new InlineKeyboardMarkup(arr);
            return keyboard;
        }
        public static InlineKeyboardMarkup ToKeyboard(this List<InlineKeyboardButton> arr)
        {
            var keyboard = new InlineKeyboardMarkup(arr);
            return keyboard;
        }
    }
}