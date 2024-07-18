import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    end: string;
    ph: string;
    disputeCreated: string;
    info: string;
    find: string;
    go: string;
}

export const data = {
    ru: {
        back: "Назад",
        end: "Завершить",
        ph: "Оставьте пожалуйста отзыв о сделке.",
        disputeCreated: "Диспут создан",
        info: "Дождитесь пока арбитр вмешается. Он изучит переписку, задаст необходимые вопросы и закроет сделку.\n" +
            "В случае если продавец обманул, вам перечисялт биткоины.",
        find: "Вы можете найти диспут в списке диспутов, в меню \"Сделки\".",
        go: "Перейти к диспуту",

    },
    en: {
        back: "Back",
        end: "Complete",
        ph: "Please leave a review about the transaction.",
        disputeCreated: "Dispute created",
        info: "Wait for the arbiter to intervene. He will study the correspondence, ask the necessary questions and close the deal.\n" +
            "If the seller cheated, bitcoins are transferred to you.",
        find: "You can find the dispute in the list of disputes, in the \"Transactions\" menu.",
        go: "Go to the dispute",
    }
};