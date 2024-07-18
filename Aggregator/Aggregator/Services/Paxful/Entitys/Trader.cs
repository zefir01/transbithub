using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Aggregator.Services.Paxful.Json.OfferJson;
using Microsoft.Extensions.Logging;

namespace Aggregator.Services.Paxful.Entitys
{
    public class Trader : Aggregator.Entitys.Trader
    {
        [NotMapped] public IEnumerable<Ad> PxAds => Ads.OfType<Ad>();

        private DateTime ParseRegistered(string value)
        {
            var match1 = Regex.Match(value, @"^(\d+) ([a-z]+) ago$", RegexOptions.IgnoreCase);
            if (match1.Success)
            {
                DateTime result = DateTime.Now;
                int count = int.Parse(match1.Groups[1].Captures[0].Value);
                string unit = match1.Groups[2].Captures[0].Value;
                result = unit switch
                {
                    "day" => result.AddDays(-count),
                    "month" => result.AddMonths(-count),
                    "year" => result.AddYears(-count),
                    "weeks" => result.AddDays(-7 * count),
                    "months" => result.AddMonths(-count),
                    "days" => result.AddDays(-count),
                    "years" => result.AddYears(-count),
                    "week" => result.AddDays(-7),
                    "hours" => result.AddHours(-count),
                    _ => throw new InvalidDataException($"Invalid time unit {unit}")
                };
                return result;
            }

            throw new InvalidDataException($"Unable to parse string: {value}");
        }


        public Trader(Json.Trader.Data json)
        {
            Name = json.Username;
            RegisteredAt = ParseRegistered(json.Joined);
            Snapshots.Add(new TraderSnapshot(this, json));
        }

        public Trader()
        {
        }

        public void UpdateAd(Data json)
        {
            var ad = PxAds.FirstOrDefault(p => p.PxAdId == json.OfferId);
            if (ad == null)
            {
                ad = new Ad(this, json);
                if (ad.PaymentType == Catalog.PaymentTypes.OTHER)
                    return;
                Ads.Add(ad);
            }
            else
                ad.Update(json);
        }

        public void Update(Json.Trader.Data json, ILogger logger)
        {
            UpdatedAt = DateTime.Now;
            var snapshot = new TraderSnapshot(this, json);
            var last = Snapshots.OfType<TraderSnapshot>().OrderByDescending(p => p.Id).FirstOrDefault();
            if(last==null || !last.Compare(snapshot))
                Snapshots.Add(snapshot);
            else
                logger.LogDebug($"Identical PX snapshot: {Name}");
        }
    }
}