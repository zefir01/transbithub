import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    desc: string;
    balance: string;
    btcTransactions: string;
}

export const data = {
    ru: {
        title: "Управление вашими финансами",
        desc: "Здесь вы можете ввести, вывести, посмотреть транзакции по вашим криптовалютам.",
        balance: "Баланс",
        btcTransactions: "Транзакции Bitcoin"
    },
    en: {
        title: "Managing your finances",
        desc: "Here you can enter, withdraw, see transactions on your cryptocurrencies.",
        balance: "Balance",
        btcTransactions: "Bitcoin transactions"
    }
};