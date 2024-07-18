import {ILang, IProfile, Langs} from "./interfaces";
import {IActionBase, ProfileActionTypes, ProfileLoadedType} from "./actions";
import {Profile} from "../Protos/adminka_pb";

const initialState = () => {
    return {
        profile: undefined
    };
};


export function ProfileReducer(
    state: IProfile = initialState(),
    action: IActionBase
): IProfile {
    switch (action.type) {
        case ProfileActionTypes.PROFILE_LOADED: {
            let act = action as ProfileLoadedType;
            return {
                profile: act.profile
            }
        }
        case ProfileActionTypes.LOGOUT: {
            return initialState();
        }
    }
    return state;
}