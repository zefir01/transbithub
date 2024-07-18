import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    end: string;
    dealCompleted: string;
    ph: string;
    toBalance: string;
    promise: string;
    toWallet: string;
    info: string;
    go: string;
}

export const data = {
    ru: {
        back: "Назад",
        end: "Завершить",
        ph: "Оставьте пожалуйста отзыв о сделке.",
        dealCompleted: "Сделка успешно завершена",
        toBalance: "Биткоины зачислены на ваш баланс. ",
        promise: "Купленный Промис",
        toWallet: "Биткоины отправлены на адрес:",
        info: "Вы можете найти сделку в списке завершенных сделок, в меню \"Сделки\".",
        go: "Перейти к сделке",

    },
    en: {
        back: "Back",
        end: "Complete",
        ph: "Please leave a review about the transaction.",
        dealCompleted: "Deal completed successfully",
        toBalance: "Bitcoins are credited to your balance. ",
        promise: "Purchased Promise",
        toWallet: "Bitcoins sent to the address:",
        info: "You can find the deal in the list of completed deals, in the \"Deals\" menu.",
        go: "Go to deal",
    }
};