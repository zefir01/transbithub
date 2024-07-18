import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    ph: string;
    info: string;
}

export const data = {
    ru: {
        ph: "Введите адрес кошелька",
        info: "Скопируйте адрес из вашего кошелька."
    },
    en: {
        ph: "Enter wallet address",
        info: "Copy the address from your wallet."
    }
};