import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    reasons: string;
    youCancel: string;
    sellerCancel: string;
    invoiceDeleted: string;
    youCancelPayment: string;
    lnExpired: string;
    done: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Покупка отменена",
        reasons: "Возможные причины:",
        youCancel: "Вы отменили сделку",
        sellerCancel: "Продавец биткоинов отменил сделку",
        invoiceDeleted: "Счет был удален",
        youCancelPayment: "Платеж был отменен вами",
        lnExpired: "Истек срок действия запроса платежа Lightning Network",
        done: "Завершить"
    },
    en: {
        back: "Back",
        title: "Purchase canceled",
        reasons: "Possible reasons:",
        youCancel: "You cancel the deal",
        sellerCancel: "Bitcoin seller canceled the deal",
        invoiceDeleted: "Invoice has been deleted",
        youCancelPayment: "The payment was canceled by you",
        lnExpired: "Lightning Network payment request expired",
        done: "Complete"
    }
};