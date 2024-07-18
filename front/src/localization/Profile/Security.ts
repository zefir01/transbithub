import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    password: string;
    passwordHelp: string;
    email: string;
    emailHelp: string;
    twoFa: string;
    twoFaHelp: string;
    telegram: string;
    telegramHelp: string;
    trdApp: string;
    trdAppHelp: string;
    sessions: string;
    sessionsHelp: string;
    delete: string;
    deleteHelp: string;
    change: string;
    enable: string;
    disable: string;
    deleteBtn: string;
    edit: string;
    show: string;
    title: string;
    confirmed: string;
    noConfirmed: string;
}

export const data = {
    ru: {
        password: "Пароль",
        passwordHelp: "Защитите ваш аккаунт сильным паролем",
        email: "Email",
        emailHelp: "Подтверждение электронной почты",
        twoFa: "Двухфакторная аутентификация",
        twoFaHelp: "Настройка двухфакторной аутентификации",
        telegram: "Telegram",
        telegramHelp: "Уведомления через Telegram",
        trdApp: "Сторонние приложения",
        trdAppHelp: "Настройка API и сторонних приложений",
        sessions: "Сессии",
        sessionsHelp: "Активные сессии и события авторизации",
        delete: "Удаление аккаунта",
        deleteHelp: "Процедура удаления аккаунта",
        change: "Изменить",
        enable: "Включить",
        disable: "Выключить",
        deleteBtn: "Удалить",
        edit: "Изменить",
        show: "Смотреть",
        title: "Настройки безопасности",
        confirmed: "Подтверждено",
        noConfirmed: "Не подтверждено"
    },
    en: {
        password: "Password",
        passwordHelp: "Protect your account with a strong password",
        email: "Email",
        emailHelp: "Email verification",
        twoFa: "Two-factor authentication",
        twoFaHelp: "Configure two-factor authentication",
        telegram: "Telegram",
        telegramHelp: "Telegram notifications",
        trdApp: "3rd party applications",
        trdAppHelp: "Configuring API and third-party applications",
        sessions: "Sessions",
        sessionsHelp: "Active sessions and authorization events",
        delete: "Account deleting",
        deleteHelp: "Account deletion procedure",
        change: "Change",
        enable: "Enable",
        disable: "Disable",
        deleteBtn: "Delete",
        edit: "Edit",
        show: "Show",
        title: "Security settings",
        confirmed: "Confirmed",
        noConfirmed: "Not confirmed"
    }
};