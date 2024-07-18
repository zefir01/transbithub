import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    balance: string;
    promise: string;
    warn: string;
    passPh: string;
    ln: string;
    warnLn: string;
}


export const data = {
    ru: {
        title: "Откуда вы хотите продать?",
        balance: "С баланса",
        promise: "Промис",
        warn: "Для продажи с баланса, требуется авторизация",
        passPh: "Введите пароль от Промиса",
        ln: "Lightning Network",
        warnLn: "Для использования Lightning Network, требуется авторизация",
    },
    en: {
        title: "Where do you want to sell from?",
        balance: "From balance",
        promise: "Promise",
        warn: "To sell from balance, authorization is required",
        passPh: "Enter Promise password",
        ln: "Lightning Network",
        warnLn: "To use Lightning Network, authorization is required",
    }
};