import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    info: string;
    passPh: string;
    noOdd: string;
    toBalance: string;
    toPromise: string;
    pay: string;
    title: string;
}

export const data = {
    ru: {
        info: "Вы моежете оплатить счет Промисом. Если сдача будет получена Промисом, в платеже будет новый Промис со сдачей. Если Промис защищен паролем, Промис со сдачей будет защищен тем же паролем.",
        passPh: "Пароль от Промиса",
        noOdd: "Без сдачи",
        toBalance: "Получить сдачу на баланс",
        toPromise: "Получить сдачу Промисом",
        pay: "Оплатить",
        title: "Оплатить Промисом"
    },
    en: {
        info: "You can pay your invoice with Promise. If you receives the odd money by Promise, the payment will include a new odd money Promise. If the Promise is password protected, the odd money Promise will be protected with the same password.",
        passPh: "Promise password",
        noOdd: "No change",
        toBalance: "Get change on balance",
        toPromise: "Get change with Promise",
        pay: "Pay",
        title: "Pay by Promise"
    }
};