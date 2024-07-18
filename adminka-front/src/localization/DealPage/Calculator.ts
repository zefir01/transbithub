import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    wallet: string,
    walletDesc: string,
    sell: string,
    buy: string,
    howMuch: string,
    sell1: string,
    buy1: string,
    ownDeal: string,
    auth: string,
    adDeleted: string,
    adDeleted1: string,
    asPromise: string;
}

export const data = {
    ru: {
        wallet: "Адрес вашего кошелька",
        walletDesc: "Если вы не зарегистрированы, вы можете купить криптовалюту.\n" +
            "Криптовалюта будет отправлена на указанный адрес. Текущая стоимость\n" +
            "транзакции сети {cryptoAmount}{cryptoCurrency}/{fiatAmount}{fiatCurrency}. После завершения сделки, криптовалюта будет отправлена на указанный адрес. " +
            "Стоимость транзакции будет вычтена из суммы сделки.",
        sell: "Продать",
        buy: "Купить",
        howMuch: "Сумма",
        sell1: "продать",
        buy1: "купить",
        ownDeal: "Вы не можете совершить сделку с собой.",
        auth: "Для продажи криптовалюты требуется авторизация.",
        adDeleted: "Объявление удалено или отключено или у продавца закончилась криптовалюта.",
        adDeleted1: "Объявление удалено или отключено",
        asPromise: "Купить как Промис"
    },
    en: {
        wallet: "Your wallet address",
        walletDesc: "If you are not registered, you can buy cryptocurrency.\n" +
            "Cryptocurrency will be sent to the specified address. Current transaction value of the network {cryptoAmount}{cryptoCurrency}/{fiatAmount}{fiatCurrency}. " +
            "After the transaction is completed, the cryptocurrency will be sent to the specified address. " +
            "The transaction cost will be deducted from the transaction amount.",
        sell: "Sell",
        buy: "Buy",
        howMuch: "Amount",
        sell1: "sell",
        buy1: "buy",
        ownDeal: "You cannot make a deal with yourself.",
        auth: "For the sale of cryptocurrencies, authorization is required.",
        adDeleted: "The ad has been deleted or disabled, or the seller has run out of cryptocurrency.",
        adDeleted1: "Ad deleted or disabled",
        asPromise: "Buy as Promise"
    }
};