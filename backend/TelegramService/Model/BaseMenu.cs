using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.InputFiles;
using Telegram.Bot.Types.ReplyMarkups;
using TelegramService.Model.Localization;
using TelegramService.Services;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class Photo
    {
        public Guid Id { get; }
        public byte[] Data { get; }
        public InputOnlineFile TgmFile { get; set; }

        public Photo(Guid id)
        {
            Id = id;
        }

        public Photo(byte[] data)
        {
            Data = data;
        }

        public override string ToString()
        {
            return $"Photo: Id={Id} TgmFile={TgmFile.Url}";
        }
    }

    public class Result
    {
        public Result(BaseMenu navigation, string message, InlineKeyboardMarkup keyboard, Photo photo = null)
        {
            Navigation = navigation;
            Message = message;
            Keyboard = keyboard;
            Photo = photo;
        }

        public BaseMenu Navigation { get; }
        public string Message { get; }
        public InlineKeyboardMarkup Keyboard { get; set; }
        public Photo Photo { get; }

        public override string ToString()
        {
            return $"Result: Navigation={Navigation.Name} Message={Message} Photo={Photo}";
        }
    }

    public class ErrorResult : Result
    {
        public ErrorResult(BaseMenu navigation, string message)
            : base(navigation, $"<code>{message}</code>",
                new InlineKeyboardMarkup(new List<List<InlineKeyboardButton>>()))
        {
        }

        public static List<Result> GetArray(BaseMenu navigation, string message)
        {
            return new List<Result>
            {
                new ErrorResult(navigation, message)
            };
        }
    }

    public class BaseMenu
    {
        protected BaseMenu CurrentItem => Menu.CurrentItem;
        public virtual bool HideNavigation { get; }
        public virtual string Name { get; }
        public BaseMenu Parent { get; }
        private List<BaseMenu> Childs = new List<BaseMenu>();
        private List<Event> events = new List<Event>();
        protected IReadOnlyList<Event> Events => Root.events;
        public BaseMenu Redirect { get; protected set; }

        public string Path
        {
            get
            {
                var local = Name.IsNullOrEmpty() ? "" : $"/{Name}";
                if (Parent == null)
                    return $"{Menu.Config.SiteName}{local}";
                return $"{Parent.Path}{local}";
            }
        }

        public int Id { get; }
        private int counter;
        protected BaseMenu Root { get; }
        protected virtual IReadOnlyList<ICommand> Commands { get; } = new List<ICommand>();
        public virtual string Header { get; }
        private Dictionary<int, BaseMenu> allItems = new Dictionary<int, BaseMenu>();
        public IReadOnlyDictionary<int, BaseMenu> AllItems => Root.allItems;
        private IMenu menu;

        public IMenu Menu => Root.menu;

        protected Langs Lang => Root.menu.Lang;
        private Localization.BaseMenu s;
        protected CultureInfo CultureInfo => Root.menu.CultureInfo;
        protected bool BackDisabled { get; set; }
        private ImageLoader ImageLoader => Menu.ImageLoader;
        public GrpcClients Clients => Menu.Clients;

        public Catalog.Currencies Currency
        {
            get => Menu.Currency;
            set => Menu.Currency = value;
        }

        public BaseMenu(BaseMenu parent)
        {
            Parent = parent;

            if (Parent == null)
            {
                Root = this;
                Id = 0;
                counter++;
            }
            else
            {
                Root = Parent.Root;
                Id = Root.counter;
                Root.counter++;
            }

            Root.allItems.Add(Id, this);
            Parent?.Childs.Add(this);
            s = new Localization.BaseMenu(Menu);
        }

        public BaseMenu(IMenu menu)
        {
            this.menu = menu;
            Root = this;
            Id = 0;
            counter++;

            Root.allItems.Add(Id, this);
            Parent?.Childs.Add(this);
            s = new Localization.BaseMenu(menu);
        }

        public async AsyncResult ReceiveCommand(string command)
        {
            await Root.GetEvents();
            return await OnCommand(command);
        }

        public async AsyncResult ReceiveMessage(Message message)
        {
            await Root.GetEvents();
            return await NewMessage(message);
        }

        protected virtual async AsyncResult OnCommand(string command)
        {
            var arr = command.Split(" ");
            if (arr[0] == "go")
            {
                var item = Childs.FirstOrDefault(p => p.Id.ToString() == arr[1]);
                if (item == null)
                {
                    List<Result> result;
                    result = await IsBack(command);
                    if (result != null)
                        return result;

                    result = await IsHome(command);
                    if (result != null)
                        return result;

                    return await PrintError(s.Get(Localization.BaseMenu.Keys.InvalidCommand));
                }

                return await item.Print();
            }

            if (arr[0] == "cmd")
            {
                var cmd = Commands.FirstOrDefault(p => p.Id.ToString() == arr[1]);
                if (cmd == null)
                    return await PrintError(s.Get(Localization.BaseMenu.Keys.InvalidCommand));
                return await NewCommand(cmd);
            }

            return await PrintError(s.Get(Localization.BaseMenu.Keys.InvalidCommand));
        }

        protected virtual async AsyncResult NewCommand(ICommand command)
        {
            return await PrintError(s.Get(Localization.BaseMenu.Keys.InvalidCommand));
        }

        protected virtual Task OnBack()
        {
            return Task.CompletedTask;
        }

        protected virtual async AsyncResult OnHome()
        {
            return await Root.Print();
        }

        protected async AsyncResult IsHome(string command)
        {
            if (command == "go home")
            {
                await OnBack();
                if (Parent == null)
                {
                    return null;
                }

                return await OnHome();
            }

            return null;
        }

        protected async AsyncResult IsBack(string command)
        {
            if (command == "go back")
            {
                if (Parent == null)
                {
                    return null;
                }

                return await Parent.Print();
            }

            return null;
        }

        public virtual async AsyncResult OnStart()
        {
            return await Print();
        }

        public async AsyncResult PrintError(string message)
        {
            return await Print($"<code>{message}</code>");
        }

        public async AsyncResult PrintError()
        {
            return await PrintError(s.Get(Localization.BaseMenu.Keys.InvalidCommand));
        }

        protected virtual AsyncResult Content()
        {
            return Task.FromResult(new List<Result>());
        }

        public async AsyncResult Print(string message = null)
        {
            if (Redirect != null)
                return await Redirect.Print(message);
            List<Result> results = new List<Result>();
            var commands = Keyboard();
            InlineKeyboardMarkup keyboard;
            string msg;
            if (commands.Count < 50)
            {
                msg = $"<b>{s.Get(Localization.BaseMenu.Keys.Path)}</b> {Path}";
                msg += $"\n{Header}";
                if (!msg.IsNullOrEmpty())
                    msg += $"\n{message}";
                List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
                foreach (var button in commands)
                {
                    arr.Add(new List<InlineKeyboardButton>
                        {
                            button
                        }
                    );
                }

                if (Parent != null && !BackDisabled)
                    arr.Add(BackBtn.BackHome(this));

                keyboard = new InlineKeyboardMarkup(arr);
                results.Add(new Result(this, msg, keyboard));
            }
            else
            {
                msg = $"<b>{s.Get(Localization.BaseMenu.Keys.Path)}</b> {Path}";
                msg += $"\n{Header}";
                if (!msg.IsNullOrEmpty())
                    msg += $"\n{message}";
                for (int i = 0; i < commands.Count; i++)
                {
                    List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
                    if (!msg.IsNullOrEmpty())
                        msg = msg + $"\n#{i}:";
                    else
                        msg = $"#{i}:";
                    var sel = commands.Skip(i * 50).Take(50);
                    foreach (var button in sel)
                    {
                        arr.Add(new List<InlineKeyboardButton>
                            {
                                button
                            }
                        );
                    }

                    if (!commands.Skip((i + 1) * 50).Any() && Parent != null && !BackDisabled)
                        arr.Add(BackBtn.BackHome(this));

                    keyboard = new InlineKeyboardMarkup(arr);
                    results.Add(new Result(this, msg, keyboard));
                    msg = "";
                    if (!commands.Skip((i + 1) * 50).Any())
                        break;
                }
            }

            return results.Concat(await Content()).ToList();
        }

        private List<InlineKeyboardButton> Keyboard()
        {
            List<InlineKeyboardButton> arr = new List<InlineKeyboardButton>();
            foreach (var command in Commands)
            {
                var btn = InlineKeyboardButton.WithCallbackData(command.Name, $"cmd {command.Id}");
                arr.Add(btn);
            }

            foreach (var child in Childs.Where(p => !p.HideNavigation))
            {
                var btn = InlineKeyboardButton.WithCallbackData(child.Name, $"go {child.Id}");
                arr.Add(btn);
            }

            return arr;
        }

        public virtual async AsyncResult NewMessage(Message message)
        {
            return await PrintError(s.Get(Localization.BaseMenu.Keys.InvalidCommand));
        }

        public virtual Task<StateBase> GetState()
        {
            return Task.FromResult(new StateBase
            {
                Id = Id
            });
        }

        public virtual Task SetState(StateBase state)
        {
            return Task.CompletedTask;
        }

        public async Task<List<StateBase>> GetAllStates()
        {
            List<StateBase> states = new List<StateBase>();
            foreach (var pair in Root.allItems)
                states.Add(await pair.Value.GetState());

            return states;
        }

        public async Task SetStates(List<StateBase> states)
        {
            foreach (var pair in Root.allItems)
            {
                var s = states.First(p => p.Id == pair.Value.Id);
                await pair.Value.SetState(s);
            }
        }

        private async Task GetEvents()
        {
            var resp = await Clients.TradeClient.GetUserEventsAsync(new Empty());
            events = resp.Events.ToList();
        }

        protected async Task MarkEventAsRead(Event evt)
        {
            var req = new MarkEventsAsReadRequest();
            req.Id.Add((ulong) evt.Id);
            await Clients.TradeClient.MarkEventsAsReadAsync(req);
            Root.events.Remove(evt);
        }

        protected async Task MarkEventAsRead(List<Event> evts)
        {
            if (!evts.Any())
                return;
            var req = new MarkEventsAsReadRequest();
            req.Id.AddRange(evts.Select(p => p.Id));
            await Clients.TradeClient.MarkEventsAsReadAsync(req);
            foreach (var evt in evts)
                Root.events.Remove(evt);
        }

        public async AsyncResult NewEvent(Event evt)
        {
            List<Result> res = null;
            if (Root == this)
                events.Add(evt);
            var needUpdate = await OnEvent(evt);
            if (CurrentItem == this && needUpdate)
                res = await Print();
            foreach (var child in Childs)
            {
                var res2 = await child.NewEvent(evt);
                if (res2 != null)
                    res = res2;
            }

            return res;
        }

        protected virtual Task<bool> OnEvent(Event evt)
        {
            return Task.FromResult(false);
        }

        protected bool IsImage(Message message)
        {
            return ImageLoader.IsImage(message);
        }

        protected virtual Task<bool> OnImageLoaded(Guid id)
        {
            return Task.FromResult(false);
        }

        public async AsyncResult ImageLoaded(Guid id)
        {
            List<Result> res = null;
            var needUpdate = await OnImageLoaded(id);
            if (CurrentItem == this && needUpdate)
                res = await Print();
            return res;
        }
    }
}