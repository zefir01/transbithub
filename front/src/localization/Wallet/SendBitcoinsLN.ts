import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Balance: string;
    fundsError: string;
    send: string;
    invoicePh: string;
    description: string;
    amount: string;
    success: string;
}

export const data = {
    ru: {
        Balance: "Баланс",
        fundsError: "Недостаточно средств",
        send: "Отправить",
        invoicePh: "Введите запрос платежа",
        description: "Описание:",
        amount: "Сумма:",
        success: "Запрос на вывод создан."
    },
    en: {
        Balance: "Balance",
        fundsError: "Insufficient funds",
        send: "Send",
        invoicePh: "Enter payment request",
        description: "Description:",
        amount: "Amount:",
        success: "Withdrawal request created."
    }
};

