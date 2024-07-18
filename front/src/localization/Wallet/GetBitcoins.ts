import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Title: string;
    Description: string;
    Bech32: string;
    Bech32Description: string;
    Legacy: string;
    LegacyDesctiption: string;
    Inst1: string;
    Inst2: string;
    onChain: string;
    ln: string;
}

export const data = {
    ru: {
        Title: "Принять биткоины",
        Description: "Пополнение счета в биткоинах",
        Bech32: "Bech32 адрес",
        Bech32Description: "Новый тип адреса. Стоимость транзакции меньше примерно на 40%, но поддерживается\n" +
            "                                        пока не всеми кошельками.\n" +
            "                                        Если ваш кошелек не понимает адрес, переключтесь на обычный тип адресов.",
        Legacy: "Обычный адрес",
        LegacyDesctiption: "Обычный тип адреса. Поддерживается всеми кошельками.",
        Inst1: "Для оплаты отсканируйте штрихкод или перейдите по ссылке:",
        Inst2: " или переведите нужное количество на адрес:",
        onChain: "Через сеть Bitcoin",
        ln: "Через Lightning Network"
    },
    en: {
        Title: "Receive bitcoins",
        Description: "Depositing in Bitcoins",
        Bech32: "Bech32 address",
        Bech32Description: "New type of address. The transaction cost is about 40% less, but not all wallets support it yet. If your wallet does not understand the address, switch to the usual type of addresses.",
        Legacy: "Legacy address",
        LegacyDesctiption: "The legacy address. Supported by all wallets.",
        Inst1: "To pay, scan the barcode or follow the link:",
        Inst2: " or transfer the required amount to the address:",
        onChain: "Through the Bitcoin network",
        ln: "Through the Lightning Network"
    }
};