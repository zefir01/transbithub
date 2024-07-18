import {ILang, Langs} from "../store/Interfaces";
import {IActionBase, LangActionTypes, SetLangType} from "../actions";

const initialState: ILang = {
    Lang: Langs.auto
};

export function LangReducer(
    state: ILang = initialState,
    action: IActionBase
): ILang {
    if (state.Lang === Langs.auto) {
        let l: string = navigator.language.split("-")[0];
        let c = l as keyof typeof Langs;
        if (c !== undefined) {
            return {
                ...state,
                Lang: Langs[c]
            }
        }
        else{
            return {
                ...state,
                Lang: Langs.en
            }
        }
    }
    switch (action.type) {
        case LangActionTypes.SET_LANG: {
            let act = action as SetLangType;
            return {
                ...state,
                Lang: act.lang
            }
        }
        default:
            return state
    }
}