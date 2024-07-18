import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {InvoiceInfo} from "../Invoices/InvoiceInfo";
import {GetInvoiceByIdRequest, GetInvoicesResponse, Invoice} from "../Protos/api_pb";
import {useRouteMatch} from "react-router-dom";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Alert, Button} from "reactstrap";
import {Loading} from "../Loading";
import {errors} from "../localization/Errors";
import {data, IStrings} from "../localization/Integration/InvoiceIframe";
import {useStrings} from "../Hooks";

export function InvoiceIframe() {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables,
            userId: store.profile.UserId
        }), []
    );
    const {authState, vars, userId, currency} = useMappedState(mapState);
    const [invoice, setInvoice] = useState<Invoice.AsObject | null>(null);
    const [pieces, setPieces] = useState<number>(1);
    const [requested, setRequested] = useState(false);
    const [getRunning, setGetRunning] = useState(false);
    const [error, setError] = useState("");
    const [isHelper, setIsHelper] = useState(false);
    const matchInvoice = useRouteMatch('/iframes/invoice/:id/:pieces?');
    const matchHelperInvoice = useRouteMatch('/iframes/helper/invoice/:id/:pieces?');

    useEffect(() => {
        async function f() {
            if ((!matchInvoice && !matchHelperInvoice) || authState === AuthState.NotAuthed || getRunning || invoice) {
                return;
            }
            let match = matchInvoice ? matchInvoice : matchHelperInvoice;
            // @ts-ignore
            let id = match.params.id;
            if (id === undefined || id === "") {
                return;
            }
            // @ts-ignore
            let p = match.params.pieces;
            if (p !== undefined && p !== "") {
                setPieces(parseInt(p));
            }

            if(matchHelperInvoice){
                setIsHelper(true);
            }
            else {
                setIsHelper(false);
            }

            setGetRunning(true);
            let req = new GetInvoiceByIdRequest();
            req.setInvoiceid(id);

            try {
                let resp = await TradeGrpcRunAsync<GetInvoicesResponse.AsObject>(tradeApiClient.getInvoiceById, req, getToken());
                setInvoice(resp.invoicesList[0]);
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetRunning(false);
                setRequested(true);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [matchInvoice, authState, requested, getRunning, matchHelperInvoice, invoice])

    if (invoice === null && requested) {
        return (
            <>
                <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
                <Alert color="danger" isOpen={error === ""}>{strings.notFound}</Alert>
            </>
        )
    }

    if (invoice === null || !vars || vars.size === 0 || currency === "" || userId === "" || authState === AuthState.NotAuthed) {
        return <Loading/>;
    }

    return (
        <>
            <InvoiceInfo invoice={invoice} hideHeader={true} disableLinks={true}/>
            <Button color="primary" className="btn-block mt-1" onClick={() => {
                if (isHelper) {
                    window.open(`/links/helper/invoice/${invoice?.id}/${pieces}`, "_blank");
                } else {
                    window.open(`/links/invoice/${invoice?.id}/${pieces}`, "_blank");
                }
            }}>
                {strings.buy}
            </Button>
        </>
    )
}