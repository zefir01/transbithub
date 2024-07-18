import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    period: string;
    purchased: string;
    time: string;
    buy: string;
    more: string;
    close: string;
}

export const data = {
    ru: {
        period: "Период перерасчета цены: ",
        purchased: "Куплено авторасчетов: ",
        time: "Купленных авто расчетов хватит на: ",
        buy: "Купить авторасчеты",
        more: "Подробнее про автоцену:",
        close: "Закрыть",
    },
    en: {
        period: "Price recalculation period: ",
        purchased: "Purchased auto calculations: ",
        time: "The purchased auto calculations will be enough for: ",
        buy: "Buy auto calculations",
        more: "More about auto price:",
        close: "Close"
    }
};