import {IActionBase} from "../actions";
import {ISystemState} from "../store/Interfaces";

const initialState: ISystemState = {
    accessTokenIsUpdating: false
};


export function SystemReducer(
    state: ISystemState = initialState,
    action: IActionBase
): ISystemState {
    switch (action.type) {
        default:
            return state
    }
}
