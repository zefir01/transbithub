import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    id: string;
    payer: string;
    createdAt: string;
    fiatAmount: string;
    btcPrice: string;
    cryptoAmount: string;
    fee: string;
    confirmation: string;
    confInfo: string;
    status: string;
    deal: string;
    show: string;
    hide: string;
    cancel: string;
    messenger1: string;
    messenger2: string;
    seller: string;
    refund: string;
    pieces: string;
    purchased: string;
    refunding: string;
    refunded: string;
    promise: string;
}

export const data = {
    ru: {
        title: "Информация о платеже ",
        id: "Номер платежа: ",
        payer: "Оплатил",
        createdAt: "Создан",
        fiatAmount: "Сумма в фиатной валюте",
        btcPrice: "Цена за 1 BTC",
        cryptoAmount: "Сумма в криптовалюте",
        fee: "Комиссия",
        confirmation: "Подтверждение",
        confInfo: "Вы можете отправить подтверждение любому человеку, это абсолютное доказательство оплаты счета. Не изменяйте его.",
        status: "Статус",
        deal: "Сделка: ",
        show: "Показать",
        hide: "Скрыть",
        cancel: "Отменить",
        messenger1: "Написать покупателю",
        messenger2: "Написать продавцу",
        seller: "Партнер",
        refund: "Вернуть деньги",
        pieces: "Части",
        purchased: "Куплено: ",
        refunding: "Возвращается: ",
        refunded: "Возвращено: ",
        promise: "Промис"
    },
    en: {
        title: "Payment information ",
        id: "Payment number: ",
        payer: "Payer",
        createdAt: "Created at",
        fiatAmount: "Fiat amount",
        btcPrice: "Price for 1 BTC",
        cryptoAmount: "Cryptocurrency amount",
        fee: "Fee",
        confirmation: "Confirmation",
        confInfo: "You can send confirmation to anyone, this is absolute proof of payment of the invoice. Don't change it.",
        status: "Status",
        deal: "Deal ",
        show: "Show",
        hide: "Hide",
        cancel: "Cancel",
        messenger1: "Contact the buyer",
        messenger2: "Contact the seller",
        seller: "Partner",
        refund: "Refund",
        pieces: "Pieces",
        purchased: "Purchased: ",
        refunding: "Refunding: ",
        refunded: "Refunded: ",
        promise: "Promise"
    }
};