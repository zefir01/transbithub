import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    sell: string;
    buy: string;
    using: string;
    currency: string;
    user: string;
    wants: string;
    buyFrom: string;
    selFrom: string;
}

export const data = {
    ru: {
        sell: "Продажа ",
        buy: "Покупка ",
        using: ", используя ",
        currency: "️, в валюте ",
        user: "Пользователь ",
        wants: " хочет ",
        buyFrom: "купить у вас",
        selFrom: "продать вам",
    },
    en: {
        sell: "Sale ",
        buy: "Buy ",
        using: ", using ",
        currency: "️, in currency ",
        user: "User ",
        wants: " wants ",
        buyFrom: "",
        selFrom: "",
    }
};