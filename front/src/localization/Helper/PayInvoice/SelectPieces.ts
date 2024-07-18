import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info: string;
    ok: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Сколько вы хотите купить ?",
        info: "Укажите количество частей, которые вы хотите купить. Смысл частей описан в коментарии счета.",
        ok: "Все верно"
    },
    en: {
        back: "Back",
        title: "How much do you want to buy?",
        info: "Indicate the number of parts you want to buy. The meaning of the parts is described in the account comment.",
        ok: "All right",
    }
};