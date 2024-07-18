import {EventTypes, IDeals, IEvent} from "../store/Interfaces";
import {
    AddMessageToDealType,
    DealCanceledType,
    EventsActionTypes,
    IActionBase,
    LoadDealsType,
    MarkAsReadedDealType,
    MarkAsReadedEventsType,
    MarkAsReadedEventType,
    NewEventType, ProfileActionTypes
} from "../actions";
import {Deal} from "../../Protos/api_pb";

function pushDealId(arr: number[], deal: Deal.AsObject) {
    // eslint-disable-next-line eqeqeq
    let arr1 = arr.filter(p => p != deal.id);
    arr1.push(deal.id);
    return arr1;
}

const initialState = () => {
    return {
        newEvents: new Array<IEvent>(),
        newDeals: new Array<number>(),
        newStatusDeals: new Array<number>(),
        newMessageDeals: new Array<number>(),
        deals: new Array<Deal.AsObject>()
    };
};


export const DealsReducer = (state: IDeals = initialState(),
                             action: IActionBase) => {
    let newDeals = state.newDeals;
    let newEvents = state.newEvents;
    let newStatusDeals = state.newStatusDeals;
    let newMessageDeals = state.newMessageDeals;
    let deals = state.deals;

    function readEvent(evt: IEvent) {
        switch (evt.type) {
            case EventTypes.DealNew:
                newDeals = newDeals.filter(p => p !== evt!.dealId);
                break;
            case EventTypes.DealStatusChanged:
                newStatusDeals = newStatusDeals.filter(p => p !== evt!.dealId);
                break;
            case EventTypes.DealNewMessage:
                newMessageDeals = newMessageDeals.filter(p => p !== evt!.dealId);
                break;
        }
        newEvents = newEvents.filter(p => p.id !== evt!.id);
    }

    switch (action.type) {
        case EventsActionTypes.CLEAR: {
            return initialState();
        }
        case EventsActionTypes.NEW_EVENT: {
            let act = action as NewEventType;

            let eventType: EventTypes;
            let deal: Deal.AsObject;

            if (!act.event.dealnew && !act.event.dealstatuschanged && !act.event.dealnewmessage && !act.event.dealfiatpayed
                && !act.event.dealdisputecreated) {
                return state;
            }

            if (act.event.dealnew) {
                eventType = EventTypes.DealNew;
                deal = act.event.dealnew;
                newDeals = pushDealId(newDeals, deal);
            } else if (act.event.dealstatuschanged) {
                eventType = EventTypes.DealStatusChanged;
                deal = act.event.dealstatuschanged;
                newStatusDeals = pushDealId(newStatusDeals, deal);
            } else if (act.event.dealnewmessage) {
                eventType = EventTypes.DealNewMessage;
                deal = act.event.dealnewmessage!;
                newMessageDeals = pushDealId(newMessageDeals, deal);
            } else if (act.event.dealfiatpayed) {
                eventType = EventTypes.DealFiatPayed;
                deal = act.event.dealfiatpayed;
            } else if (act.event.dealdisputecreated) {
                eventType = EventTypes.DealDisputeCreated;
                deal = act.event.dealdisputecreated!;
            } else {
                return state;
            }

            deals = deals.filter(p => p.id !== deal.id);
            deals.push(deal);

            let dealMessageId: number | null = null;
            if (eventType === EventTypes.DealNewMessage) {
                let messages = deal.messagesList.sort((a, b) => a.id - b.id);
                let msg = messages[messages.length - 1];
                dealMessageId = msg.id;
            }

            if (!newEvents.map(p => p.id).includes(act.event.id)) {
                newEvents.push({
                    id: act.event.id,
                    dealId: deal.id,
                    type: eventType,
                    dealMessageId,
                    invoiceId: null,
                    invoiceType: null,
                    invoicePayment: null
                });
            }


            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case EventsActionTypes.MARK_AS_READED_DEAL: {
            let act = action as MarkAsReadedDealType;
            let deal = act.deal;
            let changes = 0;
            // eslint-disable-next-line eqeqeq
            changes += newEvents.filter(p => p.dealId == deal.id).length;
            // eslint-disable-next-line eqeqeq
            changes += newDeals.filter(p => p == deal.id).length;
            // eslint-disable-next-line eqeqeq
            changes += newStatusDeals.filter(p => p == deal.id).length;
            // eslint-disable-next-line eqeqeq
            changes += newMessageDeals.filter(p => p != deal.id).length;
            if (changes === 0) {
                return state;
            }
            // eslint-disable-next-line eqeqeq
            newEvents = newEvents.filter(p => p.dealId != deal.id);
            // eslint-disable-next-line eqeqeq
            newDeals = newDeals.filter(p => p != deal.id);
            // eslint-disable-next-line eqeqeq
            newStatusDeals = newStatusDeals.filter(p => p != deal.id);
            // eslint-disable-next-line eqeqeq
            newMessageDeals = newMessageDeals.filter(p => p != deal.id);
            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case EventsActionTypes.MARK_AS_READED_EVENT: {
            let act = action as MarkAsReadedEventType;
            let evt = newEvents.find(p => p.id === act.event.id);
            if (evt === undefined)
                return state;
            readEvent(evt);
            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case EventsActionTypes.MARK_AS_READED_EVENTS: {
            let act = action as MarkAsReadedEventsType;
            if (newEvents.length === 0) {
                return state;
            }
            let evts = newEvents.filter(p => act.events.map(z => z.id).includes(p.id));
            if (evts.length === 0) {
                return state;
            }
            for (let evt of evts) {
                readEvent(evt);
            }
            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case EventsActionTypes.ADD_MESSAGE_TO_DEAL: {
            let act = action as AddMessageToDealType;
            let deal = deals.find(p => p.id === act.deal.id);
            if (deal === undefined)
                throw new Error("Unknown deal with id=" + act.deal.id);
            deal.messagesList.push(act.message);
            newDeals = newDeals.filter(p => p !== act.deal.id);
            newMessageDeals = newMessageDeals.filter(p => p !== act.deal.id);
            newStatusDeals = newStatusDeals.filter(p => p !== act.deal.id);
            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case EventsActionTypes.LOAD_DEALS: {
            let act = action as LoadDealsType;
            deals = deals.filter(p => !act.deals.map(z => z.id).includes(p.id));
            deals = deals.concat(act.deals);
            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case EventsActionTypes.DEAL_CANCELED: {
            let act = action as DealCanceledType;
            deals = deals.filter(p => p.id !== act.deal.id);
            deals.push(act.deal);
            if (!newStatusDeals.includes(act.deal.id))
                newStatusDeals.push(act.deal.id);
            if (newDeals.includes(act.deal.id)) {
                newDeals = newDeals.filter(p => p !== act.deal.id);
            }
            return {
                ...state,
                newEvents,
                newDeals,
                newStatusDeals,
                newMessageDeals,
                deals,
            }
        }
        case ProfileActionTypes.LOGOUT: {
            return initialState();
        }
        default:
            return state;
    }
};