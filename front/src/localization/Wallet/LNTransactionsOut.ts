import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    amount: string;
    created: string;
    description: string;
    more: string;
    status: string;
    error: string;
    success: string;
    failed: string;
    pending: string;
    started: string;
}

export const data = {
    ru: {
        amount: "Сумма:",
        created: "Создан:",
        description: "Описание:",
        more: "Загрузить еще",
        status: "Статус:",
        error: "Ошибка:",
        success: "Успешно",
        failed: "Ошибка",
        pending: "В процессе",
        started: "Запущено",
    },
    en: {
        amount: "Amount:",
        created: "Created at:",
        description: "Description:",
        more: "Load more",
        status: "Status:",
        error: "Error:",
        success: "Success",
        failed: "Failed",
        pending: "Pending",
        started: "Started",
    }
};