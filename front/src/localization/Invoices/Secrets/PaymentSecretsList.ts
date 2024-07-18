import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    warn1: string;
    warn2: string;
    title: string;
    link: string;
}

export const data = {
    ru: {
        warn1: "У продавца не хватило секретов. Свяжитесь с продавцом для получения товара.",
        warn2: "У вас не хватило секретов для этой продажи. Свяжитесь с покупателем для передачи товара.",
        title: "Купленные секреты",
        link: "Для получения товара перейдите по ссылке: "
    },
    en: {
        warn1: "The seller did not have enough secrets. Contact the seller to get the item.",
        warn2: "You didn't have enough secrets for this sale. Contact the buyer to transfer the item.",
        title: "Purchased secrets",
        link: "To get the product follow the link: "
    }
};