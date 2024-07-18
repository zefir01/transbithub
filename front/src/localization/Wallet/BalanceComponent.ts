import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Send: string,
    Receive: string,
    Currency: string,
    Confirmed: string,
    NotConfirmed: string,
    Deposited: string,
}

export const data = {
    ru: {
        Send: "Отправить",
        Receive: "Получить",
        Currency: "Криптовалюта",
        Confirmed: "Подтверждено",
        NotConfirmed: "Ожидается",
        Deposited: "Депозит"

    },
    en: {
        Send: "Send",
        Receive: "Receive",
        Currency: "Currency",
        Confirmed: "Confirmed",
        NotConfirmed: "Expected",
        Deposited: "Deposited"
    }
};
