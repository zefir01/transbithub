import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    helper: string;
    desc: string;
    desc1: string;
    desc2: string;
    desc3: string;
    close1: string;
    use: string;
}

export const data = {
    ru: {
        title: "Использовать Помощник?",
        info: "Если вы впервые на этом сайте или не имеете опыта работы с криптовалютой, мы рекомендуем использовать ",
        helper: "Помощник",
        desc: "Помощник упрощает следующие операции:",
        desc1: "Покупка биткоинов",
        desc2: "Оплата счетов за товары и услуги",
        desc3: "Использование Промисов",
        close1: "Закрыть и больше не спрашивать",
        use: "Использовать Помощник"
    },
    en: {
        title: "Use an Assistant?",
        info: "If you are new to this site or have no experience with cryptocurrency, we recommend using ",
        helper: "Assistant",
        desc: "The assistant simplifies the following operations:",
        desc1: "Buying bitcoins",
        desc2: "Payment of invoices for goods and services",
        desc3: "Using Promises",
        close1: "Close and ask no more",
        use: "Use the Assistant"
    }
};