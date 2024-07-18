import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    send: string;
    max: string;
}

export const data = {
    ru: {
        send: "Отправить",
        max: "Максимум 10 файлов за раз.",
    },
    en: {
        send: "Send",
        max: "Maximum 10 files at a time."
    }
};