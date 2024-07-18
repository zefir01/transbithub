import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    ago: string;
    info: string;
    toTrustEnabled: string;
    toTrustDisabled: string;
    complainEnabled: string;
    complainDisabled: string;
    ad: string;
    buy: string;
    sell: string
    noFeedbacks: string;
    feedbacks: string;
    removeTrust: string;
    complaintPh: string;
    complaintContactPh: string;
    complaintSent: string;
    complaintSend: string;
    blockUser: string;
    blockUserAuth: string;
    unblockUser: string;
}

export const data = {
    ru: {
        ago: "назад",
        info: "Информация о ",
        toTrustEnabled: "Добавить в доверенные",
        toTrustDisabled: "Для добавления пользователя в доверенные, требуется авторизация",
        complainEnabled: "Пожаловаться на пользователя",
        complainDisabled: "Для создания жалобы на пользователя, требуется авторизация",
        ad: "Объявления ",
        buy: " о покупке",
        sell: " о продаже",
        noFeedbacks: "Пока нет отзывов",
        feedbacks: "Последние отзывы",
        removeTrust: "Убрать из доверенных",
        complaintPh: "Напишите жалобу сюда",
        complaintContactPh: "Укажите Telegram или email для связи.",
        complaintSent: "Жалоба отправлена",
        complaintSend: "Отправить жалобу",
        blockUser: "Заблокировать пользователя",
        blockUserAuth: "Для блокирования пользователя требуется авторизация",
        unblockUser: "Разблокировать пользователя",

    },
    en: {
        ago: "ago",
        info: "Information about ",
        toTrustEnabled: "Add to Trusted",
        toTrustDisabled: "To add a user to trusted, authorization is required",
        complainEnabled: "Complain to user",
        complainDisabled: "To create a user complaint, authorization is required",
        ad: "Advertisements ",
        buy: " about purchase",
        sell: " about sale",
        noFeedbacks: "No feedbacks yet",
        feedbacks: "Last feedbacks",
        removeTrust: "Remove from trusted",
        complaintPh: "Write a complaint here",
        complaintContactPh: "Enter Telegram or email for communication.",
        complaintSent: "Complaint sent",
        complaintSend: "Send complaint",
        blockUser: "Block user",
        blockUserAuth: "Authorization required to block user",
        unblockUser: "Unblock User",
    }
};

export const strings = new LocalizedStrings(data);