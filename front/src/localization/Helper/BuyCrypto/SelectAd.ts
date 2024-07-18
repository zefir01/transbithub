import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    adName: string;
    price: string;
    window: string;
    terms: string;
    back: string;
    title: string;
    ok: string;
    next: string;
    error: string;
}

export const data = {
    ru: {
        adName: "Название объявления:",
        price: "Цена:",
        window: "Срок оплаты:",
        terms: "Условия:",
        back: "Назад",
        title: "Выберите подходящие вам условия сделки",
        ok: "Мне подходят эти условия",
        next: "Выбрать другие условия",
        error: "Подходящие объявления не найдены. Попробуйте изменить запрос.",

    },
    en: {
        adName: "Title Advertisement:",
        price: "Price:",
        window: "Time for payment:",
        terms: "Terms:",
        back: "Back",
        title: "Choose the terms of the deal that suit you",
        ok: "These conditions suit me",
        next: "Select other conditions",
        error: "No matching ads found. Try changing your request.",
    }
};