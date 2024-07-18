using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class CreatePromise : BaseMenu
    {
        public class State : StateBase
        {
            public Catalog.Currencies? Currency { get; set; }
            public string Variable { get; set; }
            public bool? InCrypto { get; set; }
            public decimal Amount { get; set; }
            public string Promise { get; set; }
            public string Password { get; set; }
            public CreatePromiseStatus Status { get; set; }
        }

        public enum CreatePromiseStatus
        {
            IsEnablePassword,
            EnterPassword,
            EnterAmount,
            Result
        }

        private Catalog.Currencies? currency;
        private string variable;
        private bool? inCrypto;
        private decimal amount;
        private string promise;
        private string password;
        private CreatePromiseStatus status = CreatePromiseStatus.IsEnablePassword;
        private Dictionary<string, decimal> vars;
        private readonly CreatePromiseOptions options;
        private Localization.CreatePromise s;

        public CreatePromise(BaseMenu parent) : base(parent)
        {
            s = new Localization.CreatePromise(Menu);
            BackDisabled = true;
            options = new CreatePromiseOptions(this);
            inCrypto = false;
            GetVars().ConfigureAwait(false).GetAwaiter().GetResult();
        }

        private async Task GetVars()
        {
            vars = (await Clients.TradeClient.GetVariablesAsync(new Empty())).Variables_.ToDictionary(p => p.Key,
                p => p.Value.FromPb());
            vars = vars.Where(p => p.Key.StartsWith("AVG_") || p.Key.EndsWith("_usd"))
                .ToDictionary(p => p.Key, p => p.Value);
        }

        private KeyValuePair<string, decimal> GetAvgVar()
        {
            return vars.First(p => p.Key == $"AVG_{currency.ToString()}");
        }

        public override string Name => s.Get(Localization.CreatePromise.Keys.Name);

        public void SetParams(Catalog.Currencies? currency, string variable, bool inCrypto)
        {
            this.currency = currency;
            this.variable = variable;
            this.inCrypto = inCrypto;
        }

        public override async AsyncResult OnStart()
        {
            promise = "";
            password = "";
            amount = 0;
            status = CreatePromiseStatus.IsEnablePassword;
            await GetVars();
            currency ??= Menu.Currency;
            variable ??= GetAvgVar().Key;
            inCrypto ??= false;
            return await Print();
        }

        private string GetVariableName()
        {
            string v = "";
            if (!variable.IsNullOrEmpty())
            {
                if (variable.StartsWith("AVG_"))
                    v = $"\"{s.Get(Localization.CreatePromise.Keys.Average)}\"";
                else if (variable.EndsWith("_usd"))
                {
                    var t = variable.Split("_")[0];
                    var first = t.Substring(0, 1).ToUpper();
                    v = $"\"{first + t.Substring(1)}\"";
                }
            }

            return v;
        }

        public override string Header
        {
            get
            {
                string v = GetVariableName();

                string pass = password.IsNullOrEmpty() ? "Нет" : $"\"{password}\"";
                string h = s.Get(Localization.CreatePromise.Keys.Info);
                if (inCrypto.Value)
                    h += s.Get(Localization.CreatePromise.Keys.InCrypto1);
                else
                    h += s.Get(Localization.CreatePromise.Keys.InCrypto2, currency.ToString(), v);

                switch (status)
                {
                    case CreatePromiseStatus.IsEnablePassword:
                        return h;
                    case CreatePromiseStatus.EnterPassword:
                        return h;
                    case CreatePromiseStatus.EnterAmount:
                        return h + s.Get(Localization.CreatePromise.Keys.Protect, pass);
                    case CreatePromiseStatus.Result:
                        return h + s.Get(Localization.CreatePromise.Keys.ProtectAmount, pass,
                            amount.ToString(CultureInfo.InvariantCulture));
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            switch (status)
            {
                case CreatePromiseStatus.IsEnablePassword:
                    return await PrintError();
                case CreatePromiseStatus.EnterPassword:
                    password = message.Text;
                    status = CreatePromiseStatus.EnterAmount;
                    return await Print();
                case CreatePromiseStatus.EnterAmount:
                    if (message.Text.Contains(","))
                        return await PrintError(s.Get(Localization.CreatePromise.Keys.DecimalError));
                    if (!decimal.TryParse(message.Text, out amount))
                        await PrintError(s.Get(Localization.CreatePromise.Keys.AmountError));
                    var balance = await Clients.TradeClient.GetBalancesAsync(new Empty());
                    decimal crypto;
                    if (inCrypto.Value)
                    {
                        decimal fee = amount * CoreLib.Config.PromiseFee;
                        if (fee < CoreLib.Config.Satoshi)
                            fee = CoreLib.Config.Satoshi;
                        if (balance.Confirmed.FromPb() < amount + fee)
                            return await PrintError(s.Get(Localization.CreatePromise.Keys.BalanceError));
                        crypto = amount;
                    }
                    else
                    {
                        var vprice = vars.First(p => p.Key == variable).Value;
                        if (!variable.StartsWith("AVG_"))
                        {
                            if (currency != Catalog.Currencies.USD)
                            {
                                var curPrice = vars.First(p => p.Key == currency.ToString());
                                vprice *= curPrice.Value;
                            }
                        }

                        crypto = amount / vprice;
                        decimal fee = crypto * CoreLib.Config.PromiseFee;
                        if (fee < CoreLib.Config.Satoshi)
                            fee = CoreLib.Config.Satoshi;
                        if (balance.Confirmed.FromPb() < crypto + fee)
                            return await PrintError(s.Get(Localization.CreatePromise.Keys.BalanceError));
                    }

                    var resp1 = await Clients.TradeClient.CreatePromiseAsync(new CreatePromiseRequest
                    {
                        Amount = crypto.ToPb(),
                        Password = password
                    });
                    promise = resp1.Promise;

                    status = CreatePromiseStatus.Result;
                    return await Print();
                case CreatePromiseStatus.Result:
                    return await PrintError();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        protected override async AsyncResult OnCommand(string command)
        {
            var result = await IsHome(command);
            if (result != null)
                return result;
            result = await IsBack(command);
            if (result != null)
            {
                switch (status)
                {
                    case CreatePromiseStatus.IsEnablePassword:
                        return result;
                    case CreatePromiseStatus.EnterPassword:
                        status = CreatePromiseStatus.IsEnablePassword;
                        return await Print();
                    case CreatePromiseStatus.EnterAmount:
                        if (password.IsNullOrEmpty())
                            status = CreatePromiseStatus.IsEnablePassword;
                        else
                            status = CreatePromiseStatus.EnterPassword;
                        return await Print();
                    case CreatePromiseStatus.Result:
                        return result;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            switch (status)
            {
                case CreatePromiseStatus.IsEnablePassword:
                    if (command == "cmd no")
                        status = CreatePromiseStatus.EnterAmount;
                    if (command == "cmd yes")
                        status = CreatePromiseStatus.EnterPassword;
                    if (command == "cmd options")
                    {
                        options.SetParams(currency, variable, inCrypto.Value);
                        return await options.Print();
                    }

                    return await Print();
                case CreatePromiseStatus.EnterPassword:
                    return await PrintError();
                case CreatePromiseStatus.EnterAmount:
                    return await PrintError();
                case CreatePromiseStatus.Result:
                    return await PrintError();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        protected override AsyncResult Content()
        {
            switch (status)
            {
                case CreatePromiseStatus.IsEnablePassword:
                    var list = new List<List<InlineKeyboardButton>>
                    {
                        new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromise.Keys.Yes),
                                "cmd yes"),
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromise.Keys.No), "cmd no")
                        },
                        new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromise.Keys.Options),
                                "cmd options")
                        },
                        BackBtn.BackHome(this)
                    };
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, s.Get(Localization.CreatePromise.Keys.IsPass), list.ToKeyboard())
                    });
                case CreatePromiseStatus.EnterPassword:
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, s.Get(Localization.CreatePromise.Keys.EnterPass),
                            BackBtn.BackHome(this).ToKeyboard())
                    });
                case CreatePromiseStatus.EnterAmount:
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, s.Get(Localization.CreatePromise.Keys.EnterAmount),
                            BackBtn.BackHome(this).ToKeyboard())
                    });
                case CreatePromiseStatus.Result:
                    string text = s.Get(Localization.CreatePromise.Keys.Warning);
                    text += promise;
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, text, BackBtn.Home(this))
                    });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Amount = amount,
                Currency = currency,
                Variable = variable,
                InCrypto = inCrypto,
                Password = password,
                Promise = promise,
                Status = status
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = (State) state;
            amount = st.Amount;
            currency = st.Currency;
            variable = st.Variable;
            inCrypto = st.InCrypto;
            password = st.Password;
            promise = st.Promise;
            status = st.Status;
            return Task.CompletedTask;
        }
    }
}