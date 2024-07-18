import LocalizedStrings from "react-localization";


export function errors(key: string): string {
    key = key.replace("Exception was thrown by handler. UserException: ", "");
    key = key.replace("Exception was thrown by handler. UserException:", "");
    key = key.replace("upstream connect error or disconnect/reset before headers. reset reason: connection termination", "");
    let d = new LocalizedStrings({
        ru: {},
        en: {}
    });
    let ru = {
        "Invalid 2FA code.": "Неверный код двухфакторной аутентификации.",
        "Invalid token.": "Неверный код подтверждения.",
        "invalid recaptcha.": "Ошибка рекаптчи. Возможно вы робот. Обратитесь в техподдержку ресурса.",
        recaptchaError: "Ошибка рекаптчи. Попробуйте похже.",
        "TypeError: Failed to fetch": "Сервер не отвечает",
        invalid_username_or_password: "Неверное имя пользователя или пароль.",
        "Too much deal amount.": "Слишком большая сумма сделки.",
        "Too much amount.": "Слишком большая сумма сделки.",
        "The deal amount is too small.": "Слишком маленькая сумма сделки.",
        "Your account has insufficient funds to create a deal.": "На вашем счету недостаточно средств для заключения сделки.",
        "Price is less than or equal to zero.": "Цена меньше или равна нулю.",
        "You cannot invoice yourself.": "Вы не можете выставить счет себе.",
        "Invoice not found.": "Счет не найден.",
        "Payment not found.": "Платеж не найден.",
        "No suitable advertisement found.": "Подходящие объявления не найдены.",
        "You already have payment to this invoice. Please, cancel previous payment.": "У вас уже есть оплата по этому счету. Пожалуйста, отмените предыдущий платеж.",
        "Incorrect password.": "Неверный пароль.",
        "Promise locked.": "Промис заблокирован.",
        "Invalid password.": "Неверный пароль.",
        "Invalid promise.": "Некорректный Промис.",
        "Promise not found or already used.": "Промис не найден или уже использован",
        "You already create deal for this ad. To create new deal, complete or cancel previous deal.": "Вы уже создали сделку по этому объявлению. Для создания новой сделки, отмените или завершите предыдущую.",
        "Advertisement not found.": "Объявление не найдено."
    };
    let en = {
        "Invalid 2FA code.": "Invalid two-factor authentication code.",
        "Invalid token.": "Invalid confirmation code",
        "invalid recaptcha.": "Recaptcha error. Perhaps you are a robot. Contact tech support resource.",
        recaptchaError: "Recaptcha error. Try later.",
        "TypeError: Failed to fetch": "Server is not responding",
        invalid_username_or_password: "Invalid username or password",
        "Too much deal amount.": "Too much deal amount.",
        "Too much amount.": "Too much deal amount.",
        "The deal amount is too small.": "The deal amount is too small.",
        "Your account has insufficient funds to create a deal.": "Your account has insufficient funds to create a deal.",
        "Price is less than or equal to zero.": "Price is less than or equal to zero.",
        "You cannot invoice yourself.": "You cannot invoice yourself.",
        "Invoice not found.": "Invoice not found.",
        "Payment not found.": "Payment not found.",
        "No suitable advertisement found.": "No suitable advertisement found.",
        "You already create deal for this ad. To create new deal, complete or cancel previous deal.": "You already create deal for this ad. To create new deal, complete or cancel previous deal.",
        "Advertisement not found.": "Advertisement not found."
    }
    let lang = d.getLanguage();
    let data;
    if (lang === "ru") {
        data = Object.entries(ru);
    } else {
        data = Object.entries(en);
    }
    let f = data.find(p => p[0] === key);
    if (f) {
        return f[1];
    } else {
        return key;
    }
}
