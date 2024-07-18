import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    login: string;
    register: string;
    userRegistered: string;
    passNotMatch: string;
    regiterBtn: string;
    passConfirm: string;
    recaptchaError: string;
    success: string;
    user: string;
}

export const data = {
    ru: {
        login: "Имя пользователя",
        password: "Пароль",
        register: "Регистрация",
        userRegistered: "Такой пользователь уже зарегистрирован.",
        passNotMatch: "Пароль и подтверждение не совпадают.",
        regiterBtn: "Регистрация",
        passConfirm: "Подтверждение пароля",
        invalid_username_or_password: "Неверное имя пользователя или пароль.",
        recaptchaError: "Ошибка рекаптчи. Попробуйте похже.",
        success: "Регистрация успешна",
        user: "Имя пользователя может содержать только символы: a-Z A-Z 0-9 -._@+"
    },
    en:{
        login: "Username",
        password: "Password",
        register: "Registration",
        userRegistered: "This user is already registered.",
        passNotMatch: "Password and confirmation do not match.",
        regiterBtn: "Registration",
        passConfirm: "Password confirmation",
        invalid_username_or_password: "Invalid username or password",
        recaptchaError: "Recaptcha error. Try later.",
        success: "Registration success.",
        user: "Username can only contain characters: a-Z A-Z 0-9 -._@+"
    }
};