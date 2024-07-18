import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string,
    close: string;
}

export const data = {
    ru: {
        title: "Оригинальное изображение",
        close: "Закрыть",
    },
    en: {
        title: "Original image",
        close: "Close",
    }
};