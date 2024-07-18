import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    createdAt: string,
    dealType: string,
    partner: string,
    amount: string,
    initiator: string,
    owner: string,
    price: string,
    buy: string;
    sell: string;
    toWork: string;
    stopWork: string;
    giveAway: string;
    selectUser: string;
    close: string;
    select: string;
    notFound: string;
}

export const data = {
    ru: {
        createdAt: "Создано",
        dealType: "Тип сделки",
        partner: "Партнер по сделке",
        amount: "Сумма",
        initiator: "Инициатор",
        owner: "Владелец объявления",
        price: "Цена",
        buy: "Покупка",
        sell: "Продажа",
        toWork: "В работу",
        toFree: "В доступные",
        stopWork: "Прекратить работу",
        giveAway: "Передать",
        selectUser: "Выберите пользователя:",
        close: "Закрыть",
        select: "Выбрать",
        notFound: "Нет аккаунтов"
    },
    en: {
        createdAt: "Created at",
        dealType: "Dela type",
        partner: "Partner",
        amount: "Amount",
        initiator: "Initiator",
        owner: "Ad owner",
        price: "Price",
        buy: "Buy",
        sell: "Sell",
        toWork: "To work",
        stopWork: "Stop work",
        giveAway: "Give away",
        selectUser: "Select user:",
        close: "Close",
        select: "Select",
        notFound: "No accounts"
    }
};