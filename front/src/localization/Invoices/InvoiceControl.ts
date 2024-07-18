import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    invoiceControl: string;
    delete: string;
    block: string;
    edit: string;
    balance: string;
    self: string;
    pay: string;
    cryptoAmount: string;
    fiatAmount: string;
    pieces: string;
    needAuth: string;
    payLn: string;
}

export const data = {
    ru: {
        invoiceControl: "Управление счетом",
        delete: "Удалить",
        block: "Заблокировать пользователя",
        edit: "Редактировать",
        balance: "Недостаточно средств для оплаты",
        self: "Вы не можете оплатить собственный счет",
        pay: "Оплатить с баланса",
        cryptoAmount: "Сумма в криптовалюте: ",
        fiatAmount: "Сумма в фиатной валюте: ",
        pieces: "Части:",
        needAuth: "Для оплаты с баланса требуется авторизация.",
        payLn: "Оплатить через Lightning Network"
    },
    en: {
        invoiceControl: "Invoice control",
        delete: "Delete",
        block: "Block partner",
        edit: "Edit",
        balance: "Insufficient balance to pay",
        self: "You cannot pay your own invoice",
        pay: "Pay from balance",
        cryptoAmount: "Cryptocurrency amount: ",
        fiatAmount: "Fiat amount: ",
        pieces: "Pieces:",
        needAuth: "To pay from balance, authorization is required.",
        payLn: "Pay with Lightning Network"
    }
};