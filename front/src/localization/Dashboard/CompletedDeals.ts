import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    completedDeals: string,
    desc: string,
}

export const data = {
    ru: {
        completedDeals: "Завершенные сделки",
        desc: "Здесь отображаются завершенные сделки.",
    },
    en: {
        completedDeals: "Canceled deals",
        desc: "Completed deals are displayed here.",
    }
};