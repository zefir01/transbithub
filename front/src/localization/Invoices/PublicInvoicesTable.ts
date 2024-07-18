import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    piecesPrice: string;
    pieces: string;
    minAmount: string;
    maxAmount: string;
    more: string;
    delete: string;
    secrets: string;
    status: string;
    active: string;
    pendingPay: string;
    noPieces: string;
    payed: string;
}

export const data = {
    ru: {
        piecesPrice: "Цена за часть",
        pieces: "Части",
        minAmount: "Минимальная сумма",
        maxAmount: "Максимальная сумма",
        more: "Загрузить еще",
        delete: "Удалить",
        secrets: "Секретов осталось",
        status: "Статус",
        active: "Активный",
        pendingPay: "Ожидает оплату",
        noPieces: "Закончились части",
        payed: "Оплачен",
    },
    en: {
        piecesPrice: "Price per piece",
        pieces: "Pieces",
        minAmount: "Minimal amount",
        maxAmount: "Maximum amount",
        more: "More",
        delete: "Delete",
        secrets: "Secrets left",
        status: "Status",
        active: "Active",
        pendingPay: "Pending pay",
        noPieces: "Out of pieces",
        payed: "Payed",
    }
};