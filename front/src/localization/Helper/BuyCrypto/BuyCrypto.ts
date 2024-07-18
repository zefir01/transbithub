import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    back: string;
    country: string;
    countryInfo: string;
    change: string;
    currency: string;
    currencyInfo: string;
    paymentType: string;
    paymentTypeInfo: string;
    ok: string;
}

export const stringsBuyCrypto: IStrings = new LocalizedStrings({
    ru: {
        title: "Выберите страну валюту и способ оплаты",
        info: "Для проведения операции нужно ответить на несколько вопросов.",
        back: "Назад",
        country: "Страна",
        countryInfo: "Укажите страну, в которой вы хотите купить биткоины",
        change: "Изменить",
        currency: "Валюта",
        currencyInfo: "Укажите валюту за которую вы хотите купить биткоины",
        paymentType: "Способ оплаты",
        paymentTypeInfo: "Укажите через что вы хотите перевести",
        ok: "Все верно",
    },
    en: {
        title: "Select country currency and payment method",
        info: "To carry out the operation, you need to answer several questions.",
        back: "Back",
        country: "Country",
        countryInfo: "Specify the country where you want to buy bitcoins",
        change: "Edit",
        currency: "Currency",
        currencyInfo: "Specify the currency for which you want to buy bitcoins",
        paymentType: "Payment type",
        paymentTypeInfo: "Specify through what you want to transfer",
        ok: "All right",
    }
});

export const stringsPayInvoice: IStrings = new LocalizedStrings({
    ru: {
        title: "Выберите страну валюту и способ оплаты",
        info: "Для проведения операции нужно ответить на несколько вопросов.",
        back: "Назад",
        country: "Страна",
        countryInfo: "Укажите страну, в которой вы находитесь",
        change: "Изменить",
        currency: "Валюта",
        currencyInfo: "Укажите валюту в которой вы хотите оплатить счет",
        paymentType: "Способ оплаты",
        paymentTypeInfo: "Укажите через что вы хотите перевести",
        ok: "Все верно",
    },
    en: {
        title: "Select country currency and payment method",
        info: "To carry out the operation, you need to answer several questions.",
        back: "Back",
        country: "Country",
        countryInfo: "Specify the country you are in",
        change: "Edit",
        currency: "Currency",
        currencyInfo: "Specify the currency in which you want to pay the invoice",
        paymentType: "Payment type",
        paymentTypeInfo: "Specify through what you want to transfer",
        ok: "All right",
    }
});

export const stringsUsePromise: IStrings = new LocalizedStrings({
    ru: {
        title: "Выберите страну валюту и способ оплаты",
        info: "Для проведения операции нужно ответить на несколько вопросов.",
        back: "Назад",
        country: "Страна",
        countryInfo: "Укажите страну, которой вы находитесь",
        change: "Изменить",
        currency: "Валюта",
        currencyInfo: "Укажите валюту которую вы хотите получить",
        paymentType: "Способ оплаты",
        paymentTypeInfo: "Укажите через что вы хотите получить",
        ok: "Все верно",
    },
    en: {
        title: "Select country currency and payment method",
        info: "To carry out the operation, you need to answer several questions.",
        back: "Back",
        country: "Country",
        countryInfo: "Specify the country you are in",
        change: "Edit",
        currency: "Currency",
        currencyInfo: "Specify the currency you want to receive",
        paymentType: "Payment type",
        paymentTypeInfo: "Specify through what you want to receive",
        ok: "All right",
    }
});