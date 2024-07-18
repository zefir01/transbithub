import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    New: string;
    amount: string;
    partner: string;
    time: string;
    more: string;
    statusPending: string;
    statusPaid: string;
    statusCanceled: string;
    status: string;
    cancel: string;
    refund: string;
    payment: string;
    pieces: string;
    invoice: string;
}

export const data = {
    ru: {
        New: "Новый",
        amount: "Сумма",
        block: "Заблокировать партнера",
        partner: "Партнер",
        time: "Время",
        more: "Загрузить еще",
        statusPending: "Ожидает оплату",
        statusPaid: "Оплачен",
        statusCanceled: "Отменен",
        status: "Статус",
        cancel: "Отменить",
        refund: "Возврат по ",
        payment: "платежу ",
        pieces: "Части: ",
        invoice: "Счет"
    },
    en: {
        New: "New",
        amount: "Amount",
        block: "Block partner",
        partner: "Partner",
        time: "Time",
        more: "Load more",
        statusPending: "Pending pay",
        statusPaid: "Paid",
        statusCanceled: "Canceled",
        status: "Status",
        cancel: "Cancel",
        refund: "Refund for",
        payment: "payment ",
        pieces: "Pieces: ",
        invoice: "Invoice"
    }
};