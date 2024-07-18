import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info: string;
    info1: string;
    amount: string;
    amount1: string;
    ok: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Укажите сумму для покупки",
        info: "Для проведения операции нужно ответить на несколько вопросов.",
        info1: "Сколько вы хотите купить ?",
        amount: "Сумма в ",
        amount1: "Сумма в Bitcoin",
        ok: "Все верно",

    },
    en: {
        back: "Back",
        title: "Enter the amount for purchase",
        info: "To carry out the operation, you need to answer several questions.",
        info1: "How much do you want to buy?",
        amount: "Amount in ",
        amount1: "Amount in Bitcoin",
        ok: "All right",
    }
};