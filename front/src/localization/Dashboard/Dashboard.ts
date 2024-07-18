import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    head: string,
    desc: string,
    wallet: string,
    advertisements: string,
    opened: string,
    completed: string,
    canceled: string,
    disputed: string,
}

export const data = {
    ru: {
        head: "Информационная панель",
        desc: "На этой странице вы можете просматривать свои объявления и сделки, а также управлять ими. Для получения уведомлений используйте Telegram бота: ",
        wallet: "Кошелек",
        advertisements: "Объявления",
        opened: "Открытые сделки",
        completed: "Завершенные сделки",
        canceled: "Отмененные сделки",
        disputed: "Диспуты",
    },
    en: {
        head: "Dashboard",
        desc: "On this page you can view and manage your ads and deals. To receive notifications, use Telegram Bot: ",
        wallet: "Wallet",
        advertisements: "Advertisements",
        opened: "Opened deals",
        completed: "Completed deals",
        canceled: "Canceled deals",
        disputed: "Disputed deals",
    }
};