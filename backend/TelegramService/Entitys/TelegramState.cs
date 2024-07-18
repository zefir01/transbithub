
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using TelegramService.Model.Localization;

namespace TelegramService.Entitys
{
    [Index(nameof(TelegramUserId))]
    [Index(nameof(AnonymousUserId))]
    [Index(nameof(LoginUserId))]
    public class TelegramState
    {
        [Key] public long Id { get; private set; }
        public int TelegramUserId { get; private set; }
        public string Data { get; set; }
        public string AnonymousUserId { get; set; }
        public string LoginUserId { get; set; }
        public List<int> LastMessages { get; set; } = new List<int>();
        public virtual List<WaitingImage> WaitingImages { get; set; } = new List<WaitingImage>();
        public Langs Lang { get; set; }

        public TelegramState()
        {
        }

        public TelegramState(string anonymousUserId, int telegramUserId, string data, Langs lang)
        {
            AnonymousUserId = anonymousUserId;
            TelegramUserId = telegramUserId;
            Data = data;
            Lang = lang;
        }
    }
}