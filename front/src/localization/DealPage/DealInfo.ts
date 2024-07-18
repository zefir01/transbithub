import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    price: string;
    paymentMethod: string;
    user: string;
    limitations: string;
    location: string;
    paymentWindow: string;
    feedbacks: string;
    promise: string;
    show: string;
    close: string;
}

export const data = {
    ru: {
        price: "Цена:",
        paymentMethod: "Способ оплаты:",
        user: "Пользователь:",
        feedbacks: "Положительных отзывов:",
        limitations: "Ограничения по сделке:",
        location: "Местоположение:",
        paymentWindow: "Окно оплаты:",
        promise: "Промис",
        show: "Показать",
        close: "Закрыть"
    },
    en: {
        price: "Price:",
        paymentMethod: "Payment method:",
        user: "User:",
        feedbacks: "Positive feedbacks:",
        limitations: "Deal limitations:",
        location: "Location:",
        paymentWindow: "Payment window:",
        promise: "Promise",
        show: "Show",
        close: "Close"
    }
};