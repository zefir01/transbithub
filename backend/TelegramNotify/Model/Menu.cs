using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using TelegramService;
using TelegramService.Entitys;
using TelegramService.Model;
using TelegramService.Model.Localization;
using TelegramService.Services;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using BaseMenu = TelegramService.Model.BaseMenu;
using Enum = System.Enum;
using ImageLoader = TelegramService.Model.ImageLoader;

// ReSharper disable ObjectCreationAsStatement

namespace TelegramNotify.Model
{
    public class MenuState : StateBase
    {
        public int CurrentItemId { get; set; }
        public Catalog.Currencies? Currency { get; set; }
    }

    public class Menu : IMenu
    {
        public BaseMenu Root { get; }
        public BaseMenu CurrentItem { get; private set; }
        public MyProfileResponse Profile { get; private set; }
        private readonly IQueue queue;
        public string UserId => queue.UserId;
        public GrpcClients Clients { get; }
        public IQueue Queue => queue;
        public ImageLoader ImageLoader => queue.ImageLoader;

        public Catalog.Currencies Currency
        {
            get => Enum.Parse<Catalog.Currencies>(Profile.DefaultCurrency);
            set => Profile.DefaultCurrency = value.ToString();
        }

        private ILogger logger;
        public Langs Lang => queue.Lang;
        private readonly Random rnd = new Random();
        public CultureInfo CultureInfo { get; private set; } = new CultureInfo("en-EN");
        public IConfig Config { get; }

        public Menu(ILogger logger,
            GrpcClients clients, IQueue queue, IConfig config, TelegramState state = null)
        {
            this.logger = logger;
            Clients = clients;
            this.queue = queue;
            Config = config;

            Root = new Main(this, logger, config);

            CurrentItem = Root;
            Profile = clients.TradeClient.GetMyProfile(new Empty());
            if (state != null)
            {
                try
                {
                    if (!state.Data.IsNullOrEmpty())
                    {
                        JsonSerializerSettings settings = new JsonSerializerSettings
                        {
                            TypeNameHandling = TypeNameHandling.All
                        };
                        var s = JsonConvert.DeserializeObject<List<StateBase>>(state.Data, settings);
                        SetState(s).ConfigureAwait(false).GetAwaiter().GetResult();
                    }
                }
                catch (Exception e)
                {
                    logger.LogWarning("Error in telegram state.", e);
                    //throw new StateException("Error in telegram state.", e);
                }
            }
        }


        public async Task<List<StateBase>> GetState()
        {
            var s = await Root.GetAllStates();
            s.Add(new MenuState
            {
                Id = -1,
                CurrentItemId = CurrentItem.Id,
                Currency = Currency
            });
            return s;
        }

        private async Task SetState(List<StateBase> states)
        {
            var s = states.First(p => p.Id == -1) as MenuState;
            states.Remove(s);
            CurrentItem = Root.AllItems[s.CurrentItemId];
            Currency = s.Currency ?? Currency;
            if (Lang == Langs.RU)
                CultureInfo = new CultureInfo("ru-RU");
            else
                CultureInfo = new CultureInfo("en-EN");
            await Root.SetStates(states);
        }

        public async AsyncResult ImageLoaded(Guid id)
        {
            var res = await CurrentItem.ImageLoaded(id);
            var navigation = res.Last().Navigation;
            if (CurrentItem != navigation)
                res = await navigation.OnStart();
            CurrentItem = navigation;
            return res;
        }

        public async AsyncResult NewCommand(string command)
        {
            var res = await CurrentItem.ReceiveCommand(command);
            var navigation = res.Last().Navigation;
            if (CurrentItem != navigation)
                res = await navigation.OnStart();
            CurrentItem = navigation;
            return res;
        }

        public async AsyncResult NewMessage(Message message)
        {
            List<Result> res;
            res = await CurrentItem.ReceiveMessage(message);
            var navigation = res.Last().Navigation;
            if (CurrentItem != navigation)
                res = await navigation.OnStart();
            CurrentItem = navigation;

            return res;
        }

        public async AsyncResult NewEvent(Event evt)
        {
            var res = await Root.NewEvent(evt);
            if (res == null)
                return null;
            var navigation = res.Last().Navigation;
            if (CurrentItem != navigation)
                res = await navigation.OnStart();
            CurrentItem = navigation;
            return res;
        }

        public async AsyncResult PrintError(string message)
        {
            return await CurrentItem.PrintError(message);
        }
    }
}