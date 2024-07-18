using System;
using System.Diagnostics.CodeAnalysis;

namespace Aggregator.Services.BitZlato.ParseResults
{
    public static class Extensions
    {
        public static Catalog.CryptoCurrencies BzGetCryptoCurrency(this string value)
        {
            return Enum.Parse<Catalog.CryptoCurrencies>(value);
        }

        public static Catalog.Currencies BzGetFiatCurrency(this string value)
        {
            return Enum.Parse<Catalog.Currencies>(value);
        }

        [SuppressMessage("ReSharper", "StringLiteralTypo")]
        public static Catalog.PaymentTypes BzGetPaymentType(this string value)
        {
            return value switch
            {
                "Sberbank" => Catalog.PaymentTypes.SBERBANK,
                "Cash at ATM" => Catalog.PaymentTypes.CASH_AT_ATM,
                "Tinkoff" => Catalog.PaymentTypes.TINKOFF,
                "Card to card" => Catalog.PaymentTypes.CREDITCARD,
                "VISA" => Catalog.PaymentTypes.VISA,
                "MASTERCARD" => Catalog.PaymentTypes.MASTERCARD,
                "VTB" => Catalog.PaymentTypes.VTB,
                "Alfa-bank" => Catalog.PaymentTypes.ALFA_BANK,
                "SBP" => Catalog.PaymentTypes.SBP,
                "Raiffeisen Bank" => Catalog.PaymentTypes.RAIFFEZEN_BANK,
                "QIWI" => Catalog.PaymentTypes.QIWI,
                "Otkritie Bank" => Catalog.PaymentTypes.OTKRITIE_BANK,
                "MTS-bank" => Catalog.PaymentTypes.MTS_BANK,
                "Mir (payment system)" => Catalog.PaymentTypes.MIR,
                "Pochta Bank" => Catalog.PaymentTypes.POCHTA_BANK,
                "Sovcombank" => Catalog.PaymentTypes.SOVKOM_BANK,
                "Gazprombank" => Catalog.PaymentTypes.GAZPROM_BANK,
                "Payeer" => Catalog.PaymentTypes.PAYEER,
                "PS Bank" => Catalog.PaymentTypes.PS_BANK,
                "Rosbank" => Catalog.PaymentTypes.ROS_BANK,
                "MTS Money" => Catalog.PaymentTypes.MTS_MONEY,
                "Uralsib" => Catalog.PaymentTypes.URALSIB_BANK,
                "Rocketbank" => Catalog.PaymentTypes.ROCKET_BANK,
                "National bank transfer" => Catalog.PaymentTypes.NATIONAL_BANK,
                "Russian Standard Bank" => Catalog.PaymentTypes.RUSSIAN_STANDART_BANK,
                "Kykyryza bank" => Catalog.PaymentTypes.KUKURUZA_BANK,
                "UBRR" => Catalog.PaymentTypes.UBRR,
                "RNCB Bank" => Catalog.PaymentTypes.RNCB_BANK,
                "Avangard Bank" => Catalog.PaymentTypes.AVANGARD_BANK,
                "Touch Bank" => Catalog.PaymentTypes.TOCHKA_BANK,
                "Bank of Moscow" => Catalog.PaymentTypes.MOSCOW_BANK,
                "Yandex.Money" => Catalog.PaymentTypes.YANDEXMONEY,
                "Sim-card balance" => Catalog.PaymentTypes.MOBILE_BALANCE,
                "advcash" => Catalog.PaymentTypes.ADVCASH,
                "Webmoney" => Catalog.PaymentTypes.WEBMONEY,
                "Citibank" => Catalog.PaymentTypes.CITY_BANK,
                "KoronaPay (Zolotaya korona)" => Catalog.PaymentTypes.KORONA_PAY,
                "VK Pay" => Catalog.PaymentTypes.VK_PAY,
                "UniCredit Bank" => Catalog.PaymentTypes.UNI_CREDIT_BANK,
                "Bank Saint Petersburg" => Catalog.PaymentTypes.SPB_BANK,
                "Cash" => Catalog.PaymentTypes.CASHU,
                "ForBank" => Catalog.PaymentTypes.FORA_BANK,
                "PaySend" => Catalog.PaymentTypes.PAY_SEND,
                "SWIFT" => Catalog.PaymentTypes.INTERNATIONAL_WIRE_SWIFT,
                "Moneygram" => Catalog.PaymentTypes.MONEYGRAM,
                "Transferwise" => Catalog.PaymentTypes.TRANSFERWISE,
                "Anelik" => Catalog.PaymentTypes.ANELIK,
                "BIC" => Catalog.PaymentTypes.BIC,
                "Contact" => Catalog.PaymentTypes.CONTACT,
                "Interkassa" => Catalog.PaymentTypes.INTERKASSA,
                "LiqPay" => Catalog.PaymentTypes.LIQ_PAY,
                "Western Union" => Catalog.PaymentTypes.WESTERN_UNION_BANK,
                "SEPA" => Catalog.PaymentTypes.SEPA,
                "Skrill" => Catalog.PaymentTypes.SKRILL,
                "Perfect Money" => Catalog.PaymentTypes.PERFECT_MONEY,
                "Credit Bank Of Moscow" => Catalog.PaymentTypes.CREDIT_BANK_OF_MOSCOW,
                "Revolut" => Catalog.PaymentTypes.REVOLUT,
                "Google Play" => Catalog.PaymentTypes.GOOGLEWALLET,
                "Other payment methods" => Catalog.PaymentTypes.OTHER,
                "Cashless payments (Entity)" => Catalog.PaymentTypes.CASHH_LESS,
                "Steam" => Catalog.PaymentTypes.STEAM,
                "Capitalist" => Catalog.PaymentTypes.CAPITALIST,
                "BelarusBank" => Catalog.PaymentTypes.BELARUS_BANK,
                "ERIP" => Catalog.PaymentTypes.ERIP,
                "Mtbank" => Catalog.PaymentTypes.MT_BANK,
                "Priorbank" => Catalog.PaymentTypes.PRIOR_BANK,
                "Belinvestbank" => Catalog.PaymentTypes.BELINVEST_BANK,
                "Belgazprombank" => Catalog.PaymentTypes.BELGAZPROM_BANK,
                "BPS-Sberbank" => Catalog.PaymentTypes.BPS_SBER_BANK,
                "Dabrabyt" => Catalog.PaymentTypes.DABRABYT,
                "Technobank" => Catalog.PaymentTypes.TECHNO_BANK,
                "IdeaBank" => Catalog.PaymentTypes.IDEA_BANK,
                "Paritetbank" => Catalog.PaymentTypes.PARITET_BANK,
                "Reshenie Bank" => Catalog.PaymentTypes.RESHENIE_BANK,
                "BNB" => Catalog.PaymentTypes.BNB,
                "Bank BelVEB" => Catalog.PaymentTypes.BELVEB_BANK,
                "BSB Bank" => Catalog.PaymentTypes.BSB_BANK,
                "BTA Bank" => Catalog.PaymentTypes.BTA_BANK,
                "Bank Moscow-Minsk" => Catalog.PaymentTypes.MOSCOW_MINSK_BANK,
                "Belagroprombank" => Catalog.PaymentTypes.BELAGROPROM_BANK,
                "Neteller" => Catalog.PaymentTypes.NETELLER,
                "Lemonade → MPesa" => Catalog.PaymentTypes.LEMOMADE_MPESA,
                "M-Pesa" => Catalog.PaymentTypes.MPESA,
                "KCB" => Catalog.PaymentTypes.KCB,
                "Equity" => Catalog.PaymentTypes.EQIITY,
                "Chipper Cash" => Catalog.PaymentTypes.CASHU,
                "PesaLink" => Catalog.PaymentTypes.PESA_LINK,
                "CBA Loop" => Catalog.PaymentTypes.CBA_LOOP,
                "National Bank" => Catalog.PaymentTypes.NATIONAL_BANK,
                "Kaspi Gold" => Catalog.PaymentTypes.KASPI_GOLD,
                "Bank of Astana" => Catalog.PaymentTypes.ASTANA_BANK,
                "PayPal" => Catalog.PaymentTypes.PAYPAL,
                "Monobank" => Catalog.PaymentTypes.MONO_BANK,
                "PrivatBank" => Catalog.PaymentTypes.PRIVAT_BANK,
                "Oschadbank" => Catalog.PaymentTypes.OSCHAD_BANK,
                "FUIB" => Catalog.PaymentTypes.FUIB,
                "A-BANK" => Catalog.PaymentTypes.A_BANK,
                "OTP" => Catalog.PaymentTypes.OTP,
                "CONCORD Bank" => Catalog.PaymentTypes.CONCORD_BANK,
                "EasyPay" => Catalog.PaymentTypes.EASY_PAY,
                "GlobalMoney" => Catalog.PaymentTypes.GLOBAL_MONEY,
                "izibank" => Catalog.PaymentTypes.IZI_BANK,
                "PokerStars" => Catalog.PaymentTypes.POCKER_STARS,
                "YooMoney" => Catalog.PaymentTypes.YANDEXMONEY,

                _ => throw new InvalidPaymentTypeException(value)
            };
        }
    }
}