import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    promisePh: string;
    passPh: string;
    toBalance: string;
    sell: string;
    sellInfo: string;
    country: string;
    currency: string;
    paymentType: string;
    getPrice: string;
    price: string;
    fiat: string;
    sellBestPrice: string;
    listAds: string;
    toBalanceOk: string;
}

export const data = {
    ru: {
        promisePh: "Вставьте Промис сюда",
        passPh: "Пароль от Промиса",
        toBalance: "Зачислить Промис на баланс",
        sell: "Продать Промис за фиатную валюту",
        sellInfo: "Вы можете продать промис за фиатную валюту. Сделка будет создана ровно на сумму Промиса. Во время сделки, Промис будет заблокирован. Выберите страну, валюту и способ оплаты.",
        country: "Страна поиска объявлений",
        currency: "Фиатная валюта, которую вы хотите получить",
        paymentType: "Желаемый способ оплаты",
        getPrice: "Получить цену",
        price: "Цена:",
        fiat: "В результате продажи вы получите:",
        sellBestPrice: "Продать по лучшей цене",
        listAds: "Показать список подходящих объявлений",
        toBalanceOk: "Промис успешно зачислен на ваш баланс."
    },
    en: {
        promisePh: "Paste the Promise here",
        passPh: "Promise password",
        toBalance: "Add Promise to balance",
        sell: "Sell Promise for Fiat",
        sellInfo: "You can sell a promise for fiat currency. The deal will be created for exactly the Promise amount. During the deal, this Promise will be blocked. Select your country, currency and payment method.",
        country: "Country of search ads",
        currency: "Fiat currency you want to receive",
        paymentType: "Desired payment method",
        getPrice: "Get the price",
        price: "Price:",
        fiat: "As a result of the sale, you will receive:",
        sellBestPrice: "Sell at the best price",
        listAds: "Show a list of matching advertisements",
        toBalanceOk: "The promise has been successfully added to your balance."
    }
};