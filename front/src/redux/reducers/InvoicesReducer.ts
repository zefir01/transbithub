import {EventTypes, IInvoices, InvoiceType} from "../store/Interfaces";
import {
    ConversationDeletedType,
    EventsActionTypes,
    FromMeInvoicesLoadedType,
    IActionBase,
    InvoiceActionTypes,
    InvoiceCreatedType,
    InvoiceDeletedType,
    InvoicePaymentsLoadedType,
    LoadConversationsType,
    LoadConversationType,
    LoadDealsType,
    MarkAsReadedEventsType,
    NewEventType,
    NewInvoicesPayment,
    ProfileActionTypes,
    ProfileSuccessType,
    PublicInvoicesLoadedType,
    PublicInvoiceUpdatedType,
    RefundCreatedType,
    ToMeInvoicesLoadedType
} from "../actions";
import {Conversation, DealStatus, Invoice, InvoicePayment} from "../../Protos/api_pb";

const initialState = () => {
    return {
        toMeInvoices: null,
        fromMeInvoices: null,
        newEvents: [],
        newInvoicesIds: [],
        toMeInvoicePayments: null,
        fromMeInvoicePayments: null,
        newPaymentsIds: [],
        publicInvoices: null,
        userId: "",
        conversations: null
    }
};

export const InvoicesReducer = (state: IInvoices = initialState(),
                                action: IActionBase) => {
    function getFromMeInvoices(state: IInvoices) {
        if (state.fromMeInvoices !== null) {
            return Array.from(state.fromMeInvoices);
        }
        return new Array<Invoice.AsObject>();
    }

    function getToMeInvoices(state: IInvoices) {
        if (state.toMeInvoices !== null) {
            return Array.from(state.toMeInvoices);
        }
        return new Array<Invoice.AsObject>();
    }

    function getPublicInvoices(state: IInvoices) {
        if (state.publicInvoices !== null) {
            return Array.from(state.publicInvoices);
        }
        return new Array<Invoice.AsObject>();
    }

    function getFromMePayments(state: IInvoices) {
        if (state.fromMeInvoicePayments !== null) {
            return Array.from(state.fromMeInvoicePayments);
        }
        return new Array<InvoicePayment.AsObject>();
    }

    function getToMePayments(state: IInvoices) {
        if (state.toMeInvoicePayments !== null) {
            return Array.from(state.toMeInvoicePayments);
        }
        return new Array<InvoicePayment.AsObject>();
    }

    function pushInvoice(arr: Array<Invoice.AsObject>, invoice: Invoice.AsObject): Array<Invoice.AsObject> {
        arr = arr.filter(p => p.id !== invoice.id);
        arr.push(invoice);
        return arr;
    }

    function pushPayment(arr: Array<InvoicePayment.AsObject>, payment: InvoicePayment.AsObject): Array<InvoicePayment.AsObject> {
        arr = arr.filter(p => p.id !== payment.id);
        arr.push(payment);
        return arr;
    }

    function pushConversation(conversation: Conversation.AsObject, state: IInvoices): Array<Conversation.AsObject> {
        let arr = getConversations(state);
        arr = pushConversationArr(conversation, arr);
        return arr;
    }

    function pushConversationArr(conversation: Conversation.AsObject, arr: Array<Conversation.AsObject>): Array<Conversation.AsObject> {
        arr = arr.filter(p => p.id !== conversation.id);
        arr.push(conversation);
        return arr;
    }

    function getConversations(state: IInvoices): Array<Conversation.AsObject> {
        let arr;
        if (state.conversations === null) {
            arr = new Array<Conversation.AsObject>();
        } else {
            arr = Array.from(state.conversations);
        }
        return arr;
    }

    switch (action.type) {
        case InvoiceActionTypes.INVOICE_CREATED: {
            let act = action as InvoiceCreatedType;
            if (act.invoice.isprivate) {
                let fromMe = getFromMeInvoices(state);
                fromMe.push(act.invoice);
                return {
                    ...state,
                    fromMeInvoices: fromMe
                }
            } else {
                let pub = getPublicInvoices(state);
                pub.push(act.invoice);
                return {
                    ...state,
                    publicInvoices: pub
                }
            }
        }
        case InvoiceActionTypes.TOME_INVOICES_LOADED: {
            let act = action as ToMeInvoicesLoadedType;
            let toMe = getToMeInvoices(state);
            for (let invoice of act.invoices) {
                toMe = pushInvoice(toMe, invoice);
            }
            return {
                ...state,
                toMeInvoices: toMe
            }
        }
        case InvoiceActionTypes.FROMME_INVOICES_LOADED: {
            let act = action as FromMeInvoicesLoadedType;
            let fromMe = getFromMeInvoices(state);
            for (let invoice of act.invoices) {
                fromMe = pushInvoice(fromMe, invoice);
            }
            return {
                ...state,
                fromMeInvoices: fromMe
            }
        }
        case InvoiceActionTypes.PUBLIC_INVOICES_LOADED: {
            let act = action as PublicInvoicesLoadedType;
            let pub = getPublicInvoices(state);
            for (let inv of act.invoices) {
                pub = pushInvoice(pub, inv);
            }
            return {
                ...state,
                publicInvoices: pub
            }
        }
        case InvoiceActionTypes.PUBLIC_INVOICE_UPDATED: {
            let act = action as PublicInvoiceUpdatedType;
            let pub = getPublicInvoices(state);
            pub = pub = pushInvoice(pub, act.invoice);
            return {
                ...state,
                publicInvoices: pub
            }
        }
        case InvoiceActionTypes.INVOICE_DELETED: {
            let act = action as InvoiceDeletedType;
            let invoices: Array<Invoice.AsObject>;

            if (state.toMeInvoices !== null && state.toMeInvoices.map(p => p.id).includes(act.invoiceId)) {
                invoices = state.toMeInvoices.filter(p => p.id !== act.invoiceId);
                return {
                    ...state,
                    toMeInvoices: invoices
                }
            }
            if (state.fromMeInvoices !== null && state.fromMeInvoices.map(p => p.id).includes(act.invoiceId)) {
                invoices = state.fromMeInvoices.filter(p => p.id !== act.invoiceId);
                return {
                    ...state,
                    fromMeInvoices: invoices
                }
            }
            if (state.publicInvoices !== null && state.publicInvoices.map(p => p.id).includes(act.invoiceId)) {
                invoices = state.publicInvoices.filter(p => p.id !== act.invoiceId);
                return {
                    ...state,
                    publicInvoices: invoices
                }
            }
            return {
                ...state
            }
        }
        case InvoiceActionTypes.NEW_INVOICE_PAYMENT: {
            let act = action as NewInvoicesPayment;
            let toMeInvoices = getToMeInvoices(state);
            let publicInvoices = getPublicInvoices(state);
            let fromMePayments = getFromMePayments(state);
            if (act.payment.invoice!.isprivate) {
                //toMeInvoices = toMeInvoices.filter(p => p.id !== act.payment.invoice!.id);
                toMeInvoices = pushInvoice(toMeInvoices, act.payment.invoice!);
            } else {
                publicInvoices = pushInvoice(publicInvoices, act.payment.invoice!);
            }
            fromMePayments = pushPayment(fromMePayments, act.payment);
            return {
                ...state,
                fromMeInvoicePayments: fromMePayments,
                toMeInvoices: toMeInvoices,
                publicInvoices: publicInvoices
            }
        }
        case EventsActionTypes.NEW_EVENT: {
            let act = action as NewEventType;
            if (act.event.invoicenew) {
                let newEvents = Array.from(state.newEvents);
                let toMe = getToMeInvoices(state);
                toMe = pushInvoice(toMe, act.event.invoicenew);
                if(!newEvents.map(p=>p.id).includes(act.event.id)) {
                    newEvents.push({
                        id: act.event.id,
                        type: EventTypes.InvoiceNew,
                        dealId: null,
                        dealMessageId: null,
                        invoiceId: act.event.invoicenew.id,
                        invoiceType: InvoiceType.toMe,
                        invoicePayment: null
                    });
                }
                let newInvoices = Array.from(state.newInvoicesIds);
                newInvoices.push(act.event.invoicenew.id);
                return {
                    ...state,
                    toMeInvoices: toMe,
                    newEvents,
                    newInvoicesIds: newInvoices
                }
            }
            if (act.event.invoicepaymentnew) {
                let newEvents = Array.from(state.newEvents);
                let payment = act.event.invoicepaymentnew;
                let invoice = payment.invoice!;
                let toMe = getToMePayments(state);
                newEvents.push({
                    id: act.event.id,
                    type: EventTypes.InvoicePaymentNew,
                    dealId: null,
                    dealMessageId: null,
                    invoiceId: null,
                    invoiceType: null,
                    invoicePayment: payment
                });
                toMe = pushPayment(toMe, act.event.invoicepaymentnew);
                let fromMeInvoices = getFromMeInvoices(state);
                let publicInvoices = getPublicInvoices(state);
                if (invoice?.isprivate) {
                    fromMeInvoices = pushInvoice(fromMeInvoices, invoice);
                } else {
                    publicInvoices = pushInvoice(publicInvoices, invoice);
                }
                let newPaymentsIds = Array.from(state.newPaymentsIds);
                newPaymentsIds.push(payment.id);
                return {
                    ...state,
                    newEvents,
                    toMeInvoicePayments: toMe,
                    fromMeInvoices,
                    publicInvoices,
                    newPaymentsIds
                }
            }
            if (act.event.dealstatuschanged) {
                let deal = act.event.dealstatuschanged;
                if (deal.status !== DealStatus.COMPLETED && deal.status !== DealStatus.CANCELED) {
                    return state;
                }
                if (!deal.payment) {
                    return state;
                }
                if (deal.payment.owner!.id === state.userId) {
                    let payments = getFromMePayments(state);
                    payments = pushPayment(payments, deal.payment);
                    return {
                        ...state,
                        fromMeInvoicePayments: payments
                    }
                } else {
                    let payments = getToMePayments(state);
                    payments = pushPayment(payments, deal.payment);
                    return {
                        ...state,
                        toMeInvoicePayments: payments
                    }
                }

            }
            if (act.event.invoicedeleted) {
                let toMe = getToMeInvoices(state);
                toMe = toMe.filter(p => p.id !== act.event.invoicedeleted?.id);
                let newEvents = state.newEvents.filter(p => p.invoiceId !== act.event.invoicedeleted?.id);
                let newIds = state.newInvoicesIds.filter(p => p !== act.event.invoicedeleted?.id);
                return {
                    ...state,
                    newEvents,
                    newInvoicesIds: newIds,
                    toMeInvoices: toMe
                }
            }
            if (act.event.conversationnewmessage) {
                let newEvents = Array.from(state.newEvents);
                newEvents = newEvents.filter(p => p.id !== act.event.id);
                newEvents.push({
                    id: act.event.id,
                    type: EventTypes.ConversationNewMessage,
                    dealId: null,
                    dealMessageId: null,
                    invoiceId: null,
                    invoiceType: null,
                    invoicePayment: null,
                    conversation: act.event.conversationnewmessage
                });
                let convs = pushConversation(act.event.conversationnewmessage, state);
                return {
                    ...state,
                    conversations: convs,
                    newEvents
                }
            }
            if (act.event.invoicepaymentupdated) {
                let payment = act.event.invoicepaymentupdated;
                let toMe = getToMePayments(state);
                let fromMe = getFromMePayments(state);
                if (payment.owner?.id === state.userId) {
                    fromMe = pushPayment(fromMe, payment);
                } else {
                    toMe = pushPayment(toMe, payment);
                }
                return {
                    ...state,
                    toMeInvoicePayments: toMe,
                    fromMeInvoicePayments: fromMe
                }
            }
            return state;
        }
        case EventsActionTypes.MARK_AS_READED_EVENTS: {
            let act = action as MarkAsReadedEventsType;
            if (state.newEvents.length === 0)
                return state;
            let eventsIdsToMark = act.events.map(z => z.id);
            if (eventsIdsToMark.length === 0) {
                return state;
            }
            let invoiceIdsToMark = act.events.filter(p => p.invoiceId !== null).map(z => z.invoiceId);
            let paymentIdsToMark = act.events.filter(p => p.invoicePayment !== null).map(p => p.invoicePayment!.id);
            let newEvents = state.newEvents.filter(p => !eventsIdsToMark.includes(p.id));
            let newInvoicesIds = state.newInvoicesIds.filter(z => !invoiceIdsToMark.includes(z));
            let newPaymentsIds = state.newPaymentsIds.filter(p => !paymentIdsToMark.includes(p));
            return {
                ...state,
                newEvents,
                newInvoicesIds,
                newPaymentsIds
            }
        }
        case InvoiceActionTypes.PAYMENTS_LOADED: {
            let act = action as InvoicePaymentsLoadedType;
            let toMePayments = getToMePayments(state);
            let fromMePayments = getFromMePayments(state);
            let c = getConversations(state);
            for (let payment of act.payments) {
                if (payment.owner?.id !== state.userId) {
                    toMePayments = pushPayment(toMePayments, payment);
                } else {
                    fromMePayments = pushPayment(fromMePayments, payment);
                }

                let conv = c.find(p => p.payment?.id === payment.id);
                if (conv) {
                    conv.payment = payment;
                    c = pushConversation(conv, state);
                }
            }
            return {
                ...state,
                toMeInvoicePayments: toMePayments,
                fromMeInvoicePayments: fromMePayments,
                conversations: c
            }
        }
        case ProfileActionTypes.PROFILE_SUCCESS: {
            let act = action as ProfileSuccessType;
            return {
                ...state,
                userId: act.profile.userid,
            }
        }
        case EventsActionTypes.LOAD_DEALS: {
            let act = action as LoadDealsType;
            let toMe = getToMePayments(state);
            let fromMe = getFromMePayments(state);
            for (let deal of act.deals) {
                let affected = toMe.filter(p => !p.dealisnull && p.deal?.id === deal.id);
                for (let payment of affected) {
                    payment = {
                        ...payment,
                        deal
                    }
                    toMe = pushPayment(toMe, payment);
                }
                affected = fromMe.filter(p => !p.dealisnull && p.deal?.id === deal.id);
                for (let payment of affected) {
                    let newPayment = {
                        ...payment,
                        deal
                    }
                    fromMe = pushPayment(fromMe, newPayment);
                }
            }
            return {
                ...state,
                toMeInvoicePayments: toMe,
                fromMeInvoicePayments: fromMe
            }
        }
        case InvoiceActionTypes.CONVERSATION_LOADED: {
            let act = action as LoadConversationType;
            let arr = pushConversation(act.conversation, state);
            return {
                ...state,
                conversations: arr
            }
        }
        case InvoiceActionTypes.CONVERSATIONS_LOADED: {
            let act = action as LoadConversationsType;
            let arr = getConversations(state);
            for (let conv of act.conversations) {
                arr = pushConversationArr(conv, arr);
            }
            return {
                ...state,
                conversations: arr
            }
        }
        case InvoiceActionTypes.CONVERSATION_DELETED: {
            let act = action as ConversationDeletedType;
            let arr = getConversations(state);
            arr = arr.filter(p => p.id !== act.id);
            return {
                ...state,
                conversations: arr,
            }
        }
        case InvoiceActionTypes.REFUND_CREATED: {
            let act = action as RefundCreatedType;
            let payments = getToMePayments(state);
            payments = pushPayment(payments, act.response.payment!);
            let invoices = getToMeInvoices(state);
            invoices = pushInvoice(invoices, act.response.refund!);
            return {
                ...state,
                toMeInvoicePayments: payments,
                toMeInvoices: invoices
            };
        }

        case ProfileActionTypes.LOGOUT: {
            return initialState();
        }

        default:
            return state;
    }
};