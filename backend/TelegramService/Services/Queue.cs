using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Auth.Protos.Internal;
using IdentityModel.Client;
using IdentityServer4.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Protos.TradeApi.V1;
using Shared;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using TelegramService.Entitys;
using TelegramService.Model;
using TelegramService.Model.Localization;
using ImageLoader = TelegramService.Model.ImageLoader;

namespace TelegramService.Services
{
    public class NeedTwoFaException : Exception
    {
    }

    public class PromiseFormatException : Exception
    {
        public PromiseFormatException() : base("Promise invalid format.")
        {
        }
    }

    public interface IQueue: IDisposable
    {
        int TgmUserId { get; }
        string UserId { get; }
        GrpcClients GrpcClients { get; }
        ImageLoader ImageLoader { get; }
        Langs Lang { get; }
        DateTime LastActivity { get; }
        Task<List<Result>> Login(string username, string password, string twoFa = "");
        Task<List<Result>> Logout();
        Task OnImageLoaded(Guid guid);
        void OnUpdate(Update update);
        void OnEvent(Event evt);
        Task<int> PrintResult(Result result);

        public static string CheckPromise(string str, out bool clearSigned, out bool encrypted)
        {
            Regex regexClear =
                new Regex(@"-----BEGIN PGP SIGNED MESSAGE-----(.*)-----END PGP SIGNATURE-----",
                    RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.Compiled);

            Regex regexEncrypted =
                new Regex(@"-----BEGIN PGP MESSAGE-----(.*)-----END PGP MESSAGE-----",
                    RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.Compiled);
            
            string promise = "";
            clearSigned = false;
            encrypted = false;
            var m1 = regexClear.Match(str);
            if (m1.Success)
            {
                clearSigned = true;
                promise = m1.Value;
            }

            var m2 = regexEncrypted.Match(str);
            if (m2.Success)
            {
                encrypted = true;
                promise = m2.Value;
            }

            if (clearSigned == encrypted)
                throw new PromiseFormatException();
            return promise;
        }
    }

    public class Queue : IQueue
    {
        private enum ItemType
        {
            NewMessage,
            NewCommand,
            NewEvent,
            ImageLoaded
        }

        private class Item
        {
            public ItemType Type { get; set; }
            public Message Message { get; set; }
            public string Command { get; set; }
            public Event Event { get; set; }
            public Guid ImageId { get; set; }
        }

        private readonly IConfig config;
        public int TgmUserId { get; }
        public string UserId { get; private set; }
        public GrpcClients GrpcClients { get; }
        private readonly IServiceProvider provider;
        private IMenu menu;
        private readonly List<int> lastMessages;
        private readonly CancellationTokenSource tokenSource = new();
        private readonly ConcurrentQueue<Item> queue = new();
        private readonly ILogger logger;
        private readonly TelegramBotClient botClient;
        private readonly IFactory factory;


        public ImageLoader ImageLoader { get; }
        private readonly Task workerTask;
        private readonly Manager manager;
        public Langs Lang { get; }

        public Queue(IConfig config, int tgmUserId, string lang, IServiceProvider provider,
            ILogger logger, TelegramBotClient botClient, Manager manager, IFactory factory)
        {
            this.factory = factory;
            this.manager = manager;
            using var scope = provider.CreateScope();
            using var db = scope.ServiceProvider.GetService<ITgmDbContext>();
            this.config = config;
            TgmUserId = tgmUserId;
            this.provider = provider;
            this.logger = logger;
            this.botClient = botClient;
            GrpcClients = new GrpcClients(config, "");
            Lang = Enum.Parse<Langs>(lang.ToUpper());
            var state = db.TelegramStates
                .FirstOrDefault(p => p.TelegramUserId == tgmUserId);
            if (state != null)
            {
                UserId = state.LoginUserId.IsNullOrEmpty() ? state.AnonymousUserId : state.LoginUserId;
                lastMessages = state.LastMessages;
            }
            else
            {
                var response = GrpcClients.AuthClient.RegisterTelegramUser(new RegisterTelegramUserRequest
                {
                    TelegramId = (uint) tgmUserId,
                    Lang = lang
                });
                UserId = response.UserId;
                lastMessages = new List<int>();
            }

            var token = GetToken(UserId).ConfigureAwait(false).GetAwaiter().GetResult();
            GrpcClients.UpdateToken(token);
            menu = factory.CreateMenu(logger, GrpcClients, this, config, state);
            ImageLoader = new ImageLoader(provider, botClient, menu, this, state, tokenSource.Token);
            workerTask = Worker();
        }

        public Queue(IConfig config, string userId, IServiceProvider provider, ILogger logger,
            TelegramBotClient botClient, Manager manager, IFactory factory)
        {
            this.manager = manager;
            using var scope = provider.CreateScope();
            using var db = scope.ServiceProvider.GetRequiredService<ITgmDbContext>();
            this.config = config;
            UserId = userId;
            this.provider = provider;
            this.logger = logger;
            this.botClient = botClient;
            var state = db.TelegramStates
                .First(p => p.LoginUserId == userId || p.AnonymousUserId == userId);
            TgmUserId = state.TelegramUserId;
            lastMessages = state.LastMessages;
            Lang = state.Lang;

            var token = GetToken(userId).ConfigureAwait(false).GetAwaiter().GetResult();
            GrpcClients = new GrpcClients(config, token);
            menu = factory.CreateMenu(logger, GrpcClients, this, config, state);
            ImageLoader = new ImageLoader(provider, botClient, menu, this, state, tokenSource.Token);
            workerTask = Worker();
        }

        public DateTime LastActivity { get; private set; } = DateTime.Now;

        public void Dispose()
        {
            tokenSource.Cancel();
            tokenSource.Dispose();
        }

        private async Task<string> GetToken(string userId)
        {
            using var client = new HttpClient();
            var response = await client.RequestTokenAsync(new TokenRequest
            {
                Address = $"http://{config.AuthHost}:{config.AuthHttpPort}/connect/token",
                GrantType = "delegation",

                ClientId = "telegram",
                ClientSecret = "oon8Iengi6auleiz",

                Parameters =
                {
                    {"subject", userId},
                    {"scope", "trade profile_security"}
                }
            }, cancellationToken: tokenSource.Token);
            if (response.IsError)
                throw new UserException(response.ErrorDescription);
            return response.AccessToken;
        }

        public async Task<List<Result>> Login(string username, string password, string twoFa = "")
        {
            using var scope = provider.CreateScope();
            await using var db = scope.ServiceProvider.GetService<ITgmDbContext>();
            using var client = new HttpClient();
            var scopes = MyResources.GetApiResources().First().Scopes;
            var scopesStr = string.Join(" ", scopes);
            var response = await client.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = $"http://{config.AuthHost}:{config.AuthHttpPort}/connect/token",
                //GrantType = GrantType.ResourceOwnerPassword,

                ClientId = "telegram",
                ClientSecret = "oon8Iengi6auleiz",
                UserName = username,
                Password = password,
                Scope = "profile_security trade",

                Parameters =
                {
                    {"two_fa", twoFa},
                }
            }, cancellationToken: tokenSource.Token);
            if (response.IsError)
            {
                if (response.Error == "Need two_fa pin.")
                    throw new NeedTwoFaException();
                throw new UserException(response.ErrorDescription);
            }

            var jwt = response.AccessToken;
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwt);
            UserId = token.Claims.First(p => p.Type == "sub").Value;
            GrpcClients.UpdateToken(response.AccessToken);
            var state = await db.TelegramStates.FirstAsync(p => p.TelegramUserId == TgmUserId,
                cancellationToken: tokenSource.Token);
            state.LoginUserId = UserId;
            state.Data = "";
            await db.SaveChangesAsync(tokenSource.Token);
            menu = factory.CreateMenu(logger, GrpcClients, this, config);
            await manager.OnLogin(TgmUserId, UserId);
            return await menu.CurrentItem.Print();
        }

        public async Task<List<Result>> Logout()
        {
            using var scope = provider.CreateScope();
            await using var db = scope.ServiceProvider.GetService<ITgmDbContext>();
            var state = await db.TelegramStates.FirstAsync(p => p.TelegramUserId == TgmUserId,
                cancellationToken: tokenSource.Token);
            state.LoginUserId = null;
            GrpcClients.UpdateToken(await GetToken(state.AnonymousUserId));
            state.Data = "";
            await db.SaveChangesAsync(tokenSource.Token);
            UserId = state.AnonymousUserId;
            menu = factory.CreateMenu(logger, GrpcClients, this, config);
            return await menu.CurrentItem.Print();
        }

        private async Task Save()
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            string json = JsonConvert.SerializeObject(await menu.GetState(), settings);
            using var scope = provider.CreateScope();
            await using var db = scope.ServiceProvider.GetService<ITgmDbContext>();
            var entity = await db.TelegramStates.FirstOrDefaultAsync(p => p.TelegramUserId == TgmUserId,
                cancellationToken: tokenSource.Token);
            if (entity == null)
            {
                entity = new TelegramState(UserId, TgmUserId, json, Lang) {AnonymousUserId = UserId};
                await db.TelegramStates.AddAsync(entity, tokenSource.Token);
            }

            entity.Data = json;
            entity.LastMessages = lastMessages;
            entity.WaitingImages = ImageLoader.GetWaitingGuids()
                .Select(p => new WaitingImage {Id = p.Key, CreatedAt = p.Value, State = entity}).ToList();
            await db.SaveChangesAsync(tokenSource.Token);
        }

        private async Task DeleteMessage(int fromId, int id)
        {
            try
            {
                logger.LogDebug($"Deleting message: from={fromId} id={id}");
                await botClient.DeleteMessageAsync(fromId, id, tokenSource.Token);
            }
            catch (Exception e)
            {
                logger.LogWarning(e, "Unable to delete message: from={fromId} id={id}");
            }
        }

        public async Task<int> PrintResult(Result result)
        {
            logger.LogDebug("PrintResult");
            var (r, id) = await ImageLoader.OutPhoto(result, tokenSource.Token);
            logger.LogDebug($"Image processed: result={r} id={id}");
            if (id == null)
            {
                var m = await botClient.SendTextMessageAsync(TgmUserId, r.Message, ParseMode.Html,
                    replyMarkup: r.Keyboard, cancellationToken: tokenSource.Token);
                return m.MessageId;
            }

            return id.Value;
        }

        private async Task Send(List<Result> messages)
        {
            logger.LogDebug("Sending messages: " + messages.Count);
            LastActivity = DateTime.Now;
            foreach (var lastMessage in lastMessages)
                await DeleteMessage(TgmUserId, lastMessage);
            lastMessages.Clear();
            foreach (var msg in messages)
            {
                var id = await PrintResult(msg);
                lastMessages.Add(id);
            }

            await Save();
            logger.LogDebug("Sending messages: " + messages.Count + " end.");
        }

        private async Task Worker()
        {
            while (!tokenSource.Token.IsCancellationRequested)
            {
                if (queue.IsEmpty)
                {
                    await Task.Delay(3000, tokenSource.Token);
                    continue;
                }

                var resultsSets = new List<List<Result>>();
                while (!queue.IsEmpty)
                {
                    if (queue.TryDequeue(out var item))
                    {
                        try
                        {
                            switch (item.Type)
                            {
                                case ItemType.NewMessage:
                                    var res = await menu.NewMessage(item.Message);
                                    if (res != null)
                                        resultsSets.Add(res);
                                    break;
                                case ItemType.NewCommand:
                                    var res1 = await menu.NewCommand(item.Command);
                                    if (res1 != null)
                                        resultsSets.Add(res1);
                                    break;
                                case ItemType.NewEvent:
                                    var res2 = await menu.NewEvent(item.Event);
                                    if (res2 != null)
                                        resultsSets.Add(res2);
                                    break;
                                case ItemType.ImageLoaded:
                                    var res3 = await menu.ImageLoaded(item.ImageId);
                                    if (res3 != null)
                                        resultsSets.Add(res3);
                                    break;
                                default:
                                    throw new ArgumentOutOfRangeException();
                            }
                        }
                        catch (UserException e)
                        {
                            logger.LogError(e, "Error in worker: " + e.Message);
                            try
                            {
                                var res = await menu.PrintError(e.Message);
                                resultsSets.Add(res);
                            }
                            catch (Exception ee)
                            {
                                Console.WriteLine(ee);
                            }
                        }
                        catch (Exception e)
                        {
                            logger.LogError(e, "Error in worker: " + e.Message);
                            try
                            {
                                var res = await menu.PrintError(e.HideException(logger).Message);
                                resultsSets.Add(res);
                            }
                            catch (Exception ee)
                            {
                                Console.WriteLine(ee);
                            }
                        }
                    }
                    else
                        await Task.Delay(100, tokenSource.Token);
                }

                if (resultsSets.Any())
                {
                    var last = resultsSets[^1];
                    await Send(last);
                }
            }
        }

        public Task OnImageLoaded(Guid guid)
        {
            var item = new Item
            {
                ImageId = guid,
                Type = ItemType.ImageLoaded
            };
            queue.Enqueue(item);
            return Task.CompletedTask;
        }

        public void OnUpdate(Update update)
        {
            switch (update.Type)
            {
                case UpdateType.Unknown:
                    break;
                case UpdateType.Message:
                {
                    var item = new Item
                    {
                        Message = update.Message,
                        Type = ItemType.NewMessage
                    };
                    queue.Enqueue(item);
                    break;
                }
                case UpdateType.InlineQuery:
                    break;
                case UpdateType.ChosenInlineResult:
                    break;
                case UpdateType.CallbackQuery:
                {
                    var item = new Item
                    {
                        Command = update.CallbackQuery.Data,
                        Type = ItemType.NewCommand
                    };
                    queue.Enqueue(item);
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

        public void OnEvent(Event evt)
        {
            var item = new Item
            {
                Event = evt,
                Type = ItemType.NewEvent
            };
            queue.Enqueue(item);
        }
    }
}