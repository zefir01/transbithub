import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    country: string;
    fiat: string;
    paymentType: string;
    bestDeal: string;
    bestInfo: string;
    selectAd: string;
    selectAdInfo: string;
}

export const data = {
    ru: {
        title: "Оплатить фиатной валютой через сделку",
        info: "Вы можете оплатить счет фиатной валютой, через сделку. Сделка будет создана ровно на ту сумму," +
            " которая требуется для оплаты. Сумма сделки в фиатной валюте, может незначительно отличаться." +
            " Купленная криптовалюта будет автоматически использована для оплаты. Выберите страну, валюту и" +
            " способ оплаты.",
        country: "Страна поиска объявлений",
        fiat: "Фиатная валюта, которой вы хотите оплатить",
        paymentType: "Желаемый способ оплаты",
        bestDeal: "Оплатить по лучшему курсу",
        bestInfo: "Создает сделку по объявлению с наиболее выгодным курсом.",
        selectAd: "Выбрать объявление вручную",
        selectAdInfo: "Будет показан список подходящих объявлений, из которого вы можете выбрать объявление для" +
            " создания сделки."
    },
    en: {
        title: "Pay with fiat currency through a deal",
        info: "You can pay your invoice with fiat currency through a Escrow. The deal will be created for exactly the same amount "+
            "which is required for payment. The amount of the transaction in phytan currency may differ slightly. " +
            "The purchased cryptocurrency will be automatically used for payment. Select your country, currency and " +
            " payment method.",
        country: "Country of search ads",
        fiat: "Fiat currency you want to pay with",
        paymentType: "Desired payment method",
        bestDeal: "Pay at the best rate",
        bestInfo: "Creates a deal with the ad with the most profitable rate.",
        selectAd: "Select ad manually",
        selectAdInfo: "A list of eligible ads will be displayed, from which you can select an ad to create a deal."
    }
};