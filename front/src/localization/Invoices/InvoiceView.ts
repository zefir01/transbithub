import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    invoiceDeleted: string;
    invoiceTitle: string;
    info: string;
}

export const data = {
    ru: {
        invoiceDeleted: "Счет удален или полность. оплачен.",
        invoiceTitle: "Информация о счете",
        info: "Сумма счета рассчитана исходя из средней торгуемой цены за последние 5 минут.",
    },
    en: {
        invoiceDeleted: "Invoice deleted or fully payed.",
        invoiceTitle: "Invoice information",
        info: "The invoice amount is calculated based on the average traded price for the last 5 minutes."
    }
};