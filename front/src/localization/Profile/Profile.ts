import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    Danger: string;
    Confirm: string;
    Warning: string;
    TwoFA: string;
}

export const data = {
    ru: {
        Danger: "Опасность!",
        Confirm: "Если вы не подтвердите почту, восстановление пароля будет невозможно. Если вы потеряете пароль, вы не сможете восстановить доступ к учетной записи и средствам хранящимся в кошельке. Мы настоятельно рекомендуем подтвердить почту.",
        Warning: "Внимание!",
        TwoFA: "Пароль это недостаточная мера обеспечения безопасности. Мы рекомендуем включить двухфакторную аутентификацию. Мы не будем нести ответственность за потерю денег если ваш пароль будет взломан.",
    },
    en:{
        Danger: "Danger!",
        Confirm: "If you do not confirm your mail, password recovery will not be possible. If you lose your password, you will not be able to regain access to the account and the spedsts stored in the wallet. We strongly recommend confirming your mail.",
        Warning: "Warning!",
        TwoFA: "Password is not a sufficient security measure. We recommend that you enable two-factor authentication. We will not be responsible for losing money if your password is cracked.",
    }
};