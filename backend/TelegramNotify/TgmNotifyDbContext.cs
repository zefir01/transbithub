using Marques.EFCore.SnakeCase;
using Microsoft.EntityFrameworkCore;
using TelegramService;
using TelegramService.Entitys;

namespace TelegramNotify
{
    public class TgmNotifyDbContext: TgmDbContext
    {
        public TgmNotifyDbContext(IConfig config) : base(config)
        {
        }
    }
}