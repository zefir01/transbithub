import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    payment: string;
}

export const data = {
    ru: {
        payment: "Платеж: ",
    },
    en: {
        payment: "Payment: ",
    }
};