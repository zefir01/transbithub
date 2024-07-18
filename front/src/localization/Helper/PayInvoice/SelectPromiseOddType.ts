import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    noOdd: string;
    noOddInfo: string;
    balance: string;
    balanceInfo: string;
    promise: string;
    promiseInfo: string;
    warn: string;
    ok: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Что сделать со сдачей ?",
        noOdd: "Без сдачи",
        noOddInfo: "Сдача будет использована на развитие проекта.",
        balance: "Зачислить на баланс",
        balanceInfo: "Сдача будет зачислена на ваш баланс.",
        promise: "Выдать Промисом",
        promiseInfo: "Будет создан Промис на сумму сдачи с тем же паролем.",
        warn: "Для использования баланса требуется авторизация. Войдите или зарегистрируйтесь.",
        ok: "Все верно"
    },
    en: {
        back: "Back",
        title: "What to do with the change?",
        noOdd: "No change",
        noOddInfo: "The change will be used to develop the project.",
        balance: "Add to balance",
        balanceInfo: "The change will be added to your balance.",
        promise: "Issue Promise",
        promiseInfo: "A Promise for the change will be created with the same password.",
        warn: "To use the balance, authorization is required. Login or register.",
        ok: "All right"
    }
};