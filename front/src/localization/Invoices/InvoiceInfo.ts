import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    yes: string;
    no: string;
    amount: string;
    piecePrice: string;
    amountCrypto: string;
    piecePriceCrypto: string;
    pieces: string;
    partner: string;
    ttl: string;
    private: string;
    inCrypto: string;
    fiat: string;
    comment: string;
    number: string;
    fee: string;
    minCryptoAmount: string;
    maxCryptoAmount: string;
    minFiatAmount: string;
    maxFiatAmount: string;
    limit: string;
    totalAmountFiat: string;
    totalAmountCrypto: string;
    paymentsCount: string;
    show: string;
    hide: string;
    refund: string;
    payment: string;
    pieces1: string;
    autoPrice: string;
    links: string;
    linksDesc: string;
    link: string;
    piecesParam: string;
    helper: string;
    iframe: string;
    iframeHelper: string;
    close: string;
    status: string;
    active: string;
    pendingPay: string;
    noPieces: string;
    payed: string;
}

export const data = {
    ru: {
        yes: "Да",
        no: "Нет",
        amount: "Сумма",
        piecePrice: "Цена за часть",
        amountCrypto: "Сумма в криптовалюте",
        piecePriceCrypto: "Цена за часть в криптовалюте",
        pieces: "Части",
        partner: "Партнер",
        ttl: "Действует до",
        private: "Приватный",
        inCrypto: "В криптовалюте",
        fiat: "Фиатная валюта",
        comment: "Комментарий",
        number: "Номер счета: ",
        fee: "Комиссия",
        minCryptoAmount: "Минимальная сумма в криптовалюте",
        maxCryptoAmount: "Максимальная сумма в криптовалюте",
        minFiatAmount: "Минимальная сумма в фиатной валюте",
        maxFiatAmount: "Максимальная сумма в фиатной валюте",
        limit: "Ограничить ликвидность",
        totalAmountFiat: "Всего оплачено в фиатной валюте",
        totalAmountCrypto: "Всего оплачено в криптовалюте",
        paymentsCount: "Количество платежей",
        show: "Показать",
        hide: "Скрыть",
        refund: "Возврат по ",
        payment: "платежу ",
        pieces1: "Части: ",
        autoPrice: "Покупка авторасчетов цены объявления.",
        links: "Ссылки",
        linksDesc: "Вы можете использовать эти ссылки для размещения на форума, в письмах, в мессеннджерах, где угодно.",
        link: "Стандартная оплата",
        piecesParam: "количество частей по умолчанию (необязательно)",
        helper: "Оплата через Помощник",
        iframe: "IFrame стандартной оплаты",
        iframeHelper: "IFrame оплаты через Помощник",
        close: "Закрыть",
        status: "Статус",
        active: "Активный",
        pendingPay: "Ожидает оплату",
        noPieces: "Закончились части",
        payed: "Оплачен",
    },
    en: {
        yes: "Yes",
        no: "No",
        amount: "Amount",
        piecePrice: "Price of piece",
        amountCrypto: "Amount in cryptocurrency",
        piecePriceCrypto: "Price per piece in cryptocurrency",
        pieces: "Pieces",
        partner: "Partner",
        ttl: "Valid until",
        private: "Is private",
        inCrypto: "In cryptocurrency",
        fiat: "Fiat currency",
        comment: "Comment",
        number: "Invoice id: ",
        fee: "Fee",
        minCryptoAmount: "Minimum amount in cryptocurrency",
        maxCryptoAmount: "Maximum amount in cryptocurrency",
        minFiatAmount: "Minimum amount in fiat currency",
        maxFiatAmount: "Maximum amount in fiat currency",
        limit: "Limit liquidity",
        totalAmountFiat: "Total paid in fiat currency",
        totalAmountCrypto: "Paid in total in cryptocurrency",
        paymentsCount: "Payments count",
        show: "Show",
        hide: "Hide",
        refund: "Refund for",
        payment: "payment ",
        pieces1: "Pieces: ",
        autoPrice: "Buying advertisement price auto calculations.",
        links: "Links",
        linksDesc: "You can use these links to post on the forum, in emails, in instant messengers, anywhere.",
        link: "Standard payment",
        piecesParam: "default number of parts (optional)",
        helper: "Payment via Assistant",
        iframe: "IFrame standard payment",
        iframeHelper: "IFrame Payment Assistant",
        close: "Close",
        status: "Status",
        active: "Active",
        pendingPay: "Pending pay",
        noPieces: "Out of pieces",
        payed: "Payed",
    }
};