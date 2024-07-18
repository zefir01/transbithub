import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    buySell: string,
    wallet: string,
    profile: string;
    signIn: string;
    dashboard: string;
    logout: string;
    invoices: string;
    promises: string;
    helper: string;
    docs: string;
    tor: string;
}

export const data = {
    ru: {
        buySell: "Купить/Продать",
        wallet: "Кошелек",
        profile: "Профиль",
        signIn: "Вход/Регистрация",
        dashboard: "Сделки",
        logout: "Выход",
        invoices: "Счета",
        promises: "Промисы",
        helper: "Помощник",
        docs: "Документация",
        tor: "Вы используете приватный режим браузера. Если вы его закроете, то потеряете доступ к вашей сессии, сделкам, счетам и т.п. Мы настоятельно рекомендуем использовать приватный режим только зарегистрированным пользователям. Создайте учетную запись или войдите в существующую."
    },
    en: {
        buySell: "Buy/Sell",
        wallet: "Wallet",
        profile: "Profile",
        signIn: "Login/Register",
        dashboard: "Deals",
        logout: "Logout",
        invoices: "Invoices",
        promises: "Promises",
        helper: "Assistant",
        docs: "Documentation",
        tor: "You are using private browser mode. If you close it, you will lose access to your session, deals, invoices, etc. We strongly recommend using private mode only for registered users. Create an account or log into an existing one."
    }
};