using System;
using System.Threading.Tasks;

namespace Aggregator.Services.BitZlato.ParseResults
{
    public class AdResult
    {
        public long Id { get; private set; }
        public bool IsBuy { get; private set; }
        public Catalog.CryptoCurrencies CryptoCurrency { get; private set; }
        public Catalog.Currencies FiatCurrency { get; private set; }
        public decimal Price { get; private set; }
        public decimal MinAmount { get; private set; }
        public decimal MaxAmount { get; private set; }
        public Catalog.PaymentTypes PaymentType { get; private set; }
        public string Owner { get; private set; }
        public DateTime OwnerLastActivity { get; private set; }
        public bool OwnerVerified { get; private set; }
        public string Terms { get; private set; } = "";

        public AdResult(Datum json)
        {
            Id = json.Id;
            IsBuy = json.Type == "selling";
            CryptoCurrency = json.Cryptocurrency.BzGetCryptoCurrency();
            FiatCurrency = json.Currency.BzGetFiatCurrency();
            Price = Convert.ToDecimal(json.Rate);
            MinAmount = Convert.ToDecimal(json.LimitCurrency.Min);
            MaxAmount = Convert.ToDecimal(json.LimitCurrency.Max);
            PaymentType = json.Paymethod.Name.BzGetPaymentType();
            Owner = json.Owner;
            OwnerLastActivity = DateTime.UnixEpoch.AddMilliseconds(json.OwnerLastActivity);
            OwnerVerified = json.IsOwnerVerificated;
        }

        public void AddParsedData(string terms)
        {
            Terms = terms;
        }
    }
}