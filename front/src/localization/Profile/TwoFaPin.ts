import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    label: string;
}

export const data = {
    ru: {
        label: "Код двухфакторной аутентификации:"
    },
    en:{
        label: "Two-factor authentication code:"
    }
};