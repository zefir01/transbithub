import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    dealCanceled: string;
    why: string;
    youCancel: string;
    sellerCancel: string;
    timeout: string;
    info: string;
    go: string;
    feedback: string;
    end: string;
}

export const data = {
    ru: {
        back: "Назад",
        dealCanceled: "Сделка отменена",
        why: "Возможные причины:",
        youCancel: "Вы отменили сделку",
        sellerCancel: "Продавец отменил сделку",
        timeout: "Истекло время отведенное на сделку",
        info: "Вы можете найти эту сделку в отмененных сделках, в меню \"Сделки\"",
        go: "Перейти к сделке",
        feedback: "Оставьте пожалуйста отзыв о сделке.",
        end: "Завершить",

    },
    en: {
        back: "Back",
        dealCanceled: "Deal canceled",
        why: "Possible reasons:",
        youCancel: "You canceled the deal",
        sellerCancel: "Seller canceled the deal",
        timeout: "Trade time expired",
        info: "You can find this deal in canceled deals, in the \"Deals\" menu",
        go: "Go to deal",
        feedback: "Please leave a review about the transaction.",
        end: "Complete",
    }
};