import LocalizedStrings, {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    opened: string;
    completed: string;
    canceled: string;
    disputed: string;
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
    complete: string;
    transfer: string;
    createDispute: string;
    feedback: string;
    feedbackBtn: string;
    dealCanceled: string;
    dealCompleted: string;
    dealDisputed: string;
    dealFiatPayed: string;
    waitDeposit: string;
}

export const data = {
    ru: {
        opened: "Открыта",
        completed: "Завершена",
        canceled: "Отменена",
        disputed: "Диспут",
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
        complete: "Завершить сделку",
        transfer: "Перевести ",
        createDispute: "Создать диспут",
        feedback: "Оставьте отзыв о сделке",
        feedbackBtn: "Оставить отзыв",
        dealCanceled: "Сделка отменена.",
        dealCompleted: "Сделка завершена.",
        dealDisputed: "Диспут создан.",
        dealFiatPayed: "Фиатная валюта отправлена.",
        waitDeposit: "Ожидает депозит"
    },
    en: {
        opened: "Opened",
        completed: "Completed",
        canceled: "Canceled",
        disputed: "Disputed",
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
        complete: "Complete deal",
        transfer: "Transfer ",
        createDispute: "Create dispute",
        feedback: "Write a deal feedback",
        feedbackBtn: "Send feedback",
        dealCanceled: "Deal canceled.",
        dealCompleted: "Deal completed.",
        dealDisputed: "Dispute created.",
        dealFiatPayed: "Fiat currency sent.",
        waitDeposit: "Wait deposit"
    }
};