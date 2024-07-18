import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    head: string;
    i: string;
    arbitrator: string;
}

export const data = {
    ru: {
        head: "Чат",
        i: "Я",
        arbitrator: "Арбитр"
    },
    en: {
        head: "Chat",
        i: "My",
        arbitrator: "Arbitrator"
    }
};