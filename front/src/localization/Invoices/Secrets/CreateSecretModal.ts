import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title1: string;
    title2: string;
    info: string;
    textInfo: string;
    textPh: string;
    imageInfo: string;
    addToStart: string;
    addToEnd: string;
    save: string;
    close: string;
    max: string;
}

export const data = {
    ru: {
        title1: "Создать секрет",
        title2: "Изменить секрет",
        info: "При оплате счета покупатель покупает секреты. Одна часть - один секрет. Первые в списке, будут проданы первыми.",
        textInfo: "Введите описание секрета. Его увидит покупатель, после оплаты. Не более 1000 символов.",
        textPh: "Введите текст",
        imageInfo: "Добавьте изображения к секрету. Их увидит покупатель, после оплаты. Не более 10 изображений.",
        addToStart: "Добавить в начало",
        addToEnd: "Добавить в конец",
        save: "Сохранить",
        close: "Закрыть",
        max: "Максимум 10 файлов."
    },
    en: {
        title1: "Create secret",
        title2: "Change secret",
        info: "When paying the invoice, the buyer buys secrets. One piece is one secret. The first on the list will be sold first.",
        textInfo: "Enter a description for the secret. The buyer will see it after payment. No more than 1000 characters.",
        textPh: "Enter text",
        imageInfo: "Add images to the secret. The buyer will see them after payment. No more than 10 images.",
        addToStart: "Add to start",
        addToEnd: "Add to end",
        save: "Save",
        close: "Close",
        max: "Maximum 10 files."
    }
};