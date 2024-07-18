import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    selectCountry: string;
    country: string;
    close: string;
    selectCurrency: string;
    selectPaymentType: string;
}

export const data = {
    ru: {
        selectCountry: "Выберите страну из списка",
        country: "Страна: ",
        close: "Закрыть",
        selectCurrency: "Выберите валюту из списка",
        selectPaymentType: "Выберите способ платежа из списка",

    },
    en: {
        selectCountry: "Select a country from the list",
        country: "Country: ",
        close: "Close",
        selectCurrency: "Select a currency from the list",
        selectPaymentType: "Choose a payment method from the list",
    }
};