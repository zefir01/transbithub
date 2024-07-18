using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class ReceivePromise : BaseMenu
    {
        public class PromiseFormatException : Exception
        {
            public PromiseFormatException() : base("Promise invalid format.")
            {
            }
        }

        public class State : StateBase
        {
            public Status Status { get; set; }
            public string Promise { get; set; }
            public string Password { get; set; }
            public bool ClearSigned { get; set; }
            public bool Encrypted { get; set; }
            public bool Force { get; set; }
        }

        public enum Status
        {
            Blank,
            Password,
            Receiving,
            Received
        }

        private Status status = Status.Blank;
        private string promise;
        private string password;
        private bool clearSigned;
        private bool encrypted;
        private bool force;
        private Localization.ReceivePromise s;

        private static readonly Regex regexClear =
            new Regex(@"-----BEGIN PGP SIGNED MESSAGE-----(.*)-----END PGP SIGNATURE-----",
                RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.Compiled);

        private static readonly Regex regexEncrypted =
            new Regex(@"-----BEGIN PGP MESSAGE-----(.*)-----END PGP MESSAGE-----",
                RegexOptions.Multiline | RegexOptions.Singleline | RegexOptions.Compiled);

        public static string CheckPromise(string str, out bool clearSigned, out bool encrypted)
        {
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

        public ReceivePromise(BaseMenu parent) : base(parent)
        {
            s = new Localization.ReceivePromise(Menu);
            BackDisabled = true;
        }

        public async AsyncResult SetPromise(Message message)
        {
            status = Status.Blank;
            promise = null;
            password = null;
            clearSigned = false;
            encrypted = false;
            force = true;
            return await NewMessage(message);
        }

        public override string Name => s.Get(Localization.ReceivePromise.Keys.Name);

        public override string Header
        {
            get
            {
                if (promise.IsNullOrEmpty())
                    return "";

                return s.Get(Localization.ReceivePromise.Keys.Header2, promise);
            }
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            switch (status)
            {
                case Status.Blank:
                    try
                    {
                        promise = CheckPromise(message.Text, out clearSigned, out encrypted);
                    }
                    catch (PromiseFormatException)
                    {
                        status = Status.Blank;
                        promise = null;
                        password = null;
                        clearSigned = false;
                        encrypted = false;
                        return await PrintError(s.Get(Localization.ReceivePromise.Keys.FormatError));
                    }

                    if (encrypted)
                        status = Status.Password;
                    else
                        status = Status.Receiving;
                    return await Print();
                case Status.Password:
                    password = message.Text;
                    status = Status.Receiving;
                    return await Print();
                case Status.Receiving:
                    return await PrintError();
                case Status.Received:
                    return await PrintError();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
                return result;

            result = await IsHome(command);
            if (result != null)
                return result;

            switch (status)
            {
                case Status.Blank:
                    return await PrintError();
                case Status.Password:
                    return await PrintError();
                case Status.Receiving:
                    if (command == "cmd toBalance")
                    {
                        try
                        {
                            await Clients.TradeClient.PromiseToBalanceAsync(new PromiseToBalanceRequest
                            {
                                Password = password ?? "",
                                Promise = promise
                            });
                        }
                        catch (Exception)
                        {
                            status = Status.Blank;
                            promise = null;
                            password = null;
                            clearSigned = false;
                            encrypted = false;
                            return await PrintError(s.Get(Localization.ReceivePromise.Keys.NotFound));
                        }

                        status = Status.Received;
                        return await Print();
                    }

                    return await PrintError();
                case Status.Received:
                    return await PrintError();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        protected override AsyncResult Content()
        {
            List<Result> res;
            switch (status)
            {
                case Status.Blank:
                    res = new List<Result>
                    {
                        new Result(this, s.Get(Localization.ReceivePromise.Keys.Header1),
                            BackBtn.BackHome(this).ToKeyboard())
                    };
                    break;
                case Status.Password:
                    res = new List<Result>
                    {
                        new Result(this, s.Get(Localization.ReceivePromise.Keys.Password),
                            BackBtn.BackHome(this).ToKeyboard())
                    };
                    break;
                case Status.Receiving:
                    var list = new List<List<InlineKeyboardButton>>
                    {
                        new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.ReceivePromise.Keys.ToBalance),
                                "cmd toBalance"),
                        },
                        BackBtn.BackHome(this)
                    };
                    res = new List<Result>
                    {
                        new Result(this, s.Get(Localization.ReceivePromise.Keys.ToBalance1), list.ToKeyboard())
                    };
                    break;
                case Status.Received:
                    res = new List<Result>
                    {
                        new Result(this, s.Get(Localization.ReceivePromise.Keys.Success),
                            BackBtn.BackHome(this).ToKeyboard())
                    };
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return Task.FromResult(res);
        }

        public override async AsyncResult OnStart()
        {
            if (force)
            {
                force = false;
                return await Print();
            }

            status = Status.Blank;
            promise = null;
            password = null;
            clearSigned = false;
            encrypted = false;
            return await Print();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                ClearSigned = clearSigned,
                Encrypted = encrypted,
                Password = password,
                Promise = promise,
                Status = status,
                Force = force
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = (State) state;
            clearSigned = st.ClearSigned;
            encrypted = st.Encrypted;
            password = st.Password;
            promise = st.Promise;
            status = st.Status;
            force = st.Force;
            return Task.CompletedTask;
        }
    }
}