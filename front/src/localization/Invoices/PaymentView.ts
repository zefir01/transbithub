import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    invoiceTitle: string;
}

export const data = {
    ru: {
        invoiceTitle: "Информация о счете",

    },
    en: {
        invoiceTitle: "Invoice information",
    }
};