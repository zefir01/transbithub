import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    RecoveryPassword: string;
    Info1: string;
    Info2: string;
    Instruction: string;
    Inst1: string;
    Inst1_1: string;
    Inst2: string;
    Inst3: string;
    Inst4: string;
    Inst5: string;
    Inst6: string;
    Inst7: string;
    SendCodeTitle: string;
    SendCode: string;
    Warn1: string;
    ChangePass: string;
    RecoveryCode: string;
    RecoveryCodeHelp: string;
    NewPassword: string;
    NewPasswordHelp: string;
    ChangePassword: string;
    Email: string;
    CodeSuccess: string;
    PassSuccess: string;
    PasswordDigits: string;
    PasswordSpecial: string;
    PasswordSize: string;
    Error: string;
    Confirmation: string;
    ConfirmationInvalid: string;
    recaptchaError: string;
}

export const data = {
    ru: {
        RecoveryPassword: "Восстановление пароля",
        Info1: "Вы можете восстановить пароль через проверку электронной почты.",
        Info2: "Внимание! Если email не подтвержден, восстановить пароль невозможно.",
        Instruction: "Инструкция",
        Inst1: "Для восстановления пароля, введите email в форме \"Отправка кода восстановления\".",
        Inst1_1: "Внимание! Email должен быть подтвержден.",
        Inst2: "Нажмите кнопку \"Отправить код\"",
        Inst3: "Если у вас включена двухфакторная аутентификация, введите код из приложения и повторно нажмите кнопку \"Отправить код\".",
        Inst4: "Перейдите по ссылке из письма или введите код из письма в поле \"Код восстановления\".",
        Inst6: "Введите новый пароль в поле \"Новый пароль\".",
        Inst7: "Нажмите кнопку \"Изменить пароль\".",
        SendCodeTitle: "Отправка кода восстановления",
        SendCode: "Отправить код",
        Warn1: "Введите код двухфакторной аутентификации и нажмите кнопку \"Отправить код\" еще раз.",
        ChangePass: "Изменение пароля",
        RecoveryCode: "Код восстановления",
        RecoveryCodeHelp: "Введите код восстановления из письма или СМС.",
        NewPassword: "Новый пароль",
        NewPasswordHelp: "Введите новый пароль",
        ChangePassword: "Изменить пароль",
        Email: "Email",
        CodeSuccess: "Код восстановления успешно отправлен.",
        PassSuccess: "Пароль успешно изменен.",
        PasswordDigits: "Пароль должен содержать цифры.",
        PasswordSpecial: "Пароль должен содержать специальные символы.",
        PasswordSize: "Пароль должен быть от 8 до 20 символов.",
        Error: "Неверный код восстановления или email.",
        Confirmation: "Подтверждение нового пароля",
        ConfirmationInvalid: "Пароль и подтверждение не совпадают.",
        recaptchaError: "Ошибка рекаптчи. Попробуйте позже.",
    },
    en:{
        RecoveryPassword: "Password recovery",
        Info1: "You can reset your password by checking email",
        Info2: "Attention! If the email number are not verified, it is impossible to recover the password.",
        Instruction: "Instruction",
        Inst1: "To recover your password, enter your email in the \"Send recovery code\" form.",
        Inst1_1: "Attention! Email must be confirmed.",
        Inst2: "Click \"Send code\"",
        Inst3: "If you have two-factor authentication enabled, enter the code from the application and click the \"Send code\" button again.",
        Inst4: "Click on the link from the letter or enter the code from the letter in the \"Recovery code\" field.",
        Inst6: "Enter the new password in the \"New Password\" field.",
        Inst7: "Click the \"Change password\" button.",
        SendCodeTitle: "Send recovery code",
        SendCode: "Send code",
        Warn1: "Enter the two-factor authentication code and click the \"Send Code\" button again.",
        ChangePass: "Change password",
        RecoveryCode: "Recovery code",
        RecoveryCodeHelp: "Enter the recovery code from the letter",
        NewPassword: "New password",
        NewPasswordHelp: "Enter new password",
        ChangePassword: "Change password",
        Email: "Email",
        CodeSuccess: "Recovery code sent successfully.",
        PassSuccess: "Password changed successfully.",
        PasswordDigits: "Password must contains digits.",
        PasswordSpecial: "Password must contains special symbols.",
        PasswordSize: "Password must contain from 8 to 20 characters.",
        Error: "Invalid recovery code or email.",
        Confirmation: "New password confirmation",
        ConfirmationInvalid: "Password and confirmation do not match.",
        recaptchaError: "Recaptcha error. Try later.",
    }
};