import LocalizedStrings from "react-localization";


export interface IMyMap {
    get(key: string): string;
}

type ttt = typeof data;

class myMap implements IMyMap {
    private readonly items: any;

    constructor(data: ttt) {
        this.items = new LocalizedStrings(data);
    }

    public get(key: string) {
        if (key in this.items)
            return this.items.getString(key);
        return key;
    }
}

export const data = {
    ru: {
        san: "Вск",
        mon: "Пнд",
        tue: "Втр",
        wed: "Срд",
        thu: "Чтв",
        fri: "Птн",
        sat: "Сбт",
    },
    en: {
        san: "San",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
    }
};

export const strings = new myMap(data);