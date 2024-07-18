import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    title1: string;
    positive: string;
    negative: string;
    feedbackBtn: string;
}

export const data = {
    ru: {
        title: "Оставьте отзыв о покупке",
        title1: "Оставьте отзыв о продаже",
        positive: "Положительный",
        negative: "Отрицательный",
        feedbackBtn: "Оставить"
    },
    en: {
        title: "Write a purchase feedback",
        title1: "Write a sale feedback",
        positive: "Positive",
        negative: "Negative",
        feedbackBtn: "Send feedback"
    }
};