using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class AdList : BaseMenu
    {
        public class State : StateBase
        {
            public Catalog.Countries Country { get; set; }
            public decimal Amount { get; set; }
            public Catalog.Currencies Currency { get; set; }
            public Catalog.PaymentTypes PaymentType { get; set; }
            public bool IsBuy { get; set; }
            public ulong? InvoiceId { get; set; }
            public uint Pieces { get; set; }
        }

        private Catalog.Countries country;
        private decimal amount;
        private Catalog.Currencies currency;
        private Catalog.PaymentTypes paymentType;
        private bool isBuy;
        private IList<Protos.TradeApi.V1.Advertisement> ads;
        private int pageSize = 30;
        private int page = 0;
        private Localization.AdList s;
        public AdInfo AdInfo { get; }
        private UserInfo userInfo;
        private ulong? invoiceId;
        private uint pieces;

        public AdList(BaseMenu parent) : base(parent)
        {
            s = new Localization.AdList(Menu);
            AdInfo = new AdInfo(this);
            userInfo = new UserInfo(this);
        }

        public override bool HideNavigation => true;

        public override string Name => s.Get(Localization.AdList.Keys.Name);

        public void SetFilter(bool isBuy, Catalog.Countries country, decimal amount, Catalog.Currencies currency,
            Catalog.PaymentTypes paymentType)
        {
            this.isBuy = isBuy;
            this.amount = amount;
            this.country = country;
            this.currency = currency;
            this.paymentType = paymentType;
        }

        public void SetInvoiceId(ulong? invoiceId, uint pieces)
        {
            this.invoiceId = invoiceId;
            this.pieces = pieces;
        }

        private async Task GetAds()
        {
            if (!invoiceId.HasValue)
            {
                var resp = await Clients.TradeClient.FindAdvertisementsAsync(new FindAdvertisementsRequest
                {
                    Country = country.ToString(),
                    CryptoAmount = 0m.ToPb(),
                    Currency = currency.ToString(),
                    FiatAmount = amount.ToPb(),
                    IsBuy = !isBuy,
                    PaymentType = paymentType.ToString(),
                    Skip = (uint) (page * pageSize),
                    Take = (uint) pageSize,
                    UserId = ""
                });
                ads = resp.Advertisements;
            }
            else
            {
                var resp = await Clients.TradeClient.GetInvoiceSuitableAdvertisementsAsync(
                    new GetInvoiceSuitableAdvertisementsRequest
                    {
                        Count = (uint) ((page + 1) * pageSize),
                        Country = country.ToString(),
                        Currency = currency.ToString(),
                        InvoiceId = invoiceId.Value,
                        PaymentType = paymentType.ToString(),
                        Pieces = pieces,
                        Skip = (uint) (page * pageSize)
                    });
                ads = resp.Advertisements;
            }
        }

        public override async AsyncResult OnStart()
        {
            await GetAds();
            return await Print();
        }

        protected override AsyncResult Content()
        {
            if (ads == null)
                return Task.FromResult(new List<Result>());
            var t = ads.Select(CreateAdMessage).ToList();
            t.Add(Footer());
            return Task.FromResult(t);
        }

        private Result CreateAdMessage(Protos.TradeApi.V1.Advertisement ad)
        {
            string partner = ad.IsBuy ? s.Get(Localization.AdList.Keys.Buyer) : s.Get(Localization.AdList.Keys.Seller);
            string action = ad.IsBuy ? s.Get(Localization.AdList.Keys.Sell) : s.Get(Localization.AdList.Keys.Buy);
            string msg =
                $"<b>{partner}:</b> {ad.Owner.Username} {s.Get(Localization.AdList.Keys.Rate)} {ad.Owner.ResponseRate.FromPb()}%\n" +
                $"<b>{s.Get(Localization.AdList.Keys.Price)}</b> {ad.Price.FromPb()} {ad.FiatCurrency}/BTC\n" +
                $"<b>{s.Get(Localization.AdList.Keys.Limits)}</b> {ad.MinAmount.FromPb()}-{ad.MaxAmountCalculated.FromPb()} {ad.FiatCurrency}\n" +
                $"{ad.Title}";
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            var btn = InlineKeyboardButton.WithCallbackData(action, $"cmd ad {ad.Id}");
            var btn1 = InlineKeyboardButton.WithCallbackData(partner, $"cmd user {ad.Owner.Id}");
            arr.Add(new List<InlineKeyboardButton>
                {
                    btn, btn1
                }
            );
            var keyboard = new InlineKeyboardMarkup(arr);
            var res = new Result(this, msg, keyboard);
            return res;
        }

        private Result Footer()
        {
            string msg = $"{s.Get(Localization.AdList.Keys.Name)} {page * pageSize}-{ads.Count + pageSize * page}";
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            var a1 = BackBtn.BackHome(this);
            arr.Add(a1);
            if (ads.Count == pageSize)
            {
                var btn = InlineKeyboardButton.WithCallbackData(s.Get(Localization.AdList.Keys.NextPage), "cmd next");
                a1.Add(btn);
            }

            var keyboard = new InlineKeyboardMarkup(arr);
            var res = new Result(this, msg, keyboard);
            return res;
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

            var arr = command.Split(" ");
            if (arr[0] == "cmd")
            {
                if (arr[1] == "ad")
                {
                    ulong id = ulong.Parse(arr[2]);
                    var ad = ads.First(p => p.Id == id);
                    AdInfo.SetAd(ad, amount);
                    await AdInfo.SetInvoiceId(invoiceId, pieces);
                    return await AdInfo.Print();
                }

                if (arr[1] == "user")
                {
                    string id = arr[2];
                    await userInfo.SetUser(id);
                    return await userInfo.Print();
                }
            }
            else
            {
                return await PrintError();
            }

            return await PrintError();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Country = country,
                IsBuy = isBuy,
                Amount = amount,
                Currency = currency,
                PaymentType = paymentType,
                InvoiceId = invoiceId,
                Pieces = pieces
            });
        }

        public override async Task SetState(StateBase state)
        {
            var s = state as State;
            country = s.Country;
            isBuy = s.IsBuy;
            amount = s.Amount;
            currency = s.Currency;
            paymentType = s.PaymentType;
            invoiceId = s.InvoiceId;
            pieces = s.Pieces;
            await GetAds();
        }
    }
}