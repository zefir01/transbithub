import {useCallback, useEffect, useState} from "react";
import LocalizedStrings, {GlobalStrings} from "react-localization";

export function useStrings<TData extends GlobalStrings<any>>(data: TData) {
    const lang="ru";
    const [strings, setStrings] = useState(new LocalizedStrings(data));

    useEffect(() => {
        let s = new LocalizedStrings(data);
        s.setLanguage(lang);
        setStrings(s);
    }, [lang, data]);

    return strings;
}