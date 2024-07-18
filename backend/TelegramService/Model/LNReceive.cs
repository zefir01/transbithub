using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using IdentityServer4.Extensions;
using Protos.TradeApi.V1;
using QRCoder;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using Enum = System.Enum;

namespace TelegramService.Model
{
    public class LNReceive : BaseMenu
    {
        public enum Status
        {
            IsCrypto,
            IsDefaultCurrency,
            SelectCurrency,
            Amount,
            Description,
            Result
        }

        public class State : StateBase
        {
            public Status Status { get; set; }
            public bool IsCrypto { get; set; }
            public Catalog.Currencies Currency { get; set; }
            public decimal Amount { get; set; }
            public string Description { get; set; }
            public string Invoice { get; set; }
        }

        private Balance balance;
        private Status status = Status.IsCrypto;
        private bool isCrypto;
        private Catalog.Currencies currency;
        private decimal amount;
        private string description;
        private string invoice;
        private readonly Localization.LNReceive s;

        public override async AsyncResult OnStart()
        {
            invoice = "";
            status = Status.IsCrypto;
            await GetBalances();
            return await Print();
        }

        private async Task GetBalances()
        {
            balance =await Clients.TradeClient.GetBalancesAsync(new Empty());
            currency = Menu.Currency;
        }

        public LNReceive(BaseMenu parent) : base(parent)
        {
            s=new Localization.LNReceive(Menu);
        }

        public override string Name => s.Get(Localization.LNReceive.Keys.Name);
        public override bool HideNavigation => true;

        public override string Header
        {
            get
            {
                string cur;
                if (isCrypto)
                    cur = "BTC";
                else
                    cur = currency.ToString();
                switch (status)
                {
                    case Status.IsCrypto:
                        return s.Get(Localization.LNReceive.Keys.Header1);
                    case Status.IsDefaultCurrency:
                        return s.Get(Localization.LNReceive.Keys.Header1);
                    case Status.SelectCurrency:
                        return s.Get(Localization.LNReceive.Keys.Header1);
                    case Status.Amount:
                        return s.Get(Localization.LNReceive.Keys.Header2, cur);
                    case Status.Description:
                        return s.Get(Localization.LNReceive.Keys.Header3, cur, amount.ToString(CultureInfo.InvariantCulture));
                    case Status.Result:
                        return s.Get(Localization.LNReceive.Keys.Header3, cur, amount.ToString(CultureInfo.InvariantCulture));
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
            {
                switch (status)
                {
                    case Status.IsCrypto:
                        return result;
                    case Status.IsDefaultCurrency:
                        status = Status.IsCrypto;
                        return await Print();
                    case Status.SelectCurrency:
                        status = Status.IsDefaultCurrency;
                        return await Print();
                    case Status.Amount:
                        status = Status.IsCrypto;
                        return await Print();
                    case Status.Description:
                        status = Status.Amount;
                        return await Print();
                    case Status.Result:
                        status = Status.Description;
                        return await Print();
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            result = await IsHome(command);
            if (result != null)
                return result;

            switch (status)
            {
                case Status.IsCrypto:
                    if (command == "cmd btc")
                    {
                        isCrypto = true;
                        status = Status.Amount;
                        return await Print();
                    }

                    if (command == "cmd fiat")
                    {
                        isCrypto = false;
                        status = Status.IsDefaultCurrency;
                        return await Print();
                    }

                    break;
                case Status.IsDefaultCurrency:
                    if (command == "cmd yes")
                    {
                        currency = Enum.Parse<Catalog.Currencies>(Menu.Profile.DefaultCurrency);
                        status = Status.Amount;
                        return await Print();
                    }

                    if (command == "cmd no")
                    {
                        status = Status.SelectCurrency;
                        return await Print();
                    }

                    break;
                case Status.SelectCurrency:
                    var arr = command.Split(" ");
                    if (arr.Length != 2 || arr[0] != "cmd")
                        return await PrintError();
                    if (Enum.TryParse(arr[1], out Catalog.Currencies c))
                    {
                        currency = c;
                        status = Status.Amount;
                        return await Print();
                    }

                    return await PrintError();
                case Status.Amount:
                    break;
                case Status.Description:
                    if (command == "cmd skip")
                    {
                        description = "";
                        status = Status.Result;
                        return await Print();
                    }

                    break;
                case Status.Result:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return await Print();
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            switch (status)
            {
                case Status.IsCrypto:
                    break;
                case Status.IsDefaultCurrency:
                    break;
                case Status.SelectCurrency:
                    if (Enum.TryParse(message.Text, out Catalog.Currencies c))
                    {
                        currency = c;
                        status = Status.Amount;
                        return await Print();
                    }

                    break;
                case Status.Amount:
                    if (decimal.TryParse(message.Text, out decimal am))
                    {
                        amount = am;
                        status = Status.Description;
                        return await Print();
                    }

                    break;
                case Status.Description:
                    description = message.Text;
                    status = Status.Result;
                    return await Print();
                case Status.Result:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return await PrintError();
        }

        private Bitmap GetQrCode(string uri)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(uri, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);
            return qrCodeImage;
        }

        protected override async Task<List<Result>> Content()
        {
            switch (status)
            {
                case Status.IsCrypto:
                {
                    invoice = "";
                    string str = s.Get(Localization.LNReceive.Keys.IsCrypto);
                    var arr = new List<List<InlineKeyboardButton>>
                    {
                        new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNReceive.Keys.InBtc), "cmd btc"),
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNReceive.Keys.SelectFiat), "cmd fiat")
                        },
                        BackBtn.BackHome(this)
                    };
                    return new List<Result> {new Result(this, str, arr.ToKeyboard())};
                }
                case Status.IsDefaultCurrency:
                {
                    invoice = "";
                    string str = s.Get(Localization.LNReceive.Keys.DefaultCurrency, Currency.ToString());
                    var arr = new List<List<InlineKeyboardButton>>
                    {
                        new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNReceive.Keys.Yes), "cmd yes"),
                            InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNReceive.Keys.SelectCurrency), "cmd no")
                        },
                        BackBtn.BackHome(this)
                    };
                    return new List<Result> {new Result(this, str, arr.ToKeyboard())};
                }
                case Status.SelectCurrency:
                {
                    invoice = "";
                    string str = s.Get(Localization.LNReceive.Keys.ListCurrency);
                    var res = new List<Result>
                    {
                        new Result(this, str, InlineKeyboardMarkup.Empty())
                    };
                    res.AddRange(CurrencyBtnList.Get(this, true));
                    return res;
                }
                case Status.Amount:
                {
                    invoice = "";
                    string cur;
                    if (isCrypto)
                        cur = "BTC";
                    else
                        cur = currency.ToString();
                    string str = s.Get(Localization.LNReceive.Keys.Amount, cur);
                    return new List<Result>
                    {
                        new Result(this, str, BackBtn.BackHome(this).ToKeyboard())
                    };
                }
                case Status.Description:
                {
                    invoice = "";
                    string str = s.Get(Localization.LNReceive.Keys.Desc);
                    var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.LNReceive.Keys.Skip), "cmd skip");
                    return new List<Result>
                    {
                        new Result(this, str, new List<List<InlineKeyboardButton>>
                        {
                            new List<InlineKeyboardButton> {btn},
                            BackBtn.BackHome(this)
                        }.ToKeyboard())
                    };
                }
                case Status.Result:
                {
                    string str = s.Get(Localization.LNReceive.Keys.Result);
                    if (invoice.IsNullOrEmpty())
                    {
                        try
                        {
                            var vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
                            decimal am;
                            if (isCrypto)
                            {
                                am = amount;
                            }
                            else
                            {
                                var v = vars.Variables_.First(p => p.Key == $"AVG_{currency.ToString().ToUpper()}");
                                am = amount / v.Value.FromPb();
                            }

                            var resp = await Clients.TradeClient.LNDepositAsync(new LNDepositRequest
                            {
                                Amount = am.ToPb(),
                                Description = description,
                                ExpiresIn = 60

                            });
                            invoice = "lightning:" + resp.Invoice;
                            str += "\n" + invoice;
                        }
                        catch
                        {
                            return new List<Result> {new ErrorResult(this, "Internal error.")};
                        }
                    }

                    var qr = GetQrCode(invoice);
                    await using MemoryStream ms = new MemoryStream();
                    qr.Save(ms, ImageFormat.Png);
                    ms.Position = 0;
                    var photo = new Photo(ms.ToArray());

                    return new List<Result>
                    {
                        new Result(this, str, InlineKeyboardMarkup.Empty()),
                        new Result(this, "", BackBtn.BackHome(this).ToKeyboard(), photo)
                    };
                }
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Amount = amount,
                Currency = currency,
                Description = description,
                Id = Id,
                Invoice = invoice,
                IsCrypto = isCrypto,
                Status = status
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = (State) state;
            amount = st.Amount;
            currency = st.Currency;
            description = st.Description;
            invoice = st.Invoice;
            isCrypto = st.IsCrypto;
            status = st.Status;
            return Task.CompletedTask;
        }
    }
}