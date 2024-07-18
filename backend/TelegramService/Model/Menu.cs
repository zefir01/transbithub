using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Protos.TradeApi.V1;
using Shared;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using TelegramService.Entitys;
using TelegramService.Model.Localization;
using TelegramService.Services;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using Enum = System.Enum;

// ReSharper disable ObjectCreationAsStatement

namespace TelegramService.Model
{
    public class StateException : Exception
    {
        public StateException(string message, Exception exception) : base(message, exception)
        {
        }
    }

    public class MenuState : StateBase
    {
        public int CurrentItemId { get; set; }
        public Catalog.Currencies? Currency { get; set; }
    }

    public interface IMenu
    {
        BaseMenu Root { get; }
        BaseMenu CurrentItem { get; }
        MyProfileResponse Profile { get; }
        string UserId { get; }
        GrpcClients Clients { get; }
        IQueue Queue { get; }
        ImageLoader ImageLoader { get; }
        Catalog.Currencies Currency { get; set; }
        Langs Lang { get; }
        CultureInfo CultureInfo { get; }
        IConfig Config { get; }
        Task<List<StateBase>> GetState();
        AsyncResult ImageLoaded(Guid id);
        AsyncResult NewCommand(string command);
        AsyncResult NewMessage(Message message);
        AsyncResult NewEvent(Event evt);
        AsyncResult PrintError(string message);
    }

    public class Menu : IMenu
    {
        public BaseMenu Root { get; }
        public BaseMenu CurrentItem { get; private set; }
        public MyProfileResponse Profile { get; private set; }
        readonly Regex invoiceRegex = new Regex(@"^\/start invoice-(\d+)$");
        readonly Regex invoicePiecesRegex = new Regex(@"^\/start invoice-(\d+)-pieces-(\d+)$");
        readonly Regex adRegex = new Regex(@"^\/start advertisement-(\d+)$");
        readonly Regex adAmountRegex = new Regex(@"^\/start advertisement-(\d+)-amount-(\d+(\.\d{1,2})?)$");
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
            if (message.Type == MessageType.Text)
            {
                MatchCollection matches = invoiceRegex.Matches(message.Text);
                if (matches.Any())
                {
                    var val = matches[0].Groups[1].Value;
                    if (ulong.TryParse(val, out var id))
                    {
                        if (id <= 0)
                            throw new UserException("Id must be greater then 0.");
                        var view = ((Main) Root).Invoices.InvoiceView;
                        await view.SetInvoice(id);
                        return await view.Print();
                    }
                }

                matches = invoicePiecesRegex.Matches(message.Text);
                if (matches.Any())
                {
                    var idStr = matches[0].Groups[1].Value;
                    var piecesStr = matches[0].Groups[2].Value;
                    if (ulong.TryParse(idStr, out var id) && uint.TryParse(piecesStr, out uint pieces))
                    {
                        if (id <= 0)
                            throw new UserException("Id must be greater then 0.");
                        var view = ((Main) Root).Invoices.InvoiceView;
                        await view.SetInvoice(id, pieces);
                        return await view.Print();
                    }
                }

                matches = adRegex.Matches(message.Text);
                if (matches.Any())
                {
                    var idStr = matches[0].Groups[1].Value;
                    if (ulong.TryParse(idStr, out var id))
                    {
                        if (id <= 0)
                            throw new UserException("Id must be greater then 0.");
                        var view = ((Main) Root).AdInfo;
                        await view.SetAdId(id);
                        return await view.Print();
                    }
                }

                matches = adAmountRegex.Matches(message.Text);
                if (matches.Any())
                {
                    var idStr = matches[0].Groups[1].Value;
                    var amountStr = matches[0].Groups[2].Value;
                    if (ulong.TryParse(idStr, out var id) && decimal.TryParse(amountStr, out var amount))
                    {
                        if (amount < 0)
                            throw new UserException("Amount must be greater then 0.");
                        if (id <= 0)
                            throw new UserException("Id must be greater then 0.");
                        var view = ((Main) Root).AdInfo;
                        await view.SetAdId(id, amount);
                        return await view.Print();
                    }
                }
            }


            List<Result> res;
            string promise = null;
            if (!(CurrentItem is ReceivePromise))
            {
                if (message.Type == MessageType.Text)
                {
                    try
                    {
                        promise = IQueue.CheckPromise(message.Text, out _, out _);
                    }
                    catch (PromiseFormatException)
                    {
                    }
                }
            }

            if (!promise.IsNullOrEmpty())
                res = await ((Main) Root).Promises.ReceivePromise.SetPromise(message);
            else
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