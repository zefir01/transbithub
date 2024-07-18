import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    rate: string,
    deals: string;
    payments: string;
    service: string;
}

export const data = {
    ru: {
        rate: "Рейтинг: ",
        deals: "Сделок:",
        payments: "Платежей:",
        service: "Сервис"
    },
    en: {
        rate: "Rate: ",
        deals: "Deals:",
        payments: "Payments:",
        service: "Service"
    }
};