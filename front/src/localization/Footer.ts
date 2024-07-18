import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    info1: string;
    info2: string;
    info3: string;
    infoSupport1: string;
}

export const data = {
    ru: {
        info1: "Нашли ошибку? Пишите багрепорт на ",
        info2: " и получите оплату 5-15$ в зависимости от критичности бага.",
        info3: "Багрепорт должен включать способ воспроизведения бага.",
        infoSupport1: "Возникли проблемы? Напишите нам: "
    },
    en: {
        info1: "Found a bug? Write a bug report to ",
        info2: " and get paid $ 5-15 depending on the severity of the bug.",
        info3: "The bug report should include a way to reproduce the bug.",
        infoSupport1: "Having problems? Write to us: "
    }
};