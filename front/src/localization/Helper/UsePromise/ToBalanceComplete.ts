import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    complete: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Промис успешно зачислен на баланс",
        complete: "Завершить"
    },
    en: {
        back: "Back",
        title: "The promise was successfully credited to the balance",
        complete: "Complete"
    }
};