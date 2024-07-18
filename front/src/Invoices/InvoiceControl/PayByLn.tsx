import * as React from "react";
import {data, IStrings} from "../../localization/Invoices/InvoiceControl";
import {LoadingBtn} from "../../LoadingBtn";
import {useCallback, useEffect, useState} from "react";
import {Invoice, InvoicePayment, PayInvoiceFromLNRequest} from "../../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {NewInvoicesPayment} from "../../redux/actions";
import {useDispatch, useMappedState} from "redux-react-hook";
import {PaymentInfoRouteState} from "../PaymentInfo";
import {Redirect} from "react-router-dom";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useStrings} from "../../Hooks";
import {errors} from "../../localization/Errors";

export interface PayByLnProps{
    invoice: Invoice.AsObject;
    pieces: number | null;
}

export function PayByLn(props: PayByLnProps){
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

    const [pay, setPay] = useState(false);
    const [payRunning, setPayRunning] = useState(false);
    const [, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [redirectState, setRedirectState] = useState<PaymentInfoRouteState | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        async function f() {
            if (payRunning || !pay || !props.pieces || authState === AuthState.NotAuthed) {
                return;
            }
            setPayRunning(true);
            setPay(false);

            try {
                let req = new PayInvoiceFromLNRequest();
                req.setInvoiceid(props.invoice.id);
                req.setPieces(props.pieces);

                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceFromLN, req, getToken());
                setError("");
                dispatch(NewInvoicesPayment(resp))
                setRedirectState({lnInvoiceOpen: true});
                setRedirect("/invoices/payment/" + resp.id);
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setPayRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [pay, payRunning, authState, props.invoice.id, dispatch, props.pieces]);

    if (redirect !== "") {
        if (redirectState !== null) {
            return <Redirect push to={{
                pathname: redirect,
                state: redirectState
            }}/>;
        } else {
            return <Redirect push to={redirect}/>;
        }
    }

    return(
        <LoadingBtn loading={payRunning} outline color="success" className="btn-block"
                    disabled={!props.pieces}
                    onClick={() => {
                        setPay(true);
                    }}>
            {strings.payLn}
        </LoadingBtn>
    );
}