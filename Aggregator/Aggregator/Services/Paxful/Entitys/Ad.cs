using System;
using System.Diagnostics.CodeAnalysis;
using Aggregator.Services.Paxful.Json.All;
using Microsoft.EntityFrameworkCore;
using Data = Aggregator.Services.Paxful.Json.OfferJson.Data;


namespace Aggregator.Services.Paxful.Entitys
{
    [Index(nameof(PxAdId))]
    public class Ad: Aggregator.Entitys.Ad
    {
        public string PxAdId { get; protected set; }

        public Ad()
        {
        }

        [SuppressMessage("ReSharper", "StringLiteralTypo")]
        private Catalog.PaymentTypes ParsePaymentType(string value)
        {
            return value switch
            {
                "xoom-money-transfer" => Catalog.PaymentTypes.XOOM,
                "paypal" => Catalog.PaymentTypes.PAYPAL,
                "bank-transfer" => Catalog.PaymentTypes.SPECIFIC_BANK,
                "steam-wallet-gift-card" => Catalog.PaymentTypes.STEAM,
                "m-pesa" => Catalog.PaymentTypes.MPESA,
                "google-play-gift-card" => Catalog.PaymentTypes.GOOGLEWALLET,
                "western-union" => Catalog.PaymentTypes.WESTERN_UNION_BANK,
                "skrill" => Catalog.PaymentTypes.SKRILL,
                "moneygram" => Catalog.PaymentTypes.MONEYGRAM,
                "any-creditdebit-card" => Catalog.PaymentTypes.CREDITCARD,
                "remitly" => Catalog.PaymentTypes.REMITLY,
                "onevanilla-visamastercard-gift-card" => Catalog.PaymentTypes.CREDITCARD,
                "wechat-pay" => Catalog.PaymentTypes.WECHAT,
                "mtn-mobile-money" => Catalog.PaymentTypes.MTN,
                "greendot-card" => Catalog.PaymentTypes.GREENDOT_CARD,
                "wise-transferwise" => Catalog.PaymentTypes.TRANSFERWISE,
                "neteller" => Catalog.PaymentTypes.NETELLER,
                "zelle-pay" => Catalog.PaymentTypes.ZELLE,
                "visa-debitcredit-card" => Catalog.PaymentTypes.VISA,
                "google-pay" => Catalog.PaymentTypes.GOOGLEWALLET,
                "walmart-moneycard" => Catalog.PaymentTypes.WALMART2WALMART,
                "applepay" => Catalog.PaymentTypes.APPLE_PAY,
                "cash-app" => Catalog.PaymentTypes.CASH_AT_ATM,
                "barter-from-flutterwave" => Catalog.PaymentTypes.FLUTTERWAVE_BARTER,
                "ria-money-transfer" => Catalog.PaymentTypes.RIA,
                "airtel-money" => Catalog.PaymentTypes.AIRTM,
                "paysendcom" => Catalog.PaymentTypes.PAY_SEND,
                "gobank-money-transfer" => Catalog.PaymentTypes.GO_BANK,
                "visa-gift-card" => Catalog.PaymentTypes.VISA,
                "cash-deposit-to-bank" => Catalog.PaymentTypes.CASH_DEPOSIT,
                "sendwave-wallet" => Catalog.PaymentTypes.SEND_WAVE,
                "mobile-recharge" => Catalog.PaymentTypes.MOBILE_BALANCE,
                "easypaisa" => Catalog.PaymentTypes.EASYPAISA,
                "american-express-card" => Catalog.PaymentTypes.AMERICAN_EXPRESS,
                "chipper-cash" => Catalog.PaymentTypes.CHIPPER_CASH,
                "payoneer" => Catalog.PaymentTypes.PAYONEER,
                "upi-transfer" => Catalog.PaymentTypes.UPI_TRANSFER,
                "vodafone-cash-payment" => Catalog.PaymentTypes.VODAFONE_CACH_PAYMENT,
                "eversend" => Catalog.PaymentTypes.EVERSEND,
                "other-online-wallets" => Catalog.PaymentTypes.OTHER_ONLINE_WALLET,
                "myvanilla-prepaid-card" => Catalog.PaymentTypes.MYVANILA_PREPAID_CARD,
                "chime-instant-transfers" => Catalog.PaymentTypes.CHIME_INSTANT_TRANFERS,
                "advcash" => Catalog.PaymentTypes.ADVCASH,
                "imps-transfer" => Catalog.PaymentTypes.BANK_TRANSFER_IMPS,
                "mukuru" => Catalog.PaymentTypes.MUKURU,
                "paysafecard" => Catalog.PaymentTypes.PAYSAFECARD,
                "bluebird-american-express" => Catalog.PaymentTypes.BLUEBIRD_CARD,
                "transfast" => Catalog.PaymentTypes.TRANSFAST,
                "international-wire-transfer-swift" => Catalog.PaymentTypes.INTERNATIONAL_WIRE_SWIFT,
                "jazzcash" => Catalog.PaymentTypes.JAZZCASH,
                "phonepe" => Catalog.PaymentTypes.PHONEPE,
                "paytm-online-wallet" => Catalog.PaymentTypes.PAYTM,
                "prepaid-debit-card" => Catalog.PaymentTypes.CREDITCARD,
                "gcash" => Catalog.PaymentTypes.GCASH,
                "orange-money" => Catalog.PaymentTypes.ORANGE,
                "venmo" => Catalog.PaymentTypes.VENMO,
                "perfect-money" => Catalog.PaymentTypes.PERFECT_MONEY,
                "revolut" => Catalog.PaymentTypes.REVOLUT,
                "payeer" => Catalog.PaymentTypes.PAYEER,
                "sepa" => Catalog.PaymentTypes.SEPA,
                "cash-in-person" => Catalog.PaymentTypes.CASHU,
                "airtm" => Catalog.PaymentTypes.AIRTM,
                "webmoney" => Catalog.PaymentTypes.WEBMONEY,
                "current-pay" => Catalog.PaymentTypes.CURRENT_PAY,
                "bhim" => Catalog.PaymentTypes.BHIM,
                "mercado-pago" => Catalog.PaymentTypes.MERCADO_PAGO,
                "target-visa-gift-card" => Catalog.PaymentTypes.VISA,
                "n26" => Catalog.PaymentTypes.N26_BANK,
                "xpress-money-service" => Catalog.PaymentTypes.XPRESS_MONEY_SERVICE,
                "momo" => Catalog.PaymentTypes.MOMO,
                "qq-pay" => Catalog.PaymentTypes.QQ_PAY,
                "paymaya-wallet" => Catalog.PaymentTypes.PAYMAYA,
                "simple-bank-app" => Catalog.PaymentTypes.SIMPLE_BANK,
                "wave-mobile-wallet" => Catalog.PaymentTypes.SEND_WAVE,
                "flashpay-netspend" => Catalog.PaymentTypes.FLASHPAY_NETSPEND,
                "airpay" => Catalog.PaymentTypes.AIRPAY,
                "cash-by-mail" => Catalog.PaymentTypes.CASH_BY_MAIL,
                "nano" => Catalog.PaymentTypes.NANO,
                "tigo-pesa" => Catalog.PaymentTypes.TIGOPESA_TANZANIA,
                "rocket-remit" => Catalog.PaymentTypes.ROCKET_REMIT,
                "interac-e-transfer" => Catalog.PaymentTypes.INTERAC,
                "rushcard-prepaid-visa" => Catalog.PaymentTypes.RUSH_CARD_PREPAID_VISA,
                "abra" => Catalog.PaymentTypes.ABRA,
                "cardcom-transfer" => Catalog.PaymentTypes.CARDCOM,
                "qtum" => Catalog.PaymentTypes.QTUM,
                "astropay-direct" => Catalog.PaymentTypes.ASTROPAY,
                "faster-payment-system-fps" => Catalog.PaymentTypes.FAST_PAYMENT_SYSTEM,
                "esewa" => Catalog.PaymentTypes.ESEWA,
                "qiwi" => Catalog.PaymentTypes.QIWI,
                "pcs-prepaid-cash-services" => Catalog.PaymentTypes.PCS_PREPAID_CASH_SERVICE,
                "afriex" => Catalog.PaymentTypes.AFRIEX,
                "paysera-money-transfer" => Catalog.PaymentTypes.PAYSERA_MONEY_TRANSFER,
                "epay" => Catalog.PaymentTypes.EPAY,
                "accountnow-prepaid-card" => Catalog.PaymentTypes.ACCOUNTNOW_PREPAID_CARD,
                "equitel-mobile-money" => Catalog.PaymentTypes.EQUITEL_MOBILE_MONEY,
                "ecopayz" => Catalog.PaymentTypes.ECOPAYZ,
                "serve-to-serve" => Catalog.PaymentTypes.SERVE2SERVE,
                "grabpay" => Catalog.PaymentTypes.GRABPAY,
                "echeck" => Catalog.PaymentTypes.ECHECK,
                "azimo" => Catalog.PaymentTypes.AZIMO,
                "chase-quickpay" => Catalog.PaymentTypes.CHASE_QUICKPAY,
                "cardless-cash" => Catalog.PaymentTypes.CASHU,
                "bunq-transfer" => Catalog.PaymentTypes.BUNQ_TRANSFER,
                "ecocash" => Catalog.PaymentTypes.ECOCASH,
                "bill-payment" => Catalog.PaymentTypes.CASHH_LESS,
                "egiftercom-code" => Catalog.PaymentTypes.EGIFTERCOM_CODE,
                "stratis-strax" => Catalog.PaymentTypes.STRATIS_STRAX,
                "sofi-money-instant-transfer" => Catalog.PaymentTypes.SOFI_MOMEY_INSTANT_TRANSFER,
                "readydebit-prepaid-card" => Catalog.PaymentTypes.READYDEBIT_PREPAID_CARD,
                "iota-miota" => Catalog.PaymentTypes.IOTA_MIOTA,
                "fnb-e-wallet" => Catalog.PaymentTypes.FNB_E_WALLET,
                "cib-smart-wallet" => Catalog.PaymentTypes.CIB_SMART_WALLET,
                "etisalat-cash" => Catalog.PaymentTypes.ETISALAT_CASH,
                "rapid-transfer" => Catalog.PaymentTypes.RAPID_TRANSFER,
                "mobilepay" => Catalog.PaymentTypes.MOBILE_BALANCE,
                "bancolombia-cash-deposit" => Catalog.PaymentTypes.BANCOLOMBIA_CASH_DEPOSIT,
                "yoomoney" => Catalog.PaymentTypes.YANDEXMONEY,
                "tarjeta-uala" => Catalog.PaymentTypes.TARJETA_UALA,
                "expresspay" => Catalog.PaymentTypes.EXPRESSPAY,
                "plusgirot" => Catalog.PaymentTypes.PLUSGIROT,
                "monese-online-transfer" => Catalog.PaymentTypes.MONESE_ONLINE_TRANSFER,
                "uphold" => Catalog.PaymentTypes.UPHOLD,
                "paxos-standard-pax" => Catalog.PaymentTypes.PAXOS,
                "simbapay" => Catalog.PaymentTypes.SIMBA_PAY,
                "hello-paisa" => Catalog.PaymentTypes.HELLO_PAISA,
                "carbon" => Catalog.PaymentTypes.CARBON,
                "postepay" => Catalog.PaymentTypes.PostePay,
                "wells-fargo-surepay" => Catalog.PaymentTypes.WELS_FARGO_SUREPAY,
                "cashu" => Catalog.PaymentTypes.CASHU,
                "nbe-phone-cash" => Catalog.PaymentTypes.NBE_PHONE_CASH,
                "postal-money-order" => Catalog.PaymentTypes.POSTAL_MONEY_ORDER,
                "circle-pay" => Catalog.PaymentTypes.CIRCLE_PAY,
                "moneypak" => Catalog.PaymentTypes.MONEYPACK,
                "cellulant" => Catalog.PaymentTypes.CELULANT,
                "aza-finance" => Catalog.PaymentTypes.AZA_FINANCE,
                "bitlipa" => Catalog.PaymentTypes.BITLIPA,
                "idrt" => Catalog.PaymentTypes.IDRT,
                "chimpchange-mobile-banking" => Catalog.PaymentTypes.CHIMPCHANGE_MOBILE_BANKING,
                "bkash-e-wallet" => Catalog.PaymentTypes.BKASH_E_WALLET,
                "credits-cs" => Catalog.PaymentTypes.CREDITS_CS,
                "biliratryb" => Catalog.PaymentTypes.BILIRATRIB,
                "bnext" => Catalog.PaymentTypes.BNEXT,
                "costco-cash-card" => Catalog.PaymentTypes.COSTCO_CASH_CARD,
                "sofort" => Catalog.PaymentTypes.SOFORT,
                "payid" => Catalog.PaymentTypes.PAYID,
                "qnb-smart-wallet" => Catalog.PaymentTypes.QNB_SMART_WALLET,
                "line-pay" => Catalog.PaymentTypes.LINE_PAY,
                "brz" => Catalog.PaymentTypes.BRZ,
                "e-zwich" => Catalog.PaymentTypes.E_ZWICH,
                "paxos-gold-paxg" => Catalog.PaymentTypes.PAXOS,
                "opal-transfer" => Catalog.PaymentTypes.OPAL_TRANFER,
                "mcash-mobile-payment" => Catalog.PaymentTypes.MCASH_MOBILE_WALLET,
                "oxxo" => Catalog.PaymentTypes.OXXO,
                "tarjeta-prex" => Catalog.PaymentTypes.TARJETA_PREX,
                "kakaopay" => Catalog.PaymentTypes.KAKAO_PAY,
                "tele2" => Catalog.PaymentTypes.TELE2,
                "nganluong" => Catalog.PaymentTypes.NGANLUONG,
                "viettelpay" => Catalog.PaymentTypes.VIETTELPAY,
                "zalopay" => Catalog.PaymentTypes.ZALOPAY,
                "ononpay" => Catalog.PaymentTypes.ONOPAY,
                "icard" => Catalog.PaymentTypes.ICARD,
                "mobikwik-wallet" => Catalog.PaymentTypes.MOBIKWIK_WALLET,
                "doc" => Catalog.PaymentTypes.DOC,
                "emq-send" => Catalog.PaymentTypes.EMQ_SEND,
                "check" => Catalog.PaymentTypes.CHECK,
                "swish" => Catalog.PaymentTypes.SWISH,
                "paym" => Catalog.PaymentTypes.PAYM,
                "cashiers-check" => Catalog.PaymentTypes.CASHIERS_CHECK,
                "kroger-to-kroger-prepaid" => Catalog.PaymentTypes.KROGER_TO_KROGER_PREPAID,
                "interac-online" => Catalog.PaymentTypes.INTERAC,
                "square-up" => Catalog.PaymentTypes.SQUARE_CASH,
                "amazon-cash" => Catalog.PaymentTypes.AMAZON_CASH,
                "cashlib-vouchers" => Catalog.PaymentTypes.CASHLIB_VOUCHERS,
                "quickteller" => Catalog.PaymentTypes.QUICKTELLER,
                "mobivi" => Catalog.PaymentTypes.MOBIVI,
                "moca" => Catalog.PaymentTypes.MOCA,
                "gonderal" => Catalog.PaymentTypes.GONDERAL,
                "dotpay-wallet" => Catalog.PaymentTypes.DOTPAY_WALLET,
                "oxigen-wallet" => Catalog.PaymentTypes.OXIGEN_WALLET,
                "jiomoney" => Catalog.PaymentTypes.JIOMONEY,
                "freecharge" => Catalog.PaymentTypes.FREECHARGE,
                "getcarbon" => Catalog.PaymentTypes.GETCARBON,
                "kurepay" => Catalog.PaymentTypes.KUREPAY,
                "okpay" => Catalog.PaymentTypes.OKPAY,
                "akimbo" => Catalog.PaymentTypes.AKIMBO,
                "stripe" => Catalog.PaymentTypes.STRIPE,
                "ezremit" => Catalog.PaymentTypes.EZREMIT,
                "liqpay" => Catalog.PaymentTypes.LIQ_PAY,
                "discover-credit-cards" => Catalog.PaymentTypes.DISCOVER_CREDIT_CARDS,
                "mpayvn" => Catalog.PaymentTypes.MPAYVN,
                "yono" => Catalog.PaymentTypes.YONO,
                "pesalink" => Catalog.PaymentTypes.PESA_LINK,
                "ngnt" => Catalog.PaymentTypes.NGNT,
                "hubtel" => Catalog.PaymentTypes.HUBTEL,
                "movii" => Catalog.PaymentTypes.MOVII,
                "ozow" => Catalog.PaymentTypes.OZOW,
                "cnhc" => Catalog.PaymentTypes.CNHC,
                "payson" => Catalog.PaymentTypes.PAYSON,
                "kroger-recharge-card" => Catalog.PaymentTypes.KROGER_RECHARGE_CARD,
                "popmoney" => Catalog.PaymentTypes.POPMONEY,
                "paypower" => Catalog.PaymentTypes.PAYPOWER,
                "toss-wallet" => Catalog.PaymentTypes.TOSS_WALLET,
                "payoo" => Catalog.PaymentTypes.PAYOO,
                "payzapp" => Catalog.PaymentTypes.PAYZAPP,
                "bitrefill-balance-cards" => Catalog.PaymentTypes.BITREFILL_BALANCE_CARDS,
                "tikkie" => Catalog.PaymentTypes.TIKKIE,
                "remita" => Catalog.PaymentTypes.REMITA,
                "zengin-system" => Catalog.PaymentTypes.ZENGIN_SYSTEM,
                "pokerstars" => Catalog.PaymentTypes.POCKER_STARS,
                "boost-mobile" => Catalog.PaymentTypes.BOOST_MOBILE,
                "mango-card2card" => Catalog.PaymentTypes.MANGO_CARD2CARD,
                "payza" => Catalog.PaymentTypes.PAYZA,
                "pingit" => Catalog.PaymentTypes.PINGIT,
                "ugo-pay" => Catalog.PaymentTypes.UGOPAY,
                "voguepay" => Catalog.PaymentTypes.VOGUEPAY,
                "dmm-prepaid-card" => Catalog.PaymentTypes.DMM_PREPAID_CARD,
                "tarjeta-pago24" => Catalog.PaymentTypes.TARJETA_PAGO24,
                "pim" => Catalog.PaymentTypes.PIM,
                "pago-facil" => Catalog.PaymentTypes.PAGO_FACIL,
                "rapipago" => Catalog.PaymentTypes.RAPIPAGO,
                "payme" => Catalog.PaymentTypes.PAYME,
                "t-kash" => Catalog.PaymentTypes.T_CASH,
                "china-telecom-card" => Catalog.PaymentTypes.CHINA_TELECOM_CARD,
                "wari" => Catalog.PaymentTypes.WARI,
                "piggyvest" => Catalog.PaymentTypes.PIGGYVEST,
                "modo" => Catalog.PaymentTypes.MODO,
                "wapipay" => Catalog.PaymentTypes.WAPIPAY,
                "tpaga" => Catalog.PaymentTypes.TPAGA,
                "fliqpay" => Catalog.PaymentTypes.FLIQPAY,
                "ding-connect" => Catalog.PaymentTypes.DING_CONNECT,
                "solidtrust-pay" => Catalog.PaymentTypes.SOLID_TRUST_PAY,
                "straight-talk-reload" => Catalog.PaymentTypes.STRAIGHT_TALK_RELOAD,
                "fasapay-online-payment" => Catalog.PaymentTypes.FASAPAY_ONLINE_PAYMENT,
                "viabuy-card2card-transfer" => Catalog.PaymentTypes.VIABUY_CARD2CARD_TRANFER,
                "truemoney" => Catalog.PaymentTypes.TRUEMONEY,
                "unionpay-app" => Catalog.PaymentTypes.UNIONPAY_APP,
                "paga-wallet" => Catalog.PaymentTypes.PAGA_WALLET,
                "etsy" => Catalog.PaymentTypes.ETSY,
                "payu-wallet" => Catalog.PaymentTypes.PAYU_WALLET,
                "vbank" => Catalog.PaymentTypes.V_BANK,
                "uhuru" => Catalog.PaymentTypes.UHURU,
                "xago" => Catalog.PaymentTypes.XAGO,
                "pintu" => Catalog.PaymentTypes.PINTU,
                "domestic-wire-transfer"=>Catalog.PaymentTypes.SPECIFIC_BANK,

                _ => throw new InvalidPaymentTypeException(value)
            };
        }

        public Ad(Trader trader, Json.OfferJson.Data json)
        {
            Owner = trader;
            PxAdId = json.Id;
            IsBuy = json.OfferType != "buy";
            Price = json.FiatPricePerBtc;
            DisabledAt = json.Active ? null : DateTime.Now;
            MinAmount = json.FiatAmountRangeMin;
            MaxAmount = json.FiatAmountRangeMax;
            Terms = json.OfferTerms;
            PaymentType = ParsePaymentType(json.PaymentMethodSlug);
            Window = json.PaymentWindow;
            try
            {
                FiatCurrency = Enum.Parse<Catalog.Currencies>(json.CurrencyCode);
            }
            catch (ArgumentException)
            {
                throw new InvalidCurrencyException(json.CurrencyCode);
            }
            try
            {
                CryptoCurrency = Enum.Parse<Catalog.CryptoCurrencies>(json.CryptoCurrency);
            }
            catch (ArgumentException)
            {
                throw new InvalidCurrencyException(json.CryptoCurrency);
            }
        }

        public void Update(Data json)
        {
            IsBuy = json.OfferType != "buy";
            Price = json.FiatPricePerBtc;
            DisabledAt = json.Active ? null : DateTime.Now;
            MinAmount = json.FiatAmountRangeMin;
            MaxAmount = json.FiatAmountRangeMax;
            Terms = json.OfferTerms;
            PaymentType = ParsePaymentType(json.PaymentMethodSlug);
            Window = json.PaymentWindow;
            try
            {
                FiatCurrency = Enum.Parse<Catalog.Currencies>(json.CurrencyCode);
            }
            catch (ArgumentException)
            {
                throw new InvalidCurrencyException(json.CurrencyCode);
            }
            try
            {
                CryptoCurrency = Enum.Parse<Catalog.CryptoCurrencies>(json.CryptoCurrency);
            }
            catch (ArgumentException)
            {
                throw new InvalidCurrencyException(json.CryptoCurrency);
            }
            UpdatedAt = DateTime.Now;
            PriceUpdatedAt=DateTime.Now;
        }

        public void UpdatePrice(Offer json)
        {
            Price = json.FiatPricePerBtc;
            PriceUpdatedAt = DateTime.Now;
            DisabledAt = null;
        }

        public void Disable()
        {
            DisabledAt=DateTime.Now;
            PriceUpdatedAt = DateTime.Now;
        }
    }
}