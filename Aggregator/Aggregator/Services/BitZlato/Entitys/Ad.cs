using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Aggregator.Services.BitZlato.ParseResults;
using Microsoft.EntityFrameworkCore;

namespace Aggregator.Services.BitZlato.Entitys
{
    public class Ad: Aggregator.Entitys.Ad
    {

        public Ad()
        {
        }

        public Ad(AdResult ad, Trader owner)
        {
            AdId = ad.Id;
            IsBuy = ad.IsBuy;
            CryptoCurrency = ad.CryptoCurrency;
            FiatCurrency = ad.FiatCurrency;
            Price = ad.Price;
            MinAmount = ad.MinAmount;
            MaxAmount = ad.MaxAmount;
            PaymentType = ad.PaymentType;
            Owner = owner;
            Terms = ad.Terms;
        }

        public void Update(Datum data)
        {
            Price = data.Rate;
            PriceUpdatedAt = DateTime.Now;
        }

        public void Update(AdResult ad)
        {
            IsBuy = ad.IsBuy;
            CryptoCurrency = ad.CryptoCurrency;
            FiatCurrency = ad.FiatCurrency;
            Price = ad.Price;
            MinAmount = ad.MinAmount;
            MaxAmount = ad.MaxAmount;
            PaymentType = ad.PaymentType;
            DisabledAt = null;
            PriceUpdatedAt = DateTime.Now;
        }

        public void UpdateTerms(string terms)
        {
            Terms = terms;
            UpdatedAt = DateTime.Now;
            PriceUpdatedAt = DateTime.Now;
        }
    }
}