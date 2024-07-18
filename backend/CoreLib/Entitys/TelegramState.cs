using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    [Index(nameof(TelegramUserId))]
    [Index(nameof(AnonymousUserId))]
    [Index(nameof(LoginUserId))]
    public class TelegramState
    {
        [Key]
        public long Id { get; private set; }
        public int TelegramUserId { get; private set; }
        public string Data { get; set; }
        public string AnonymousUserId { get; set; }
        public string LoginUserId { get; set; }
        public TelegramState(){}

        public TelegramState(string anonymousUserId, int telegramUserId, string data)
        {
            AnonymousUserId = anonymousUserId;
            TelegramUserId = telegramUserId;
            Data = data;
        }
    }
}