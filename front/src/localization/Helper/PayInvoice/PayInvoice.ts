import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    notFound: string;
    back: string;
    title: string;
    info: string;
    ph: string;
}

export const data = {
    ru: {
        notFound: "Счет не найден.",
        back: "Назад",
        title: "Поиск счета",
        info: "Введите номер счета и нажмите кнопку \"Найти\"",
        ph: "Введите номер счета",

    },
    en: {
        notFound: "Invoice not found.",
        back: "Back",
        title: "Invoice search",
        info: "Enter your account number and click the \"Find\" button",
        ph: "Enter account number",
    }
};