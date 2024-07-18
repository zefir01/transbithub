import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    head: string;
    i: string;
    arbitrator: string;
}

export const data = {
    ru: {
        head: "Договоритесь с партнером о сделке в этом чате",
        i: "Я",
        arbitrator: "Арбитр"
    },
    en: {
        head: "Arrange a deal with this partner in this chat",
        i: "My",
        arbitrator: "Arbitrator"
    }
};