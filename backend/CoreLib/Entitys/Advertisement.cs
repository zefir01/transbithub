using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using CoreLib.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys
{
    public class AdData
    {
        public string Equation { get; set; }
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }
        public string Message { get; set; }
        public Catalog.Countries Country { get; set; }
        public Catalog.PaymentTypes PaymentType { get; set; }
        public Catalog.Currencies FiatCurrency { get; set; }
        public bool IsBuy { get; set; }
        public List<TimeTableItemData> TimeTable { get; set; }
        public bool MonitorLiquidity { get; set; }
        public bool NotAnonymous { get; set; }
        public bool Trusted { get; set; }
        public string Title { get; set; }
        public uint Window { get; set; }
        public bool IsEnabled { get; set; }
        public int? AutoPriceDelay { get; set; }
        public bool LnEnabled { get; set; }
        public bool LnDisableBalance { get; set; }
    }

    public class TimeTableItemData
    {
        public Days Day { get; set; }
        public byte Start { get; set; }
        public byte End { get; set; }
    }

    public enum Days
    {
        San,
        Mon,
        Tue,
        Wed,
        Thu,
        Fri,
        Sat
    }


    [Index(nameof(Day))]
    [Index(nameof(Start))]
    [Index(nameof(End))]
    public class TimeTableItem : Entity, ICloneable
    {
        public Days Day { get; private set; }
        public byte Start { get; private set; }
        public byte End { get; private set; }

        public TimeTableItem(DataDBContext db) : base(db)
        {
        }

        public TimeTableItem(Days day, byte start, byte end, DataDBContext db) : base(db)
        {
            Day = day;
            Start = start;
            End = end;
        }

        public object Clone()
        {
            return MemberwiseClone();
        }
    }

    [Index(nameof(AutoPriceDelay))]
    [Index(nameof(MinAmount))]
    [Index(nameof(MaxAmount))]
    [Index(nameof(Country))]
    [Index(nameof(PaymentType))]
    [Index(nameof(FiatCurrency))]
    [Index(nameof(IsBuy))]
    [Index(nameof(MonitorLiquidity))]
    [Index(nameof(NotAnonymous))]
    [Index(nameof(Trusted))]
    [Index(nameof(IsEnabled))]
    public partial class Advertisement : Entity
    {
        public bool IsDeleted { get; set; }
        public int? AutoPriceDelay { get; private set; }
        public string Equation { get; private set; }
        public decimal MinAmount { get; private set; }
        public decimal MaxAmount { get; private set; }

        public string Message { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public Catalog.Countries Country { get; private set; }
        public Catalog.PaymentTypes PaymentType { get; private set; }
        public Catalog.Currencies FiatCurrency { get; private set; }
        public bool IsBuy { get; private set; }
        [Required] public virtual UserData Owner { get; private set; }
        private List<TimeTableItem> _TimeTable = new List<TimeTableItem>();

        public virtual IReadOnlyList<TimeTableItem> TimeTable
        {
            get => _TimeTable;
            set => _TimeTable = value.ToList();
        }

        public bool MonitorLiquidity { get; private set; }
        public bool NotAnonymous { get; private set; }
        public bool Trusted { get; private set; }
        public string Title { get; private set; }
        public uint Window { get; private set; }
        public bool IsEnabled { get; private set; }
        public bool LnFunding { get; private set; }
        public bool LnDisableBalance { get; private set; }
        public virtual AdMetadata Metadata { get; private set; }

        public object Clone()
        {
            return MemberwiseClone();
        }


        public Advertisement(DataDBContext db) : base(db)
        {
        }


        public Advertisement(AdData data, DataDBContext db) : base(db)
        {
            if (data.MonitorLiquidity && data.MinAmount > data.MaxAmount)
                throw new UserException("Monitor liquidity enabled, but max amount not set or incorrect.");

            Owner = requester;
            Equation = data.Equation;
            MinAmount = data.MinAmount;
            MaxAmount = data.MaxAmount;
            Message = data.Message;
            Country = data.Country;
            PaymentType = data.PaymentType;
            FiatCurrency = data.FiatCurrency;
            IsBuy = data.IsBuy;
            IsEnabled = data.IsEnabled;
            MonitorLiquidity = data.MonitorLiquidity;
            NotAnonymous = data.NotAnonymous;
            Trusted = data.Trusted;
            Title = data.Title;
            Window = data.Window;
            Metadata = new AdMetadata(this, db);
            CreatedAt = DateTime.Now;
            AutoPriceDelay = data.AutoPriceDelay;
            LnFunding = data.LnEnabled;
            LnDisableBalance = data.LnDisableBalance;

            foreach (var i in data.TimeTable)
            {
                var ent = new TimeTableItem(i.Day, i.Start, i.End, db);
                _TimeTable.Add(ent);
            }

            if (AutoPriceDelay.HasValue && Owner.Options.AutoPrice > 0)
                Metadata.AutoPriceUpdate().ConfigureAwait(false).GetAwaiter().GetResult();
            else
                Metadata.Update(true).ConfigureAwait(false).GetAwaiter().GetResult();

            if (Metadata.MinCryptoAmount < Config.MinimalAmountBtc)
            {
                decimal minFiat = Math.Round(Config.MinimalAmountBtc * Metadata.Price, 2);
                throw new UserException(
                    $"Minimal deal limit must be greater or equal 0.000001BTC or {minFiat}{FiatCurrency}.");
            }
        }

        public async Task Modify([NotNull] AdData data)
        {
            Equation = data.Equation;
            MinAmount = data.MinAmount;
            MaxAmount = data.MaxAmount;
            Message = data.Message;
            Country = data.Country;
            PaymentType = data.PaymentType;
            FiatCurrency = data.FiatCurrency;
            IsBuy = data.IsBuy;
            IsEnabled = data.IsEnabled;
            MonitorLiquidity = data.MonitorLiquidity;
            NotAnonymous = data.NotAnonymous;
            Trusted = data.Trusted;
            Title = data.Title;
            Window = data.Window;
            AutoPriceDelay = data.AutoPriceDelay;
            LnFunding = data.LnEnabled;
            LnDisableBalance = data.LnDisableBalance;

            db.RemoveRange(TimeTable);
            _TimeTable = new List<TimeTableItem>();
            foreach (var i in data.TimeTable)
            {
                var ent = new TimeTableItem(i.Day, i.Start, i.End, db);
                _TimeTable.Add(ent);
            }

            if (AutoPriceDelay.HasValue && Owner.Options.AutoPrice > 0)
                Metadata.AutoPriceUpdate(true).ConfigureAwait(false).GetAwaiter().GetResult();
            else
                await Metadata.Update(true);

            db.Notify(new AdChangedNotification(this, source));
        }

        public async Task ChangeStatus(bool status)
        {
            IsEnabled = status;
            await Metadata.Update(false);
            db.Notify(new AdChangedNotification(this, source));
        }

        /// <summary>
        /// Buy to LN
        /// </summary>
        /// <param name="bolt11">LN invoice to withdraw, if deal complete</param>
        /// <param name="amount">If bolt11 invoice not contains amount, you must specify amount manually.</param>
        /// <returns>Created deal</returns>
        public async Task<Deal> CreateDealLnBuy(string bolt11, decimal? fiatAmount, decimal? cryptoAmount)
        {
            var (fAmount, crAmount) = bolt11.GetAmounts(fiatAmount, cryptoAmount, this, db.Config);
            return await CreateDeal(fAmount, crAmount, bolt11: bolt11);
        }

        public async Task<Deal> CreateDealLnSell(decimal? fiatAmount, decimal? cryptoAmount)
        {
            return await CreateDeal(fiatAmount, cryptoAmount, lnFunding: true);
        }

        /// <summary>
        /// Main deal creation method
        /// </summary>
        /// <param name="fiatAmount">amount in fiat</param>
        /// <param name="cryptoAmount">amount in BTC</param>
        /// <param name="wallet">For buy, wallet to withdraw BTC</param>
        /// <param name="payment">Attache deal to payment, to pay invoice by deal</param>
        /// <param name="promise">Sell promise</param>
        /// <param name="bolt11">LN invoice to withdraw BTC</param>
        /// <param name="lnFunding">Funding deal by initiator</param>
        /// <returns>Deal</returns>
        /// <exception cref="UserException"></exception>
        /// <exception cref="AlreadyCreatedException">Throws when initiator already have deal with this ad</exception>
        public async Task<Deal> CreateDeal(decimal? fiatAmount, decimal? cryptoAmount, string wallet = null,
            InvoicePayment payment = null, Promise promise = null, string bolt11 = null, bool lnFunding = false)
        {
            if (Metadata.Status != AdMetadata.AdStatus.Enabled)
                throw new UserException("Advertisement disabled.");
            if (requester.IsAnonymous && IsBuy && promise == null)
                throw new UserException("Anonymous user cant sell crypto currency.");
            if (Owner.BlockedUsers.Any(p => p.User == requester))
                throw new UserException("You cannot create this deal. You are blocked by ad owner.");
            if (Metadata.MaxAmount < fiatAmount)
                throw new UserException("Too much deal amount.");
            if (MinAmount > fiatAmount)
                throw new UserException("The deal amount is too small.");
            if (!fiatAmount.HasValue && !cryptoAmount.HasValue)
                throw new UserException("Amount required.");
            if (!wallet.IsNullOrEmpty() && (payment != null || promise != null))
                throw new UserException("Wallet cannot be specified with Payment or Promise");

            var d = db.User.DealsInitiator.FirstOrDefault(p => p.Ad.Id == Id && p.Status == DealStatus.Opened);
            if (d != null)
                throw new AlreadyCreatedException(d);


            Deal deal;
            if (lnFunding)
                deal = new Deal(this, fiatAmount, cryptoAmount, true, db);
            else if (!bolt11.IsNullOrEmpty())
                deal = new Deal(this, fiatAmount, cryptoAmount, null, db, bolt11: bolt11);
            else if (payment == null)
                deal = new Deal(this, fiatAmount, cryptoAmount, wallet, db, promise);
            else
                deal = new Deal(payment, this, fiatAmount, cryptoAmount, wallet, db);
            if (!wallet.IsNullOrEmpty())
            {
                var w = await db.BtcCoreWallets.FirstAsync();
                if (deal.CryptoAmount <= w.Fee)
                    throw new UserException($"The deal amount cannot be less than the bitcoin fee({w.Fee}).");
            }

            await deal.AdOwner.Balance.DealChanged(deal);
            await deal.Initiator.Balance.DealChanged(deal);
            deal.DealChanged();
            if (MonitorLiquidity)
                MaxAmount -= deal.FiatAmount;
            await Metadata.Update(false);
            return deal;
        }


        public async Task DealStatusChanged(Deal deal)
        {
            if (!MonitorLiquidity)
                return;
            if (deal.Status == DealStatus.Canceled)
                MaxAmount += deal.FiatAmount;
            await Metadata.Update(false);
        }
    }
}