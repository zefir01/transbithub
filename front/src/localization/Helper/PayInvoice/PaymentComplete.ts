import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    oddPromise: string;
    complete: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Покупка успешно завершена",
        oddPromise: "Промис со сдачей",
        complete: "Завершить",

    },
    en: {
        back: "Back",
        title: "Purchase completed successfully",
        oddPromise: "Promise with odd money",
        complete: "Complete",
    }
};