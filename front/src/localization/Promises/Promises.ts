import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    promise: string;
    close: string;
    title: string;
    info1: string;
    info2: string;
    info3: string;
    info4: string;
    info5: string;
    info6: string;
    info7: string;
    info8: string;
    info9: string;
    create: string;
    receive: string;
}

export const data = {
    ru: {
        promise: "Промис",
        close: "Закрыть",
        title: "Управление Промисами",
        info1: "Промисы похожи на наличные деньги. Вы можете перевести деньги с баланса в Промис или купить Промис за фиатную валюту.",
        info2: "Если Промис не защищен паролем, воспользоваться им может любой, кто смог его прочитать.",
        info3: "Не пересылайте Промисы по зашифрованным каналам, если Промисы не защищены паролем.",
        info4: "Незащищеный Промис, это не безопасно, но быстро и просто. Не используйте незащищеные Промисы для больших сумм.",
        info5: "Безопасно пересылать незащищенные Промисы через Telegram, WhatsApp и другие мессенджеры со сквозным шифрованием.",
        info6: "Крайне опасно пересылать незащищенные Промисы через социальные сети и электронную почту.",
        info7: "В любой момент вы можете перечислить Промис на счет, продать его за фиатные деньги или использовать для оплаты товаров и услуг.",
        info8: "Комиссия за создание Промиса оплачивается создателем, в момент создания Промиса и составляет ",
        info9: "% от суммы Промиса, но не менее 0.00000001 BTC (1 Сатоши)",
        create: "Создать Промис",
        receive: "Принять Промис",

    },
    en: {
        promise: "Promise",
        close: "Close",
        title: "Promise management",
        info1: "Promises are like cash. You can transfer money from your balance to Promise or buy a Promise with fiat currency.",
        info2: "If a Promise is not password protected, anyone who can read it can use it.",
        info3: "Do not forward Promises over encrypted channels unless the Promises are password protected.",
        info4: "Unprotected Promise, it's not secure, but quick and easy. Do not use unprotected promises for large amounts.",
        info5: "Safely forward insecure Promises via Telegram, WhatsApp and other end-to-end encrypted messengers.",
        info6: "It is extremely dangerous to send unprotected promises via social media and email.",
        info7: "At any time, you can transfer the Promise to your account, sell it for fiat money, or use it to pay for goods and services.",
        info8: "The commission for creating a Promise is paid by the creator, at the time of creating a Promise and is ",
        info9: "% of the Promise amount, but not less than 0.00000001 BTC (1 Satoshi)",
        create: "Create Promise",
        receive: "Receive Promise",
    }
};