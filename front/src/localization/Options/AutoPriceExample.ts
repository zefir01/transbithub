import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    yourAd: string;
    example: string;
    info1: string;
    info2: string;
    info3: string;
    info4: string;
    info5: string;
    info6: string;
    info7: string;
    info8: string;
    info9: string;
    info10: string;
    info11: string;
    info12: string;
    info13: string;
    info14: string;
    info15: string;
    info16: string;
    info17: string;
    info18: string;
    info19: string;
    info20: string;
    info21: string;
    info22: string;
    info23: string;
    info24: string;
    title: string;
    price: string;
}

export const data = {
    ru: {
        yourAd: " Ваше объявление",
        example: "Рассмотрим пример:",
        info1: "Допустим, вы размещаете объявление о покупке:",
        info2: "Вы ставите максимально допустимую для вас цену, через уравнение цены: 1200",
        info3: "Это означает, что дороже, чем 1200",
        info4: " вы не хотите покупать.",
        info5: "Общий список объявлений будет выглядеть так:",
        info6: "Без автоцены, все сделки по вашему объявлению будут проходить по цене 1200",
        info7: "Но, для сохранения вашей позиции в списке достаточно покупать по 1100.01",
        info8: "что выгоднее.",
        info9: "В результате авторасчета, цена объявления будет установлена на 1100.01",
        info10: "что максимизирует прибыль без изменения позиции в списке.",
        info11: "Список будет выглядеть так:",
        info12: "Допустим вы хотите занять и постоянно поддерживать первое место в списке:",
        info13: "Для этого вам нужно выставить максимальную цену с запасом, например 2000",
        info14: "В результате авторасчета цены, ваше объявление займет первое место с ценой 1300.01",
        info15: "и список будет выглядеть так:",
        info16: "Т.е. первая позиция будет занята с максимальной эффективностью.",
        info17: "Список объявлений постоянно меняется. Стандартный перерасчет цены происходит 1 раз в 5 минут.",
        info18: "Кроме того, владельцы объявлений могут сами менять цену.",
        info19: "Чем меньше вы установите интервал авторасчета цены, тем эффективнее вы будете торговать.",
        info20: "Один авторасчет цены стоит",
        info21: "Сатоши",
        info22: "Минимальный период авторасчетов: 10 секунд. Максимальный: 1 час.",
        info23: "В авторасчете используются более актуальные цены фиатных и криптовалют чем в стандартном пятиминутном расчете.",
        info24: "Купленные авторасчеты можно использовать для любых объявлений неограниченно долго.",
        title: "Подробнее про автоцену:",
        price: "Цена"
    },
    en: {
        yourAd: " Your advertisement",
        example: "Consider an example:",
        info1: "Let's say you are posting a purchase advertisement:",
        info2: "You set the maximum acceptable price for you, through the price equation: 1200",
        info3: "This means that for more than 1200",
        info4: " you do not want to buy.",
        info5: "The general list of ads will look like this:",
        info6: "Without auto price, all transactions for your ad will be held at a price of 1200",
        info7: "But, to keep your position in the list, it is enough to buy at 1100.01",
        info8: "which is more profitable.",
        info9: "As a result of auto-calculation, the ad price will be set to 1100.01",
        info10: "which will maximize profit without changing the position in the list.",
        info11: "The list will look like this:",
        info12: "Let's say you want to take and maintain the top spot on the list:",
        info13: "To do this, you need to set the maximum price with a margin, for example 2000",
        info14: "As a result of automatic price calculation, your ad will take first place with a price of 1300.01",
        info15: "and the list will look like this:",
        info16: "Those. the first position will be taken with maximum efficiency.",
        info17: "The list of advertisements is constantly changing. Standard recalculation of prices occurs once every 5 minutes.",
        info18: "In addition, advertisement owners can change the price themselves.",
        info19: "The less you set the auto-price interval, the more efficiently you will trade.",
        info20: "One automatic price calculation costs",
        info21: "Satoshi",
        info22: "Minimum auto-calculation period: 10 seconds. Maximum: 1 hour.",
        info23: "The auto-calculation uses more up-to-date prices for fiat and crypto currencies than the standard five-minute calculation.",
        info24: "Purchased auto calculations can be used for any ad for an unlimited time.",
        title: "More about auto price:",
        price: "Price"
    }
};