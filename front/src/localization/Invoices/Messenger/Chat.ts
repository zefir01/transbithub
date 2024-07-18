import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    you: string;
}

export const data = {
    ru: {
        you: "Вы",

    },
    en: {
        you: "You",
    }
};