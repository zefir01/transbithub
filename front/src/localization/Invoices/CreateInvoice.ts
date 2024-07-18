import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string,
    info: string;
    type: string;
    private: string;
    public: string;
    typeInfo1: string;
    typeInfo2: string;
    baseCurrency: string;
    cryptoCurrency: string;
    fiatCurrency: string;
    currencyInfo1: string;
    currencyInfo2: string
    partner: string;
    partnerInfo: string;
    priceInfo: string;
    priceInfo2: string;
    expression: string;
    expressionError: string;
    price: string;
    expressionInfo: string;
    ttl: string;
    minute: string;
    hour: string;
    day: string;
    ttlInfo: string;
    create: string;
    avgInfo: string;
    exchInfo: string;
    useExchRate: string;
    avg: string;
    currentValues: string;
    priceBtc: string;
    price1Btc: string;
    check: string;
    minPieces: string;
    maxPieces: string;
    minPiecesInfo: string;
    maxPiecesInfo: string;
    valuesInfo: string;
    comment: string;
    commentInfo: string;
    cryptoPiecePrice: string;
    minPiecePriceCrypto: string;
    maxPicePriceCrypto: string;
    amountCrypto: string;
    amountFiat: string;
    fiatPiecePrice: string;
    minFiatAmount: string;
    maxFiatAmount: string;
    amount: string;
    balanceError: string;
    limit: string;
    limitInfo: string;
    titleUpdate: string;
    btnUpdate: string;
    max: string;
    images: string;
    imagesInfo: string;
    calc: string;
}

export const data = {
    ru: {
        title: "Создание и выставление счета",
        info: "Комиссия составляет 1%, и взимается с создателя счета.",
        type: "Тип счета",
        private: "Приватный счет",
        public: "Публичный счет",
        typeInfo1: "Приватный счет, выставляется конкретному партнеру. Оплатить его может только он и только в полном объеме. Комиссия взимается в момент создания счета.",
        typeInfo2: "Публичный счет, оплатить может любой желающий. Можно разместить ссылку на него на сайте или форуме. Возможна оплата частями. Комиссия взимается в момент оплаты счета.",
        baseCurrency: "Основная валюта",
        cryptoCurrency: "Криптовалюта",
        fiatCurrency: "Фиатная валюта",
        currencyInfo1: "Если основной валютой счета является криптовалюта, то вы получите именно\n" +
            " то количество криптовалюты, вне зависимости от изменения курса.",
        currencyInfo2: "Если основной валютой счета является фиатная валюта, то количество\n" +
            " криптовалюты будет расчитываться через курс, которое вы задаете.",
        partner: "Партнер",
        partnerInfo: "Обязательное поле. Имя пользователя, которому будет выставлен счет. Проверьте, существует ли такой пользователь.",
        priceInfo: "Цена за часть в криптовалюте. Вы получите эту сумму минус 1% комиссии. Минимальная сумма: ",
        priceInfo2: "Цена за часть и фиатная валюта, которая будет использована для расчета количества криптовалюты. Минимальная сумма: ",
        expression: "Уравнение цены",
        expressionError: "Ошибка в уравнении цены",
        price: "Цена за часть",
        expressionInfo: "Уравнение цены используемое для расчета количества криптовалюты счета. Подробнее смотрите в FAQ.",
        ttl: "Время жизни счета",
        minute: "Минут",
        hour: "Часов",
        day: "Дней",
        ttlInfo: "Время, через которое счет будет удален и не сможет быть оплачен. Минимальный срок жизни 15 минут. Максимальный срок жизни 30 дней.",
        create: "Создать счет",
        avgInfo: "Использовать среднюю цену всех сделок за последние 5 минут",
        exchInfo: "Использовать последнюю цену биржи ",
        useExchRate: "Использовать курс биржи",
        avg: "Среднее",
        currentValues: "Текущие расчетные значения",
        priceBtc: "Цена за 1 BTC: ",
        price1Btc: "Сумма счета в BTC: ",
        check: "Проверить",
        minPieces: "Минимум частей",
        maxPieces: "Максимум частей",
        minPiecesInfo: "Вы можете позволить партнеру оплатить счет за несколько единиц товара, на его усмотрение. " +
            "Минимальное количество частей 1. Минимальное количество не должно быть больше максимального.",
        maxPiecesInfo: "",
        valuesInfo: "Значения цен рассчитанные по курсу, на данный момент.",
        comment: "Комментарий к счету",
        commentInfo: "Вы можете оставить комментарий к счету, где описать условия оплаты и значение частей.",
        cryptoPiecePrice: "Цена за часть в криптовалюте: ",
        minPiecePriceCrypto: "Минимальная сумма счета в криптовалюте: ",
        maxPicePriceCrypto: "Максимальная сумма счета в криптовалюте: ",
        fiatPiecePrice: "Цена за часть в фиатной валюте: ",
        minFiatAmount: "Минимальная сумма счета в фиатной валюте: ",
        maxFiatAmount: "Максимальная сумма счета в фиатной валюте: ",
        amountCrypto: "Сумма счета в криптовалюте ",
        amountFiat: "Сумма счета в фиатной валюте ",
        amount: "Сумма счета",
        balanceError: "Недостаточный баланс для оплаты комиссии",
        limit: "Ограничить ликвидность",
        limitInfo: "Ограничить ликвидность до максимального количества частей. Подходит для продажи ограниченной партии товара. " +
            "Пример: Нужно продать 30 единиц товара, при покупке двух единиц, общее количество будет уменьшено на два.",
        titleUpdate: "Изменение счета ",
        btnUpdate: "Изменить счет",
        max: "Максимум 10 файлов.",
        images: "Изображения",
        imagesInfo: "Вы можете прикрепить изобраения к счету. Они будут видны всем, кто может видеть счет. " +
            "Будьте внимательны, эти изображения можно видеть до оплаты счета.",
        calc: "Расчет количества"
    },
    en: {
        title: "Create and send invoice",
        info: "The commission is 1% and is charged to the invoice creator.",
        type: "Invoice type",
        private: "Private invoice",
        public: "Public invoice",
        typeInfo1: "A private invoice issued to a specific partner. Only he can pay for it and only in full. Commission is charged at the moment of account creation.",
        typeInfo2: "Public account, anyone can pay. You can place a link to it on a site or forum. Payment in installments is possible. The commission is charged at the time of payment of the invoice.",
        baseCurrency: "Base currency",
        cryptoCurrency: "Cryptocurrency",
        fiatCurrency: "Fiat currency",
        currencyInfo1: "If the main currency of the account is cryptocurrency, then you will receive exactly the amount " +
            "of cryptocurrency, regardless of the change in exchange rate.",
        currencyInfo2: "If the main currency of the account is fiat currency, then the number of cryptocurrencies " +
            "will be calculated through the price rate that you specify.",
        partner: "Partner",
        partnerInfo: "Required field. The name of the user who will be billed. Check if such user exists.",
        priceInfo: "Price of a piece in cryptocurrency. You will receive this amount minus 1% commission. Minimal amount: ",
        priceInfo2: "Price of a piece and fiat currency, which will be used to calculate the number of cryptocurrencies. Minimal amount: ",
        expression: "Price equation",
        expressionError: "Error in the price equation",
        price: "Price for piece",
        expressionInfo: "The price equation used to calculate the number of cryptocurrency accounts. See the FAQ for more details.",
        ttl: "Invoice lifetime",
        minute: "Minutes",
        hour: "Hours",
        day: "Days",
        ttlInfo: "The time after which the account will be deleted and cannot be paid. Minimum lifespan of 15 minutes. The maximum life of 30 days.",
        create: "Create invoice",
        avgInfo: "Use the average price of all deals in the last 5 minutes",
        exchInfo: "Use the latest exchange price ",
        useExchRate: "Use exchange rate",
        avg: "Average",
        currentValues: "Current calculated values",
        priceBtc: "Price for 1 BTC: ",
        price1Btc: "BTC invoice amount: ",
        check: "Check",
        minPieces: "Minimum pieces",
        maxPieces: "Maximum pieces",
        minPiecesInfo: "You can let the partner pay the bill for several pieces, at their discretion. " +
            "The minimum number of parts is 1. The minimum pieces should not exceed the maximum pieces.",
        maxPiecesInfo: "",
        valuesInfo: "Prices are calculated at the exchange rate, yes at the moment.",
        comment: "Account comment",
        commentInfo: "You can leave a comment on the invoice where you describe the terms of payment and the value of the pieces.",
        cryptoPiecePrice: "Price per piece in cryptocurrency: ",
        minPiecePriceCrypto: "Minimum account amount in cryptocurrency: ",
        maxPicePriceCrypto: "Maximum account amount in cryptocurrency: ",
        fiatPiecePrice: "Price per piece in fiat currency: ",
        minFiatAmount: "Minimum fiat amount of invoice: ",
        maxFiatAmount: "Maximum fiat amount of invoice: ",
        amountCrypto: "Invoice amount in cryptocurrency ",
        amountFiat: "Invoice amount in fiat currency ",
        amount: "Invoice amount",
        balanceError: "Insufficient balance to pay fee",
        limit: "Limit liquidity",
        limitInfo: "Limit liquidity to the maximum number of pieces. Suitable for the sale of a limited batch of goods. " +
            "Example: You need to sell 30 units of a product, when buying two units, the total will be reduced by two.",
        titleUpdate: "Update invoice ",
        btnUpdate: "Update invoice",
        max: "Maximum 10 files.",
        images: "Images",
        imagesInfo: "You can attach images to the invoice. They will be visible to everyone who can see the invoice. "+
        "Be careful, these images can be seen before the bill is paid.",
        calc: "Amount calculation"
    }
};