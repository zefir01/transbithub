import {IAuthState, SupportAccounts} from "./interfaces";
import {IActionBase, LoadedAccountsType, ProfileActionTypes, SupportAccountsTypes} from "./actions";

const initialState = () => {
    return {
        accounts: undefined
    };
};

export function SupportAccountsReducer(state: SupportAccounts = initialState(),
                                       action: IActionBase) {
    switch (action.type) {
        case SupportAccountsTypes.LOADED_ACCOUNTS: {
            let act = action as LoadedAccountsType;
            return {
                ...state,
                accounts: act.accounts
            }
        }
        case ProfileActionTypes.LOGOUT:
            return initialState();
        default:
            return state;
    }
}