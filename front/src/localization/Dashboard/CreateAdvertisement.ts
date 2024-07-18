import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    info1: string;
    info3: string;
    info8: string;
    info9: string;
    dealType: string;
    dealCont1: string;
    dealCont21: string;
    dealCont22: string;
    dealCont3: string;
    location: string;
    locationDesc: string;
    additionalInfo: string;
    currency: string;
    paymentType: string;
    paymentTypeDesc: string;
    profit: string;
    profitDesc: string;
    expression: string;
    expressionError: string;
    expressionInfo: string;
    expressionDesc: string;
    minLimit: string;
    maxLimit: string;
    maxLimitDesc: string;
    workTime: string;
    workTimeDesc: string;
    terms: string;
    termsDesc: string;
    liquidParams: string;
    monitorLiquid: string;
    monitorLiquidDesc: string;
    securityParams: string;
    notAnonymous: string;
    notAnoymousDesc: string;
    trusted: string;
    trustedDesc: string;
    publish: string;
    editAdTitle: string;
    createAdTitle: string;
    title: string;
    titleDesc: string;
    window: string;
    windowDesc: string;
    country: string;
    amountError: string;
    minLimitDesc1: string;
    autoPrice: string;
    autoPriceMore: string;
    autoPrice1: string;
    lnEnable: string;
    lnDisableBalance: string;
    lnEnableDesc: string;
    lnDisableBalanceDesc: string;
}

export const data = {
    ru: {
        info1: `Для отображения объявлений вам необходимо иметь криптовалюту на вашем балансе.`,
        info3: `Сбор с разместивших объявление пользователей за каждую совершенную сделку составляет 1%
                            от общей суммы сделки.
                            Информация обо всех сборах приводится на соответствующей странице нашего сайта.`,
        info8: `Весь обмен информацией должен происходить на этом сайте.`,
        info9: `Способы оплаты, отмеченные как "С высокой степенью риска" сопряжены со значительным
                            риском мошенничества.
                            Будьте осмотрительны и всегда проверяйте личность ваших партнеров по сделке, если вы
                            используете способ оплаты с высокой степенью риска.`,
        dealType: `Тип сделки`,
        dealCont1: `Я хочу...`,
        dealCont21: `Продать криптовалюту онлайн`,
        dealCont22: `Купить криптовалюту онлайн`,
        dealCont3: `Какой тип объявления вы хотите создать?`,
        location: `Местоположение`,
        locationDesc: `Для онлайн-торговли вам необходимо указать страну.`,
        additionalInfo: `Дополнительная информация`,
        currency: `Валюта`,
        paymentType: `Способ оплаты`,
        paymentTypeDesc: `Обязательно. Название или идентификационный код используемого вами способа оплаты.
                                Сначала укажите страну. Если желаемого способа оплаты нет в списке, свяжитесь с тех. поддержкой.`,
        profit: `Прибыль`,
        profitDesc: `Размер прибыли, которую вы хотите получить сверх рыночной цены.
                                        Используйте отрицательное значение для покупки или продажи ниже рыночной цены,
                                        чтобы осуществить больше сделок.
                                        Для более сложного ценообразования используйте уравнение установления цены.`,
        expression: `Уравнение цены`,
        expressionError: `Неверная формула`,
        expressionInfo: `Цена сделки с текущей рыночной стоимостью`,
        expressionDesc: `Вы можете использовать переменные в уравнении формулы. Подробнее смотрите в FAQ.
                                        Обратите внимание, что пользователь, разместивший объявление, всегда отвечает за
                                        оплату всех сборов за обработку сделки.`,
        minLimit: `Минимальный лимит сделки`,
        minLimitDesc1: `Минимальная сумма одной сделки 0,000001BTC или `,
        maxLimit: `Максимальный лимит сделки`,
        maxLimitDesc: `Обязательный параметр для объявление о покупке. Максимальный сумма одной сделки.
                                        Ваш баланс может также ограничить максимальный сумму сделки, подлежащую фондированию.`,
        workTime: `Часы работы`,
        workTimeDesc: `Необязательный параметр. Дни и часы, в которые объявление будет показываться (в
                                        остальное время оно будет скрыто).`,
        terms: `Условия сделки`,
        termsDesc: `Дополнительные условия сделки. Пример: После оплаты отправьте документы, подтверждающие оплату.`,
        liquidParams: `Параметры ликвидности`,
        monitorLiquid: `Следить за ликвидностью`,
        monitorLiquidDesc: `Этот параметр ограничивает ликвидность этого объявления до максимального лимита
                                        транзакции.
                                        Покупатели не могут открыть и завершить сделки на сумму свыше указанной.
                                        Пример: если включен параметр "следить за ликвидностью" и максимальный лимит
                                        транзакции установлен в размере 100 долл.США,
                                        то в случае открытия торгов покупателем за 20 долларов США максимальный лимит
                                        транзакций автоматически уменьшается до 80 долл.США.
                                        Лимит возвращается к значению 100 долл.США, если покупатель отменяет торги, и
                                        остается на уровне 80 долл.США, если торги завершаются.`,
        securityParams: `Параметры безопасности`,
        notAnonymous: `Не показывать объявление анонимным пользователям`,
        notAnoymousDesc: `Чтобы ответить на ваше объявление, пользователям необходимо зарегистрироваться на сайте.`,
        trusted: `Только доверенные пользователи`,
        trustedDesc: `Установите ограничение, при котором ваше объявление смогут видеть лишь
                                        пользователи, которых вы отметили как доверенных.
                                        Узнайте, как отмечать пользователей доверенными."`,
        publish: `Опубликовать объявление`,
        createAdTitle: `Создание объявления`,
        editAdTitle: `Редактирование объявления`,
        title: `Заголовок`,
        titleDesc: "Заголовок объявления. Он будет отображаться при поиске, в таблице объявлений. Максисмум 200 символов.",
        window: "Окно оплаты",
        windowDesc: "Количество минут за которое оплата должна быть произведена. Если за это время оплата не произведена, сделка автоматически отменяется. Минимальное значение 15 мин. Максимальное 90 мин.",
        country: "Страна: ",
        amountError: "Минимальный лимит больше максимального.",
        autoPrice: "Автоматическая установка цены. \n" +
            "В объявлении вы указываете цену, хуже которой вы не хотите торговать. \n" +
            "Если автоцена включена, то с периодичностью указанной вами, будет происходить авторасчет цены.\n" +
            "В результате авторасчета цены вашего объявления, оно займет максимально высокую позицию, которая ограничена только пороговой ценой указанной вами в объявлении.\n" +
            "При этом, цена вашего объявления будет только на 0.01 хуже, чем цена ближайшего конкурента из списка ниже.\n " +
            "Чем меньше период, тем эффективнее торговля.",
        autoPriceMore: "Подробнее на примере",
        autoPrice1: "Авто цена",
        lnEnable: "Lightning Network",
        lnDisableBalance: "Не использовать баланс",
        lnEnableDesc: "Для внесения депозита будет использоваться Lightning Network. " +
            "Эта функция позволяет иметь минимальное доверие к бирже, использование кошелька биржи минимально, как по времени так и по объему средств. " +
            "Если вы имеете канал с биржей, то можете совершать ввод и вывод без комиссии. " +
            "После создания сделки, при недостаточном балансе, будет создан Invoice на недостающую сумму. "+
            "У вас будет 10 минут для его оплаты. Если вы не оплатите, сделка будет отменена автоматически. " +
            "Полученные средства будут использованы как депозит сделки. При отмене сделки инициатором, средства будут возвращены на ваш баланс. ",
        lnDisableBalanceDesc: "Если это опция включена, то при создании сделки будет создан Invoice на сумму сделки, без использования баланса."
    },
    en: {
        info1: `To display ads you need to have crypto currency in your balance.`,
        info3: `The fee from users who placed an advertisement for each completed transaction is 1%
                             from total transaction amount.
                             Information on all fees is provided on the corresponding page of our website.`,
        info8: `All information exchange must take place on yhis site.`,
        info9: `Payment methods marked as High Risk are associated with significant risk fraud.
                             Be careful and always verify the identity of your transaction partners if you
                             Use a high risk payment method.`,
        dealType: `Type of transaction`,
        dealCont1: `I want to...`,
        dealCont21: `Sell crypto currency Online`,
        dealCont22: `Buy crypto currency Online`,
        dealCont3: `What type of ad do you want to create?`,
        location: `Location`,
        locationDesc: `For online trading you need to specify a country.`,
        additionalInfo: `Additional Information`,
        currency: `Currency`,
        paymentType: `Payment method`,
        paymentTypeDesc: `Required. The name or identification code of your payment method.
                                 First enter the country. If the desired payment method is not listed, contact those. support`,
        profit: `Profit`,
        profitDesc: `The amount of profit you want to get in excess of the market price.
                                         Use a negative value to buy or sell below market price,
                                         to make more transactions.
                                         For more complex pricing, use the pricing equation
`,
        expression: `Price equation`,
        expressionError: `Invalid formula`,
        expressionInfo: `Transaction price with current market value`,
        expressionDesc: `You can use variables in the fomula equation. See the FAQ for more details.
                                         Please note that the user who posted the ad is always responsible for
                                         Payment of all transaction processing fees.`,
        minLimit: `Minimum deal limit`,
        minLimitDesc1: `The minimum amount of one deal 0,000001BTC or `,
        maxLimit: `Maximum deal limit`,
        maxLimitDesc: `Mandatory parameter for a buy ad. The maximum amount of one deal.
                                         Your balance may also limit maximum deal amount to be funded.`,
        workTime: `Opening hours`,
        workTimeDesc: `Optional parameter. Days and hours during which the ad will be displayed (in
                                         the rest of the time it will be hidden).`,
        terms: `Terms of a transaction`,
        termsDesc: `Additional terms of the deal. Example: After payment, send documents confirming the payment.`,
        liquidParams: `Liquidity parameters`,
        monitorLiquid: `Monitor liquidity`,
        monitorLiquidDesc: `This setting limits the liquidity of this ad to the maximum limit.
                                        transactions.
                                        Buyers cannot open and complete transactions in excess of the specified amount.
                                        Example: if the option "monitor liquidity" and the maximum limit are enabled
                                        transactions set at $ 100,
                                        then in case of the opening of bidding by the buyer for $ 20, the maximum limit
                                        transaction automatically reduced to $ 80.
                                        The limit returns to the value of $ 100 if the buyer cancels the bid, and
                                        remains on level of 80 US dollars if trading ends.`,
        securityParams: `Security options`,
        notAnonymous: `Do not show advertisement to anonymous users`,
        notAnoymousDesc: `To respond to your advertisement, users need to register on the site.`,
        trusted: `Verified Users Only`,
        trustedDesc: `Set a limit where only your ad can be seen. Users which you marked as verified.
                                         Learn how to mark users verified.`,
        publish: `Post advertisement`,
        createAdTitle: `Create advertisement`,
        editAdTitle: `Editing an advertisement`,
        title: "Title",
        titleDesc: "The title of the advertisement. It will be displayed in the search table in the ad table. Maximum 200 characters.",
        window: "Payment window",
        windowDesc: "The number of minutes for which payment must be made. If payment is not made during this time, the transaction is automatically canceled. The minimum value is 15 minutes. Maximum 90 minutes.",
        country: "Country: ",
        amountError: "The minimum limit is greater than the maximum.",
        autoPrice: "Automatic price calculation. \n" +
            "In your advertisement, you set a price worse than which you do not want to trade. \n" +
            "If auto price is enabled, then with the frequency specified by you, the price will be automatically calculated.\n" +
            "As a result of the auto-calculation of the price of your advertisement, it will take the highest possible position, which is limited only by the threshold price you specified in the advertisement.\n" +
            "At the same time, the price of your ad will be only 0.01 worse than the price of your nearest competitor from the list below.\n " +
            "The shorter the period, the more efficient the trade.",
        autoPriceMore: "More on example",
        autoPrice1: "Auto price",
        lnEnable: "Lightning Network",
        lnDisableBalance: "Don't use balance",
        lnEnableDesc: "Lightning Network will be used to deposit. " +
            "This feature allows you to have a minimal trust in the exchange, the use of the exchange wallet is minimal, both in time and by amount. " +
            "If you have a channel with exchange, you can enter and output without commission. " +
            "After creating a transaction, with an insufficient balance, Invoice will be created for the missing amount. "+
            "You will have 10 minutes to pay it. If you do not pay, the deal will be canceled automatically. " +
            "The funds received will be used as a deal deposit. When canceling a deal on the request of the initiator, funds will be returned to your balance.",
        lnDisableBalanceDesc: "If this option is enabled, Invoice will be created on the full amount of the deal, without the use of the balance."
    }
};