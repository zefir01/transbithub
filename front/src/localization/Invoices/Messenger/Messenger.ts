import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    noMessages: string;
}

export const data = {
    ru: {
        noMessages: "У вас пока нет сообщений.",

    },
    en: {
        noMessages: "You have no messages yet.",
    }
};