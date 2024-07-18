import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    add: string;
    soldTitle: string;
    soldInfo: string;
}

export const data = {
    ru: {
        title: "Секреты",
        info: "Покупатель покупает секреты. Одна часть - один секрет. Если секретов недостаточно, то покупателю будет рекомендовано связаться с продавцом, для получения товара.",
        add: "Добавить",
        soldTitle: "Проданные секреты",
        soldInfo: "После продажи, секреты попадают в эту таблицу."
    },
    en: {
        title: "Secrets",
        info: "The buyer buys secrets. One piece is one secret. If secrets are not enough, the buyer will be advised to contact the seller to receive the goods.",
        add: "Add new",
        soldTitle: "Secrets sold",
        soldInfo: "After the sale, the secrets go into this table."
    }
};