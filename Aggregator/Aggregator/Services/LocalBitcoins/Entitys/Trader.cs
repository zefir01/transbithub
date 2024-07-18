using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.LocalBitcoins.Entitys
{
    public class Trader :Aggregator.Entitys.Trader
    {
        [NotMapped]
        private IEnumerable<Ad> LbAds => Ads.OfType<Ad>();

#pragma warning disable 8618
        public Trader()
#pragma warning restore 8618
        {
        }

        public Trader(IEnumerable<AdListData> list, ILogger logger)
        {
            AdListData data = list.First();
            Name = data.Profile.Username;
            var snapshot = new TraderSnapshot(data);
            Snapshots.Add(snapshot);
            LastActivity = data.Profile.LastOnline;

            var adIds = list.Select(p => p.AdId).Distinct();
            foreach (var id in adIds)
            {
                var listData = list.First(p => p.AdId == id);
                try
                {
                    var ad = new Ad(listData, this);
                    Ads.Add(ad);
                }
                catch (InvalidPaymentTypeException e)
                {
                    logger.LogError(e, e.Message);
                }
            }
        }

        public void Update(IEnumerable<AdListData> list, ILogger logger)
        {
            var data = list.First();
            var snapshot = new TraderSnapshot(data);

            var last = Snapshots.OfType<TraderSnapshot>().OrderByDescending(p => p.Id).FirstOrDefault();
            if(last==null || !last.Compare(snapshot))
                Snapshots.Add(snapshot);
            else
                logger.LogDebug($"Identical LB snapshot: {Name}");
            LastActivity = data.Profile.LastOnline;

            var adIds = list.Select(p => p.AdId).Distinct();
            foreach (var id in adIds)
            {
                var listData = list.First(p => p.AdId == id);
                try
                {
                    var ad = LbAds.FirstOrDefault(p => p.AdId == listData.AdId);
                    if (ad == null)
                    {
                        ad = new Ad(listData, this);
                        Ads.Add(ad);
                    }
                    else
                    {
                        ad.Update(listData);
                    }
                }
                catch (InvalidPaymentTypeException e)
                {
                    logger.LogError(e, e.Message);
                }
            }

            foreach (var ad in Ads)
            {
                var exist = list.Any(p => p.AdId == ad.AdId);
                if (!exist)
                    ad.DisabledAt = DateTime.Now;
            }

            UpdatedAt = DateTime.Now;
        }
    }
}