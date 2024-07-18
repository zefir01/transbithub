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
    QIWI: string;
    RELOADIT: string;
    SERVE2SERVE: string;
    SQUARE_CASH: string;
    SUPERFLASH: string;
    SWISH: string;
    TELE2: string;
    TELEGRAMATIC_ORDER: string;
    TIGOPESA_TANZANIA: string;
    VENMO: string;
    VIPPS: string;
    WALMART2WALMART: string;
    XOOM: string;
    YANDEXMONEY: string;
    ZELLE: string;
    QIWI_TERMINAL: string;
    SBERBANK: string;
    TINKOFF: string;
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
        TINKOFF: "Тинькофф"
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
        TINKOFF: "Tinkoff"
    }
};
