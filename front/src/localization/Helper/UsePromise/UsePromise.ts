import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    balance: string;
    sell: string;
    warn: string;
    ok: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Что сделать с Промисом ?",
        balance: "Зачислить на баланс",
        sell: "Продать за фиатную валюту",
        warn: "Для использования баланса требуется авторизация. Войдите или зарегистрируйтесь.",
        ok: "Все верно"
    },
    en: {
        back: "Back",
        title: "What to do with a Promise?",
        balance: "Add to balance",
        sell: "Sell for fiat currency",
        warn: "To use the balance, authorization is required. Login or register.",
        ok: "All right"
    }
};