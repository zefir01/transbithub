import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IMyMap {
    get(key: string): string;
}
type ttt = typeof data;
export class myMap implements IMyMap {
    private readonly items: any;

    constructor(data: ttt) {
        this.items = new LocalizedStrings(data);
    }

    public get(key: string) {
        if (key in this.items)
            return this.items.getString(key);
        return key;
    }
}


export interface IStrings extends LocalizedStringsMethods {
    ADVCASH: string;
    CASH_AT_ATM: string;
    CASH_DEPOSIT: string;
    CASHU: string;
    CREDITCARD: string;
    INTERNATIONAL_WIRE_SWIFT: string;
    MONEYBOOKERS: string;
    MONEYGRAM: string;
    NATIONAL_BANK: string;
    NETELLER: string;
    OKPAY: string;
    OTHER_ONLINE_WALLET: string;
    OTHER_REMITTANCE: string;
    OTHER: string;
    PAXUM: string;
    PAYEER: string;
    PAYONEER: string;
    PAYPAL: string;
    PAYZA: string;
    PERFECT_MONEY: string;
    RIA: string;
    SOLIDTRUSTPAY: string;
    SPECIFIC_BANK: string;
    TRANSFERWISE: string;
    WEBMONEY: string;
    WECHAT: string;
    WORLDREMIT: string;
    WU: string;
    QIWI: string;
    TELE2: string;
    YANDEXMONEY: string;
    LYDIA: string;
    MOBILEPAY_DANSKE_BANK_DK: string;
    INTERAC: string;
    VANILLA: string;
    ALIPAY: string;
    ASTROPAY: string;
    BANK_TRANSFER_IMPS: string;
    BITMAIN_COUPON: string;
    CASHIERS_CHECK: string;
    CHASE_QUICKPAY: string;
    DWOLLA: string;
    EASYPAISA: string;
    ECOCASH: string;
    GOOGLEWALLET: string;
    HAL_CASH: string;
    HYPERWALLET: string;
    MOBILEPAY_DANSKE_BANK: string;
    MPESA_KENYA: string;
    MPESA_TANZANIA: string;
    PAYM: string;
    PAYPALMYCASH: string;
    PAYTM: string;
    PINGIT: string;
    PostePay: string;
    PYC: string;
    RELOADIT: string;
    SERVE2SERVE: string;
    SQUARE_CASH: string;
    SUPERFLASH: string;
    SWISH: string;
    TELEGRAMATIC_ORDER: string;
    TIGOPESA_TANZANIA: string;
    VENMO: string;
    VIPPS: string;
    WALMART2WALMART: string;
    XOOM: string;
    ZELLE: string;
    QIWI_TERMINAL: string;
    SBERBANK: string;
    TINKOFF: string;

    //AGGREGATOR
    VTB: string;
    ALFA_BANK: string;
    SBP: string;
    RAIFFEZEN_BANK: string;
    MASTERCARD: string;
    VISA: string;
    OTKRITIE_BANK: string;
    MTS_BANK: string;
    MIR: string;
    POCHTA_BANK: string;
    SOVKOM_BANK: string;
    GAZPROM_BANK: string;
    PS_BANK: string;
    ROS_BANK: string;
    MTS_MONEY: string;
    URALSIB_BANK: string;
    ROCKET_BANK: string;
    RUSSIAN_STANDART_BANK: string;
    KUKURUZA_BANK: string;
    UBRR: string;
    RNCB_BANK: string;
    AVANGARD_BANK: string;
    TOCHKA_BANK: string;
    MOSCOW_BANK: string;
    MOBILE_BALANCE: string;
    CITY_BANK: string;
    KORONA_PAY: string;
    VK_PAY: string;
    UNI_CREDIT_BANK: string;
    SPB_BANK: string;
    CASH: string;
    FORA_BANK: string;
    PAY_SEND: string;
    ANELIK: string;
    BIC: string;
    CONTACT: string;
    INTERKASSA: string;
    LIQ_PAY: string;
    WESTERN_UNION_BANK: string;
    AMAZON_GIFT_CARD: string;
    EBAY_GIFT_CARD: string;
    GIFT_CARD: string;
    GOODS: string;
    SEPA: string;
    SKRILL: string;
    CREDIT_BANK_OF_MOSCOW: string;
    REVOLUT: string;
    PSN_GIFT_CARD: string;
    CASHH_LESS: string;

    //BYN
    STEAM: string;
    CAPITALIST: string;
    BELARUS_BANK: string;
    ERIP: string;
    MT_BANK: string;
    PRIOR_BANK: string;
    BELINVEST_BANK: string;
    BELGAZPROM_BANK: string;
    BPS_SBER_BANK: string;
    DABRABYT: string;
    TECHNO_BANK: string;
    IDEA_BANK: string;
    PARITET_BANK: string;
    RESHENIE_BANK: string;
    BNB: string;
    BELVEB_BANK: string;
    BSB_BANK: string;
    BTA_BANK: string;
    MOSCOW_MINSK_BANK: string;
    BELAGROPROM_BANK: string;

    //KES
    LEMOMADE_MPESA: string;
    MPESA: string;
    KCB: string;
    EQIITY: string;
    PESA_LINK: string;
    CBA_LOOP: string;

    //KZT
    KASPI_GOLD: string;
    ASTANA_BANK: string;

    //UAH
    MONO_BANK: string;
    PRIVAT_BANK: string;
    OSCHAD_BANK: string;
    FUIB: string;
    A_BANK: string;
    OTP: string;
    CONCORD_BANK: string;
    EASY_PAY: string;
    GLOBAL_MONEY: string;
    IZI_BANK: string;

    //USD
    POCKER_STARS: string;

    //Local
    AIRTM: string;
    UPHOLD: string;
    MTN: string;
    PHONEPE: string;
    UPI_TRANSFER: string;
    APPLE_PAY: string;
    PAYID: string;
    TWINT: string;
    CHIPPER_CASH: string;
    BLUEBIRD_CARD: string;
    BHIM: string;
    GREENDOT_CARD: string;
    FREECHARGE: string;
    ORANGE: string;

    //PAXFUL
    REMITLY: string;
    FLUTTERWAVE_BARTER: string;
    GO_BANK: string;
    SEND_WAVE: string;
    AMERICAN_EXPRESS: string;
    VODAFONE_CACH_PAYMENT: string;
    EVERSEND: string;
    MYVANILA_PREPAID_CARD: string;
    CHIME_INSTANT_TRANFERS: string;
    MUKURU: string;
    PAYSAFECARD: string;
    TRANSFAST: string;
    JAZZCASH: string;
    GCASH: string;
    CURRENT_PAY: string;
    MERCADO_PAGO: string;
    N26_BANK: string;
    XPRESS_MONEY_SERVICE: string;
    MOMO: string;
    FACEBOOOK_PAYMENT: string;
    QQ_PAY: string;
    PAYMAYA: string;
    SIMPLE_BANK: string;
    FLASHPAY_NETSPEND: string;
    AIRPAY: string;
    CASH_BY_MAIL: string;
    NANO: string;
    ROCKET_REMIT: string;
    RUSH_CARD_PREPAID_VISA: string;
    ABRA: string;
    CARDCOM: string;
    QTUM: string;
    FAST_PAYMENT_SYSTEM: string;
    ESEWA: string;
    PCS_PREPAID_CASH_SERVICE: string;
    AFRIEX: string;
    PAYSERA_MONEY_TRANSFER: string;
    EPAY: string;
    ACCOUNTNOW_PREPAID_CARD: string;
    EQUITEL_MOBILE_MONEY: string;
    ECOPAYZ: string;
    GRABPAY: string;
    ECHECK: string;
    AZIMO: string;
    BUNQ_TRANSFER: string;
    EGIFTERCOM_CODE: string;
    STRATIS_STRAX: string;
    SOFI_MOMEY_INSTANT_TRANSFER: string;
    READYDEBIT_PREPAID_CARD: string;
    IOTA_MIOTA: string;
    FNB_E_WALLET: string;
    CIB_SMART_WALLET: string;
    ETISALAT_CASH: string;
    RAPID_TRANSFER: string;
    BANCOLOMBIA_CASH_DEPOSIT: string;
    TARJETA_UALA: string;
    EXPRESSPAY: string;
    PLUSGIROT: string;
    MONESE_ONLINE_TRANSFER: string;
    PAXOS: string;
    SIMBA_PAY: string;
    HELLO_PAISA: string;
    CARBON: string;
    WELS_FARGO_SUREPAY: string;
    NBE_PHONE_CASH: string;
    POSTAL_MONEY_ORDER: string;
    CIRCLE_PAY: string;
    MONEYPACK: string;
    CELULANT: string;
    AZA_FINANCE: string;
    BITLIPA: string;
    IDRT: string;
    CHIMPCHANGE_MOBILE_BANKING: string;
    BKASH_E_WALLET: string;
    CREDITS_CS: string;
    BILIRATRIB: string;
    BNEXT: string;
    COSTCO_CASH_CARD: string;
    SOFORT: string;
    QNB_SMART_WALLET: string;
    LINE_PAY: string;
    BRZ: string;
    E_ZWICH: string;
    OPAL_TRANFER: string;
    MCASH_MOBILE_WALLET: string;
    OXXO: string;
    TARJETA_PREX: string;
    KAKAO_PAY: string;
    NGANLUONG: string;
    VIETTELPAY: string;
    ZALOPAY: string;
    ONOPAY: string;
    ICARD: string;
    MOBIKWIK_WALLET: string;
    DOC: string;
    EMQ_SEND: string;
    CHECK: string;
    HILTON_HHONORS_POINTS: string;
    KROGER_TO_KROGER_PREPAID: string;
    AMAZON_CASH: string;
    CASHLIB_VOUCHERS: string;
    QUICKTELLER: string;
    MOBIVI: string;
    MOCA: string;
    GONDERAL: string;
    DOTPAY_WALLET: string;
    OXIGEN_WALLET: string;
    JIOMONEY: string;
    GETCARBON: string;
    KUREPAY: string;
    AKIMBO: string;
    STRIPE: string;
    EZREMIT: string;
    DISCOVER_CREDIT_CARDS: string;
    MPAYVN: string;
    YONO: string;
    NGNT: string;
    HUBTEL: string;
    MOVII: string;
    OZOW: string;
    CNHC: string;
    PAYSON: string;
    KROGER_RECHARGE_CARD: string;
    POPMONEY: string;
    PAYPOWER: string;
    TOSS_WALLET: string;
    PAYOO: string;
    PAYZAPP: string;
    BITREFILL_BALANCE_CARDS: string;
    TIKKIE: string;
    REMITA: string;
    ZENGIN_SYSTEM: string;
    BOOST_MOBILE: string;
    MANGO_CARD2CARD: string;
    UGOPAY: string;
    VOGUEPAY: string;
    DMM_PREPAID_CARD: string;
    TARJETA_PAGO24: string;
    PIM: string;
    PAGO_FACIL: string;
    RAPIPAGO: string;
    PAYME: string;
    T_CASH: string;
    CHINA_TELECOM_CARD: string;
    WARI: string;
    PIGGYVEST: string;
    MODO: string;
    WAPIPAY: string;
    TPAGA: string;
    FLIQPAY: string;
    DING_CONNECT: string;
    SOLID_TRUST_PAY: string;
    STRAIGHT_TALK_RELOAD: string;
    FASAPAY_ONLINE_PAYMENT: string;
    VIABUY_CARD2CARD_TRANFER: string;
    TRUEMONEY: string;
    UNIONPAY_APP: string;
    PAGA_WALLET: string;
    ETSY: string;
    PAYU_WALLET: string;
    V_BANK: string;
    SLIDE_PAY_WALLET: string;
    UHURU: string;
    SPECTRA: string;
    XAGO: string;
    PINTU: string;
}

export const data ={
    ru: {
        ADVCASH: "AdvCash",
        CASH_AT_ATM: "Внесение через банкомат",
        CASH_DEPOSIT: "Внесение через банк",
        CASHU: "Наличными",
        CREDITCARD: "Пластиковая карта",
        INTERNATIONAL_WIRE_SWIFT: "Международный перевод SWIFT",
        MONEYBOOKERS: "MoneyBookers",
        MONEYGRAM: "MoneyGram",
        NATIONAL_BANK: "Национальный банк",
        NETELLER: "Neteller",
        OKPAY: "OkPay",
        OTHER_ONLINE_WALLET: "Другой онлайн кошелек",
        OTHER_REMITTANCE: "Другой перевод",
        OTHER: "Другое",
        PAXUM: "Paxum",
        PAYEER: "Payeer",
        PAYONEER: "Payoneer",
        PAYPAL: "PayPal",
        PAYZA: "PayZa",
        PERFECT_MONEY: "Perfect Money",
        RIA: "Ria",
        SOLIDTRUSTPAY: "SolidTrustPay",
        SPECIFIC_BANK: "Конкретный банк",
        TRANSFERWISE: "Transferwise",
        WEBMONEY: "WebMoney",
        WECHAT: "WeChat",
        WORLDREMIT: "WorldRemit",
        WU: "WU",
        LYDIA: "Lydia",
        MOBILEPAY_DANSKE_BANK_DK: "MobilePay.dk",
        INTERAC: "Interac",
        VANILLA: "Vanilla",
        ALIPAY: "AliPay",
        ASTROPAY: "AstroPay",
        BANK_TRANSFER_IMPS: "Банк IMPS",
        BITMAIN_COUPON: "BitMain купон",
        CASHIERS_CHECK: "Кассовый чек",
        CHASE_QUICKPAY: "Chase QuickPay",
        DWOLLA: "Dwolla",
        EASYPAISA: "EasyPaisa",
        ECOCASH: "EcoCash",
        GOOGLEWALLET: "Google кошелек",
        HAL_CASH: "HalCash",
        HYPERWALLET: "HyperWallet",
        MOBILEPAY_DANSKE_BANK: "Мобильный платеж Danske Bank",
        MPESA_KENYA: "M-Pesa Kenya",
        MPESA_TANZANIA: "M-Pesa Tanzania",
        PAYM: "Paym",
        PAYPALMYCASH: "PayPal Cash Card",
        PAYTM: "Paytm",
        PINGIT: "Pingit",
        PostePay: "Платеж через почту",
        PYC: "Pyc",
        QIWI: "Qiwi",
        RELOADIT: "Reloadit",
        SERVE2SERVE: "Serve2Serve",
        SQUARE_CASH: "Square Cash",
        SUPERFLASH: "SuperFlash",
        SWISH: "Swish",
        TELE2: "TELE2",
        TELEGRAMATIC_ORDER: "Telegramatic Order",
        TIGOPESA_TANZANIA: "Tigo Pesa Tanzania",
        VENMO: "Venmo",
        VIPPS: "Vipps",
        WALMART2WALMART: "Walmart2Walmart",
        XOOM: "Xoom",
        YANDEXMONEY: "Yandex money",
        ZELLE: "Zelle",
        QIWI_TERMINAL: "Qiwi терминал",
        SBERBANK: "Сбербанк",
        TINKOFF: "Тинькофф",

        //AGGREGATOR
        VTB: "ВТБ Банк",
        ALFA_BANK: "Альфа банк",
        SBP: "СБП Банк",
        RAIFFEZEN_BANK: "Райффайзен банк",
        MASTERCARD: "Mastercard",
        VISA: "VISA",
        OTKRITIE_BANK: "Открытие банк",
        MTS_BANK: "МТС банк",
        MIR: "МИР",
        POCHTA_BANK: "Почта банк",
        SOVKOM_BANK: "Совком банк",
        GAZPROM_BANK: "Газпром банк",
        PS_BANK: "ПС банк",
        ROS_BANK: "Рос банк",
        MTS_MONEY: "МТС Деньги",
        URALSIB_BANK: "Уралсиб банк",
        ROCKET_BANK: "Рокет банк",
        RUSSIAN_STANDART_BANK: "Русский стандарт банк",
        KUKURUZA_BANK: "Кукуруза банк",
        UBRR: "Уральский Банк (УБРиР)",
        RNCB_BANK: "РНКБ",
        AVANGARD_BANK: "Авангард банк",
        TOCHKA_BANK: "Точка банк",
        MOSCOW_BANK: "Банк Москвы",
        MOBILE_BALANCE: "Пополнение телефона",
        CITY_BANK: "Сити банк",
        KORONA_PAY: "Золотая Корона",
        VK_PAY: "VK Pay",
        UNI_CREDIT_BANK: "Юникредит банк",
        SPB_BANK: "Банк Санкт-Петербург",
        FORA_BANK: "ФорБанк",
        PAY_SEND: "PaySend",
        ANELIK: "Anelik",
        BIC: "BIC",
        CONTACT: "Contact",
        INTERKASSA: "Interkassa",
        LIQ_PAY: "LiqPay",
        WESTERN_UNION_BANK: "Western Union банк",
        SEPA: "Sepa",
        SKRILL: "Skrill",
        CREDIT_BANK_OF_MOSCOW: "Московский кредитный банк",
        REVOLUT: "Revolut",
        CASHH_LESS: "Безналичная оплата",

        //BYN
        STEAM: "Steam",
        CAPITALIST: "Capitalist",
        BELARUS_BANK: "Беларусбанк",
        ERIP: "Ерип",
        MT_BANK: "МТБанк",
        PRIOR_BANK: "Приорбанк",
        BELINVEST_BANK: "Белинвестбанк",
        BELGAZPROM_BANK: "Белгазпромбанк",
        BPS_SBER_BANK: "БПС-Сбербанк",
        DABRABYT: "Дабрабыт банк",
        TECHNO_BANK: "Технобанк",
        IDEA_BANK: "Идея Банк",
        PARITET_BANK: "Паритет банк",
        RESHENIE_BANK: "Решение банк",
        BNB: "БНБ банк",
        BELVEB_BANK: "БелВЭБ банк",
        BSB_BANK: "БСБ банк",
        BTA_BANK: "БТА банк",
        MOSCOW_MINSK_BANK: "Москва-Минск банк",
        BELAGROPROM_BANK: "Белагропром банк",

        //KES
        LEMOMADE_MPESA: "Lemonade → MPesa",
        MPESA: "M-Pesa",
        KCB: "KCB банк",
        EQIITY: "Equity",
        PESA_LINK: "Pesa Link",
        CBA_LOOP: "CBA Loop",

        //KZT
        KASPI_GOLD: "Kaspi Gold",
        ASTANA_BANK: "Банк Астаны",

        //UAH
        MONO_BANK: "Моно банк",
        PRIVAT_BANK: "ПриватБанк",
        OSCHAD_BANK: "Ощадбанк",
        FUIB: "ПУМБ",
        A_BANK: "А-банк",
        OTP: "ОТП банк",
        CONCORD_BANK: "Конкорд банк",
        EASY_PAY: "EasyPay",
        GLOBAL_MONEY: "GlobalMoney",
        IZI_BANK: "izibank",

        //USD
        POCKER_STARS: "Pocker Stars",

        //Local
        AIRTM: "Airtm",
        UPHOLD: "Uphold",
        MTN: "MTN",
        PHONEPE: "PhonePe",
        UPI_TRANSFER: "UPI Funds Transfer",
        APPLE_PAY: "Apple Pay",
        PAYID: "PayID",
        TWINT: "TWINT",
        CHIPPER_CASH: "Chipper Cash",
        BLUEBIRD_CARD: "Bluebird card",
        BHIM: "BHIM",
        GREENDOT_CARD: "Green Dot card",
        FREECHARGE: "FreeCharge",
        ORANGE: "Orange",

        //PAXFUL
        REMITLY: "Remitly",
        FLUTTERWAVE_BARTER: "Barter by Flutterwave",
        GO_BANK: "GoBank",
        SEND_WAVE: "Gobank Money Transfer",
        AMERICAN_EXPRESS: "American Express Card",
        VODAFONE_CACH_PAYMENT: "Vodafone Cash Payment",
        EVERSEND: "Eversend",
        CHIME_INSTANT_TRANFERS: "Chime instant transfers",
        MUKURU: "Mukuru",
        PAYSAFECARD: "Paysafecard",
        TRANSFAST: "Transfast",
        JAZZCASH: "JazzCash",
        GCASH: "GCash",
        CURRENT_PAY: "Current Pay",
        MERCADO_PAGO: "Mercado Pago",
        N26_BANK: "N26",
        XPRESS_MONEY_SERVICE: "Xpress Money Service",
        MOMO: "Momo",
        QQ_PAY: "QQ Pay",
        PAYMAYA: "PayMaya Wallet",
        SIMPLE_BANK: "Simple Bank App",
        FLASHPAY_NETSPEND: "Flashpay Netspend",
        AIRPAY: "AirPay",
        CASH_BY_MAIL: "Cash By Mail",
        NANO: "Nano",
        ROCKET_REMIT: "Rocket Remit",
        RUSH_CARD_PREPAID_VISA: "RushCard prepaid Visa",
        ABRA: "Abra",
        CARDCOM: "Card.com Transfer",
        QTUM: "Qtum",
        FAST_PAYMENT_SYSTEM: "Faster Payment System (FPS)",
        ESEWA: "Esewa",
        PCS_PREPAID_CASH_SERVICE: "PCS Prepaid Cash Services",
        AFRIEX: "Afriex",
        PAYSERA_MONEY_TRANSFER: "Paysera Money Transfer",
        EPAY: "ePay",
        ACCOUNTNOW_PREPAID_CARD: "AccountNow Prepaid Card",
        EQUITEL_MOBILE_MONEY: "Equitel Mobile Money",
        ECOPAYZ: "ecoPayz",
        GRABPAY: "GrabPay",
        ECHECK: "eCheck",
        AZIMO: "Azimo",
        BUNQ_TRANSFER: "Bunq Transfer",
        EGIFTERCOM_CODE: "eGifter.com code",
        STRATIS_STRAX: "Stratis STRAX",
        SOFI_MOMEY_INSTANT_TRANSFER: "SoFi Money Instant Transfer",
        READYDEBIT_PREPAID_CARD: "READYdebit Prepaid Card",
        IOTA_MIOTA: "IOTA-MIOTA",
        FNB_E_WALLET: "FNB E-WALLET",
        CIB_SMART_WALLET: "CIB smart wallet",
        ETISALAT_CASH: "Etisalat cash",
        RAPID_TRANSFER: "Rapid Transfer",
        BANCOLOMBIA_CASH_DEPOSIT: "Bancolombia Cash Deposit",
        TARJETA_UALA: "Tarjeta UALA",
        EXPRESSPAY: "Expresspay",
        PLUSGIROT: "PlusGirot",
        MONESE_ONLINE_TRANSFER: "Monese Online Transfer",
        PAXOS: "Paxos Standard (PAX)",
        SIMBA_PAY: "Simbapay",
        HELLO_PAISA: "Hello Paisa",
        CARBON: "Carbon",
        WELS_FARGO_SUREPAY: "Wells Fargo SurePay",
        NBE_PHONE_CASH: "NBE Phone cash",
        POSTAL_MONEY_ORDER: "Postal Money Order",
        CIRCLE_PAY: "Circle Pay",
        MONEYPACK: "MoneyPak",
        CELULANT: "Cellulant",
        AZA_FINANCE: "AZA Finance",
        BITLIPA: "BitLipa",
        IDRT: "IDRT",
        CHIMPCHANGE_MOBILE_BANKING: "ChimpChange Mobile Banking",
        BKASH_E_WALLET: "Bkash E-Wallet",
        CREDITS_CS: "Credits (CS)",
        BILIRATRIB: "Bilira(TRYB)",
        BNEXT: "Bnext",
        COSTCO_CASH_CARD: "Costco Cash Card",
        SOFORT: "Sofort",
        QNB_SMART_WALLET: "QNB smart wallet",
        LINE_PAY: "Line Pay",
        BRZ: "BRZ",
        E_ZWICH: "E-zwich",
        OPAL_TRANFER: "Opal Transfer",
        MCASH_MOBILE_WALLET: "mCash Mobile Payment",
        OXXO: "OXXO",
        TARJETA_PREX: "Tarjeta PREX",
        KAKAO_PAY: "KaKaoPay",
        NGANLUONG: "NganLuong",
        VIETTELPAY: "ViettelPay",
        ZALOPAY: "ZaloPay",
        ONOPAY: "Ononpay",
        ICARD: "iCard",
        MOBIKWIK_WALLET: "MobiKwik Wallet",
        DOC: "DOC",
        EMQ_SEND: "EMQ Send",
        CHECK: "Check",
        KROGER_TO_KROGER_PREPAID: "Kroger to Kroger Prepaid",
        AMAZON_CASH: "Amazon Cash",
        CASHLIB_VOUCHERS: "CASHlib Vouchers",
        QUICKTELLER: "Quickteller",
        MOBIVI: "Mobivi",
        MOCA: "Moca",
        GONDERAL: "GönderAL",
        DOTPAY_WALLET: "DotPay Wallet",
        OXIGEN_WALLET: "Oxigen Wallet",
        JIOMONEY: "JioMoney",
        GETCARBON: "Getcarbon",
        KUREPAY: "Kurepay",
        AKIMBO: "Akimbo",
        STRIPE: "Stripe",
        EZREMIT: "EzRemit",
        DISCOVER_CREDIT_CARDS: "Discover Credit Cards",
        MPAYVN: "mPayVN",
        YONO: "YONO",
        NGNT: "NGNT",
        HUBTEL: "Hubtel",
        MOVII: "Movii",
        OZOW: "Ozow",
        CNHC: "CNHC",
        PAYSON: "PaySon",
        KROGER_RECHARGE_CARD: "Kroger Recharge Card",
        POPMONEY: "Popmoney",
        PAYPOWER: "Paypower",
        TOSS_WALLET: "Toss Wallet",
        PAYOO: "Payoo",
        PAYZAPP: "PayZapp",
        BITREFILL_BALANCE_CARDS: "Bitrefill Balance Cards",
        TIKKIE: "Tikkie",
        REMITA: "Remita",
        ZENGIN_SYSTEM: "Zengin System",
        BOOST_MOBILE: "Boost Mobile",
        MANGO_CARD2CARD: "Mango Card2Card",
        UGOPAY: "UGO Pay",
        VOGUEPAY: "VoguePay",
        DMM_PREPAID_CARD: "DMM Prepaid Card",
        TARJETA_PAGO24: "Tarjeta PAGO24",
        PIM: "PIM",
        PAGO_FACIL: "Pago Fácil",
        RAPIPAGO: "Rapipago",
        PAYME: "PayMe",
        T_CASH: "T Cash",
        CHINA_TELECOM_CARD: "China Telecom Card",
        WARI: "Wari",
        PIGGYVEST: "Piggyvest",
        MODO: "MODO",
        WAPIPAY: "Wapipay",
        TPAGA: "Tpaga",
        FLIQPAY: "Fliqpay",
        DING_CONNECT: "Ding Connect",
        SOLID_TRUST_PAY: "SolidTrust Pay",
        STRAIGHT_TALK_RELOAD: "Straight Talk Reload",
        FASAPAY_ONLINE_PAYMENT: "FasaPay Online Payment",
        VIABUY_CARD2CARD_TRANFER: "VIABUY Card2Card Transfer",
        TRUEMONEY: "TrueMoney",
        UNIONPAY_APP: "UnionPay (App)",
        PAGA_WALLET: "Paga Wallet",
        ETSY: "Etsy",
        PAYU_WALLET: "PayU Wallet",
        V_BANK: "VBank",
        UHURU: "Uhuru",
        XAGO: "Xago",
        PINTU: "Pintu",
        MYVANILA_PREPAID_CARD: "MyVanilla prepaid card"
    },
    en: {
        ADVCASH: "AdvCash",
        CASH_AT_ATM: "ATM deposit",
        CASH_DEPOSIT: "Bank deposit",
        CASHU: "In cash",
        CREDITCARD: "A plastic card",
        INTERNATIONAL_WIRE_SWIFT: "International transfer SWIFT",
        MONEYBOOKERS: "MoneyBookers",
        MONEYGRAM: "MoneyGram",
        NATIONAL_BANK: "National bank",
        NETELLER: "Neteller",
        OKPAY: "OkPay",
        OTHER_ONLINE_WALLET: "Other online wallet",
        OTHER_REMITTANCE: "Other remittance",
        OTHER: "Ither",
        PAXUM: "Paxum",
        PAYEER: "Payeer",
        PAYONEER: "Payoneer",
        PAYPAL: "PayPal",
        PAYZA: "PayZa",
        PERFECT_MONEY: "Perfect Money",
        RIA: "Ria",
        SOLIDTRUSTPAY: "SolidTrustPay",
        SPECIFIC_BANK: "Specific bank",
        TRANSFERWISE: "Transferwise",
        WEBMONEY: "WebMoney",
        WECHAT: "WeChat",
        WORLDREMIT: "WorldRemit",
        WU: "WU",
        LYDIA: "Lydia",
        MOBILEPAY_DANSKE_BANK_DK: "MobilePay.dk",
        INTERAC: "Interac",
        VANILLA: "Vanilla",
        ALIPAY: "AliPay",
        ASTROPAY: "AstroPay",
        BANK_TRANSFER_IMPS: "Банк IMPS",
        BITMAIN_COUPON: "BitMain купон",
        CASHIERS_CHECK: "Cashiers check",
        CHASE_QUICKPAY: "Chase QuickPay",
        DWOLLA: "Dwolla",
        EASYPAISA: "EasyPaisa",
        ECOCASH: "EcoCash",
        GOOGLEWALLET: "Google wallet",
        HAL_CASH: "HalCash",
        HYPERWALLET: "HyperWallet",
        MOBILEPAY_DANSKE_BANK: "Mobile pay Danske Bank",
        MPESA_KENYA: "M-Pesa Kenya",
        MPESA_TANZANIA: "M-Pesa Tanzania",
        PAYM: "Paym",
        PAYPALMYCASH: "PayPal Cash Card",
        PAYTM: "Paytm",
        PINGIT: "Pingit",
        PostePay: "Poste pay",
        PYC: "Pyc",
        QIWI: "Qiwi",
        RELOADIT: "Reloadit",
        SERVE2SERVE: "Serve2Serve",
        SQUARE_CASH: "Square Cash",
        SUPERFLASH: "SuperFlash",
        SWISH: "Swish",
        TELE2: "TELE2",
        TELEGRAMATIC_ORDER: "Telegramatic Order",
        TIGOPESA_TANZANIA: "Tigo Pesa Tanzania",
        VENMO: "Venmo",
        VIPPS: "Vipps",
        WALMART2WALMART: "Walmart2Walmart",
        XOOM: "Xoom",
        YANDEXMONEY: "Yandex money",
        ZELLE: "Zelle",
        QIWI_TERMINAL: "Qiwi terminal",
        SBERBANK: "Sberbank",
        TINKOFF: "Tinkoff",

        //AGGREGATOR
        VTB: "VTB Bank",
        ALFA_BANK: "Alfa bank",
        SBP: "SBP bank",
        RAIFFEZEN_BANK: "Raiffeisen bank",
        MASTERCARD: "Mastercard",
        VISA: "VISA",
        OTKRITIE_BANK: "Open bank",
        MTS_BANK: "МТС bank",
        MIR: "MIR",
        POCHTA_BANK: "Pochta bank",
        SOVKOM_BANK: "Sovkom bank",
        GAZPROM_BANK: "Gazprom bank",
        PS_BANK: "PS bank",
        ROS_BANK: "Ros bank",
        MTS_MONEY: "МТС Money",
        URALSIB_BANK: "Uralsib bank",
        ROCKET_BANK: "Rocket bank",
        RUSSIAN_STANDART_BANK: "Russian standard bank",
        KUKURUZA_BANK: "Kukuruza bank",
        UBRR: "Ural bank",
        RNCB_BANK: "RNKB",
        AVANGARD_BANK: "Avangard bank",
        TOCHKA_BANK: "Tochka bank",
        MOSCOW_BANK: "Moscow bank",
        MOBILE_BALANCE: "Top-up phone balance",
        CITY_BANK: "City bank",
        KORONA_PAY: "Gold Crown",
        VK_PAY: "VK Pay",
        UNI_CREDIT_BANK: "Unicredit bank",
        SPB_BANK: "St. Petersburg bank",
        FORA_BANK: "FOR bank",
        PAY_SEND: "PaySend",
        ANELIK: "Anelik",
        BIC: "BIC",
        CONTACT: "Contact",
        INTERKASSA: "Interkassa",
        LIQ_PAY: "LiqPay",
        WESTERN_UNION_BANK: "Western Union bank",
        SEPA: "Sepa",
        SKRILL: "Skrill",
        CREDIT_BANK_OF_MOSCOW: "Moscow credit bank",
        REVOLUT: "Revolut",
        CASHH_LESS: "Cashless payment",

        //BYN
        STEAM: "Steam",
        CAPITALIST: "Capitalist",
        BELARUS_BANK: "Belarus bank",
        ERIP: "ERIP",
        MT_BANK: "MT bank",
        PRIOR_BANK: "Prior bank",
        BELINVEST_BANK: "BelInvest bank",
        BELGAZPROM_BANK: "BelGazprom bank",
        BPS_SBER_BANK: "BPS-Sberbank",
        DABRABYT: "Dabrabyt bank",
        TECHNO_BANK: "Techno bank",
        IDEA_BANK: "Idea bank",
        PARITET_BANK: "Paritet bank",
        RESHENIE_BANK: "Reshenie bank",
        BNB: "BNB bank",
        BELVEB_BANK: "BelVeb bank",
        BSB_BANK: "BSP bank",
        BTA_BANK: "BTA bank",
        MOSCOW_MINSK_BANK: "Moscow-Minsk bank",
        BELAGROPROM_BANK: "BelAgroProm bank",

        //KES
        LEMOMADE_MPESA: "Lemonade → MPesa",
        MPESA: "M-Pesa",
        KCB: "KCB bank",
        EQIITY: "Equity",
        PESA_LINK: "Pesa Link",
        CBA_LOOP: "CBA Loop",

        //KZT
        KASPI_GOLD: "Kaspi Gold",
        ASTANA_BANK: "Astana bank",

        //UAH
        MONO_BANK: "Mono bank",
        PRIVAT_BANK: "Privat bank",
        OSCHAD_BANK: "Oschad bank",
        FUIB: "FUIB",
        A_BANK: "A-bank",
        OTP: "OTP bank",
        CONCORD_BANK: "Concorde bank",
        EASY_PAY: "EasyPay",
        GLOBAL_MONEY: "GlobalMoney",
        IZI_BANK: "izibank",

        //USD
        POCKER_STARS: "Pocker Stars",

        //Local
        AIRTM: "Airtm",
        UPHOLD: "Uphold",
        MTN: "MTN",
        PHONEPE: "PhonePe",
        UPI_TRANSFER: "UPI Funds Transfer",
        APPLE_PAY: "Apple Pay",
        PAYID: "PayID",
        TWINT: "TWINT",
        CHIPPER_CASH: "Chipper Cash",
        BLUEBIRD_CARD: "Bluebird card",
        BHIM: "BHIM",
        GREENDOT_CARD: "Green Dot card",
        FREECHARGE: "FreeCharge",
        ORANGE: "Orange",

        //PAXFUL
        REMITLY: "Remitly",
        FLUTTERWAVE_BARTER: "Barter by Flutterwave",
        GO_BANK: "GoBank",
        SEND_WAVE: "Gobank Money Transfer",
        AMERICAN_EXPRESS: "American Express Card",
        VODAFONE_CACH_PAYMENT: "Vodafone Cash Payment",
        EVERSEND: "Eversend",
        CHIME_INSTANT_TRANFERS: "Chime instant transfers",
        MUKURU: "Mukuru",
        PAYSAFECARD: "Paysafecard",
        TRANSFAST: "Transfast",
        JAZZCASH: "JazzCash",
        GCASH: "GCash",
        CURRENT_PAY: "Current Pay",
        MERCADO_PAGO: "Mercado Pago",
        N26_BANK: "N26",
        XPRESS_MONEY_SERVICE: "Xpress Money Service",
        MOMO: "Momo",
        QQ_PAY: "QQ Pay",
        PAYMAYA: "PayMaya Wallet",
        SIMPLE_BANK: "Simple Bank App",
        FLASHPAY_NETSPEND: "Flashpay Netspend",
        AIRPAY: "AirPay",
        CASH_BY_MAIL: "Cash By Mail",
        NANO: "Nano",
        ROCKET_REMIT: "Rocket Remit",
        RUSH_CARD_PREPAID_VISA: "RushCard prepaid Visa",
        ABRA: "Abra",
        CARDCOM: "Card.com Transfer",
        QTUM: "Qtum",
        FAST_PAYMENT_SYSTEM: "Faster Payment System (FPS)",
        ESEWA: "Esewa",
        PCS_PREPAID_CASH_SERVICE: "PCS Prepaid Cash Services",
        AFRIEX: "Afriex",
        PAYSERA_MONEY_TRANSFER: "Paysera Money Transfer",
        EPAY: "ePay",
        ACCOUNTNOW_PREPAID_CARD: "AccountNow Prepaid Card",
        EQUITEL_MOBILE_MONEY: "Equitel Mobile Money",
        ECOPAYZ: "ecoPayz",
        GRABPAY: "GrabPay",
        ECHECK: "eCheck",
        AZIMO: "Azimo",
        BUNQ_TRANSFER: "Bunq Transfer",
        EGIFTERCOM_CODE: "eGifter.com code",
        STRATIS_STRAX: "Stratis STRAX",
        SOFI_MOMEY_INSTANT_TRANSFER: "SoFi Money Instant Transfer",
        READYDEBIT_PREPAID_CARD: "READYdebit Prepaid Card",
        IOTA_MIOTA: "IOTA-MIOTA",
        FNB_E_WALLET: "FNB E-WALLET",
        CIB_SMART_WALLET: "CIB smart wallet",
        ETISALAT_CASH: "Etisalat cash",
        RAPID_TRANSFER: "Rapid Transfer",
        BANCOLOMBIA_CASH_DEPOSIT: "Bancolombia Cash Deposit",
        TARJETA_UALA: "Tarjeta UALA",
        EXPRESSPAY: "Expresspay",
        PLUSGIROT: "PlusGirot",
        MONESE_ONLINE_TRANSFER: "Monese Online Transfer",
        PAXOS: "Paxos Standard (PAX)",
        SIMBA_PAY: "Simbapay",
        HELLO_PAISA: "Hello Paisa",
        CARBON: "Carbon",
        WELS_FARGO_SUREPAY: "Wells Fargo SurePay",
        NBE_PHONE_CASH: "NBE Phone cash",
        POSTAL_MONEY_ORDER: "Postal Money Order",
        CIRCLE_PAY: "Circle Pay",
        MONEYPACK: "MoneyPak",
        CELULANT: "Cellulant",
        AZA_FINANCE: "AZA Finance",
        BITLIPA: "BitLipa",
        IDRT: "IDRT",
        CHIMPCHANGE_MOBILE_BANKING: "ChimpChange Mobile Banking",
        BKASH_E_WALLET: "Bkash E-Wallet",
        CREDITS_CS: "Credits (CS)",
        BILIRATRIB: "Bilira(TRYB)",
        BNEXT: "Bnext",
        COSTCO_CASH_CARD: "Costco Cash Card",
        SOFORT: "Sofort",
        QNB_SMART_WALLET: "QNB smart wallet",
        LINE_PAY: "Line Pay",
        BRZ: "BRZ",
        E_ZWICH: "E-zwich",
        OPAL_TRANFER: "Opal Transfer",
        MCASH_MOBILE_WALLET: "mCash Mobile Payment",
        OXXO: "OXXO",
        TARJETA_PREX: "Tarjeta PREX",
        KAKAO_PAY: "KaKaoPay",
        NGANLUONG: "NganLuong",
        VIETTELPAY: "ViettelPay",
        ZALOPAY: "ZaloPay",
        ONOPAY: "Ononpay",
        ICARD: "iCard",
        MOBIKWIK_WALLET: "MobiKwik Wallet",
        DOC: "DOC",
        EMQ_SEND: "EMQ Send",
        CHECK: "Check",
        KROGER_TO_KROGER_PREPAID: "Kroger to Kroger Prepaid",
        AMAZON_CASH: "Amazon Cash",
        CASHLIB_VOUCHERS: "CASHlib Vouchers",
        QUICKTELLER: "Quickteller",
        MOBIVI: "Mobivi",
        MOCA: "Moca",
        GONDERAL: "GönderAL",
        DOTPAY_WALLET: "DotPay Wallet",
        OXIGEN_WALLET: "Oxigen Wallet",
        JIOMONEY: "JioMoney",
        GETCARBON: "Getcarbon",
        KUREPAY: "Kurepay",
        AKIMBO: "Akimbo",
        STRIPE: "Stripe",
        EZREMIT: "EzRemit",
        DISCOVER_CREDIT_CARDS: "Discover Credit Cards",
        MPAYVN: "mPayVN",
        YONO: "YONO",
        NGNT: "NGNT",
        HUBTEL: "Hubtel",
        MOVII: "Movii",
        OZOW: "Ozow",
        CNHC: "CNHC",
        PAYSON: "PaySon",
        KROGER_RECHARGE_CARD: "Kroger Recharge Card",
        POPMONEY: "Popmoney",
        PAYPOWER: "Paypower",
        TOSS_WALLET: "Toss Wallet",
        PAYOO: "Payoo",
        PAYZAPP: "PayZapp",
        BITREFILL_BALANCE_CARDS: "Bitrefill Balance Cards",
        TIKKIE: "Tikkie",
        REMITA: "Remita",
        ZENGIN_SYSTEM: "Zengin System",
        BOOST_MOBILE: "Boost Mobile",
        MANGO_CARD2CARD: "Mango Card2Card",
        UGOPAY: "UGO Pay",
        VOGUEPAY: "VoguePay",
        DMM_PREPAID_CARD: "DMM Prepaid Card",
        TARJETA_PAGO24: "Tarjeta PAGO24",
        PIM: "PIM",
        PAGO_FACIL: "Pago Fácil",
        RAPIPAGO: "Rapipago",
        PAYME: "PayMe",
        T_CASH: "T Cash",
        CHINA_TELECOM_CARD: "China Telecom Card",
        WARI: "Wari",
        PIGGYVEST: "Piggyvest",
        MODO: "MODO",
        WAPIPAY: "Wapipay",
        TPAGA: "Tpaga",
        FLIQPAY: "Fliqpay",
        DING_CONNECT: "Ding Connect",
        SOLID_TRUST_PAY: "SolidTrust Pay",
        STRAIGHT_TALK_RELOAD: "Straight Talk Reload",
        FASAPAY_ONLINE_PAYMENT: "FasaPay Online Payment",
        VIABUY_CARD2CARD_TRANFER: "VIABUY Card2Card Transfer",
        TRUEMONEY: "TrueMoney",
        UNIONPAY_APP: "UnionPay (App)",
        PAGA_WALLET: "Paga Wallet",
        ETSY: "Etsy",
        PAYU_WALLET: "PayU Wallet",
        V_BANK: "VBank",
        UHURU: "Uhuru",
        XAGO: "Xago",
        PINTU: "Pintu",
        MYVANILA_PREPAID_CARD: "MyVanilla prepaid card"
    }
};
