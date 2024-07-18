import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Title: string;
    Info1: string;
    Info2: string;
    ActiveSessions: string;
    SessionEvents: string;
    CreatedAt: string;
    ExpiredAt: string;
    ClientName: string;
    LastOnline: string;
    Ip: string;
    Time: string;
    Event: string;
    browser: string;
    success: string;
    Kill: string;
    TwoFa: string;
    cancel: string;
    killSuccess: string;
}

export const data = {
    ru: {
        Title: "Активные сессии и события",
        Info1: "Здесь приведен список ваших активных сессий. Активную сессию можно удалить, после чего пользователю сессии придется выполнить повторный вход.",
        Info2: "На вкладке \"События сессий\" вы можете увидеть список событий, таких как успешный вход на сайт или попытки войти с неправильным паролем.",
        ActiveSessions: "Активные сессии",
        SessionEvents: "События сессий",
        CreatedAt: "Время входа",
        ExpiredAt: "Истекает в",
        ClientName: "Тип входа",
        LastOnline: "Последний раз онлайн",
        Ip: "Ip адресс",
        Time: "Время",
        Event: "Событие",
        browser: "браузер",
        success: "Успешный вход",
        Kill: "Прервать",
        TwoFa: "Двухфакторная аутентификация",
        cancel: "Отменить",
        killSuccess: "Сессия прервана."
    },
    en:{
        Title: "Active sessions and events",
        Info1: "Here is a list of your active sessions. The active session can be deleted, after which the session user will have to re-enter.",
        Info2: "On the \"Session events\" tab, you can see a list of events, such as a successful login to the site or attempts to log in with the wrong password.",
        ActiveSessions: "Active sessions",
        SessionEvents: "Session events",
        CreatedAt: "Sign in at",
        ExpiredAt: "Expired at",
        ClientName: "Sign in type",
        LastOnline: "Last online",
        Ip: "Ip address",
        Time: "Time",
        Event: "Event",
        browser: "browser",
        success: "Success sign in",
        Kill: "Kill",
        TwoFa: "Two-factor authentication",
        cancel: "Cancel",
        killSuccess: "Session killed."
    }
};