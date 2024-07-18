import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    paid: string;
    notPaid: string;
    amount: string;
    created: string;
    description: string;
    period: string;
    status: string;
    more: string;
    payment: string;
}

export const data = {
    ru: {
        paid: "Оплачен",
        notPaid: "Не оплачен",
        amount: "Сумма:",
        created: "Создан:",
        description: "Описание:",
        period: "Период оплаты:",
        status: "Статус:",
        more: "Загрузить еще",
        payment: "Платеж:"
    },
    en: {
        paid: "Paid",
        notPaid: "Not paid",
        amount: "Amount:",
        created: "Created at:",
        description: "Description:",
        period: "Payment period:",
        status: "Status:",
        more: "Load more",
        payment: "Payment:"
    }
};