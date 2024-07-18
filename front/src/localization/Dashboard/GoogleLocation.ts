import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    ph: string,
}

export const data = {
    ru: {
        ph: "Ввиедите адрес",
    },
    en: {
        ph: "Enter your address",
    }
};