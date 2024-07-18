import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    type: string;
    inFiat: string;
    inCrypto: string;
    typeInfo: string;
    available: string;
    amountInfo: string;
    amount: string;
    amountInfo1: string;
    rate: string;
    avg: string;
    rateInfo: string;
    amountFiat: string;
    fee: string;
    amountFiatInfo: string;
    cryptoAmount: string;
    cryptoAmountInfo: string;
    pass: string;
    passPh: string;
    passError: string;
    confirmError: string;
    confirm: string;
    passInfo: string;
    create: string;
    warning: string;
}

export const data = {
    ru: {
        type: "Тип расчета",
        inFiat: "В фиатной валюте",
        inCrypto: "В криптовалюте",
        typeInfo: "Вы можете указать сумму в фиатной\n" +
            "валюте и количество криптовалюты в Промисе будет расчитано изходя из выбранного вами курса и валюты.\n" +
            "Также вы можете сразу указать сумму в криптовалюте.",
        available: "Доступно:",
        amountInfo: "Укажите сумму в фиатной валюте. Количество криптовалюты будет рассчитано исходя из выбранного вами курса.",
        amount: "Сумма",
        amountInfo1: "Укажите сумму в криптовалюте.",
        rate: "Курс",
        avg: "Среднее",
        rateInfo: "Курс для расчета суммы Промиса. Среднее значение это средняя цена всех сделок по выбранной валюте за последние 5 минут. Также вы можете выбрать курс конкретной биржи.",
        amountFiat: "Сумма в фиатной валюте",
        fee: " Комиссия: ",
        amountFiatInfo: "Сумма в фиатной валюте, эквивалент которой будет в Промисе. Комиссия платится при создании Промиса.",
        cryptoAmount: "Сумма в криптовалюте",
        cryptoAmountInfo: "Сумма в криптовалюте, которая будет в Промисе. Комиссия платится при создании Промиса.",
        pass: "Защитить Промис паролем",
        passPh: "Пароль Промиса",
        passError: "Максимальная длина пароля 100 символов.",
        confirmError: "Пароль и подтверждение не совпадают.",
        confirm: "Подтверждение",
        passInfo: "Вы можете зашифровать промис паролем. В результате, воспользоваться им или прочитать его содержимое будет невозможно без пароля. " +
            "Будьте крайне осоторожны и внимательны. Если вы потеряете пароль, восстановить его будет невозможно, Промис будет потерян.",
        create: "Создать",
        warning: "Обязательно скопируйте Промис. Восстановить его будет невозможно."
    },
    en: {
        type: "Calculation type",
        inFiat: "In fiat currency",
        inCrypto: "In cryptocurrency",
        typeInfo: "You can specify the amount in fiat currency and the amount of cryptocurrency in the Promise will be calculated based on your chosen rate and currency. Also, you can immediately specify the amount in cryptocurrency.",
        available: "Available:",
        amountInfo: "Enter the amount in fiat currency. The amount of cryptocurrency will be calculated based on your chosen course.",
        amount: "Amount",
        amountInfo1: "Enter the amount in cryptocurrency.",
        rate: "Rate",
        avg: "Average",
        rateInfo: "The course for calculating the Promise amount. Average is the average price of all transactions in the selected currency over the last 5 minutes. You can also choose the rate of a specific exchange.",
        amountFiat: "Fiat amount",
        fee: " Fee: ",
        amountFiatInfo: "The amount in fiat currency, the equivalent of which will be in the Promise. Commission is paid when creating a Promise.",
        cryptoAmount: "Cryptocurrency amount",
        cryptoAmountInfo: "The amount in cryptocurrency that will be in the Promise. Commission is paid when creating a Promise.",
        pass: "Password protect Promise",
        passPh: "Promise Password",
        passError: "The maximum password length is 100 characters.",
        confirmError: "Password and confirmation do not match.",
        confirm: "Confirmation",
        passInfo: "You can encrypt a promise with a password. As a result, use it or it will be impossible to read its contents without a password. Be extremely careful and careful. If you lose your password, it will be impossible to recover it, the Promise will be lost.",
        create: "Create",
        warning: "Be sure to copy the Promise. It will be impossible to restore it."
    }
};