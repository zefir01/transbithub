using CoreLib.Services;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        public interface ILastAdSearch
        {
            UserData Owner { get; set; }
            Catalog.Countries Country { get; set; }
            Catalog.Currencies Currency { get; set; }
            Catalog.PaymentTypes PaymentType { get; set; }
            decimal Amount { get; set; }
        }

        [Owned]
        public class LastAdSearchSellClass : ILastAdSearch
        {
            public virtual UserData Owner { get; set; }
            public Catalog.Countries Country { get; set; }
            public Catalog.Currencies Currency { get; set; }
            public Catalog.PaymentTypes PaymentType { get; set; }
            public decimal Amount { get; set; }
        }

        [Owned]
        public class LastAdSearchBuyClass : ILastAdSearch
        {
            public virtual UserData Owner { get; set; }
            public Catalog.Countries Country { get; set; }
            public Catalog.Currencies Currency { get; set; }
            public Catalog.PaymentTypes PaymentType { get; set; }
            public decimal Amount { get; set; }
        }
    }
}