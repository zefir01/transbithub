import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info1: string;
    info2: string;
    info3: string;
    info4: string;
    info5: string;
    title1: string;
    adsCount: string;
    calcsCount: string;
    getInvoice: string;
    you: string;
    invoice: string;
    invoiceInfo: string;
    amount: string;
    period: string;
    time: string;
}

export const data = {
    ru: {
        title: "Покупка авто расчетов цены",
        info1: "В объявлении вы указываете цену, хуже которой вы не хотите торговать.",
        info2: "Если автоцена включена, то с периодичностью указанной вами, будет происходить авторасчет цены.",
        info3: "В результате авторасчета цены вашего объявления, оно займет максимально высокую позицию, которая ограничена только пороговой ценой указанной вами в объявлении.",
        info4: "При этом, цена вашего объявления будет только на 0.01 хуже, чем цена ближайшего конкурента из списка ниже.",
        info5: "Чем меньше период, тем эффективнее торговля.",
        title1: "Сколько вы хотите купить ?",
        adsCount: "Количество объявлений:",
        calcsCount: "Количество авторасчетов:",
        getInvoice: "Получить счет на оплату",
        you: "Вы получили",
        invoice: " счет на оплату номер: ",
        invoiceInfo: "После оплаты счета вам будут зачислены авторасчеты",
        amount: "Сумма: ",
        period: "Период перерасчета цены: ",
        time: "Выберите период на который хватит авторасчетов: ",

    },
    en: {
        title: "Buying price auto calculations",
        info1: "In your advertisement, you set a price worse than which you do not want to trade.",
        info2: "If auto price is enabled, then with the frequency specified by you, the price will be automatically calculated.",
        info3: "As a result of the auto-calculation of the price of your advertisement, it will take the highest possible position, which is limited only by the threshold price you specified in the advertisement.",
        info4: "At the same time, the price of your ad will be only 0.01 worse than the price of your nearest competitor from the list below.",
        info5: "The shorter the period, the more efficient the trade.",
        title1: "How much do you want to buy?",
        adsCount: "Number of ads:",
        calcsCount: "Number of auto calculations:",
        getInvoice: "Get invoice",
        you: "You received",
        invoice: " invoice for payment number: ",
        invoiceInfo: "After paying the invoice, you will have auto calculations",
        amount: "Amount: ",
        period: "Price recalculation period: ",
        time: "Select the period for which there will be enough auto calculations: "
    }
};