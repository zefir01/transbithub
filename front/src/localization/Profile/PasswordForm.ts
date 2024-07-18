import {LocalizedStringsMethods} from 'react-localization';


export interface IStrings extends LocalizedStringsMethods {
    password: string;
    passLength: string;
    passDigits: string;
    passSimbols: string;
    passLowLetters: string;
    passUpLetters: string;
}

export const data = {
    ru: {
        password: "Пароль",
        passLength: "Минимальная длина пароля 8 символов.",
        passDigits: "Пароль должен содержать цифры.",
        passSimbols: "Пароль должен содержать специальные символы.",
        passLowLetters: "Пароль должен содержать строчные буквы.",
        passUpLetters: "Пароль должен содержать заглавные буквы.",
    },
    en: {
        password: "Password",
        passLength: "The minimum password length is 8 characters.",
        passDigits: "Password must contain digits.",
        passSimbols: "Password must contain special characters.",
        passLowLetters: "The password must contain lowercase letters.",
        passUpLetters: "Password must contain uppercase letters.",
    }
};