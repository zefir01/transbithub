import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    loginTitle: string;
    login: string;
    password: string;
    forgetPassord: string;
    loginBtn: string;
    register: string;
    userRegistered: string;
    passNotMatch: string;
    regiterBtn: string;
    passConfirm: string;
    invalid_username_or_password: string;
}

export const data = {
    ru: {
        loginTitle: "Вход",
        login: "Имя пользователя",
        password: "Пароль",
        forgetPassord: "Забыли пароль?",
        loginBtn: "Вход",
        register: "Регистрация",
        userRegistered: "Такой пользователь уже зарегистрирован.",
        passNotMatch: "Пароль и подтверждение не совпадают.",
        regiterBtn: "Регистрация",
        passConfirm: "Подтверждение пароля",
        invalid_username_or_password: "Неверное имя пользователя или пароль."
    },
    en:{
        loginTitle: "Sign in",
        login: "Username",
        password: "Password",
        forgetPassord: "Forgot your password?",
        loginBtn: "Sign in",
        register: "Registration",
        userRegistered: "This user is already registered.",
        passNotMatch: "Password and confirmation do not match.",
        regiterBtn: "Registration",
        passConfirm: "Password confirmation",
        invalid_username_or_password: "Invalid username or password"
    }
};