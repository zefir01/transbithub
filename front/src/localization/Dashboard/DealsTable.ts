import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    btn: string;
    createdAt: string,
    dealType: string,
    partner: string,
    fiatCurrency: string,
    cryptoCurrency: string,
    price: string,
    buy: string;
    sell: string;
}

export const data = {
    ru: {
        btn: "Больше сделок",
        createdAt: "Создано",
        dealType: "Тип сделки",
        partner: "Партнер по сделке",
        fiatCurrency: "Фиатная валюта",
        cryptoCurrency: "Криптовалюта",
        price: "Цена",
        buy: "Покупка",
        sell: "Продажа",
    },
    en: {
        btn: "More deals",
        createdAt: "Created at",
        dealType: "Dela type",
        partner: "Partner",
        fiatCurrency: "Fiat currency",
        cryptoCurrency: "Crypto currency",
        price: "Price",
        buy: "Buy",
        sell: "Sell",
    }
};