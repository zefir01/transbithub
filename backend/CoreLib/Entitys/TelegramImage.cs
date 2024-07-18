using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    [Index(nameof(TelegramFileId))]
    public class TelegramImage
    {
        [Key] public Guid ImageId { get; private set; }
        public string TelegramFileId { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        public TelegramImage()
        {
        }

        public TelegramImage(Guid imageId, string telegramFileId)
        {
            ImageId = imageId;
            TelegramFileId = telegramFileId;
        }
    }
}