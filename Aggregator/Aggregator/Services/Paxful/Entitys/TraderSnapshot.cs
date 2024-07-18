using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Text.RegularExpressions;

namespace Aggregator.Services.Paxful.Entitys
{
    public class TraderSnapshot : Aggregator.Entitys.TraderSnapshot
    {
        public int Partners { get; private set; }

        public TraderSnapshot()
        {
        }

        private decimal ParseAmount(string value)
        {
            var match1 = Regex.Match(value, @"^Less than (\d+)$", RegexOptions.IgnoreCase);
            var match2 = Regex.Match(value, @"^(\d+)$", RegexOptions.IgnoreCase);
            if (match1.Success)
            {
                decimal count = decimal.Parse(match1.Groups[1].Captures[0].Value);
                return count;
            }
            else if (match2.Success)
            {
                return decimal.Parse(value);
            }

            throw new InvalidDataException($"Unable to parse string: {value}");
        }

        public TraderSnapshot(Trader trader, Json.Trader.Data json)
        {
            Owner = trader;
            PositiveFeedbacks = json.FeedbackPositive;
            NegativeFeedbacks = json.FeedbackNegative;
            Partners = json.TotalPartners;
            TradesCount = json.TotalTrades;
            TrustedCount = json.TrustedBy;
            BlockedCount = json.BlockedBy;
            try
            {
                var t = json.TotalBtc.Replace("+", "");
                Amount = ParseAmount(t);
            }
            catch
            {
                Console.WriteLine(json.TotalBtc);
            }
        }

        public bool Compare(TraderSnapshot snapshot)
        {
            if (PositiveFeedbacks != snapshot.PositiveFeedbacks ||
                NegativeFeedbacks != snapshot.NegativeFeedbacks ||
                Partners != snapshot.Partners ||
                TradesCount != snapshot.TradesCount ||
                TrustedCount != snapshot.TrustedCount ||
                BlockedCount != snapshot.BlockedCount ||
                Amount != snapshot.Amount
            )
                return false;
            return true;
        }
    }
}