using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Aggregator.Entitys
{
    [Index(nameof(AdId))]
    [Index(nameof(DisabledAt))]
    [Index(nameof(Price))]
    [Index(nameof(IsBuy))]
    [Index(nameof(PaymentType))]
    [Index(nameof(FiatCurrency))]
    [Index(nameof(MinAmount))]
    [Index(nameof(MaxAmount))]
    [Index(nameof(CryptoCurrency))]
    [Index(nameof(UpdatedAt))]
    [Index(nameof(PriceUpdatedAt))]
    public class Ad
    {
        [Key] public long Id { get; private set; }
        public long AdId { get; protected set; }
        public Catalog.Countries? Country { get; protected set; }
        public bool IsBuy { get; protected set; }
        public Catalog.PaymentTypes PaymentType { get; protected set; }
        public Catalog.Currencies FiatCurrency { get; protected set; }
        public decimal MinAmount { get; protected set; }
        public decimal MaxAmount { get; protected set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public virtual Trader Owner { get; protected set; }
        public DateTime? DisabledAt { get; set; }
        public decimal Price { get; protected set; }
        public string Terms { get; protected set; }
        public string? City { get; protected set; }
        public DateTime UpdatedAt { get; protected set; } = DateTime.Now;
        public DateTime PriceUpdatedAt { get; protected set; } = DateTime.Now;
        public int? Window { get; protected set; }
        public Catalog.CryptoCurrencies CryptoCurrency { get; protected set; } = Catalog.CryptoCurrencies.BTC;
    }
}