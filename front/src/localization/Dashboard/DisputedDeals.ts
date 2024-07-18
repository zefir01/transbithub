import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    disputedDeals: string,
    desc: string,
}

export const data = {
    ru: {
        disputedDeals: "Диспуты",
        desc: "Здесь отображаются сделки, по которым открыты диспуты.",
    },
    en: {
        disputedDeals: "Disputes",
        desc: "It displays the deals on which disputes are open.",
    }
};