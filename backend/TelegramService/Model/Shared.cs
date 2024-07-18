using System;
using System.Linq;
using CoreLib.Services;
using Shared.Protos;

namespace TelegramService.Model
{
    public class InvoiceInfo
    {
        public decimal PiecePriceCrypto { get; }
        public decimal AmountCryptoMin { get; }
        public decimal AmountCryptoMax { get; }
        public decimal AmountFiatMin { get; }
        public decimal AmountFiatMax { get; }
        public decimal AmountFiat { get; }
        public decimal PiecePriceFiat { get; }
        public decimal TotalPaidFiat { get; }
        private readonly Protos.TradeApi.V1.Invoice invoice;
        private readonly Protos.TradeApi.V1.Variables vars;


        public InvoiceInfo(Protos.TradeApi.V1.Invoice invoice, Catalog.Currencies currency, Protos.TradeApi.V1.Variables vars)
        {
            this.invoice = invoice;
            this.vars = vars;

            decimal cryptoPrice;

            if (!invoice.IsBaseCrypto)
                cryptoPrice = CalcPiecePriceCrypto();
            else
                cryptoPrice = invoice.Price.FromPb();
            decimal varPrice = vars.Variables_.First(p => p.Key == "AVG_" +currency).Value.FromPb();
            var fiatPrice = Math.Round(cryptoPrice * varPrice, 2);

            PiecePriceCrypto = cryptoPrice;
            PiecePriceFiat = fiatPrice;
            if (!invoice.IsPrivate)
            {
                AmountCryptoMin = invoice.PiecesMin * cryptoPrice;
                AmountCryptoMax = invoice.PiecesMax * cryptoPrice;
                AmountFiatMin = invoice.PiecesMin * fiatPrice;
                AmountFiatMax = invoice.PiecesMax * fiatPrice;
            }
            else
                AmountFiat = fiatPrice;

            TotalPaidFiat = Math.Round(invoice.TotalPayedCrypto.FromPb() * varPrice, 2);
        }

        private decimal GetVarPrice()
        {
            if (invoice.PriceVariable == "Average")
                return vars.Variables_.First(p => p.Key == "AVG_" + invoice.FiatCurrency).Value.FromPb();

            var fiatRate = vars.Variables_.First(p => p.Key == invoice.FiatCurrency).Value.FromPb();
            var pv = vars.Variables_.First(p => p.Key == invoice.PriceVariable).Value.FromPb();
            return Math.Round(pv * fiatRate, 2);
        }

        private decimal CalcPiecePriceCrypto()
        {
            decimal varPrice = GetVarPrice();
            if (invoice.FiatCurrency == Catalog.Currencies.USD.ToString())
                return Math.Round(invoice.Price.FromPb() / varPrice, 8);

            if (invoice.PriceVariable == "Average")
                return Math.Round(invoice.Price.FromPb() / varPrice, 8);

            decimal fiatRate = vars.Variables_.First(p => p.Key == invoice.FiatCurrency).Value.FromPb();
            return Math.Round(invoice.Price.FromPb() / fiatRate / varPrice, 8);
        }
    }
}