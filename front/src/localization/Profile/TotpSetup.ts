import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    describe1: string;
    describe2: string;
    instruction: string;
    download1: string;
    or: string;
    backupCode: string;
    important: string;
    writeCode: string;
    run1: string;
    scanCode: string;
    scanCode1: string;
    enterCode: string;
    currentPassword: string;
    currentPasswordHelp: string;
    authCode: string;
    authCodeHelp: string;
    wrote: string;
    oOnPaper: string;
    enable: string;
    success: string;
    and: string;
}

export const data = {
    ru: {
        title: "Двухфакторная аутентификация",
        describe1: "Защитите вашу учетную запись от несанкционированного доступа, активировав двухфакторную аутентификацию.",
        describe2: "При активированной двухфакторной аутентификации вам необходимо вводить разовый код при каждом входе в систему.",
        instruction: "Инструкция",
        download1: "Скачайте приложение Google Authenticator для своего мобильного телефона или планшета:",
        or: "или",
        backupCode: "Ваш резервный код:",
        important: "Важно!",
        writeCode: "Запишите этот код на бумаге и храните его в надежном месте. Он вам понадобится, если вы потеряете свой телефон или если ваша учетная запись будет заблокирована.",
        run1: "Запустите приложение для аутентификации на своем мобильном устройстве. Найдите в приложении функцию",
        scanCode: "сканировать QR код",
        scanCode1: "и отсканируйте QR код.",
        enterCode: "Введите код с вашего мобильного приложения.",
        currentPassword: "Ваш текущий пароль:",
        currentPasswordHelp: "Введите ваш текущий пароль.",
        authCode: "Код аутентификации:",
        authCodeHelp: "Введите код аутентификации из приложения.",
        wrote: "Я записал(а) свой резервный код",
        oOnPaper: "на бумаге",
        enable: "Включить двухфакторную аутентификацию",
        success: "Двухфакторная аутентификация успешно включена.",
        and: "и",
    },
    en: {
        title: "Two-factor authentication",
        describe1: "Protect your account from unauthorized access by activating two-factor authentication.",
        describe2: "When two-factor authentication is activated, you need to enter a one-time code at each login.",
        instruction: "Instruction",
        download1: "Download the Google Authenticator app for your mobile phone or tablet:",
        or: "or",
        backupCode: "Your backup code:",
        important: "Important!",
        writeCode: "Write this code on paper and keep it in a safe place. You will need it if you lose your phone or if your account is blocked.",
        run1: "Launch the authentication application on your mobile device. Find the function in the application",
        scanCode: "scan QR code",
        scanCode1: "and scan the QR code below.",
        enterCode: "Enter the code from your mobile application in the field below.",
        currentPassword: "Your current password:",
        currentPasswordHelp: "Enter your current password.",
        authCode: "Authentication Code:",
        authCodeHelp: "Enter the authentication code from the application.",
        wrote: "I wrote down my backup code",
        oOnPaper: "on paper",
        enable: "Enable two-factor authentication",
        success: "Two-factor authentication has been successfully enabled.",
        and: "and"
    }
};