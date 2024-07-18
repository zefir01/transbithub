import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    opened: string;
    completed: string;
    canceled: string;
    disputed: string;
    waitDeposit: string;
    dealStatus: string;
    partnerPaid: string;
    yes: string;
    no: string;
    payDesc1: string;
    payDesc2: string;
    arbitr: string;
    cancelDeal: string;
    cancelDealDesc: string;
    positive: string;
    negative: string;
    ipaid: string;
    transfer: string;
    createDispute: string;
    feedback: string;
    feedbackBtn: string;
    dealCanceled: string;
    dealCompleted: string;
    dealDisputed: string;
    dealFiatPayed: string;
    withdrawSuccess: string;
    withdrawStarted: string;
    withdrawWaiting: string;
    withdrawFailed: string;
    withdrawFailed1: string;
    withdraw: string;
}

export const data = {
    ru: {
        opened: "Открыта",
        completed: "Завершена",
        canceled: "Отменена",
        disputed: "Диспут",
        waitDeposit: "Ожидает внесения средств",
        dealStatus: "Статус сделки:",
        partnerPaid: "Партнер сообщил о переводе ",
        yes: "Да",
        no: "Нет",
        payDesc1: "Нажмите, чтобы уведомить партнера, что вы перевели деньги.",
        payDesc2: "Нажмите, чтобы перевести криптовалюту и завершить сделку.",
        arbitr: "Нажмите для привлечения арбитра, если возникли разногласия с партнером.",
        cancelDeal: "Отменить сделку",
        cancelDealDesc: "Нажмите, если вы не произвели платеж и хотите отменить сделку.",
        positive: "Положительный",
        negative: "Отрицательный",
        ipaid: "Я оплатил ",
        transfer: "Перевести ",
        createDispute: "Создать диспут",
        feedback: "Оставьте отзыв о сделке",
        feedbackBtn: "Оставить отзыв",
        dealCanceled: "Сделка отменена.",
        dealCompleted: "Сделка завершена.",
        dealDisputed: "Диспут создан.",
        dealFiatPayed: "Фиатная валюта отправлена.",
        withdrawSuccess: "Купленные биткоины успешно отправлены на ваш кошелек",
        withdrawStarted: "Начата отправка купленных биткоинов на ваш кошелек",
        withdrawWaiting: "Ожидаем отправку купленных биткоинов на ваш кошелек",
        withdrawFailed: "Отправка купленных биткоинов на ваш кошелек не выполнена. Ошибка: ",
        withdrawFailed1: "Средства зачислены на ваш баланс. Вы можете вывести их самостоятельно или обратиться в службу поддержки.",
        withdraw: "Статус вывода средств:"
    },
    en: {
        opened: "Opened",
        completed: "Completed",
        canceled: "Canceled",
        disputed: "Disputed",
        waitDeposit: "Waiting for funds",
        dealStatus: "Deal status:",
        partnerPaid: "Partner reported payment ",
        yes: "Yes",
        no: "No",
        payDesc1: "Click to notify the partner that you have transferred the money.",
        payDesc2: "Click to transfer cryptocurrency and complete the deal.",
        arbitr: "Click to attract an arbitrator if there is a disagreement with a partner.",
        cancelDeal: "Cancel deal",
        cancelDealDesc: "Click if you haven’t made a payment and want to cancel the deal.",
        positive: "Positive",
        negative: "Negative",
        ipaid: "I paid ",
        transfer: "Transfer ",
        createDispute: "Create dispute",
        feedback: "Write a deal feedback",
        feedbackBtn: "Send feedback",
        dealCanceled: "Deal canceled.",
        dealCompleted: "Deal completed.",
        dealDisputed: "Dispute created.",
        dealFiatPayed: "Fiat currency sent.",
        withdrawSuccess: "Purchased bitcoins successfully sent to your wallet",
        withdrawStarted: "Began to send purchased bitcoins to your wallet",
        withdrawWaiting: "Waiting to send purchased bitcoins to your wallet",
        withdrawFailed: "Sending purchased bitcoins to your wallet is not success. Error: ",
        withdrawFailed1: "Funds enrolled on your balance. You can withdraw them yourself or contact support.",
        withdraw: "Withdraw status:"
    }
};