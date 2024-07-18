using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TelegramService.Entitys
{
    public class WaitingImage
    {
        public virtual TelegramState State { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key] public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}