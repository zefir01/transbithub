using System.Collections.Generic;
using CoreLib.Services;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramService.Model
{
    public static class CurrencyBtnList
    {
        public static List<Result> Get(BaseMenu src, bool backHomeAdd)
        {
            List<Result> results=new List<Result>();
            List<List<List<InlineKeyboardButton>>> btns = new List<List<List<InlineKeyboardButton>>>();
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            foreach (var curr in Catalog.CurrenciesList)
            {
                var btn = InlineKeyboardButton.WithCallbackData(curr, $"cmd {curr}");
                arr.Add(new List<InlineKeyboardButton>{btn});
                if (arr.Count == 49)
                {
                    btns.Add(arr);
                    arr = new List<List<InlineKeyboardButton>>();
                }
            }
            if (backHomeAdd)
                arr.Add(BackBtn.BackHome(src));
            btns.Add(arr);

            for (int i = 0; i < btns.Count; i++)
                results.Add(new Result(src, $"#{i}", btns[i].ToKeyboard()));

            return results;
        }
    }
}