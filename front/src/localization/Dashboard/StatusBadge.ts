import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    new: string;
    newMessage: string;
    changed: string;
}

export const data = {
    ru: {
        new: "Новая",
        newMessage: "Новое сообщение",
        changed: "Изменена",
    },
    en: {
        new: "New",
        newMessage: "New message",
        changed: "Changed",
    }
};