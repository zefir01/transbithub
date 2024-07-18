using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    // https://openexchangerates.org/signup
    public class CryptoExchangeVariable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Catalog.CryptoExchangeVariables Key { get; set; }
        public decimal Value { get; set; }
    }
    public class FiatExchangeVariable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Catalog.Currencies Key { get; set; }
        public decimal Value { get; set; }
    }

    [Index(nameof(FiatCurrency))]
    public class AvgPrice
    {
        [Key]
        public int Id { get; set; }
        public Catalog.Currencies FiatCurrency { get; set; }
        public decimal Value { get; set; }
        [NotMapped]
        public string Name => $"AVG_{FiatCurrency}";
    }

    public class VariablesMetadata
    {
        [Key]
        public int Id { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}