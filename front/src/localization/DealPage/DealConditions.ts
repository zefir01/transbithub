import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    dealConditions: string;
    report: string;
}

export const data = {
    ru: {
        dealConditions: "Условия сделки:",
        report: "Пожаловаться на это объявление",
    },
    en: {
        dealConditions: "Deal conditions:",
        report: "Report this advertisement",
    }
};