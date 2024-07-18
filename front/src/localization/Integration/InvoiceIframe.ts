import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    notFound: string;
    buy: string;
    adNotFond: string;
}

export const data = {
    ru: {
        notFound: "Счет не найден.",
        buy: "Купить",
        adNotFond: "Объявление не найдено."
    },
    en: {
        notFound: "Invoice not found.",
        buy: "Buy",
        adNotFond: "Advertisement not found."
    }
};