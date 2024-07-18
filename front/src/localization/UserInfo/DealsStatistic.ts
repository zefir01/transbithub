import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    tradesCount: string;
    avgDealAmount: string;
    counterpartysCount: string;
    feadbacksRates: string;
    firstTrade: string;
    none: string;
    median: string;
    avg: string;
    title: string;
}

export const data = {
    ru: {
        tradesCount: "Количество сделок",
        avgDealAmount: "Средний объем сделки",
        counterpartysCount: "Количество контрагентов",
        feadbacksRates: "Оценка отзывов",
        firstTrade: "Первая сделка",
        none: "Отсутствует",
        median: "Медиана времени задержки запуска депонирования платежа",
        avg: "Среднее времени задержки запуска депонирования платежа",
        title: "Статистика по сделкам",
    },
    en: {
        tradesCount: "Count of deals",
        avgDealAmount: "Average deals amount",
        counterpartysCount: "Count of counterparties",
        feadbacksRates: "Feedbacks rate",
        firstTrade: "First deal",
        none: "None",
        median: "Median time of delay for starting a payment deposit",
        avg: "Average time of delay for starting a payment deposit",
        title: "Deals statistic"
    }
};