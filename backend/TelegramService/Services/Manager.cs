using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using GrpcService1.Protos.Nats;
using IdentityServer4.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using TelegramService.Entitys;

namespace TelegramService.Services
{
    public class Manager : IDisposable
    {
        private readonly Dictionary<int, IQueue> queues = new Dictionary<int, IQueue>();
        private readonly ILogger<Manager> logger;
        private readonly IConfig config;
        private readonly TelegramBotClient botClient;
        private readonly IServiceProvider provider;
        private readonly Object createLocker = new object();
        private readonly IFactory factory;

        public Manager(IConfig config, IServiceProvider provider, IFactory factory)
        {
            logger = provider.GetService<ILogger<Manager>>();
            this.config = config;
            this.provider = provider;
            this.factory = factory;

            if (!config.ProxyUrl.IsNullOrEmpty())
            {
                WebProxy proxy;
                if (config.ProxyUser.IsNullOrEmpty())
                {
                    proxy = new WebProxy
                    {
                        Address = new Uri(config.ProxyUrl),
                        BypassProxyOnLocal = true,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(userName: config.ProxyUser, password: config.ProxyPass)
                    };
                }
                else
                {
                    proxy = new WebProxy
                    {
                        Address = new Uri(config.ProxyUrl),
                        BypassProxyOnLocal = true,
                        UseDefaultCredentials = false
                    };
                }

                botClient = new TelegramBotClient(config.TelegramToken, proxy);
            }
            else
            {
                //botClient = new TelegramBotClient(config.TelegramToken, baseUrl: "http://localhost:8081" );
                if (config.TelegramBaseUrl.IsNullOrEmpty())
                    botClient = new TelegramBotClient(config.TelegramToken);
                else
                    botClient = new TelegramBotClient(config.TelegramToken, baseUrl: config.TelegramBaseUrl);
            }

            botClient.Timeout = TimeSpan.FromMinutes(1);

            var me = botClient.GetMeAsync().ConfigureAwait(false).GetAwaiter().GetResult();
            botClient.DeleteWebhookAsync().ConfigureAwait(false).GetAwaiter().GetResult();
            if (!config.WebHookPem.IsNullOrEmpty())
            {
                botClient.SetWebhookAsync($"https://{config.WebhookIp}/{config.WebhookPath}/",
                        new FileStream(config.WebHookPem, FileMode.Open))
                    .ConfigureAwait(false).GetAwaiter().GetResult();
            }
            else
            {
                if (!config.WebhookIp.IsNullOrEmpty())
                {
                    botClient.SetWebhookAsync($"https://{config.WebhookIp}/{config.WebhookPath}/")
                        .ConfigureAwait(false).GetAwaiter().GetResult();
                }
                else
                {
                    botClient.OnUpdate += OnUpdateReceived;
                    botClient.StartReceiving();
                }
            }

            logger.LogInformation($@"Telegram service started. ID={me.Id} Name={me.Username}.");
        }

        private void OnUpdateReceived(object sender, UpdateEventArgs e)
        {
            var from = e.Update.Message?.From.Id ?? e.Update.CallbackQuery?.From.Id;
            if (!from.HasValue)
            {
                logger.LogError("Empty from id.");
                return;
            }

            SendUpdate(from.Value, e.Update);
        }

        public Task Clean()
        {
            var toClean = queues.Where(p => p.Value.LastActivity < DateTime.Now.AddHours(-1)).ToList();
            foreach (var queue in toClean)
            {
                queue.Value.Dispose();
                lock (createLocker)
                {
                    queues.Remove(queue.Key);
                }

                logger.LogDebug($"Cleaned user: {queue.Key}");
            }

            return Task.CompletedTask;
        }

        private void SendUpdate(int tgmId, Update update)
        {
            if (queues.ContainsKey(tgmId))
            {
                queues[tgmId].OnUpdate(update);
                return;
            }

            var q = CreateQueue(tgmId,
                update.Message?.From.LanguageCode ?? update.CallbackQuery?.From.LanguageCode ?? "ru");
            q?.OnUpdate(update);
        }

        public void OnUpdate(Update update)
        {
            switch (update.Type)
            {
                case UpdateType.Unknown:
                    break;
                case UpdateType.Message:
                {
                    var tgmId = update.Message.From.Id;
                    SendUpdate(tgmId, update);
                    break;
                }
                case UpdateType.InlineQuery:
                    break;
                case UpdateType.ChosenInlineResult:
                    break;
                case UpdateType.CallbackQuery:
                {
                    var tgmId = update.CallbackQuery.From.Id;
                    SendUpdate(tgmId, update);
                    break;
                }
                case UpdateType.EditedMessage:
                    break;
                case UpdateType.ChannelPost:
                    break;
                case UpdateType.EditedChannelPost:
                    break;
                case UpdateType.ShippingQuery:
                    break;
                case UpdateType.PreCheckoutQuery:
                    break;
                case UpdateType.Poll:
                    break;
                case UpdateType.PollAnswer:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public async Task OnEvent(EventNats evt)
        {
            var userId = evt.Receiver;
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetService<ITgmDbContext>();
            var state = await db.TelegramStates.FirstOrDefaultAsync(p => p.LoginUserId == userId);
            if (state == null)
                state = await db.TelegramStates.FirstOrDefaultAsync(p => p.AnonymousUserId == userId);
            if (state == null)
                return;
            IQueue q;
            if (!queues.ContainsKey(state.TelegramUserId))
            {
                q = CreateQueue(state);
            }
            else
                q = queues[state.TelegramUserId];

            q?.OnEvent(evt.Event);
        }

        private IQueue CreateQueue(TelegramState state)
        {
            lock (createLocker)
            {
                try
                {
                    var userId = state.LoginUserId.IsNullOrEmpty() ? state.AnonymousUserId : state.LoginUserId;
                    var q = factory.CreateQueue(config, userId, provider, logger, botClient, this);
                    queues.Add(state.TelegramUserId, q);
                    return q;
                }
                catch
                {
                    return null;
                }
            }
        }

        private IQueue CreateQueue(int tgmUserId, string lang)
        {
            lock (createLocker)
            {
                try
                {
                    var q = factory.CreateQueue(config, tgmUserId, lang, provider, logger, botClient, this);
                    queues.Add(tgmUserId, q);
                    return q;
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Create queue error: " + e.Message);
                    return null;
                }
            }
        }

        public async Task OnLogin(int tgmUserId, string userId, CancellationToken cancellationToken = default)
        {
            foreach (var queue in queues.Values.Where(p => p.UserId == userId && p.TgmUserId != tgmUserId).ToList())
            {
                try
                {
                    queue.Dispose();
                    queues.Remove(queue.TgmUserId);
                }
                catch (Exception e)
                {
                    logger.LogError("Force logout error: " + e.Message, e);
                }
            }

            using var scope = provider.CreateScope();
            await using var db = scope.ServiceProvider.GetService<ITgmDbContext>();
            var states = await db.TelegramStates.Where(p => p.TelegramUserId != tgmUserId && p.LoginUserId == userId)
                .ToListAsync(cancellationToken: cancellationToken);
            foreach (var state in states)
            {
                state.LoginUserId = null;
                state.Data = "";
            }

            await db.SaveChangesAsync(cancellationToken);
        }

        public void Dispose()
        {
            botClient.StopReceiving();
        }
    }
}