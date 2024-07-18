import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    ChangeEmail: string;
    ActionTitle: string;
    Action1: string;
    Action2: string;
    Action3: string;
    NewEmail: string;
    Captcha: string;
    Success: string;
    ConfirmationCode: string;
    InvalidCode: string;
    Confirm: string;
    MailConfirmed: string;
    InvalidEmail: string;
    MailError: string;
    EmailConfirmation: string;
}

export const data = {
    ru: {
        ChangeEmail: "Изменить адрес электронной почты",
        ActionTitle: "После изменения адреса электронной почты, вам придется подтвердить его снова. Если сразу после его изменения вы не получили email подтверждения, выполните следующие действия:",
        Action1: "Подождите еще немного",
        Action2: "Проверьте папку спам",
        Action3: "Используйте другой адрес электронной почты",
        NewEmail: "Новый адрес электронной почты:",
        Captcha: "Пожалуйста, проверьте, человек ли вы.",
        Success: "Письмо с кодом подтверждения отправлено.",
        ConfirmationCode: "Введите код подтверждения или перейдите по ссылке в письме.",
        InvalidCode: "Неверный код подтверждения",
        Confirm: "Подтвердить",
        MailConfirmed: "Почта подтверждена",
        InvalidEmail: "Некорректный адрес электронной почты",
        MailError: "Ошибка при отправке письма.",
        EmailConfirmation: "Подтверждение электронной почты"
    },
    en: {
        ChangeEmail: "Change Email",
        ActionTitle: "After changing the email address, you will have to confirm it again. If immediately after changing it you did not receive an email confirmation, follow these steps:",
        Action1: "Wait some more",
        Action2: "Check your spam folder",
        Action3: "Use a different email address",
        NewEmail: "New email address:",
        Captcha: "Please check if you are human.",
        Success: "A confirmation email has been sent.",
        ConfirmationCode: "Enter the verification code or follow the link in the letter.",
        InvalidCode: "Invalid confirmation code",
        Confirm: "Confirm",
        MailConfirmed: "Email confirmed",
        InvalidEmail: "Invalid email",
        MailError: "Error sending email.",
        EmailConfirmation: "Email confirmation"
    }
};