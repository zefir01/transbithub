import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info: string;
    request: string;
    cancel: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Используйте QR код или скопируйте запрос.",
        info: "Срок оплаты: 1 час.",
        request: "Запрос:",
        cancel: "Отменить"
    },
    en: {
        back: "Back",
        title: "Use QR code or copy the request.",
        info: "Payment term: 1 hour.",
        request: "Request:",
        cancel: "Cancel"
    }
};