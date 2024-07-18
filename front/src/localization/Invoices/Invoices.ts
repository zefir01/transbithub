import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    createInvoice: string;
    toMeInvoices: string;
    fromMeInvoices: string;
    toMePayments: string;
    fromMePayments: string;
    publicInvoices: string;
    defaultCurrency: string;
    messages: string;
}

export const data = {
    ru: {
        title: "Управление счетами",
        info: "Здесь вы можете создавать, выставлять и оплачивать счета. Для получения уведомлений используйте Telegram бота: ",
        createInvoice: "Выставить счет",
        toMeInvoices: "Счета выставленные мне",
        fromMeInvoices: "Счета выставленные мной",
        toMePayments: "Платежи мне",
        fromMePayments: "Платежи от меня",
        publicInvoices: "Публичные счета",
        defaultCurrency: "Валюта отображения счетов и платежей:",
        messages: "Сообщения ",
    },
    en: {
        title: "Invoice management",
        info: "Here you can create, issue and pay invoices. To receive notifications, use Telegram Bot: ",
        createInvoice: "Issue invoice",
        toMeInvoices: "Invoices issued to me",
        fromMeInvoices: "Invoices issued by me",
        toMePayments: "Payments to me",
        fromMePayments: "Payments from me",
        publicInvoices: "Public invoices",
        defaultCurrency: "Currency for displaying invoices and payments:",
        messages: "Messages "
    }
};