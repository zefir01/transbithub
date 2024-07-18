import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    amount: string;
    partner: string;
    validTo: string;
    load: string;
    New: string;
    delete: string;
    refund: string;
    payment: string;
    pieces: string;
    status: string;
    active: string;
    pendingPay: string;
    noPieces: string;
    payed: string;
}

export const data = {
    ru: {
        amount: "Сумма",
        partner: "Партнер",
        validTo: "Действует до",
        load: "Загрузить еще",
        New: "Новый",
        delete: "Удалить",
        refund: "Возврат по ",
        payment: "платежу ",
        pieces: "Части: ",
        status: "Статус",
        active: "Активный",
        pendingPay: "Ожидает оплату",
        noPieces: "Закончились части",
        payed: "Оплачен",

    },
    en: {
        amount: "Amount",
        partner: "Partner",
        validTo: "Valid until",
        load: "Load more",
        New: "New",
        delete: "Delete",
        refund: "Refund for",
        payment: "payment ",
        pieces: "Pieces: ",
        status: "Status",
        active: "Active",
        pendingPay: "Pending pay",
        noPieces: "Out of pieces",
        payed: "Payed",
    }
};