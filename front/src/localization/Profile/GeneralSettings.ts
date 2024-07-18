import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    generalSettings: string;
    timeZone: string;
    aboutPlaceholder: string;
    aboutHelp: string;
    site: string;
    siteHelp: string;
    preferences: string;
    salesDisabled: string;
    salesDisabledHelp: string;
    buysDisabled: string;
    buysDisabledHelp: string;
    notifycationContacts: string;
    notifycationContactsHelp: string;
    notificationPaymets: string;
    notificationPaymetsHelp: string;
    notificationDeposit: string;
    notificationDepositHelp: string;
    showMeAsVerifer: string;
    showMeAsVeriferHelp: string;
    disableConfedentialEmail: string;
    disableConfedentialEmailHelp: string;
    enableWebNotifications: string;
    enableWebNotificationsHelp: string;
    saveChanges: string;
    success: string;
    defaultCurrency: string;
    errorMax300: string;
}

export const data = {
    ru: {
        generalSettings: "Основные настройки",
        timeZone: "Часовой пояс",
        aboutPlaceholder: "Обо мне...",
        aboutHelp: "Показывается в общедоступном профиле. Только обычный текст, не более 300 символов.",
        site: "Site:",
        siteHelp: "Показывается в общедоступном профиле.",
        preferences: "Предпочтения",
        salesDisabled: "Продажи временно приостановлены",
        salesDisabledHelp: "Временно отключить все объявления о продажах.",
        buysDisabled: "Покупки временно приостановлены",
        buysDisabledHelp: "Временно отключить все объявления о покупках.",

        notificationPaymetsHelp: "Получать уведомления о новых онлайн-платежах по вашим объявлениям (бесплатно)",
        notificationDepositHelp: "Посылать уведомления при каждой новой отправке биткоинов со счета депонирования (бесплатно)",
        showMeAsVerifer: "Показывать меня другим пользователям как проверившего настоящее имя",
        showMeAsVeriferHelp: "Ваше имя пользователя отображается, когда люди совершают новые сделки с вашими бывшими партнерами.",
        disableConfedentialEmail: "Отключить конфиденциальную информацию из уведомлений по электронной почте",
        disableConfedentialEmailHelp: "Сообщения электронной почты будут просто содержать предложение войти на сайт, где можно будет просмотреть собственно уведомления.",
        enableWebNotifications: "Включить веб-уведомления",
        enableWebNotificationsHelp: "Вы будете получать внешние уведомления за пределами окна браузера.",
        saveChanges: "Сохранить изменения",
        success: "Изменения успешно сохранены.",
        defaultCurrency: "Валюта по умолчанию:",
        errorMax300: "Максимальная длина 300 символов.",

    },
    en: {
        generalSettings: "General settings",
        timeZone: "Timezone:",
        aboutPlaceholder: "About myself...",
        aboutHelp: "Shown on a public profile. Only plain text, no more than 300 characters.",
        site: "Site:",
        siteHelp: "Shown on a public profile.",
        preferences: "Preferences",
        salesDisabled: "Sales temporarily suspended",
        salesDisabledHelp: "Temporarily disable all sales announcements.",
        buysDisabled: "Purchases are temporarily suspended",
        buysDisabledHelp: "Temporarily disable all offers of purchases.",
        notificationDepositHelp: "Send notifications with every new sending of bitcoins from the deposit account (free)",
        showMeAsVerifer: "Show me to other users as having verified the real name",
        showMeAsVeriferHelp: "Your username is displayed when people make new deals with your former partners.",
        disableConfedentialEmail: "Disable confidential information from email notifications",
        disableConfedentialEmailHelp: "Email messages will simply contain an offer to enter the site, where you can view the actual notifications.",
        enableWebNotifications: "Enable web notifications",
        enableWebNotificationsHelp: "You will receive external notifications outside the browser window.",
        saveChanges: "Save changes",
        success: "Changes saved successfully.",
        defaultCurrency: "Default currency:",
        errorMax300: "The maximum length is 300 characters."
    }
};