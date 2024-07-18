using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult= System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using Enum = System.Enum;

namespace TelegramService.Model
{
    public class CreatePromiseOptions : BaseMenu
    {
        public class State : StateBase
        {
            public Catalog.Currencies? Currency { get; set; }
            public string Variable { get; set; }
            public bool InCrypto { get; set; }
            public Status Status  { get; set; }
        }
        public enum Status
        {
            InCrypto,
            Currency,
            SelectCurrency,
            Variable,
            SelectVariable
        }

        private Catalog.Currencies? currency;
        private string variable;
        private bool inCrypto;
        private Status status = Status.InCrypto;
        private Dictionary<string, decimal> vars;
        private CreatePromise parent;
        private Localization.CreatePromiseOptions s;

        public CreatePromiseOptions(CreatePromise parent) : base(parent)
        {
            s=new Localization.CreatePromiseOptions(Menu);
            this.parent = parent;
        }

        public void SetParams(Catalog.Currencies? currency, string variable, bool inCrypto)
        {
            status = Status.InCrypto;
            this.currency = currency;
            this.variable = variable;
            this.inCrypto = inCrypto;
        }

        public override bool HideNavigation => true;
        public override string Name => s.Get(Localization.CreatePromiseOptions.Keys.Name);
        public override string Header => s.Get(Localization.CreatePromiseOptions.Keys.Header);

        private async AsyncResult GoToParent()
        {
            parent.SetParams(currency, variable, inCrypto);
            return await parent.Print();
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
                    case Status.InCrypto:
                        return result;
                    case Status.Currency:
                        status = Status.InCrypto;
                        return await Print();
                    case Status.SelectCurrency:
                        status = Status.Currency;
                        return await Print();
                    case Status.Variable:
                        status = Status.Currency;
                        return await Print();
                    case Status.SelectVariable:
                        status = Status.Variable;
                        return await Print();
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            switch (status)
            {
                case Status.InCrypto:
                    if (command == "cmd crypto")
                    {
                        inCrypto = true;
                        return await GoToParent();
                    }
                    else if (command == "cmd fiat")
                    {
                        inCrypto = false;
                        status = Status.Currency;
                    }
                    else return await PrintError();

                    return await Print();
                case Status.Currency:
                    if (command == "cmd yes")
                        status = Status.Variable;
                    else if (command == "cmd no")
                        status = Status.SelectCurrency;
                    else return await PrintError();
                    return await Print();
                case Status.SelectCurrency:
                    if (Enum.TryParse(command, out Catalog.Currencies c))
                    {
                        currency = c;
                        status = Status.Variable;
                        return await Print();
                    }

                    return await PrintError(s.Get(Localization.CreatePromiseOptions.Keys.CurrencyError));
                case Status.Variable:
                    if (command == "cmd yes")
                        return await GoToParent();
                    else if (command == "cmd no")
                        status = Status.SelectVariable;
                    else return await PrintError();
                    return await Print();
                case Status.SelectVariable:
                    variable = command;
                    return await GoToParent();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private List<Result> GetCommandsSelectFiatCurrency()
        {
            List<List<InlineKeyboardButton>> btns = new List<List<InlineKeyboardButton>>();
            foreach (var cur in Catalog.CurrenciesList)
            {
                var list = new List<InlineKeyboardButton>
                {
                    InlineKeyboardButton.WithCallbackData(cur, cur),
                };
                btns.Add(list);
            }

            btns.Add(BackBtn.BackHome(this));
            int counter = 0;
            int page = 1;
            List<List<InlineKeyboardButton>> buffer = new List<List<InlineKeyboardButton>>();
            List<Result> results = new List<Result>();
            foreach (var btn in btns)
            {
                counter++;
                if (counter == 50)
                {
                    results.Add(new Result(this, "#" + page, buffer.ToKeyboard()));
                    buffer = new List<List<InlineKeyboardButton>>();
                    page++;
                    counter = 0;
                }

                buffer.Add(btn);
            }

            if (buffer.Any())
                results.Add(new Result(this, "#" + (page + 1), buffer.ToKeyboard()));
            return results;
        }

        private string GetVariableName(string variable)
        {
            if (variable.IsNullOrEmpty())
                return "";
            string v = "";
            if (variable.StartsWith("AVG_"))
                v = s.Get(Localization.CreatePromiseOptions.Keys.Average);
            else if (variable.EndsWith("_usd"))
            {
                var t = variable.Split("_")[0];
                var first = t.Substring(0, 1).ToUpper();
                v = $"{first + t.Substring(1)}";
            }

            return v;
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            switch (status)
            {
                case Status.InCrypto:
                    return await PrintError();
                case Status.Currency:
                    return await PrintError();
                case Status.SelectCurrency:
                    if (Enum.TryParse(message.Text, out Catalog.Currencies c))
                    {
                        currency = c;
                        status = Status.Variable;
                        return await Print();
                    }

                    return await PrintError(s.Get(Localization.CreatePromiseOptions.Keys.CurrencyError));
                case Status.Variable:
                    return await PrintError();
                case Status.SelectVariable:
                    return await PrintError();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private async Task GetVars()
        {
            vars = (await Clients.TradeClient.GetVariablesAsync(new Empty())).Variables_.ToDictionary(p => p.Key, p => p.Value.FromPb());
            vars = vars.Where(p => p.Key.StartsWith("AVG_") || p.Key.EndsWith("_usd"))
                .ToDictionary(p => p.Key, p => p.Value);
        }

        protected override AsyncResult Content()
        {
            switch (status)
            {
                case Status.InCrypto:
                    var list = new List<InlineKeyboardButton>
                    {
                        InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromiseOptions.Keys.InCrypto), "cmd crypto"),
                        InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromiseOptions.Keys.InFiat), "cmd fiat")
                    };
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this,
                            s.Get(Localization.CreatePromiseOptions.Keys.IsCrypto),
                            list.ToKeyboard())
                    });
                case Status.Currency:
                    var list1 = new List<InlineKeyboardButton>
                    {
                        InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromiseOptions.Keys.Yes), "cmd yes"),
                        InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromiseOptions.Keys.Change), "cmd no")
                    };
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, s.Get(Localization.CreatePromiseOptions.Keys.FiatCorrect, currency.ToString()),
                            list1.ToKeyboard())
                    });
                case Status.SelectCurrency:
                    List<Result> all = new List<Result>();
                    var r = new Result(this, s.Get(Localization.CreatePromiseOptions.Keys.SelectFiat),
                        InlineKeyboardMarkup.Empty());
                    all.Add(r);
                    all.AddRange(GetCommandsSelectFiatCurrency());
                    return Task.FromResult(all);
                case Status.Variable:
                    var list2 = new List<InlineKeyboardButton>
                    {
                        InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromiseOptions.Keys.Yes), "cmd yes"),
                        InlineKeyboardButton.WithCallbackData(s.Get(Localization.CreatePromiseOptions.Keys.Change), "cmd no")
                    };
                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, s.Get(Localization.CreatePromiseOptions.Keys.RateCorrect, GetVariableName(variable)),
                            list2.ToKeyboard())
                    });
                case Status.SelectVariable:
                    var list3 = new List<List<InlineKeyboardButton>>();
                    var avgVar = vars.First(p => p.Key.StartsWith($"AVG_{currency}"));
                    var exVars = vars.Where(p => p.Key.EndsWith("_usd"));
                    foreach (var v in new []{avgVar}.Concat(exVars))
                    {
                        list3.Add(new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(GetVariableName(v.Key), v.Key)
                        });
                    }

                    return Task.FromResult(new List<Result>
                    {
                        new Result(this, s.Get(Localization.CreatePromiseOptions.Keys.SelectRate),
                            list3.ToKeyboard())
                    });
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public override async AsyncResult OnStart()
        {
            await GetVars();
            status = Status.InCrypto;
            return await Print();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Currency = currency,
                InCrypto = inCrypto,
                Status = status,
                Variable = variable
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = (State) state;
            currency = st.Currency;
            inCrypto = st.InCrypto;
            status = st.Status;
            variable = st.Variable;
            return Task.CompletedTask;
        }
    }
}