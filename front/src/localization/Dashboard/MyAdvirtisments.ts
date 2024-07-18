import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
    status: string;
    type: string;
    price: string;
    expression: string;
    createdAt: string;
    create: string;
    vacation: string;
    salesDisabled: string;
    salesDisabledHelp: string;
    buysDisabled: string;
    buysDisabledHelp: string;
    country: string;
    buy: string;
    sell: string;
    edit: string;
    delete: string;
    active: string;
    disabled: string;
    DisabledByOwner: string;
    NotEnoughMoney: string;
    GlobalDisabled: string;
    DisabledByTimetable: string;
    autoPrice: string;
    autoPriceBuyed: string;
    period: string;
    autoPriceBuy: string;
    autoPriceMore: string;
    no: string;
    links: string;
    linksDesc: string;
    standard: string;
    helper: string;
    iframe: string;
    iframeHelper: string;
    close: string;
    amount: string;
}

export const data = {
    ru: {
        title: `Ваши объявления`,
        info: `Создавайте и управляйте объявлениями о продаже и покупке криптовалюты.`,
        status: `Статус`,
        type: `Тип`,
        price: `Цена`,
        expression: `Уравнение`,
        createdAt: `Создано`,
        create: `Создать объявление`,
        vacation: `Отпуск`,
        salesDisabled: `Продажи временно приостановлены`,
        salesDisabledHelp: `Временно отключить все объявления о продажах`,
        buysDisabled: `Покупки временно приостановлены`,
        buysDisabledHelp: `Временно отключить все объявления о покупках`,
        country: `Страна`,
        buy: `Покупка`,
        sell: `Продажа`,
        edit: "Редактировать",
        delete: "Удалить",
        active: "Включено",
        disabled: "Отключено",
        DisabledByOwner: "Отключено пользователем",
        NotEnoughMoney: "Недостаточно средств",
        GlobalDisabled: "Отключено глобально пользователем",
        DisabledByTimetable: "Отключено по расписанию",
        autoPrice: "Авто цена",
        autoPriceBuyed: "Осталось Авторасчетов:",
        period: "Авторасчетов хватит на:",
        autoPriceBuy: "Купить Авторасчеты",
        autoPriceMore: "Подробнее про автоцену",
        no: "Нет",
        links: "Ссылки",
        linksDesc: "Вы можете использовать эти ссылки для размещения на форума, в письмах, в мессеннджерах, где угодно.",
        standard: "Стандартная покупка/продажа",
        helper: "Покупка/Продажа через Помощник",
        iframe: "IFrame для стандартной покупки/продажи",
        iframeHelper: "IFrame для покупки/продажи через Помощник",
        close: "Закрыть",
        amount: "сумма по умолчанию (необязательно)",

    },
    en: {
        title: `Your advertisements`,
        info: `Create and manage advertisements for the sale and purchase of cryptocurrency.`,
        status: `Status`,
        type: `Type`,
        price: `Price`,
        expression: `Equation`,
        createdAt: `Created at`,
        create: `Create advertisement`,
        vacation: `Vacation`,
        salesDisabled: `Sales temporarily suspended`,
        salesDisabledHelp: `Temporarily disable all sales announcements`,
        buysDisabled: `Purchases are temporarily suspended`,
        buysDisabledHelp: `Temporarily disable all purchase ads`,
        country: `Country`,
        buy: `Buy`,
        sell: `Sell`,
        edit: "Edit",
        delete: "Delete",
        active: "Enabled",
        disabled: "Disabled",
        DisabledByOwner: "Disabled by owner",
        NotEnoughMoney: "Not enough money",
        GlobalDisabled: "Disabled globaly by owner",
        DisabledByTimetable: "Disabled by timetable",
        autoPrice: "Auto price",
        autoPriceBuyed: "Remaining Auto Calculations:",
        period: "Auto calculations will be enough for:",
        autoPriceBuy: "Buy Auto Calculations",
        autoPriceMore: "More about Auto Price",
        no: "No",
        links: "Links",
        linksDesc: "You can use these links to post on the forum, in emails, in instant messengers, anywhere.",
        standard: "Standard buying/selling",
        helper: "Buying/Selling via Assistant",
        iframe: "IFrame for standard buying/selling",
        iframeHelper: "IFrame for buying/selling via Assistant",
        close: "Close",
        amount: "default amount (optional)",
    }
};