import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    newDeal: string;
    newMessage: string;
    newStatus: string;
    newFiat: string;
    newDisput: string;
    events: string;
    allReaded: string;
    newInvoice: string;
    paymentReceived: string;
}

export const data = {
    ru: {
        newDeal: "Новая сделка",
        newMessage: "Новое сообщение",
        newStatus: "Статус сделки изменен",
        newFiat: "Партнер перевел фиатные деньги",
        newDisput: "Создан диспут",
        events: "Cобытия ",
        allReaded: "Все прочитано",
        newInvoice: "Получен счет",
        paymentReceived: "Получен платеж",
    },
    en: {
        newDeal: "New deal",
        newMessage: "New message",
        newStatus: "Deal status changed",
        newFiat: "Partner transferred fiat money",
        newDisput: "New dispute",
        events: "Events ",
        allReaded: "Mark all read",
        newInvoice: "Received invoice",
        paymentReceived: "Payment received"
    }
};