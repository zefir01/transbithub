import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    price: string;
    paymentMethod: string;
    initiator: string;
    owner: string;
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
        initiator: "Инициатор:",
        owner: "Владелец",
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
        initiator: "Initiator:",
        owner: "Owner",
        feedbacks: "Positive feedbacks:",
        limitations: "Deal limitations:",
        location: "Location:",
        paymentWindow: "Payment window:",
        promise: "Promise",
        show: "Show",
        close: "Close"
    }
};