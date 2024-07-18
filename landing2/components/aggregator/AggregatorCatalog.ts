// noinspection SpellCheckingInspection,JSUnusedGlobalSymbols

export enum Currencies
{
    ANG,
    USD,
    BDT,
    EUR,
    XOF,
    BGN,
    BAM,
    BBD,
    XPF,
    BMD,
    BND,
    BOB,
    BHD,
    BIF,
    BTN,
    JMD,
    NOK,
    BWP,
    WST,
    BRL,
    BSD,
    GBP,
    BYN,
    BZD,
    RUB,
    RWF,
    RSD,
    TMT,
    TJS,
    RON,
    NZD,
    GTQ,
    XAF,
    JPY,
    GYD,
    GEL,
    XCD,
    GNF,
    GMD,
    DKK,
    GIP,
    GHS,
    OMR,
    TND,
    JOD,
    HRK,
    HTG,
    HUF,
    HKD,
    HNL,
    AUD,
    ILS,
    PYG,
    IQD,
    PAB,
    PGK,
    PEN,
    PKR,
    PHP,
    PLN,
    ZMW,
    MAD,
    EGP,
    ZAR,
    VND,
    SBD,
    ETB,
    SOS,
    SAR,
    ERN,
    MDL,
    MGA,
    UZS,
    MMK,
    MOP,
    MNT,
    MKD,
    MUR,
    MWK,
    MVR,
    UGX,
    TZS,
    MYR,
    MXN,
    SHP,
    FJD,
    FKP,
    NIO,
    NAD,
    VUV,
    NGN,
    NPR,
    CHF,
    COP,
    CNY,
    CLP,
    CAD,
    CDF,
    CZK,
    CRC,
    CVE,
    CUP,
    SZL,
    SYP,
    KGS,
    KES,
    SSP,
    SRD,
    KHR,
    KMF,
    STN,
    KRW,
    KWD,
    SLL,
    SCR,
    KZT,
    KYD,
    SGD,
    SEK,
    SDG,
    DOP,
    DJF,
    YER,
    DZD,
    UYU,
    LBP,
    LAK,
    TWD,
    TTD,
    TRY,
    LKR,
    TOP,
    LRD,
    LSL,
    THB,
    LYD,
    AED,
    AFN,
    ISK,
    IRR,
    AMD,
    ALL,
    AOA,
    ARS,
    AWG,
    INR,
    AZN,
    IDR,
    UAH,
    QAR,
    MZN,
    VES,
    MRU
}
export enum CryptoCurrencies
{
    BTC,
    ETH,
    LTC,
    DOGE,
    USDT,
    RUBM,
    BCH,
    DASH,
    USDC,
    DAI,
    MCR,
    MDT
}

export enum AggregatorSources{
    None,
    BitZlato,
    LocalBitcoins,
    Paxful
}

export enum PaymentTypes
{
    ADVCASH,
    CASH_AT_ATM,
    CASH_DEPOSIT,
    CASHU,
    CREDITCARD,
    INTERNATIONAL_WIRE_SWIFT,
    MONEYBOOKERS,
    MONEYGRAM,
    NATIONAL_BANK,
    NETELLER,
    OKPAY,
    OTHER_ONLINE_WALLET,
    OTHER_REMITTANCE,
    OTHER,
    PAXUM,
    PAYEER,
    PAYONEER,
    PAYPAL,
    PAYZA,
    PERFECT_MONEY,
    RIA,
    SOLIDTRUSTPAY,
    SPECIFIC_BANK,
    TRANSFERWISE,
    WEBMONEY,
    WECHAT,
    WORLDREMIT,
    WU,
    QIWI,
    TELE2,
    YANDEXMONEY,
    LYDIA,
    MOBILEPAY_DANSKE_BANK_DK,
    INTERAC,
    VANILLA,
    ALIPAY,
    ASTROPAY,
    BANK_TRANSFER_IMPS,
    BITMAIN_COUPON,
    CASHIERS_CHECK,
    CHASE_QUICKPAY,
    DWOLLA,
    EASYPAISA,
    ECOCASH,
    GOOGLEWALLET,
    HAL_CASH,
    HYPERWALLET,
    MOBILEPAY_DANSKE_BANK,
    MPESA_KENYA,
    MPESA_TANZANIA,
    PAYM,
    PAYPALMYCASH,
    PAYTM,
    PINGIT,
    PostePay,
    PYC,
    RELOADIT,
    SERVE2SERVE,
    SQUARE_CASH,
    SUPERFLASH,
    SWISH,
    TELEGRAMATIC_ORDER,
    TIGOPESA_TANZANIA,
    VENMO,
    VIPPS,
    WALMART2WALMART,
    XOOM,
    ZELLE,
    QIWI_TERMINAL,
    SBERBANK,
    TINKOFF,

    //AGGREGATOR
    VTB,
    ALFA_BANK,
    SBP,
    RAIFFEZEN_BANK,
    MASTERCARD,
    VISA,
    OTKRITIE_BANK,
    MTS_BANK,
    MIR,
    POCHTA_BANK,
    SOVKOM_BANK,
    GAZPROM_BANK,
    PS_BANK,
    ROS_BANK,
    MTS_MONEY,
    URALSIB_BANK,
    ROCKET_BANK,
    RUSSIAN_STANDART_BANK,
    KUKURUZA_BANK,
    UBRR,
    RNCB_BANK,
    AVANGARD_BANK,
    TOCHKA_BANK,
    MOSCOW_BANK,
    MOBILE_BALANCE,
    CITY_BANK,
    KORONA_PAY,
    VK_PAY,
    UNI_CREDIT_BANK,
    SPB_BANK,
    CASH,
    FORA_BANK,
    PAY_SEND,
    ANELIK,
    BIC,
    CONTACT,
    INTERKASSA,
    LIQ_PAY,
    WESTERN_UNION_BANK,
    AMAZON_GIFT_CARD,
    EBAY_GIFT_CARD,
    GIFT_CARD,
    GOODS,
    SEPA,
    SKRILL,
    CREDIT_BANK_OF_MOSCOW,
    REVOLUT,
    PSN_GIFT_CARD,
    CASHH_LESS,

    //BYN
    STEAM,
    CAPITALIST,
    BELARUS_BANK,
    ERIP,
    MT_BANK,
    PRIOR_BANK,
    BELINVEST_BANK,
    BELGAZPROM_BANK,
    BPS_SBER_BANK,
    DABRABYT,
    TECHNO_BANK,
    IDEA_BANK,
    PARITET_BANK,
    RESHENIE_BANK,
    BNB,
    BELVEB_BANK,
    BSB_BANK,
    BTA_BANK,
    MOSCOW_MINSK_BANK,
    BELAGROPROM_BANK,

    //KES
    LEMOMADE_MPESA,
    MPESA,
    KCB,
    EQIITY,
    PESA_LINK,
    CBA_LOOP,

    //KZT
    KASPI_GOLD,
    ASTANA_BANK,

    //UAH
    MONO_BANK,
    PRIVAT_BANK,
    OSCHAD_BANK,
    FUIB,
    A_BANK,
    OTP,
    CONCORD_BANK,
    EASY_PAY,
    GLOBAL_MONEY,
    IZI_BANK,

    //USD
    POCKER_STARS,

    //Local
    AIRTM,
    UPHOLD,
    MTN,
    PHONEPE,
    UPI_TRANSFER,
    APPLE_PAY,
    PAYID,
    TWINT,
    CHIPPER_CASH,
    BLUEBIRD_CARD,
    BHIM,
    GREENDOT_CARD,
    FREECHARGE,
    ORANGE,

    //PAXFUL
    REMITLY,
    FLUTTERWAVE_BARTER,
    GO_BANK,
    SEND_WAVE,
    AMERICAN_EXPRESS,
    VODAFONE_CACH_PAYMENT,
    EVERSEND,
    MYVANILA_PREPAID_CARD,
    CHIME_INSTANT_TRANFERS,
    MUKURU,
    PAYSAFECARD,
    TRANSFAST,
    JAZZCASH,
    GCASH,
    CURRENT_PAY,
    MERCADO_PAGO,
    N26_BANK,
    XPRESS_MONEY_SERVICE,
    MOMO,
    QQ_PAY,
    PAYMAYA,
    SIMPLE_BANK,
    FLASHPAY_NETSPEND,
    AIRPAY,
    CASH_BY_MAIL,
    NANO,
    ROCKET_REMIT,
    RUSH_CARD_PREPAID_VISA,
    ABRA,
    CARDCOM,
    QTUM,
    FAST_PAYMENT_SYSTEM,
    ESEWA,
    PCS_PREPAID_CASH_SERVICE,
    AFRIEX,
    PAYSERA_MONEY_TRANSFER,
    EPAY,
    ACCOUNTNOW_PREPAID_CARD,
    EQUITEL_MOBILE_MONEY,
    ECOPAYZ,
    GRABPAY,
    ECHECK,
    AZIMO,
    BUNQ_TRANSFER,
    EGIFTERCOM_CODE,
    STRATIS_STRAX,
    SOFI_MOMEY_INSTANT_TRANSFER,
    READYDEBIT_PREPAID_CARD,
    IOTA_MIOTA,
    FNB_E_WALLET,
    CIB_SMART_WALLET,
    ETISALAT_CASH,
    RAPID_TRANSFER,
    BANCOLOMBIA_CASH_DEPOSIT,
    TARJETA_UALA,
    EXPRESSPAY,
    PLUSGIROT,
    MONESE_ONLINE_TRANSFER,
    PAXOS,
    SIMBA_PAY,
    HELLO_PAISA,
    CARBON,
    WELS_FARGO_SUREPAY,
    NBE_PHONE_CASH,
    POSTAL_MONEY_ORDER,
    CIRCLE_PAY,
    MONEYPACK,
    CELULANT,
    AZA_FINANCE,
    BITLIPA,
    IDRT,
    CHIMPCHANGE_MOBILE_BANKING,
    BKASH_E_WALLET,
    CREDITS_CS,
    BILIRATRIB,
    BNEXT,
    COSTCO_CASH_CARD,
    SOFORT,
    QNB_SMART_WALLET,
    LINE_PAY,
    BRZ,
    E_ZWICH,
    OPAL_TRANFER,
    MCASH_MOBILE_WALLET,
    OXXO,
    TARJETA_PREX,
    KAKAO_PAY,
    NGANLUONG,
    VIETTELPAY,
    ZALOPAY,
    ONOPAY,
    ICARD,
    MOBIKWIK_WALLET,
    DOC,
    EMQ_SEND,
    CHECK,
    HILTON_HHONORS_POINTS,
    KROGER_TO_KROGER_PREPAID,
    AMAZON_CASH,
    CASHLIB_VOUCHERS,
    QUICKTELLER,
    MOBIVI,
    MOCA,
    GONDERAL,
    DOTPAY_WALLET,
    OXIGEN_WALLET,
    JIOMONEY,
    GETCARBON,
    KUREPAY,
    AKIMBO,
    STRIPE,
    EZREMIT,
    DISCOVER_CREDIT_CARDS,
    MPAYVN,
    YONO,
    NGNT,
    HUBTEL,
    MOVII,
    OZOW,
    CNHC,
    PAYSON,
    KROGER_RECHARGE_CARD,
    POPMONEY,
    PAYPOWER,
    TOSS_WALLET,
    PAYOO,
    PAYZAPP,
    BITREFILL_BALANCE_CARDS,
    TIKKIE,
    REMITA,
    ZENGIN_SYSTEM,
    BOOST_MOBILE,
    MANGO_CARD2CARD,
    UGOPAY,
    VOGUEPAY,
    DMM_PREPAID_CARD,
    TARJETA_PAGO24,
    PIM,
    PAGO_FACIL,
    RAPIPAGO,
    PAYME,
    T_CASH,
    CHINA_TELECOM_CARD,
    WARI,
    PIGGYVEST,
    MODO,
    WAPIPAY,
    TPAGA,
    FLIQPAY,
    DING_CONNECT,
    SOLID_TRUST_PAY,
    STRAIGHT_TALK_RELOAD,
    FASAPAY_ONLINE_PAYMENT,
    VIABUY_CARD2CARD_TRANFER,
    TRUEMONEY,
    UNIONPAY_APP,
    PAGA_WALLET,
    ETSY,
    PAYU_WALLET,
    V_BANK,
    UHURU,
    XAGO,
    PINTU
}