import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    title: string;
    info: string;
}

export const data = {
    ru: {
        title: "Помощник",
        info: "Это помощник позволяющий проводить основные операции быстрее, не отвлекаясь на подробности.\n" +
            "Если вы не хотите тратить время и силы на погружение в детали, то это ваш выбор."
    },
    en: {
        title: "Assistant",
        info: "This is an assistant that allows you to carry out basic operations faster, without being distracted by details.\n" +
            "If you don't want to waste time and effort diving into details, then this is your choice."
    }
};