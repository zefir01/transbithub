import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    phCountry: string;
    phPaymentType: string;
    phCurrency: string;
}

export const data = {
    ru: {
        phCountry: "Выберите страну",
        phPaymentType: "Выберите способ оплаты",
        phCurrency: "Выберите валюту"
    },
    en: {
        phCountry: "Select country",
        phPaymentType: "Select payment type",
        phCurrency: "Select currency"
    }
};