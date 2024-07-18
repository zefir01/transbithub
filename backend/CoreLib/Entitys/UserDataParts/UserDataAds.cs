using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Services;
using CoreLib.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class UserDataAds
        {
            public virtual UserData User { get; private set; }
            private DataDBContext db;

            private static readonly Func<DataDBContext, UserData, long, IQueryable<Advertisement>> byId =
                (db, user, id) => from ads in db.Advertisements
                        .Include<Advertisement, UserData>(p => p.Owner)
                        .Include(p => p.Metadata)
                        .Include(p => p.TimeTable)
                    where ads.Id == id
                          && ads.Metadata.Status == Advertisement.AdMetadata.AdStatus.Enabled
                          && (user == null || !user.IsAnonymous || !ads.NotAnonymous)
                          && !ads.IsDeleted
                    select new
                    {
                        ad = ads,
                        blocked = from bl in ads.Owner.BlockedUsers where bl.User == user select 1,
                        trusted = from tl in ads.Owner.TrustedUsers where tl.User == user select 1,
                    }
                    into exp
                    where !Enumerable.Any<int>(exp.blocked)
                          && (!exp.ad.Trusted || exp.ad.Trusted && Enumerable.Any<int>(exp.trusted))
                    select exp.ad;

            public UserDataAds(UserData user, DataDBContext db)
            {
                User = user;
                this.db = db;
            }

            public UserDataAds(DataDBContext db)
            {
                this.db = db;
            }

            public async Task<Advertisement> GetAdById(long id)
            {
                var ads = byId.Invoke(db, User, id);
                var ad = await ads.FirstOrDefaultAsync(db.CancellationToken);
                if (ad == null)
                    throw new UserException("Advertisement not found.");
                return ad;
            }

            public Advertisement CreateAd(AdData adData)
            {
                var count = User.Advertisements.Count(p => !p.IsDeleted);
                if (count >= 100)
                    throw new UserException("You can create maximum 100 advertisements.");
                var ad = new Advertisement(adData, User.db);
                User._Advertisements.Add(ad);
                return ad;
            }

            public async Task ChangeAllAdStatus(bool salesDisabled, bool buysDisabled)
            {
                if (User.BuysDisabled != buysDisabled)
                {
                    User.BuysDisabled = buysDisabled;
                    var ads = User.Advertisements.Where(p => p.IsBuy && !p.IsDeleted);
                    foreach (var ad in ads)
                        await ad.Metadata.Update(false);
                }

                if (User.SalesDisabled != salesDisabled)
                {
                    User.SalesDisabled = salesDisabled;
                    var ads = User.Advertisements.Where(p => !p.IsBuy && !p.IsDeleted);
                    foreach (var ad in ads)
                        await ad.Metadata.Update(false);
                }
            }

            public void RemoveAd(long adId)
            {
                var ad = User.Advertisements.FirstOrDefault(p => p.Id == adId && !p.IsDeleted);
                if (ad == null)
                    throw new UserException("Ad not found.");
                ad.IsDeleted = true;
                db.Notify(new AdDeletedNotification(ad.Id, db.SourceType));
            }

            public void RemoveAd(Advertisement ad)
            {
                User._Advertisements.Remove(ad);
                db.Notify(new AdDeletedNotification(ad.Id, db.SourceType));
            }

            public async Task<Advertisement> ChangeStatus(long adId, bool status)
            {
                var ad = User.Advertisements.FirstOrDefault(p => p.Id == adId && !p.IsDeleted);
                if (ad == null)
                    throw new UserException("Ad not found.");
                await ad.ChangeStatus(status);
                return ad;
            }

            private static readonly Func<DataDBContext, UserData, decimal?, decimal?, bool, Catalog.Countries,
                Catalog.Currencies,
                Catalog.PaymentTypes, IQueryable<Advertisement>> main =
                (db, user, fiatAmount, cryptoAmount, isBuy, country, fiatCurrency, paymentType) => from ads in db
                        .Advertisements
                        .Include(p => p.Owner).ThenInclude(p => p.LastOnline)
                        .Include(p => p.Metadata)
                        .Include(p => p.TimeTable)
                    where ads.IsBuy == isBuy
                          && ads.Country == country
                          && ads.FiatCurrency == fiatCurrency
                          && ads.PaymentType == paymentType
                          && ads.Metadata.Status == Advertisement.AdMetadata.AdStatus.Enabled
                          && (!fiatAmount.HasValue ||
                              ads.Metadata.MaxAmount >= fiatAmount.Value && ads.MinAmount <= fiatAmount.Value)
                          && (!cryptoAmount.HasValue ||
                              ads.Metadata.MaxCryptoAmount >= cryptoAmount.Value &&
                              ads.Metadata.MinCryptoAmount <= cryptoAmount.Value)
                          && (user == null || !user.IsAnonymous || !ads.NotAnonymous)
                          && !ads.IsDeleted
                    select new
                    {
                        ad = ads,
                        blocked = from bl in ads.Owner.BlockedUsers where bl.User == user select 1,
                        trusted = from tl in ads.Owner.TrustedUsers where tl.User == user select 1,
                    }
                    into exp
                    where !exp.blocked.Any()
                          && (!exp.ad.Trusted || exp.ad.Trusted && exp.trusted.Any())
                    select exp.ad;

            public async Task<List<Advertisement>> FindAds(decimal? fiatAmount, decimal? cryptoAmount, bool isBuy,
                Catalog.Countries country,
                Catalog.Currencies currency, Catalog.PaymentTypes paymentType, int skip, int take,
                CancellationToken cancellationToken = default)
            {
                var q = main.Invoke(db, db.User, fiatAmount, cryptoAmount, isBuy, country,
                    currency, paymentType);


                if (isBuy)
                    q = q.OrderByDescending(p => p.Metadata.Price);
                else
                    q = q.OrderBy(p => p.Metadata.Price);

                q = q.Skip(skip).Take(take); //pagination
                var ads = await q.ToListAsync(cancellationToken);

                if (cryptoAmount.HasValue)
                    db.User?.SetLastSearch(country, currency, paymentType, cryptoAmount.Value, isBuy);


                return ads;
            }

            public async Task<List<Advertisement>> GetAdsByOwner(bool? isBuy, string id,
                CancellationToken cancellationToken = default)
            {
                var user = await db.UserDatas.FirstOrDefaultAsync(p => p.UserId == id,
                    cancellationToken: cancellationToken);
                var isTrusted = user.TrustedUsers.Select(p => p.User.UserId).Any(p => p == db.User.UserId);
                if (user == null)
                    throw new UserException("User not found.");
                if (user.BlockedUsers.Select(p => p.User.UserId).Contains(db.User.UserId))
                    throw new UserException("You are blocked by user.");
                var main = user.Advertisements.Where(p =>
                    p.Metadata.Status == Advertisement.AdMetadata.AdStatus.Enabled && !p.IsDeleted);
                if (isBuy.HasValue)
                    main = main.Where(p => p.IsBuy == isBuy.Value);
                main = main.Where(p => !db.User.IsAnonymous || !p.NotAnonymous)
                    .Where(p => !p.Trusted || isTrusted);

                var a = main.ToList();
                return a;
            }
        }
    }
}