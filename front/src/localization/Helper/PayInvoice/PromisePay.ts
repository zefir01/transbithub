import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    back: string;
    title: string;
    info: string;
    ok: string;
    pass: string;
}

export const data = {
    ru: {
        back: "Назад",
        title: "Вставьте Промис",
        info: "Вставьте Промис. Если он защищен паролем, укажите пароль.",
        ok: "Все верно",
        pass: "Пароль от Промиса"
    },
    en: {
        back: "Back",
        title: "Paste Promise",
        info: "Paste Promise. If it is password protected, enter the password.",
        ok: "All right",
        pass: "Promise password"
    }
};