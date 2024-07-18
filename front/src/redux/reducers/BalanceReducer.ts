import {IBalances} from "../store/Interfaces";
import {BalanceUpdatedType, EventsActionTypes, IActionBase, NewEventType, ProfileActionTypes} from "../actions";

function InitialState(): IBalances {
    return {
        Balance: null
    }
}

export function BalanceReducer(state: IBalances = InitialState(), action: IActionBase): IBalances {
    switch (action.type) {
        case EventsActionTypes.NEW_EVENT:
            let act = action as NewEventType;
            if (act.event.balance) {
                return {
                    ...state,
                    Balance: act.event.balance
                };
            }
            return state;
        case ProfileActionTypes.BALANCE_UPDATED:{
            let act=action as BalanceUpdatedType;
            return {
                ...state,
                Balance: act.balance
            };
        }
        case ProfileActionTypes.LOGOUT: {
            return InitialState();
        }
        default:
            return state;
    }
}