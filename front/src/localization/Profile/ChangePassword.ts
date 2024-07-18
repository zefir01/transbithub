import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    PasswordChanged: string;
    PasswordChange: string;
    OldPassword: string;
    NewPassword: string;
    InvalidPassword: string;
    NewPasswordConfirm: string;
    ChangePassword: string;
    ConfirmEquals: string;
}

export const data = {
    ru: {
        PasswordChanged: "Пароль изменен.",
        PasswordChange: "Смена пароля",
        OldPassword: "Старый пароль",
        InvalidPassword: "Неверный пароль",
        NewPassword: "Новый пароль",
        NewPasswordConfirm: "Подтверждение нового пароля",
        ChangePassword: "Изменить пароль",
        ConfirmEquals: "Пароль и подтверждение не совпадают.",
    },
    en: {
        PasswordChanged: "Password changed.",
        PasswordChange: "Password change",
        OldPassword: "Old password",
        InvalidPassword: "Invalid password",
        NewPassword: "New password",
        NewPasswordConfirm: "New password confirmation:",
        ChangePassword: "Change password",
        ConfirmEquals: "New password and confirmation not equals.",
    }
};