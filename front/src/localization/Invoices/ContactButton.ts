import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    messenger1: string;
    messenger2: string;
}

export const data = {
    ru: {
        messenger1: "Написать покупателю",
        messenger2: "Написать продавцу"

    },
    en: {
        messenger1: "Contact the buyer",
        messenger2: "Contact the seller"
    }
};