import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    invoicesCreated: string;
    paymentsPayedAvgAmount: string;
    paymentsPayedCount: string;
    paymentsReceivedAvgAmount: string;
    paymentsReceivedCount: string;
    positive: string;
}

export const data = {
    ru: {
        title: "Статистика по счетам",
        invoicesCreated: "Счетов создано",
        paymentsPayedAvgAmount: "Средняя сумма исходящего платежа",
        paymentsPayedCount: "Количество исходящих платежей",
        paymentsReceivedAvgAmount: "Средняя сумма входящего платежа",
        paymentsReceivedCount: "Количество входящих платежей",
        positive: "Положительных отзывов по счетам",
    },
    en: {
        title: "Invoices statistic",
        invoicesCreated: "Invoices created",
        paymentsPayedAvgAmount: "Average outgoing payment amount",
        paymentsPayedCount: "Number of outgoing payments",
        paymentsReceivedAvgAmount: "Average incoming payment amount",
        paymentsReceivedCount: "Number of incoming payments",
        positive: "Positive feedback on invoices",
    }
};