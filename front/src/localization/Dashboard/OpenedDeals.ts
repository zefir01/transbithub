import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    openedDeals: string,
    desc: string,
}

export const data = {
    ru: {
        openedDeals: "Открытые сделки",
        desc: "Здесь отображаются сделки, которые еще не завершены.",
    },
    en: {
        openedDeals: "Disputes",
        desc: "It displays the deals on which disputes are open.",
    }
};