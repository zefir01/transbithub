import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info: string;
    what: string;
    info1: string;
    info2: string;
    info3: string;
    alert: string;
    ok: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Выбор кошелька",
        what: "Что сделать с купленными биткоинами ?",
        info: "Для проведения операции нужно ответить на несколько вопросов.",
        info1: "Зачислить на баланс для оплаты счетов или продажи",
        info2: "Вывести на внешний Bitcoin кошелек",
        info3: "Создать Промис",
        alert: "Для использования баланса требуется авторизация. Войдите или зарегистрируйтесь.",
        ok: "Все верно",

    },
    en: {
        back: "Back",
        title: "Select wallet",
        info: "To carry out the operation, you need to answer several questions.",
        what: "What to do with purchased bitcoins?",
        info1: "Add to balance to pay invoices or sell",
        info2: "Withdraw to external Bitcoin wallet",
        info3: "Create Promise",
        alert: "To use the balance, authorization is required. Login or register.",
        ok: "All right",
    }
};