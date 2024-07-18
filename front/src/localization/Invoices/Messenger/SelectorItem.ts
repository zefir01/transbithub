import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    invoice: string;
    rate: string;
    payments: string;
    payment: string;
    newMessage: string;
}

export const data = {
    ru: {
        invoice: "Счет:",
        rate: "Рейтинг: ",
        payments: "Платежей:",
        payment: "Платеж:",
        newMessage: "Новое сообщение"
    },
    en: {
        invoice: "Invoice:",
        rate: "Rate: ",
        payments: "Payments:",
        payment: "Payment",
        newMessage: "New message"
    }
};