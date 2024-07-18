using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;
using Enum = System.Enum;

namespace TelegramService.Model
{
    public class AdFilter : BaseMenu
    {
        public class State : StateBase
        {
            public Status Status { get; set; }
            public decimal? Amount { get; set; }
            public Catalog.Countries? Country { get; set; }
            public Catalog.Currencies? Currency { get; set; }
            public Catalog.PaymentTypes? PaymentType { get; set; }
            public ulong? InvoiceId { get; set; }
            public uint Pieces { get; set; }
            public bool IsBestDeal { get; set; }
        }

        public enum Status
        {
            Country,
            SelectCountry,
            SelectCountryList,
            FiatCurrency,
            SelectFiatCurrency,
            Amount,
            PaymentType,
            SelectPaymentType,
            Find
        }

        private Status status = Status.Country;
        private decimal? _amount;
        private Catalog.Countries? _country;
        private Catalog.Currencies? _currency;
        private Catalog.PaymentTypes? _paymentType;
        private bool hide;

        public override bool HideNavigation => hide;

        private decimal Amount
        {
            get => _amount ?? LastAdSearchParams.Amount.FromPb();
            set => _amount = value;
        }

        private Catalog.Countries Country
        {
            get => _country ?? Enum.Parse<Catalog.Countries>(LastAdSearchParams.Country);
            set => _country = value;
        }

        private new Catalog.Currencies Currency
        {
            get => _currency ?? Enum.Parse<Catalog.Currencies>(LastAdSearchParams.Currency);
            set => _currency = value;
        }

        private Catalog.PaymentTypes PaymentType
        {
            get => _paymentType ?? Enum.Parse<Catalog.PaymentTypes>(LastAdSearchParams.PaymentType);
            set => _paymentType = value;
        }

        private readonly ILogger logger;
        private bool isBuy;
        private Localization.AdFilter s;
        public AdList AdList { get; }
        private ulong? invoiceId;
        private uint pieces;
        private bool isBestDeal;
        private GetLastAdSearchParamsResponse lastAdSearchParams;

        private LastAdSearchParams LastAdSearchParams
        {
            get
            {
                if (lastAdSearchParams.LastBuySearchHasValue)
                    return lastAdSearchParams.LastBuySearch;
                return lastAdSearchParams.LastSellSearch;
            }
        }


        public override string Header
        {
            get
            {
                var str = isBuy ? s.Get(Localization.AdFilter.Keys.buy) : s.Get(Localization.AdFilter.Keys.sell);
                var str1 = isBuy ? s.Get(Localization.AdFilter.Keys.Buy) : s.Get(Localization.AdFilter.Keys.Sell);
                switch (status)
                {
                    case Status.Country:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement1, str1);
                    case Status.SelectCountry:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement1, str1);
                    case Status.FiatCurrency:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement2, str1, Catalog.CountriesNames[Country]);
                    case Status.SelectFiatCurrency:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement2, str1, Catalog.CountriesNames[Country]);
                    case Status.PaymentType:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement3, str1, Catalog.CountriesNames[Country],
                                   Currency.ToString());
                    case Status.SelectPaymentType:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement3, str1, Catalog.CountriesNames[Country],
                                   Currency.ToString());
                    case Status.Amount:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement4, str1, Catalog.CountriesNames[Country],
                                   Currency.ToString(), PaymentType.ToString());
                    case Status.Find:
                        return s.Get(Localization.AdFilter.Keys.Title, str) +
                               s.Get(Localization.AdFilter.Keys.Statement4, str1, Catalog.CountriesNames[Country],
                                   Currency.ToString(), PaymentType.ToString(),
                                   Amount.ToString(CultureInfo.InvariantCulture));
                }

                return s.Get(Localization.AdFilter.Keys.Title, str);
            }
        }

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                return status switch
                {
                    Status.Country => GetCommandsYesNo(),
                    Status.SelectCountry => GetCommandsSelectCountry(),
                    Status.SelectCountryList => GetCommandsSelectCountryList(),
                    Status.FiatCurrency => GetCommandsYesNo(),
                    Status.SelectFiatCurrency => GetCommandsSelectFiatCurrency(),
                    Status.PaymentType => GetCommandsYesNo(),
                    Status.SelectPaymentType => GetCommandsSelectPaymentType(),
                    Status.Amount => new List<Command>(),
                    _ => new List<Command>(),
                };
            }
        }

        private List<ICommand> GetCommandsYesNo()
        {
            return new List<ICommand>
            {
                new Command(s.Get(Localization.AdFilter.Keys.Yes), 1),
                new Command(s.Get(Localization.AdFilter.Keys.No), 2)
            };
        }

        private List<ICommand> GetCommandsSelectCountry()
        {
            return new List<ICommand>
            {
                new Command(s.Get(Localization.AdFilter.Keys.CountryList), 2)
            };
        }

        private List<ICommand> GetCommandsSelectCountryList()
        {
            List<ICommand> cmds = new List<ICommand>();
            int i = 0;
            foreach (var pair in Catalog.CountriesNames.OrderBy(p => p.Value))
            {
                cmds.Add(new Command<Catalog.Countries>(pair.Value, i, pair.Key));
                i++;
            }

            return cmds;
        }

        private List<ICommand> GetCommandsSelectFiatCurrency()
        {
            List<ICommand> cmds = new List<ICommand>();
            for (int i = 0; i < Catalog.CurrenciesList.Count; i++)
            {
                Enum.TryParse(Catalog.CurrenciesList[i], out Catalog.Currencies c);
                cmds.Add(new Command<Catalog.Currencies>(Catalog.CurrenciesList[i], i, c));
            }

            return cmds;
        }

        private List<ICommand> GetCommandsSelectPaymentType()
        {
            List<ICommand> cmds = new List<ICommand>();
            for (int i = 0; i < Catalog.PaymentTypesList.Count; i++)
            {
                Enum.TryParse(Catalog.PaymentTypesList[i], out Catalog.PaymentTypes c);
                cmds.Add(new Command<Catalog.PaymentTypes>(Catalog.PaymentTypesList[i], i, c));
            }

            return cmds;
        }

        public override async AsyncResult OnStart()
        {
            await GetLastAdSearch();
            return await GoCountry();
        }

        private async AsyncResult GoCountry()
        {
            status = Status.Country;
            return await Print(
                s.Get(Localization.AdFilter.Keys.CountryQ,
                    s.Get(isBuy ? Localization.AdFilter.Keys.Buy : Localization.AdFilter.Keys.Sell),
                    Catalog.CountriesNames[Country]));
        }

        private async AsyncResult GoSelectCountry()
        {
            status = Status.SelectCountry;
            return await Print(s.Get(Localization.AdFilter.Keys.CountryEnterMethod));
        }

        private async AsyncResult GoSelectCountryList()
        {
            status = Status.SelectCountryList;
            return await Print(s.Get(Localization.AdFilter.Keys.SelectCountryList));
        }

        private async AsyncResult GoFiatCurrency()
        {
            status = Status.FiatCurrency;
            return await Print(s.Get(Localization.AdFilter.Keys.CurrencyQ, Currency.ToString()));
        }

        private async AsyncResult GoSelectFiatCurrency()
        {
            status = Status.SelectFiatCurrency;
            return await Print(s.Get(Localization.AdFilter.Keys.SelectFiatCurrencyList));
        }

        private async AsyncResult GoAmount()
        {
            if (!invoiceId.HasValue)
            {
                status = Status.Amount;
                return await Print(s.Get(Localization.AdFilter.Keys.EnterAmount));
            }

            return await GoFind();
        }

        private async Task<List<Result>> GoPaymentType()
        {
            status = Status.PaymentType;
            return await Print(s.Get(Localization.AdFilter.Keys.PaymentTypeQ, PaymentType.ToString()));
        }

        private async AsyncResult GoSelectPaymentType()
        {
            status = Status.SelectPaymentType;
            return await Print(s.Get(Localization.AdFilter.Keys.PaymentTypeList));
        }

        private async AsyncResult GoFind()
        {
            status = Status.Find;
            AdList.SetInvoiceId(invoiceId, pieces);

            if (invoiceId.HasValue && isBestDeal)
            {
                var resp = await Clients.TradeClient.PayInvoiceByBestDealAsync(new PayInvoiceByBestDealRequest
                {
                    Country = Country.ToString(),
                    Currency = Currency.ToString(),
                    InvoiceId = invoiceId.Value,
                    PaymentType = PaymentType.ToString(),
                    Pieces = pieces
                });
                var view = ((Main) Root).MyDeals.DealsList.DealView;
                await view.SetDeal(resp.Deal);
                return await view.Print();
            }

            AdList.SetFilter(isBuy, Country, Amount, Currency, PaymentType);
            _amount = null;
            _country = null;
            _currency = null;
            _paymentType = null;
            return await AdList.Print();
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            switch (status)
            {
                case Status.Country:
                    if (command.Id == 1)
                    {
                        return await GoFiatCurrency();
                    }
                    else
                        return await GoSelectCountry();
                case Status.SelectCountry:
                {
                    return await GoSelectCountryList();
                }
                case Status.SelectCountryList:
                {
                    Command<Catalog.Countries> cmd = command as Command<Catalog.Countries>;
                    Country = cmd.Payload;
                    Currency = Catalog.CountryCurrency[Country];
                    return await GoFiatCurrency();
                }
                case Status.FiatCurrency:
                    if (command.Id == 1)
                    {
                        return await GoPaymentType();
                    }
                    else
                        return await GoSelectFiatCurrency();
                case Status.SelectFiatCurrency:
                {
                    Command<Catalog.Currencies> cmd = command as Command<Catalog.Currencies>;
                    Currency = cmd.Payload;
                    return await GoPaymentType();
                }
                case Status.PaymentType:
                    if (command.Id == 1)
                    {
                        return await GoAmount();
                    }
                    else
                        return await GoSelectPaymentType();
                case Status.SelectPaymentType:
                {
                    Command<Catalog.PaymentTypes> cmd = command as Command<Catalog.PaymentTypes>;
                    PaymentType = cmd.Payload;
                    return await GoAmount();
                }
            }

            return null;
        }

        public override async Task<List<Result>> NewMessage(Message message)
        {
            switch (status)
            {
                case Status.Amount:
                    if (message.Type != MessageType.Text)
                        return await PrintError();
                    string text = message.Text;
                    var isParsed = decimal.TryParse(text, out decimal am);
                    if (!isParsed)
                        return await PrintError(s.Get(Localization.AdFilter.Keys.InvalidAmount));
                    Amount = am;
                    Amount = Convert.ToDecimal(Math.Round(Amount, 2));
                    return await GoFind();
                default:
                    return await PrintError(s.Get(Localization.AdFilter.Keys.InvalidCommand));
            }
        }

        protected override Task OnBack()
        {
            status = Status.Country;
            return Task.CompletedTask;
        }

        public AdFilter(BaseMenu parent, bool isBuy, ILogger logger, IConfig config, bool hide) : base(
            parent)
        {
            this.isBuy = isBuy;
            this.logger = logger;
            this.hide = hide;

            s = new Localization.AdFilter(Menu);
            AdList = new AdList(this);
            GetLastAdSearch().ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public void SetInvoice(ulong? invoiceId, uint pieces, bool isBestDeal)
        {
            this.invoiceId = invoiceId;
            this.pieces = pieces;
            this.isBestDeal = isBestDeal;
        }

        public override string Name =>
            isBuy ? s.Get(Localization.AdFilter.Keys.Buy) : s.Get(Localization.AdFilter.Keys.Sell);

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Country = Country,
                Currency = Currency,
                PaymentType = PaymentType,
                Amount = Amount,
                Status = status,
                InvoiceId = invoiceId,
                Pieces = pieces,
                IsBestDeal = isBestDeal
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = (State) state;
            Country = st.Country ?? Enum.Parse<Catalog.Countries>(LastAdSearchParams.Country);
            Currency = st.Currency ?? Enum.Parse<Catalog.Currencies>(LastAdSearchParams.Currency);
            PaymentType = st.PaymentType ?? Enum.Parse<Catalog.PaymentTypes>(LastAdSearchParams.PaymentType);
            Amount = st.Amount ?? LastAdSearchParams.Amount.FromPb();
            status = st.Status;
            invoiceId = st.InvoiceId;
            pieces = st.Pieces;
            isBestDeal = st.IsBestDeal;
            return Task.CompletedTask;
        }

        private async Task GetLastAdSearch()
        {
            lastAdSearchParams = await Clients.TradeClient.GetLastAdSearchParamsAsync(new Empty());
        }
    }
}