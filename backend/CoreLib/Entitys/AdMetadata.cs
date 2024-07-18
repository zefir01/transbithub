using System;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    public partial class Advertisement
    {
        [Owned]
        [Index(nameof(Status))]
        [Index(nameof(MaxAmount))]
        [Index(nameof(Price))]
        [Index(nameof(MinCryptoAmount))]
        [Index(nameof(MaxCryptoAmount))]
        [Index(nameof(AutoPriceUpdateTime))]
        public class AdMetadata : EntityWithoutKey, ICloneable
        {
            public enum AdStatus
            {
                Enabled,
                DisabledByOwner,
                NotEnoughMoney,
                GlobalDisabled,
                DisabledByTimetable
            }

            /*
            public AdMetadata(Advertisement advertisement, DataDBContext db) : base(db)
            {
                Advertisement = advertisement;
                Update(true).ConfigureAwait(false);
            }
    */
            public AdMetadata(DataDBContext db) : base(db)
            {
            }

            public AdStatus Status { get; private set; }
            public decimal MaxAmount { get; private set; }
            public decimal Price { get; private set; }
            public virtual Advertisement Advertisement { get; private set; }

            public decimal MinCryptoAmount { get; private set; }
            public decimal MaxCryptoAmount { get; private set; }
            public DateTime? AutoPriceUpdateTime { get; private set; }

            public AdMetadata(Advertisement ad, DataDBContext db) : base(db)
            {
                Advertisement = ad;
            }

            public object Clone()
            {
                return MemberwiseClone();
            }

            public AdStatus CalcIsEnabled()
            {
                if (!Advertisement.IsBuy && Advertisement.MinAmount > MaxAmount && !Advertisement.LnFunding)
                    return AdStatus.NotEnoughMoney;
                if (Advertisement.IsBuy && Advertisement.Owner.BuysDisabled)
                    return AdStatus.GlobalDisabled;
                if (!Advertisement.IsBuy && Advertisement.Owner.SalesDisabled)
                    return AdStatus.GlobalDisabled;
                if (!Advertisement.IsEnabled)
                    return AdStatus.DisabledByOwner;
                if (Advertisement.MonitorLiquidity && Advertisement.MinAmount > MaxAmount)
                    return AdStatus.NotEnoughMoney;


                if (Advertisement.TimeTable != null && Advertisement.TimeTable.Any() && Advertisement.IsEnabled)
                {
                    var time = DateTime.Now;
                    var day = (int) DateTime.Now.DayOfWeek;
                    var tbl = Advertisement.TimeTable.FirstOrDefault(p => (int) p.Day == day);
                    if (tbl == null)
                        return AdStatus.DisabledByTimetable;

                    var interval = (int) Math.Round(time.TimeOfDay.TotalMinutes) / 15;
                    if (tbl.Start > interval || tbl.End < interval)
                        return AdStatus.DisabledByTimetable;
                }


                return AdStatus.Enabled;
            }

            public async Task Update(bool isCalc)
            {
                if (isCalc)
                {
                    Price = await calculator.Calc(Advertisement.Equation);
                    MinCryptoAmount = Math.Round(Advertisement.MinAmount / Price, 8);
                }

                if (!Advertisement.IsBuy && !Advertisement.LnFunding)
                {
                    var b = Advertisement.Owner.Balance;
                    var balance = Math.Round(b.Balance * Price, 2);
                    var availableBalance = Math.Round(balance * (1 - Config.DealFee), 2);
                    if (Advertisement.MaxAmount == 0)
                        MaxAmount = availableBalance;
                    else
                        MaxAmount = Advertisement.MaxAmount <= availableBalance
                            ? Advertisement.MaxAmount
                            : availableBalance;
                }
                else
                {
                    MaxAmount = Advertisement.MaxAmount;
                }

                if (MaxAmount == 0 && Advertisement.IsBuy)
                    MaxCryptoAmount = decimal.MaxValue;
                else
                    MaxCryptoAmount = Math.Round(MaxAmount / Price, 8);

                Status = CalcIsEnabled();

                if (Advertisement.AutoPriceDelay.HasValue)
                    AutoPriceUpdateTime = DateTime.Now.AddSeconds(Advertisement.AutoPriceDelay.Value);
            }

            private static readonly Func<DataDBContext, Advertisement, IQueryable<decimal>> nearestPriceBuy =
                (db, thisAd) => (from ad in db.Advertisements
                        where ad.Metadata.Status == AdStatus.Enabled
                              && ad.Id != thisAd.Id
                              && ad.IsBuy == thisAd.IsBuy
                              && ad.Metadata.Price < thisAd.Metadata.Price - 0.01m
                              && ad.Country == thisAd.Country
                              && ad.FiatCurrency == thisAd.FiatCurrency
                              && ad.PaymentType == thisAd.PaymentType
                              && ad.Metadata.Status == AdStatus.Enabled
                              && (ad.Metadata.MaxAmount >= thisAd.MinAmount &&
                                  ad.Metadata.MaxAmount <= thisAd.Metadata.MaxAmount
                                  || ad.MinAmount >= thisAd.MinAmount && ad.MinAmount <= thisAd.Metadata.MaxAmount
                                  || ad.MinAmount <= thisAd.MinAmount &&
                                  ad.Metadata.MaxAmount >= thisAd.Metadata.MaxAmount)
                        orderby ad.Metadata.Price descending
                        select ad.Metadata.Price
                    ).Take(1);

            private static readonly Func<DataDBContext, Advertisement, IQueryable<decimal>> nearestPriceSell =
                (db, thisAd) => (from ad in db.Advertisements
                        where ad.Metadata.Status == AdStatus.Enabled
                              && ad.Id != thisAd.Id
                              && ad.IsBuy == thisAd.IsBuy
                              && ad.Metadata.Price > thisAd.Metadata.Price + 0.01m
                              && ad.Country == thisAd.Country
                              && ad.FiatCurrency == thisAd.FiatCurrency
                              && ad.PaymentType == thisAd.PaymentType
                              && ad.Metadata.Status == AdStatus.Enabled
                              && (ad.Metadata.MaxAmount >= thisAd.MinAmount &&
                                  ad.Metadata.MaxAmount <= thisAd.Metadata.MaxAmount
                                  || ad.MinAmount >= thisAd.MinAmount && ad.MinAmount <= thisAd.Metadata.MaxAmount
                                  || ad.MinAmount <= thisAd.MinAmount &&
                                  ad.Metadata.MaxAmount >= thisAd.Metadata.MaxAmount)
                        orderby ad.Metadata.Price
                        select ad.Metadata.Price
                    ).Take(1);

            public async Task AutoPriceUpdate(bool force = false)
            {
                if (!Advertisement.AutoPriceDelay.HasValue)
                    throw new Exception();
                if (!force && AutoPriceUpdateTime.HasValue && AutoPriceUpdateTime > DateTime.Now)
                    throw new Exception();
                Advertisement.Owner.Options.OnAutoPriceRecalc();
                await Update(true);
                if (Status != AdStatus.Enabled)
                    return;
                decimal nearest;
                if (Advertisement.IsBuy)
                {
                    nearest = await nearestPriceBuy(db, Advertisement).FirstOrDefaultAsync();
                    if (nearest != default)
                        Price = nearest + 0.01m;
                }
                else
                {
                    nearest = await nearestPriceSell(db, Advertisement).FirstOrDefaultAsync();
                    if (nearest != default)
                        Price = nearest - 0.01m;
                }

                await Update(false);
                db.Notify(new AdChangedNotification(Advertisement, source));
                AutoPriceUpdateTime = DateTime.Now.AddSeconds(Advertisement.AutoPriceDelay.Value);
            }
        }
    }
}