import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    buyBtc: string;
    buyBtcInfo: string;
    buyBtcInfo1: string;
    buyBtcAction1: string;
    buyBtcAction2: string;
    buyBtcAction3: string;
    payInvoice: string;
    pauInvoiceInfo: string;
    invoiceNumber: string;
    payInvoiceActions: string;
    payInvoiceAction1: string;
    payInvoiceAction2: string;
    payInvoiceAction3: string;
    payInvoiceAction4: string;
    usePromise: string;
    sellPromise: string;
    receivePromise: string;
}

export const data = {
    ru: {
        title: "Что вы хотите сделать ?",
        info: "Для проведения операции нужно ответить на несколько вопросов.",
        buyBtc: "Купить биткоины",
        buyBtcInfo: "Купить биткоины за фиатные деньги.",
        buyBtcInfo1: "Использование купленных биткоинов:",
        buyBtcAction1: "Зачислить на баланс для оплаты счетов или продажи",
        buyBtcAction2: "Вывести на внешний Bitcoin кошелек",
        buyBtcAction3: "Создать Промис",
        payInvoice: "Оплатить счет",
        pauInvoiceInfo: "Оплатить счет для покупки товаров или услуг.",
        invoiceNumber: "Вам нужно иметь номер счета.",
        payInvoiceActions: "Можно оплатить способами:",
        payInvoiceAction1: "Фиатной валютой, через сделку",
        payInvoiceAction2: "С баланса",
        payInvoiceAction3: "Через Lightning Network",
        payInvoiceAction4: "Промисом",
        usePromise: "Использовать Промис",
        sellPromise: "Продать Промис за фиатную валюту",
        receivePromise: "Зачислить на баланс",

    },
    en: {
        title: "What do you want to do ?",
        info: "To carry out the operation, you need to answer several questions.",
        buyBtc: "Buy Bitcoins",
        buyBtcInfo: "Buy bitcoins for fiat money.",
        buyBtcInfo1: "Using purchased bitcoins:",
        buyBtcAction1: "Add to balance to pay bills or sell",
        buyBtcAction2: "Withdraw to external Bitcoin wallet",
        buyBtcAction3: "Create Promise",
        payInvoice: "Pay invoice",
        pauInvoiceInfo: "Pay an invoice for the purchase of goods or services.",
        invoiceNumber: "You need to have an account number.",
        payInvoiceActions: "You can pay in the following ways:",
        payInvoiceAction1: "Fiat currency, through a transaction",
        payInvoiceAction2: "From balance",
        payInvoiceAction3: "Through the Lightning Network",
        payInvoiceAction4: "By Promise",
        usePromise: "Use Promise",
        sellPromise: "Sell Promise for Fiat",
        receivePromise: "Add to balance",
    }
};