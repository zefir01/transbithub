import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    balance: string;
    promise: string;
    bitcoin: string;
    wallet: string,
    walletDesc: string,
    warnAuth: string;
    lnWarn: string;
    ln: string;
}

export const data = {
    ru: {
        title: "Что сделать с купленной криптовалютой?",
        balance: "Зачислить на баланс",
        promise: "Создать Промис",
        bitcoin: "Вывести через Bitcoin Network",
        wallet: "Адрес вашего кошелька",
        walletDesc: "Если вы не зарегистрированы, вы можете купить криптовалюту.\n" +
            "Криптовалюта будет отправлена на указанный адрес. Текущая стоимость\n" +
            "транзакции сети {cryptoAmount}{cryptoCurrency}/{fiatAmount}{fiatCurrency}. После завершения сделки, криптовалюта будет отправлена на указанный адрес. " +
            "Стоимость транзакции будет вычтена из суммы сделки.",
        warnAuth: "Для использования баланса требуется авторизация",
        lnWarn: "Для использования Lightning Network, требуется авторизация.",
        ln: "Вывести через Lightning Network"
    },
    en: {
        title: "What to do with purchased cryptocurrency?",
        balance: "Add to balance",
        promise: "create Promise",
        bitcoin: "Withdraw via Bitcoin Network",
        wallet: "Your wallet address",
        walletDesc: "If you are not registered, you can buy cryptocurrency.\n" +
            "Cryptocurrency will be sent to the specified address. Current transaction value of the network {cryptoAmount}{cryptoCurrency}/{fiatAmount}{fiatCurrency}. " +
            "After the transaction is completed, the cryptocurrency will be sent to the specified address. " +
            "The transaction cost will be deducted from the transaction amount.",
        lnWarn: "To use Lightning Network, authorization is required.",
        ln: "Withdraw via Lightning Network",
        warnAuth: "Authorization is required to use balance"
    }
};