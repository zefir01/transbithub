import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    amount: string;
    search: string;
    seller: string;
    buyer: string;
    message: string;
    price: string;
    limitations: string;
    sell: string;
    buy: string;
    more: string;
    fastSell: string;
    fastBuy: string;
}

export const data = {
    ru: {
        amount: "Сумма",
        search: "Поиск",
        seller: "Продавец",
        buyer: "Покупатель",
        message: "Способ оплаты",
        price: "Цена / BTC",
        limitations: "Ограничения",
        sell: "Продать",
        buy: "Купить",
        more: "Еще объявления ...",
        fastBuy: "Быстрая покупка",
        fastSell: "быстрая продажа"
    },
    en: {
        amount: "Amount",
        search: "Search",
        seller: "Seller",
        buyer: "Buyer",
        message: "Payment method",
        price: "Price  / BTC",
        limitations: "Limitations",
        sell: "Sell",
        buy: "Buy",
        more: "More advertisements ...",
        fastBuy: "Fast buy",
        fastSell: "Fast sell"
    }
};
