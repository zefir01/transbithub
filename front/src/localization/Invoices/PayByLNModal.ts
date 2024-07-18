import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    header: string;
    info: string;
}

export const data = {
    ru: {
        header: "Запрос платежа для оплаты счета. Срок оплаты 1 час.",
        info: "Скопируйте запрос платежа:",

    },
    en: {
        header: "Payment request to pay invoice. Payment term 1 hour.",
        info: "Copy the payment request:",
    }
};