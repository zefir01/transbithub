import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string,
    info: string;
    name: string;
    value: string;
    close: string;
}

export const data = {
    ru: {
        title: "Список переменных и их значений",
        info: "Переменные можно использовать в уравнениях цены объявлений и в расчетах цен счетов.",
        name: "Название",
        value: "Значение",
        close: "Закрыть"
    },
    en: {
        title: "List of variables and their values",
        info: "Variables can be used in ad price equations and in invoice pricing calculations.",
        name: "Name",
        value: "Value",
        close: "Close"
    }
};