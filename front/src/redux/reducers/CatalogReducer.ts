import {CatalogActionTypes, IActionBase, NewFeesType, NewVariablesType, ProfileActionTypes} from "../actions";
import {ICatalog} from "../store/Interfaces";
import {MyDecimal} from "../../MyDecimal";

const initialState = (): ICatalog => {
    return {
        variables: null,
        fee: null
    }
};


export function CatalogReducer(state: ICatalog = initialState(),
                               action: IActionBase): ICatalog {
    switch (action.type) {
        case CatalogActionTypes.NEW_VARIABLES: {
            let act = action as NewVariablesType;
            let m = new Map<string, MyDecimal>();
            act.variables.variablesMap.forEach((i) => {
                m.set(i[0], MyDecimal.FromPb(i[1]));
            });
            return {
                ...state,
                variables: m
            };
        }
        case CatalogActionTypes.NEW_FEES: {
            let act = action as NewFeesType;
            return {
                ...state,
                fee: act.fee
            };
        }
        case ProfileActionTypes.LOGOUT: {
            let st = initialState();
            st.variables = state.variables;
            return st;
        }
        default:
            return state;
    }
}