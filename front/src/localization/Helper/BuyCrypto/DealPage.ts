import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info1: string;
    info2: string;
    info3: string;
    info4: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Покупка биткоинов",
        info1: "Продавец в чате напишет вам куда перевести ",
        info2: "После того как вы перевели деньги, нажмите на кнопку \"Я" +
            " оплатил ",
        info3: "Если что то пошло не так, нажмите кнопку \"Создать диспут\"",
        info4: "Если вы передумали, нажмите кнопку \"Отменить сделку\"",

    },
    en: {
        back: "Back",
        title: "Buying bitcoins",
        info1: "The seller in the chat will write you where to transfer ",
        info2: "After you have transferred money, click on the button \"I paid ",
        info3: "If something went wrong, click the \"Create Dispute\" button",
        info4: "If you change your mind, click the \"Cancel Deal\" button",

    }
};