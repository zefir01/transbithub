using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Aggregator.Services.BitZlato.ParseResults;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.BitZlato.Entitys
{
    public class Trader : Aggregator.Entitys.Trader
    {
        public bool Verified { get; private set; }
        [NotMapped] public IEnumerable<Ad> BzAds => Ads.OfType<Ad>();

        public Trader()
        {
        }

        public Trader(TraderResult traderResult, List<AdResult> adResults)
        {
            Name = traderResult.Name;
            RegisteredAt = traderResult.CreatedAt;
            Snapshots.Add(new TraderSnapshot(traderResult, this));
            if (adResults.Any())
            {
                var ad = adResults.First();
                LastActivity = ad.OwnerLastActivity;
                Verified = ad.OwnerVerified;

                var ids = adResults.Select(p => p.Id).Distinct();
                foreach (var id in ids)
                {
                    var adResult = adResults.First(p => p.Id == id);
                    if (!Ads.Select(p => p.AdId).Contains(adResult.Id))
                        Ads.Add(new Ad(adResult, this));
                }
            }
        }

        public void Update(TraderResult traderResult, List<AdResult> adResults, ILogger logger)
        {
            var snapshot = new TraderSnapshot(traderResult, this);
            var last = Snapshots.OfType<TraderSnapshot>().OrderByDescending(p => p.Id).FirstOrDefault();
            if (last == null || !last.Compare(snapshot))
                Snapshots.Add(snapshot);
            else
                logger.LogDebug($"Identical BZ snapshot: {Name}");
            if (adResults.Any())
            {
                var ad = adResults.First();
                LastActivity = ad.OwnerLastActivity;
                Verified = ad.OwnerVerified;

                var ids = adResults.Select(p => p.Id).Distinct();
                foreach (var id in ids)
                {
                    var adResult = adResults.First(p => p.Id == id);
                    if (!Ads.Select(p => p.AdId).Contains(adResult.Id))
                        Ads.Add(new Ad(adResult, this));
                }
            }

            UpdatedAt = DateTime.Now;
        }
    }
}