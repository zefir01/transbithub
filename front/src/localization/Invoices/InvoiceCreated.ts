import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    notFoundError: string;
    invoiceCreated: string;
    invoiceUpdated: string;
}

export const data = {
    ru: {
        notFoundError: "Счет не найден.",
        invoiceCreated: "Счет создан",
        invoiceUpdated: "Счет обновлен"
    },
    en: {
        notFoundError: "Invoice not found",
        invoiceCreated: "Invoice created",
        invoiceUpdated: "Invoice updated"
    }
};