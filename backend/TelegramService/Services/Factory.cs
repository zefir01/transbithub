using System;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using TelegramService.Entitys;
using TelegramService.Model;

namespace TelegramService.Services
{
    public interface IFactory
    {
        IMenu CreateMenu(ILogger logger,
            GrpcClients clients, IQueue queue, IConfig config, TelegramState state = null);

        IQueue CreateQueue(IConfig config, int tgmUserId, string lang, IServiceProvider provider,
            ILogger logger, TelegramBotClient botClient, Manager manager);

        IQueue CreateQueue(IConfig config, string userId, IServiceProvider provider, ILogger logger,
            TelegramBotClient botClient, Manager manager);
    }

    public class Factory : IFactory
    {
        public IMenu CreateMenu(ILogger logger,
            GrpcClients clients, IQueue queue, IConfig config, TelegramState state = null)
        {
            return new Menu(logger, clients, queue, config, state);
        }

        public IQueue CreateQueue(IConfig config, int tgmUserId, string lang, IServiceProvider provider,
            ILogger logger, TelegramBotClient botClient, Manager manager)
        {
            return new Queue(config, tgmUserId, lang, provider, logger, botClient, manager, this);
        }

        public IQueue CreateQueue(IConfig config, string userId, IServiceProvider provider, ILogger logger,
            TelegramBotClient botClient, Manager manager)
        {
            return new Queue(config, userId, provider, logger, botClient, manager, this);
        }
    }
}