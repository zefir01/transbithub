export interface IStrings {
    password: string;
    info1: string;
    title: string;
    info3: string;
    remove: string;
    info2: string;
}

export const data = {
    ru: {
        title: "Удаление аккаунта",
        info1: "Если вы удалите аккаунт, вы не сможете его восстановить и получить доступ к кошельку.",
        info2: "Выведите деньги из кошелька заранее.",
        info3: "Для удаления вам потребуется пароль и код двухфакторной аутентификации (если включена)",
        password: "Ваш текущий пароль:",
        remove: "Удалить"
    },
    en: {
        title: "Account deleting",
        info1: "If you delete an account, you will not be able to restore it and gain access to the wallet.",
        info2: "Withdraw money from the wallet in advance.",
        info3: "To delete, you need a password and a two-factor authentication code (if enabled)",
        password: "Your current password:",
        remove: "Delete"
    }
};