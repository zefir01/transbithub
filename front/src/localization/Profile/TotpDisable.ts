import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    currentPassword: string;
    currentPasswordHelp: string;
    error: string;
    success: string;
    disable2FA: string;
    describe1: string;
    describe2: string;
    btn: string;
}

export const data = {
    ru: {
        title: "Отключение двухфакторной аутентификации",
        currentPassword: "Текущий пароль:",
        currentPasswordHelp: "Введите ваш текущий пароль.",
        error: "Код аутентификации или пароль неверны.",
        success: "Двухфакторная аутентификация успешно отключена.",
        disable2FA: "Отключение",
        describe1: "Мы не рекомендуем отключать двухфакторную аутентификацию.",
        describe2: "Для отключения вам потребуется пин-код и пароль.",
        btn: "Отключить"
    },
    en: {
        title: "Disabling Two-Factor authentication",
        currentPassword: "Current password:",
        currentPasswordHelp: "Enter your current password.",
        error: "The authentication code or password is incorrect.",
        success: "Two-factor authentication has been successfully disabled.",
        disable2FA: "Disabling",
        describe1: "We do not recommend disabling two-factor authentication.",
        describe2: "To disabling you will need a PIN code and password.",
        btn: "Disable"
    }
};