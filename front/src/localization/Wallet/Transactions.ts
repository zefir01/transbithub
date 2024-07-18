import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Input: string;
    Output: string;
    Find: string;
    Amount:string;
    Confirmations:string;
    Time:string;
    more: string;
}

export const data = {
    ru: {
        Input: "Входящие",
        Output: "Иcходящие",
        Find: "Найти",
        Amount:"Сумма",
        Confirmations:"Подтверждения",
        Time:"Время",
        more: "Загрузить больше"
    },
    en: {
        Input: "Inbox",
        Output: "Outgoing",
        Find: "Find",
        Amount:"Amount",
        Confirmations:"Confirmations",
        Time:"Time",
        more: "Load more"
    }
};