import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    active: string;
    deleted: string;
    payed: string;
    pending: string;
    err1: string;
    err2: string;
    info: string;
    refund: string;
    fiatAmount: string;
    cryptoAmount: string;
    invoice: string;
    pieces: string;
    toRefund: string
}

export const data = {
    ru: {
        active: "Активный",
        deleted: "Удален",
        payed: "Оплачен",
        pending: "Ожидает оплату",
        err1: "Вы не можете вернуть средства анонимному пользователю. Воспользуйтесь внешними средствами.",
        err2: "Нет доступных частей для возврата денег. Деньги за все части возвращены или возвращаются.",
        info: "Будет создан счет с теми же условиями, что и счет оплаченые покупателем. Вы сможете оплатить\n" +
            " созданный счет криптовалютой с баланса или фиатной валютой через сделку.",
        refund: "Вернуть",
        fiatAmount: "Сумма в фиатной валюте",
        cryptoAmount: "Сумма в криптовалюте",
        invoice: "Счет: ",
        pieces: "Части: ",
        toRefund: "Счета на возврат:"
    },
    en: {
        active: "Active",
        deleted: "Deleted",
        payed: "Payed",
        pending: "Pending pay",
        err1: "You cannot refund to an anonymous user. Use external means.",
        err2: "No refund parts available. All parts are refunded or refunding.",
        info: "An invoice will be created with the same conditions as the invoice paid by the buyer. You can pay \n " +
            "created invoice with cryptocurrency from your balance or with fiat currency through a deal.",
        refund: "Refund",
        fiatAmount: "Fiat amount",
        cryptoAmount: "Cryptocurrency amount",
        invoice: "Invoice: ",
        pieces: "Pieces: ",
        toRefund: "Invoices to refund:"

    }
};