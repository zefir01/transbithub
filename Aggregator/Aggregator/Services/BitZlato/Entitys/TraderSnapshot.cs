using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Aggregator.Services.BitZlato.ParseResults;

namespace Aggregator.Services.BitZlato.Entitys
{
    public class TraderSnapshot : Aggregator.Entitys.TraderSnapshot
    {
        public int DisputeLoose { get; private set; }
        public virtual List<TraderVolumes> Volumes { get; private set; } = new();

        public TraderSnapshot()
        {
        }

        public TraderSnapshot(TraderResult traderResult, Trader owner)
        {
            Owner = owner;
            Rating = traderResult.Rating;
            PositiveFeedbacks = traderResult.PositiveFeedbacks;
            NegativeFeedbacks = traderResult.NegativeFeedbacks;
            CompletedDeals = traderResult.CompletedDeals;
            CanceledDeals = traderResult.CanceledDeals;
            TrustedCount = traderResult.TrustedCount;
            DisputeLoose = traderResult.DisputeLoose;
            foreach (var volume in traderResult.Volumes)
                Volumes.Add(new TraderVolumes(volume, this));
            var v = Volumes.FirstOrDefault(p => p.CryptoCurrency == Catalog.CryptoCurrencies.BTC);
            if (v != null)
                Amount = v.Amount;
        }

        public bool Compare(TraderSnapshot snapshot)
        {
            if (
                Rating != snapshot.Rating ||
                PositiveFeedbacks!=snapshot.PositiveFeedbacks ||
                NegativeFeedbacks!=snapshot.NegativeFeedbacks ||
                CompletedDeals!=snapshot.CompletedDeals || 
                CanceledDeals!=snapshot.CanceledDeals ||
                TrustedCount!=snapshot.TrustedCount ||
                DisputeLoose!=snapshot.DisputeLoose
            )
                return false;

            foreach (var volume in snapshot.Volumes)
            {
                var v = Volumes.FirstOrDefault(p => p.CryptoCurrency == volume.CryptoCurrency);
                if (v == null)
                    return false;
                if (!v.Compare(volume))
                    return false;
            }

            
            return true;
        }
    }
}