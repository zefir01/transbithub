import {IPreload} from "../store/Interfaces";
import {IActionBase, PreloadActionTypes, ProfileActionTypes} from "../actions";

function initialState() {
    return {
        openedDeals: false,
        completedDeals: false,
        canceledDeals: false,
        disputedDeals: false,
        toMeInvoices: false,
        fromMeInvoices: false,
        toMeInvoicePayments: false,
        fromMeInvoicePayments: false,
        publicInvoices: false,
        lastSearch: false,
        conversations: false
    }
}

export function PreloadReducer(state: IPreload = initialState(), action: IActionBase) {
    switch (action.type) {
        case PreloadActionTypes.OPENED_DEALS:
            return{
                ...state,
                openedDeals: true
            };
        case PreloadActionTypes.COMPLETED_DEALS:
            return{
                ...state,
                completedDeals: true
            };
        case PreloadActionTypes.CANCELED_DEALS:
            return{
                ...state,
                canceledDeals: true
            };
        case PreloadActionTypes.DISPUTED_DEALS:
            return{
                ...state,
                disputedDeals: true
            };
        case PreloadActionTypes.TOME_INVOICES:
            return {
                ...state,
                toMeInvoices: true
            }
        case PreloadActionTypes.FROMME_INVOICES:
            return {
                ...state,
                fromMeInvoices: true
            }
        case PreloadActionTypes.TOME_PAYMENTS:
            return {
                ...state,
                toMeInvoicePayments: true
            }
        case PreloadActionTypes.FROMME_PAYMENTS:
            return {
                ...state,
                fromMeInvoicePayments: true
            }
        case PreloadActionTypes.PUBLIC_INVOICES:
            return {
                ...state,
                publicInvoices: true
            }
        case PreloadActionTypes.LAST_SEARCH:
            return {
                ...state,
                lastSearch: true
            }
        case PreloadActionTypes.CONVERSATIONS:
            return {
                ...state,
                conversations: true
            }
        case ProfileActionTypes.LOGOUT:
            return initialState();
    }
    return state;
}