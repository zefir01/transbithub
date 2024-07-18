import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    SendAmount: string;
    DestinationAddress: string;
    InvalidAddress: string;
    insufficientFunds: string;
    SendRequest: string;
    Sent: string;
    SendBitcoins: string;
    bitcoinsAccount: string;
    Balance: string;
    Commission: string;
    Send: string;
    EnterAddress: string;
    NetworkAddress: string;
    WrongAddress: string;
    Send1: string;
    toAddr: string;
    onChain: string;
    ln: string;
}

export const data = {
    ru: {
        SendAmount: "Укажите желаемое количество для отправки",
        DestinationAddress: "Введите адрес назначения",
        InvalidAddress: "Некорpектный адрес назначения",
        insufficientFunds: "Недостаточный баланс для отправки такого количества.",
        SendRequest: "Отправляем запрос.",
        Sent: "Отправлено",
        SendBitcoins: "Отправить биткоины",
        bitcoinsAccount: "Здесь вы можете отправить биткоины со счета на нужный вам кошелек.",
        Balance: "Баланс",
        Commission: "Комиссия",
        Send: "Можно отправить",
        EnterAddress: "Введите адрес назначения",
        NetworkAddress: "Адрес принадлежит к тестовой сети.",
        WrongAddress: "Некорpектный адрес.",
        Send1: "Отправить ",
        toAddr: " на адрес ",
        onChain: "Через сеть Bitcoin",
        ln: "Через Lightning Network"
    },
    en: {
        SendAmount: "Specify the desired quantity to send",
        DestinationAddress: "Enter destination address",
        InvalidAddress: "Invalid destination address",
        insufficientFunds: "There is not enough balance to send this amount.",
        SendRequest: "We send a request.",
        Sent: "Sent",
        SendBitcoins: "Send Bitcoins",
        bitcoinsAccount: "Here you can send bitcoins from the account to the wallet you need.",
        Balance: "Balance",
        Commission: "Commission",
        Send: "Can send",
        EnterAddress: "Enter destination address",
        NetworkAddress: "The address belongs to the test network.",
        WrongAddress: "Invalid address.",
        Send1: "Send ",
        toAddr: " to address ",
        onChain: "Through the Bitcoin network",
        ln: "Through the Lightning Network"
    }
};

