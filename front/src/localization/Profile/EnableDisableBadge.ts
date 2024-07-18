import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    enableText: string,
    disableText: string,
}

export const data = {
    ru: {
        enableText: "Включено",
        disableText: "Выключено"
    },
    en:{
        enableText: "Enabled",
        disableText: "Disabled"
    }
};