using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace TelegramService.Entitys
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

        public override string ToString()
        {
            return $"Image: ImageId={ImageId} TelegramFileId={TelegramFileId} CreatedAt={CreatedAt}";
        }
    }
}