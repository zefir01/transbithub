import {HelperState} from "../store/Interfaces";
import {
    HelperActionTypes,
    IActionBase, SetAdIdType,
    SetBuyAmountType,
    SetBuyFilterType,
    SetBuyResultType,
    SetCurrentPathType,
    SetDealIdType,
    SetInvoiceIdType,
    SetInvoicePaymentIdType,
    SetInvoicePaymentTypeType,
    SetInvoicePiecesType,
    SetOperationType,
    SetPromiseType,
    SetPromiseUseType
} from "../actions";

function InitialState(): HelperState {
    return {
        operation: null,
        country: "",
        currency: "",
        paymentType: "",
        amount: null,
        currentPath: "",
        amountIsFiat: true,
        buyResult: null,
        dealId: null,
        invoiceId: null,
        pieces: null,
        invoicePaymentType: null,
        invoicePaymentId: null,
        promise: "",
        promisePass: "",
        promiseOddType: null,
        promiseUseType: null,
        disableUseHelperRequest: false,
        useHelperModalShowed: false,
        adId: null
    }
}

export function HelperReducer(state: HelperState = InitialState(), action: IActionBase): HelperState {
    switch (action.type) {
        case HelperActionTypes.SET_CURRENT_PATH: {
            let act = action as SetCurrentPathType;
            return {
                ...state,
                currentPath: act.path
            }
        }
        case HelperActionTypes.SET_BUY_FILTER: {
            let act = action as SetBuyFilterType;
            return {
                ...state,
                country: act.country,
                currency: act.currency,
                paymentType: act.paymentType
            }
        }
        case HelperActionTypes.SET_BUY_AMOUNT: {
            let act = action as SetBuyAmountType;
            return {
                ...state,
                amount: act.amount,
                amountIsFiat: act.isFiat
            }
        }
        case HelperActionTypes.SET_BUY_RESULT: {
            let act = action as SetBuyResultType;
            return {
                ...state,
                buyResult: act.result
            }
        }
        case HelperActionTypes.SET_DEAL_ID: {
            let act = action as SetDealIdType;
            return {
                ...state,
                dealId: act.dealId
            };
        }
        case HelperActionTypes.RESET: {
            return {
                ...InitialState(),
                disableUseHelperRequest: state.disableUseHelperRequest,
                useHelperModalShowed: state.useHelperModalShowed
            };
        }
        case HelperActionTypes.SET_INVOICE_ID: {
            let act = action as SetInvoiceIdType;
            return {
                ...state,
                invoiceId: act.invoiceId
            }
        }
        case HelperActionTypes.SET_INVOICE_PIECES: {
            let act = action as SetInvoicePiecesType;
            return {
                ...state,
                pieces: act.pieces
            }
        }
        case HelperActionTypes.SET_OPERATION: {
            let act = action as SetOperationType;
            return {
                ...state,
                operation: act.operation
            }
        }
        case HelperActionTypes.SET_INVOICE_PAYMENT_TYPE: {
            let act = action as SetInvoicePaymentTypeType;
            return {
                ...state,
                invoicePaymentType: act.paymentType
            }
        }
        case HelperActionTypes.SET_INVOICE_PAYMENT_ID: {
            let act = action as SetInvoicePaymentIdType;
            return {
                ...state,
                invoicePaymentId: act.id
            }
        }
        case HelperActionTypes.SET_PROMISE: {
            let act = action as SetPromiseType;
            return {
                ...state,
                promise: act.promise,
                promisePass: act.pass
            }
        }
        case HelperActionTypes.SET_PROMISE_USE_TYPE: {
            let act = action as SetPromiseUseType;
            return {
                ...state,
                promiseUseType: act.data
            }
        }
        case HelperActionTypes.DISABLE_USE_HELPER_REQUEST: {
            return {
                ...state,
                disableUseHelperRequest: true
            }
        }
        case HelperActionTypes.USE_HELPER_MODAL_SHOWED: {
            return {
                ...state,
                useHelperModalShowed: true
            }
        }
        case HelperActionTypes.SET_AD_ID:{
            let act=action as SetAdIdType;
            return {
                ...state,
                adId: act.id
            }
        }
        /*
        case ProfileActionTypes.LOGOUT:
            return InitialState();
            */
        default:
            return state;
    }
}