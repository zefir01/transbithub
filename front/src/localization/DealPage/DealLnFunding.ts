import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    info1: string;
    copy: string;
    qr: string;
    info2: string;
    info3: string;
}

export const data = {
    ru: {
        title: "Внесение депозита через Lightning Network",
        info: "Для начала сделки вам необходимо внести депозит в размере ",
        info1: "или сделка будет отменена автоматически через ",
        copy: "Скопируйте запрос:",
        qr: "Или сканируйте QR код:",
        info2: "В течении ",
        info3: " партнер внесет депозит или сделка будет отменена автоматически. Ожидайте."
    },
    en: {
        title: "Deposit through a lightning network",
        info: "To start the deal, you need to make a deposit in the amount ",
        info1: "Or the transaction will be canceled automatically after ",
        copy: "Copy the invoice:",
        qr: "Or scan QR code:",
        info2: "Within ",
        info3: ", the partner will make a deposit or the transaction will be canceled automatically. Wait please."
    }
};