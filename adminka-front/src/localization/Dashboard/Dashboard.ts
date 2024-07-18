import {LocalizedStringsMethods} from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    available: string;
    inWork: string;

}

export const data = {
    ru: {
        available: "Доступные диспуты",
        inWork: "Диспуты в работе",
    },
    en:{
        available: "Available disputes",
        inWork: "In work disputes",
    }
};