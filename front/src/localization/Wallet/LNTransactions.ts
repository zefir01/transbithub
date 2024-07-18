import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    in: string;
    out: string;
}

export const data = {
    ru: {
        in: "Входящие",
        out: "Исходящие"
    },
    en: {
        in: "Incoming",
        out: "Outgoing"
    }
};