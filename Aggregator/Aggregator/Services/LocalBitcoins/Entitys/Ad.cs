using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Aggregator.Services.LocalBitcoins.Entitys
{
    public class Ad : Aggregator.Entitys.Ad
    {
        public string? BankName { get; protected set; }
        public decimal RequireFeedbackScore { get; protected set; }
        public decimal RequireTradeVolume { get; protected set; }

#pragma warning disable 8618
        public Ad()
#pragma warning restore 8618
        {
        }

        public Ad(AdListData data, Trader trader)
        {
            AdId = data.AdId;
            Country = Enum.Parse<Catalog.Countries>(data.Countrycode);
            IsBuy = data.TradeType == TradeType.OnlineSell;
            PaymentType = GetPaymentType(data);
            FiatCurrency = Enum.Parse<Catalog.Currencies>(data.Currency);
            MinAmount = data.MinAmount;
            MaxAmount = data.MaxAmountAvailable;
            BankName = data.BankName == "" ? null : data.BankName;
            RequireFeedbackScore = data.RequireFeedbackScore;
            RequireTradeVolume = data.RequireTradeVolume;
            Owner = trader;
            Price = data.TempPrice;
            Terms = data.Msg;
            City = data.City;
            Window = data.PaymentWindowMinutes;
        }

        public void Update(AdListData data)
        {
            Country = Enum.Parse<Catalog.Countries>(data.Countrycode);
            IsBuy = data.TradeType == TradeType.OnlineSell;
            PaymentType = GetPaymentType(data);
            FiatCurrency = Enum.Parse<Catalog.Currencies>(data.Currency);
            MinAmount = data.MinAmount;
            MaxAmount = data.MaxAmountAvailable;
            BankName = data.BankName == "" ? null : data.BankName;
            RequireFeedbackScore = data.RequireFeedbackScore;
            RequireTradeVolume = data.RequireTradeVolume;
            Price = data.TempPrice;
            Terms = data.Msg;
            City = data.City;
            UpdatedAt = DateTime.Now;
            DisabledAt = null;
            PriceUpdatedAt = DateTime.Now;
            Window = data.PaymentWindowMinutes;
        }

        private Catalog.PaymentTypes GetPaymentType(AdListData data)
        {
            if (Enum.TryParse<Catalog.PaymentTypes>(data.OnlineProvider, out var t))
                return t;
            return data.OnlineProvider switch
            {
                "VTB_BANK" => Catalog.PaymentTypes.VTB,
                "SBP_FAST_TRANSFER" => Catalog.PaymentTypes.SBP,
                "SPECIFIC_BANK" => Catalog.PaymentTypes.NATIONAL_BANK,
                "CARD_TO_CARD_RUSSIA" => Catalog.PaymentTypes.CREDITCARD,
                "CARD_TO_CARD_RUSSIA_VISA" => Catalog.PaymentTypes.VISA,
                "CARD_TO_CARD_RUSSIA_MASTERCARD" => Catalog.PaymentTypes.MASTERCARD,
                "PAYSEND" => Catalog.PaymentTypes.PAY_SEND,
                "OTHER_ONLINE_WALLET_GLOBAL" => Catalog.PaymentTypes.OTHER_ONLINE_WALLET,
                "CHIME" => Catalog.PaymentTypes.CHIME_INSTANT_TRANFERS,
                "PAYSERA" => Catalog.PaymentTypes.PAYSERA_MONEY_TRANSFER,
                "N26" => Catalog.PaymentTypes.N26_BANK,

                _ => throw new InvalidPaymentTypeException(data.OnlineProvider)
            };
        }
    }
}