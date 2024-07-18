import {Disputes} from "./interfaces";
import {
    DisputesTypes, EventsActionTypes,
    IActionBase, LoadDealType, MarkAsReadEventsType, NewEventType,
    ProfileActionTypes,
    ProfileLoadedType, UpdateDisputeType
} from "./actions";
import {Dispute} from "../Protos/adminka_pb";

const initialState = () => {
    return {
        availableDisputes: undefined,
        myDisputes: undefined,
        userId: undefined,
        deals: [],
        events: []
    }
}

export function DisputesReducer(
    state: Disputes = initialState(),
    action: IActionBase
): Disputes {

    function pushDispute(dispute: Dispute.AsObject, state: Disputes): Disputes {
        let myDisputes: Dispute.AsObject[] = [];
        let availableDisputes: Dispute.AsObject[] = [];
        if (state.myDisputes !== undefined) {
            myDisputes = state.myDisputes?.filter(p => p.dealid !== dispute.dealid);
        }
        if (state.availableDisputes !== undefined) {
            availableDisputes = state.availableDisputes.filter(p => p.dealid !== dispute.dealid);
        }

        if (dispute.arbitorid === state.userID) {
            myDisputes.push(dispute);
        } else if (dispute.arbitorid === "") {
            availableDisputes.push(dispute);
        }
        return {
            ...state,
            myDisputes,
            availableDisputes
        }
    }

    switch (action.type) {
        case EventsActionTypes.MARK_AS_READ_EVENTS: {
            let act = action as MarkAsReadEventsType;
            let events = state.events.filter(p => !act.events.map(x => x.id).includes(p.id));
            return {
                ...state,
                events
            }
        }
        case EventsActionTypes.NEW_EVENT: {
            let act = action as NewEventType;
            if (act.event.dealnewmessage) {
                let deals = state.deals.filter(p => p.id !== act.event.dealnewmessage?.id);
                deals.push(act.event.dealnewmessage);
                let events = state.events.filter(p => p.id !== act.event.id);
                events.push(act.event);
                return {
                    ...state,
                    deals,
                    events
                }
            }
            return state;
        }
        case EventsActionTypes.LOAD_DEAL: {
            let act = action as LoadDealType;
            let deals = state.deals.filter(p => p.id !== act.deal.id);
            deals.push(act.deal);
            return {
                ...state,
                deals
            }
        }
        case ProfileActionTypes.PROFILE_LOADED: {
            let act = action as ProfileLoadedType;
            return {
                ...state,
                userID: act.profile.userid
            }
        }
        case DisputesTypes.UPDATE_DISPUTE: {
            let act = action as UpdateDisputeType;
            if (act.dispute.completed) {
                let myDisputes = state.myDisputes?.filter(p => p.dealid !== act.dispute.dealid);
                let availableDisputes = state.availableDisputes?.filter(p => p.dealid !== act.dispute.dealid);
                return {
                    ...state,
                    myDisputes,
                    availableDisputes
                }
            }
            return pushDispute(act.dispute, state);
        }
        case ProfileActionTypes.LOGOUT:
            return initialState();
        default:
            return state;
    }
}