import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    canceledDeals: string,
    desc: string,
}

export const data = {
    ru: {
        canceledDeals: "Отмененные сделки",
        desc: "Здесь отображаются отмененные сделки.",
    },
    en: {
        canceledDeals: "Canceled deals",
        desc: "Canceled deals are displayed here.",
    }
};