import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    descriptionPh: string;
    descriptionError: string;
    timeLimit: string;
    create: string;
    copy: string;
}

export const data = {
    ru: {
        descriptionPh: "Введите описание платежа",
        descriptionError: "Максимальная длина описания: 300 символов.",
        timeLimit: "Лимит времени на оплату: ",
        create: "Создать запрос платежа",
        copy: "Скопируйте запрос:"
    },
    en: {
        descriptionPh: "Enter payment description",
        descriptionError: "Maximum description length: 300 characters.",
        timeLimit: "Time limit for payment: ",
        create: "Create payment request",
        copy: "Copy the request:"
    }
};
