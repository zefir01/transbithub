using System;
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys.Snapshots
{
    [Index(nameof(IsPrivate))]
    [Index(nameof(TtlMinutes))]
    [Index(nameof(Status))]
    [Index(nameof(ExpireTime))]
    public class InvoiceSnapshot
    {
        [Key]
        public long Key { get; private set; }
        public long Id { get; private set; }
        public bool IsPrivate { get; private set; }
        public bool IsBaseCrypto { get; private set; }
        public decimal Price { get; private set; }
        public decimal CurrentCryptoPrice { get; private set; }
        public Catalog.Currencies FiatCurrency { get; private set; }
        public string PriceVariable { get; private set; }
        public int TtlMinutes { get; private set; }
        public string Comment { get; private set; }
        public int PiecesMin { get; private set; }
        public int PiecesMax { get; private set; }

        public virtual UserData TargetUser { get; private set; }
        public virtual UserData Owner { get; private set; }
        public InvoiceStatus Status { get; private set; }
        public decimal TotalPayedCrypto { get; private set; }
        public int PaymentsCount { get; private set; }
        public DateTime? ExpireTime { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? DeletedAt { get; private set; }
        public decimal Fee { get; private set; }
        public bool TargetDeleted { get; private set; }
        public bool LimitLiquidity { get; private set; }

        public static InvoiceSnapshot Create(Invoice invoice)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Invoice, InvoiceSnapshot>();
            });
            IMapper iMapper = config.CreateMapper();
            var destination = iMapper.Map<Invoice, InvoiceSnapshot>(invoice);
            return destination;
        }
    }
}