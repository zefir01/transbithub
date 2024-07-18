export class PaymentTypes {
    private items: Map<string, string[]> = new Map<string, string[]>();

    constructor() {
        this.items.set("ALL", [
            "ADVCASH",
            "CASH_AT_ATM",
            "CASH_DEPOSIT",
            "CASHU",
            "CREDITCARD",
            "INTERNATIONAL_WIRE_SWIFT",
            "MONEYBOOKERS",
            "MONEYGRAM",
            "NATIONAL_BANK",
            "NETELLER",
            "OKPAY",
            "OTHER_ONLINE_WALLET",
            "OTHER_REMITTANCE",
            "OTHER",
            "PAXUM",
            "PAYEER",
            "PAYONEER",
            "PAYPAL",
            "PAYZA",
            "PERFECT_MONEY",
            "RIA",
            "SOLIDTRUSTPAY",
            "SPECIFIC_BANK",
            "TRANSFERWISE",
            "WEBMONEY",
            "WECHAT",
            "WORLDREMIT",
            "WU",
        ]);
        this.items.set("RU", [
            "SBERBANK",
            "QIWI",
            "TINKOFF",
            "QIWI_TERMINAL",
            "TELE2",
            "YANDEXMONEY",
        ]);
        this.items.set("FR", [
            "LYDIA",
        ]);
        this.items.set("DK", [
            "MOBILEPAY_DANSKE_BANK_DK",
        ]);
        this.items.set("CA", [
            "INTERAC",
            "VANILLA",
        ]);
        this.items.set("DE", [
            "ALIPAY",
            "ASTROPAY",
            "BANK_TRANSFER_IMPS",
            "BITMAIN_COUPON",
            "CASHIERS_CHECK",
            "CHASE_QUICKPAY",
            "DWOLLA",
            "EASYPAISA",
            "ECOCASH",
            "GOOGLEWALLET",
            "HAL_CASH",
            "HYPERWALLET",
            "MOBILEPAY_DANSKE_BANK",
            "MPESA_KENYA",
            "MPESA_TANZANIA",
            "PAYM",
            "PAYPALMYCASH",
            "PAYTM",
            "PINGIT",
            "PostePay",
            "PYC",
            "QIWI",
            "RELOADIT",
            "SERVE2SERVE",
            "SQUARE_CASH",
            "SUPERFLASH",
            "SWISH",
            "TELE2",
            "TELEGRAMATIC_ORDER",
            "TIGOPESA_TANZANIA",
            "VENMO",
            "VIPPS",
            "WALMART2WALMART",
            "XOOM",
            "YANDEXMONEY",
            "ZELLE",
        ]);
    }

    public get(key: string): string[] {
        let all = this.items.get("ALL");
        let spec = this.items.get(key);
        if (all === undefined)
            throw new Error("Error in PaymentTypes");
        if (spec === undefined)
            return all;
        return spec.concat(all);
    }
}

