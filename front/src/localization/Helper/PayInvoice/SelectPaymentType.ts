import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info: string;
    balance: string;
    balanceInfo: string;
    fiat: string;
    fiatInfo: string;
    promise: string;
    promiseInfo: string;
    ln: string;
    lnInfo: string;
    warn: string;
    lowMoney: string;
    ok: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Каким способом вы хотите оплатить ?",
        info: "Выберите способ оплаты.",
        balance: "Оплатить с баланса",
        balanceInfo: "Оплатить биткоинами с вашего баланса на ",
        fiat: "Оплатить в фиатной валютой, через сделку",
        fiatInfo: "Будет создана сделка на покупку биткоинов. Биткоины будут автоматически использованы для оплаты счета.",
        promise: "Оплатить Промисом",
        promiseInfo: "Вы можете использовать Промис для оплаты счета. Сдачу можно получить Промисом.",
        ln: "Оплатить через Lightning Network",
        lnInfo: "Будет создан запрос платежа Lightning Network. Вы можете оплатить со своего кошелька.",
        warn: "Для использования баланса требуется авторизация. Войдите или зарегистрируйтесь.",
        lowMoney: "Недостаточно средств для оплаты. Поплните баланс или уменьшите количество покупаемых частей или выберите другой способ оплаты.",
        ok: "Все верно",

    },
    en: {
        back: "Back",
        title: "How do you want to pay?",
        info: "Select a Payment Method.",
        balance: "Pay from balance",
        balanceInfo: "Pay with bitcoins from your balance on ",
        fiat: "Pay in fiat currency, through a deal",
        fiatInfo: "A deal to buy bitcoins will be created. Bitcoins will be automatically used to pay the bill.",
        promise: "Pay with Promise",
        promiseInfo: "You can use a Promise to pay a invoice. Odd money can be obtained with a Promise.",
        ln: "Pay via Lightning Network",
        lnInfo: "Will create a Lightning Network payment request. You can pay from your wallet.",
        warn: "To use the balance, authorization is required. Login or register.",
        lowMoney: "Insufficient funds to pay. Top up the balance or reduce the number of purchased pieces or choose another payment method.",
        ok: "All right",
    }
};