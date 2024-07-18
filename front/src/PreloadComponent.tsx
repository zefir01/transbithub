import {useCallback, useState} from 'react';
import {useDispatch, useMappedState} from "redux-react-hook";
import {IStore} from "./redux/store/Interfaces";
import {useDeals, useFees, useProfile} from "./Profile/Hooks";
import {DealStatus} from "./Protos/api_pb";
import {PreloadActionTypes} from "./redux/actions";
import {pageSize} from "./global";
import {useConversations, useInvoicePayments, useInvoices, useLastSearch} from "./Hooks";


export function PreloadComponent() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            preload: store.preload
        }), []
    );
    const {preload} = useMappedState(mapState);


    const [, setError] = useState("");
    useFees((e => setError(e)));

    useProfile();

    useLastSearch();

    useDeals(!preload.openedDeals, 1, DealStatus.OPENED,
        () => {
            dispatch({type: PreloadActionTypes.OPENED_DEALS})
        },
        (e) => setError(e));

    useDeals(!preload.completedDeals, 1, DealStatus.COMPLETED,
        () => {
            dispatch({type: PreloadActionTypes.COMPLETED_DEALS})
        },
        (e) => setError(e));

    useDeals(!preload.canceledDeals, 1, DealStatus.CANCELED,
        () => {
            dispatch({type: PreloadActionTypes.CANCELED_DEALS})
        },
        (e) => setError(e));

    useDeals(!preload.disputedDeals, 1, DealStatus.DISPUTED,
        () => {
            dispatch({type: PreloadActionTypes.DISPUTED_DEALS})
        },
        (e) => setError(e));

    useInvoices(!preload.fromMeInvoices, 0, pageSize, true, [],  true, null, null,
        () => {
        },
        () => dispatch({type: PreloadActionTypes.FROMME_INVOICES}),
        (e) => setError(e));
    useInvoices(!preload.toMeInvoices, 0, pageSize, false, [], true, null, null,
        () => {
        },
        () => dispatch({type: PreloadActionTypes.TOME_INVOICES}),
        (e) => setError(e));
    useInvoices(!preload.publicInvoices, 0, pageSize, true, [], false, null, null,
        () => {
        },
        () => dispatch({type: PreloadActionTypes.PUBLIC_INVOICES}),
        (e) => setError(e));
    useInvoicePayments(!preload.fromMeInvoicePayments, null, pageSize, null, false,
        () => {
        },
        () => dispatch({type: PreloadActionTypes.FROMME_PAYMENTS}),
        (e) => setError(e));
    useInvoicePayments(!preload.fromMeInvoicePayments, null, pageSize, null, true,
        () => {
        },
        () => dispatch({type: PreloadActionTypes.TOME_PAYMENTS}),
        (e) => setError(e));

    useConversations(null, null,
        ()=>{},
        () => dispatch({type: PreloadActionTypes.CONVERSATIONS}),
        (e) => setError(e),
        preload.conversations
        );

    return  null;
}