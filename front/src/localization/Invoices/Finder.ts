import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    invoice: string;
    payment: string;
    placeHolder: string;
    find: string;
}

export const data = {
    ru: {
        invoice: "Счет",
        payment: "Платеж",
        placeHolder: "Введите номер счета или платежа",
        find: "Найти",

    },
    en: {
        invoice: "Invoice",
        payment: "Payment",
        placeHolder: "Enter invoice or payment number",
        find: "Find",
    }
};