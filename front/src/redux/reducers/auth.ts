import {IActionBase, NewAnonTokenType, NewTokenType, ProfileActionTypes} from "../actions";
import {AuthState, IAuthState} from "../store/Interfaces";

const initialState: IAuthState = {
    refreshToken: "",
    anonRefreshToken: "",
    state: AuthState.NotAuthed
};

export function AuthReducer(
    state: IAuthState = initialState,
    action: IActionBase
): IAuthState {
    switch (action.type) {
        case ProfileActionTypes.NEW_TOKEN: {
            let act = action as NewTokenType;
            window.accessToken = act.accessToken;
            window.refreshToken = act.refreshToken
            return {
                ...state,
                state: AuthState.Authed,
                refreshToken: act.refreshToken,
            };
        }
        case ProfileActionTypes.NEW_ANON_TOKEN: {
            let act = action as NewAnonTokenType;
            window.accessToken = act.accessToken;
            window.anonRefreshToken = act.refreshToken;
            return {
                ...state,
                state: AuthState.AnonAuthed,
                anonRefreshToken: act.refreshToken,
            };
        }
        case ProfileActionTypes.REMOVE_TOKEN: {
            window.accessToken = undefined;
            return {
                ...state,
                state: AuthState.NotAuthed,
                //refreshToken: "",
            };
        }
        case ProfileActionTypes.REMOVE_ANON_TOKEN: {
            window.accessToken = undefined;
            window.anonRefreshToken = undefined;
            return {
                ...state,
                state: AuthState.NotAuthed,
                anonRefreshToken: ""
                //anonRefreshToken: "",
            };
        }
        case ProfileActionTypes.RENEW_TOKEN_ERROR: {
            window.accessToken = undefined;
            return {
                ...state,
                state: AuthState.NotAuthed,
            };
        }
        case ProfileActionTypes.LOGOUT: {
            window.accessToken = undefined;
            window.refreshToken = undefined;
            return {
                ...state,
                state: AuthState.NotAuthed,
                refreshToken: "",
            };
        }
        default:
            return state
    }
}