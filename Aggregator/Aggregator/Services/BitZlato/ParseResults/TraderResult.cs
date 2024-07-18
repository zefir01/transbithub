using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace Aggregator.Services.BitZlato.ParseResults
{
    public class VolumeItem
    {
        public Catalog.CryptoCurrencies CryptoCurrency { get; private set; }
        public decimal Amount { get; private set; }
        public long DealsCount { get; private set; }

        public VolumeItem(string value)
        {
            var match = Regex.Match(value, @"(.+) trades for (.+) (.+)", RegexOptions.IgnoreCase);
            if (!match.Success)
                throw new InvalidDataException($"Unable to parse volume string: {value}");
            var deals = match.Groups[1].Captures[0].Value;
            var volume = match.Groups[2].Captures[0].Value;
            var crypto = match.Groups[3].Captures[0].Value;

            CryptoCurrency = crypto.BzGetCryptoCurrency();
            Amount = decimal.Parse(volume);
            DealsCount = long.Parse(deals);
        }
    }

    public class TraderResult
    {
        public string Name { get; private set; }
        public decimal Rating { get; private set; }
        public int PositiveFeedbacks { get; private set; }
        public int NegativeFeedbacks { get; private set; }
        public int CompletedDeals { get; private set; }
        public int CanceledDeals { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public int TrustedCount { get; private set; }
        public int DisputeLoose { get; private set; }
        public List<VolumeItem> Volumes { get; private set; } = new List<VolumeItem>();

        public TraderResult(
            string name,
            string rating,
            string positiveFeedbacks,
            string negativeFeedbacks,
            string completedDeals,
            string canceledDeals,
            string disputeLoose,
            List<string> volumes,
            string years,
            string trusted
        )
        {
            Name = name;
            Rating = decimal.Parse(rating);
            PositiveFeedbacks = int.Parse(positiveFeedbacks);
            NegativeFeedbacks = int.Parse(negativeFeedbacks);
            CompletedDeals = int.Parse(completedDeals);
            CanceledDeals = int.Parse(canceledDeals);
            TrustedCount = int.Parse(trusted);
            DisputeLoose = int.Parse(disputeLoose);

            CreatedAt = GetDate(years);

            foreach (var volume in volumes)
            {
                var vol = new VolumeItem(volume);
                Volumes.Add(vol);
            }
        }

        private DateTime GetDate(string value)
        {
            DateTime result = DateTime.Now;
            //Activity for a year:
            var match1 = Regex.Match(value, @"^Activity for (\d+) ([a-z]+)s$", RegexOptions.IgnoreCase);
            var match2 = Regex.Match(value, @"^Activity for a ([a-z]+)$", RegexOptions.IgnoreCase);

            if (match1.Success)
            {
                int count = int.Parse(match1.Groups[1].Captures[0].Value);
                string unit = match1.Groups[2].Captures[0].Value;
                result = unit switch
                {
                    "day" => result.AddDays(-count),
                    "month" => result.AddMonths(-count),
                    "year" => result.AddYears(-count),
                    _ => throw new InvalidDataException($"Invalid time unit {unit}")
                };
            }
            else if (match2.Success)
            {
                string unit = match2.Groups[1].Captures[0].Value;
                result = unit switch
                {
                    "day" => result.AddDays(-1),
                    "month" => result.AddMonths(-1),
                    "year" => result.AddYears(-1),
                    _ => throw new InvalidDataException($"Invalid time unit {unit}")
                };
            }
            else
                throw new InvalidDataException($"Unable to parse string: {value}");

            return result;
        }
    }
}