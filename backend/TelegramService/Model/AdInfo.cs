using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreLib.Services;
using Humanizer;
using Humanizer.Localisation;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using AsyncResult= System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class AdInfo : BaseMenu
    {
        public class State : StateBase
        {
            public ulong? AdId { get; set; }
            public decimal Amount { get; set; }
            public ulong? InvoiceId { get; set; }
            public uint Pieces { get; set; }
        }

        private Advertisement ad;
        private decimal amount;
        private Localization.AdInfo s;
        private readonly Deal dealView;
        private ulong? invoiceId;
        private uint pieces;
        private Invoice invoice;
        private readonly UserInfo userInfo;

        public override string Name =>
            ad.IsBuy
                ? s.Get(Localization.AdInfo.Keys.NameSell) + ad.Id
                : s.Get(Localization.AdInfo.Keys.NameBuy) + ad.Id;

        protected override IReadOnlyList<ICommand> Commands
        {
            get
            {
                if (ad != null && ad.Owner.Id != Menu.UserId && ad.IsEnabled)
                {
                    if (!invoiceId.HasValue)
                    {
                        if (amount >= ad.MinAmount.FromPb() && amount <= ad.MaxAmountCalculated.FromPb())
                        {
                            if (ad.IsBuy)
                                return new List<ICommand>
                                {
                                    new Command(s.Get(Localization.AdInfo.Keys.Sell), 0),
                                    new Command(s.Get(Localization.AdInfo.Keys.Partner), 1)
                                };
                            return new List<ICommand>
                            {
                                new Command(s.Get(Localization.AdInfo.Keys.Buy), 0),
                                new Command(s.Get(Localization.AdInfo.Keys.Partner), 1)
                            };
                        }
                    }
                    else
                    {
                        return new List<ICommand>
                        {
                            new Command(s.Get(Localization.AdInfo.Keys.Buy), 0),
                            new Command(s.Get(Localization.AdInfo.Keys.Partner), 1)
                        };
                    }
                }

                return new List<ICommand>();
            }
        }

        public override string Header
        {
            get
            {
                string msg;
                if (ad != null)
                {
                    string type = ad.IsBuy
                        ? s.Get(Localization.AdInfo.Keys.NameSell)
                        : s.Get(Localization.AdInfo.Keys.NameBuy);
                    string partner = ad.IsBuy
                        ? s.Get(Localization.AdInfo.Keys.Buyer)
                        : s.Get(Localization.AdInfo.Keys.Seller);
                    string window = TimeSpan.FromMinutes(ad.Window)
                        .Humanize(precision: 3, culture: CultureInfo, minUnit: TimeUnit.Minute);
                    msg =
                        s.Get(Localization.AdInfo.Keys.Statement, type,
                            ad.PaymentType, ad.Title, ad.FiatCurrency) +
                        $"<b>{s.Get(Localization.AdInfo.Keys.Price)}</b> {ad.Price.FromPb()} {ad.FiatCurrency}/BTC\n" +
                        $"<b>{s.Get(Localization.AdInfo.Keys.PaymentType)}</b> {ad.PaymentType}\n" +
                        $"<b>{partner}</b> {ad.Owner.Username} {s.Get(Localization.AdInfo.Keys.Rate)} {ad.Owner.ResponseRate.FromPb()}%\n" +
                        $"<b>{s.Get(Localization.AdInfo.Keys.Limits)}</b> {ad.MinAmount.FromPb()}-{ad.MaxAmountCalculated.FromPb()} {ad.FiatCurrency}\n" +
                        $"<b>{s.Get(Localization.AdInfo.Keys.Location)}</b> {Catalog.CountriesNames[Enum.Parse<Catalog.Countries>(ad.Country)]}\n" +
                        $"<b>{s.Get(Localization.AdInfo.Keys.Window)}</b> {window}\n" +
                        $"<b>{s.Get(Localization.AdInfo.Keys.Terms)}</b> {ad.Message}\n";
                    if (!invoiceId.HasValue)
                    {
                        msg +=
                            $"<b>{s.Get(Localization.AdInfo.Keys.Amount)}</b> {Math.Round(amount, 2)} {ad.FiatCurrency} / {Math.Round(amount / ad.Price.FromPb(), 9)} BTC\n" +
                            $"{s.Get(Localization.AdInfo.Keys.Info)}\n";
                    }
                    else
                    {
                        decimal amCrypto = invoice.CurrentCryptoPrice.FromPb() * pieces;
                        decimal am = Math.Round(amCrypto * ad.Price.FromPb(), 2);
                        msg +=
                            $"<b>{s.Get(Localization.AdInfo.Keys.Amount)}</b> {am} {ad.FiatCurrency} / {amCrypto} BTC\n";
                    }

                    if (ad.Owner.Id == Menu.UserId)
                        msg += $"<code>{s.Get(Localization.AdInfo.Keys.Error1)}</code>\n";
                    if (!ad.IsEnabled)
                        msg += $"<code>{s.Get(Localization.AdInfo.Keys.Error2)}</code>\n";
                    if (!invoiceId.HasValue)
                    {
                        if (amount > ad.MaxAmountCalculated.FromPb())
                            msg += $"<code>{s.Get(Localization.AdInfo.Keys.Error3)}</code>\n";
                        if (amount < ad.MinAmount.FromPb())
                            msg += $"<code>{s.Get(Localization.AdInfo.Keys.Error4)}</code>\n";
                    }
                }
                else
                    msg = $"<code>{s.Get(Localization.AdInfo.Keys.Error5)}</code>\n";

                return msg;
            }
        }

        public AdInfo(BaseMenu parent) : base(parent)
        {
            s = new Localization.AdInfo(Menu);
            dealView = new Deal(this);
            userInfo = new UserInfo(this);
        }

        public override bool HideNavigation => true;

        public void SetAd(Advertisement ad, decimal amount)
        {
            this.ad = ad;
            this.amount = amount;
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Amount = amount,
                AdId = ad?.Id,
                InvoiceId = invoiceId,
                Pieces = pieces
            });
        }

        public override async Task SetState(StateBase state)
        {
            State s = state as State;
            // ReSharper disable once PossibleNullReferenceException
            amount = s.Amount;
            if (!s.AdId.HasValue)
                return;
            ad = await GetAd(s.AdId.Value);
            invoiceId = s.InvoiceId;
            pieces = s.Pieces;
            invoice = await GetInvoice(s.InvoiceId);
        }

        public async Task SetAdId(ulong id)
        {
            amount = 0;
            ad = await GetAd(id);
        }
        public async Task SetAdId(ulong id, decimal amount)
        {
            this.amount = amount;
            ad = await GetAd(id);
        }

        private async Task<Advertisement> GetAd(ulong id)
        {
            var resp=await Clients.TradeClient.GetAdvertisementsByIdAsync(new GetAdvertisementsByIdRequest
            {
                Id = id
            });
            return resp;
        }

        public override async AsyncResult NewMessage(Message message)
        {
            ad = await GetAd(ad.Id);
            if (message.Type != MessageType.Text)
                return await PrintError();
            if (!invoiceId.HasValue)
            {
                if (!decimal.TryParse(message.Text, out decimal val))
                    return await PrintError(s.Get(Localization.AdInfo.Keys.Error6));
                amount = val;
                return await Print();
            }

            return await PrintError();
        }

        protected override async AsyncResult NewCommand(ICommand command)
        {
            if (command.Id == 1)
            {
                await userInfo.SetUser(ad.Owner.Id);
                return await userInfo.Print();
            }
            if (command.Id != 0)
                return await PrintError();

            if (!invoiceId.HasValue)
            {
                var deal = await Clients.TradeClient.CreateDealAsync(new CreateDealRequest
                {
                    AdvertisementId = ad.Id,
                    BtcWallet = "",
                    BuyPromise = false,
                    CryptoAmount = 0m.ToPb(),
                    FiatAmount = amount.ToPb(),
                    PromisePassword = "",
                    SellPromise = ""
                });
                await dealView.SetDeal(deal);
                return await dealView.Print();
            }

            var resp = await Clients.TradeClient.PayInvoiceByDealAsync(new PayInvoiceByDealRequest
            {
                AdvertisementId = ad.Id,
                InvoiceId = invoiceId.Value,
                Pieces = pieces
            });
            await dealView.SetDeal(resp.Deal);
            return await dealView.Print();
        }

        public async Task SetInvoiceId(ulong? invoiceId, uint pieces)
        {
            this.invoiceId = invoiceId;
            this.pieces = pieces;
            invoice = invoiceId.HasValue ? await GetInvoice(invoiceId.Value) : null;
        }

        private async Task<Invoice> GetInvoice(ulong? invoiceId)
        {
            if (!invoiceId.HasValue)
                return null;
            var resp = await Clients.TradeClient.GetInvoiceByIdAsync(new GetInvoiceByIdRequest
            {
                InvoiceId = invoiceId.Value
            });
            return resp.Invoices[0];
        }
    }
}