import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Col, Container, Row} from "reactstrap";
import {Col6_12, pageSize} from "../global";
import {EventTypes, IEvent, IStore} from "../redux/store/Interfaces";
import {createMatchSelector} from "connected-react-router";
import {useDispatch, useMappedState} from "redux-react-hook";
import {
    SubscribePublicInvoiceRequest, SubscribePublicInvoiceResponse
} from "../Protos/api_pb";
import {InvoiceInfo} from "./InvoiceInfo";
import {Loading} from "../Loading";
import {InvoiceControl} from "./InvoiceControl/InvoiceControl";
import {useInvoices, useMarkAsReadedEvents, useStream, useStrings} from "../Hooks";
import {errors} from "../localization/Errors";
import {data, IStrings} from "../localization/Invoices/InvoiceView";
import {PrettyPrice, tradeApiClient} from "../helpers";
import {InvoiceDeleted, PublicInvoiceUpdated} from "../redux/actions";
import {Redirect} from "react-router-dom";
import {SecretsList} from "./Secrets/SecretsList";

export function InvoiceView() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            router: store.router,
            invoices: store.invoices,
            userId: store.profile.UserId,
            authState: store.auth.state,
            vars: store.catalog.variables,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            preload: store.preload.toMeInvoices && store.preload.fromMeInvoices && store.preload.publicInvoices
        }), []
    );
    const dispatch = useDispatch();
    const {router, invoices, userId, authState, vars, currency, preload} = useMappedState(mapState);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [error, setError] = useState("");
    const [markEvents, setMarkEvents] = useState<IEvent[] | null>(null);
    const [requested, setRequested] = useState(false);
    const [invoiceDeleted, setInvoiceDeleted] = useState(false);
    const [requestedWithId, setRequestedWithId] = useState("");
    const [requestedId, setRequestedId] = useState<number | null>(null);
    const [hasPrice, setHasPrice] = useState(false);
    const [redirect, setRedirect] = useState("");
    const invoiceIdCb = useCallback(() => {
        const matchSelector = createMatchSelector("/invoices/invoice/:id(\\d+)");
        const match = matchSelector({router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id === undefined)
            return null;
        return id;
    }, [router])
    const invoiceId=invoiceIdCb();
    const invoiceCb = useCallback(() => {
        let id = invoiceId;
        if (id === null) {
            return null;
        }

        if (!preload || invoices.toMeInvoices === null || invoices.fromMeInvoices === null || invoices.publicInvoices === null) {
            return null;
        }
        let all = invoices.toMeInvoices.concat(invoices.fromMeInvoices).concat(invoices.publicInvoices);
        // eslint-disable-next-line eqeqeq
        let inv = all.find(p => p.id == id);
        if (inv === undefined) {
            return null;
        }
        return inv;
    }, [invoices, preload, invoiceId]);
    let invoice = invoiceCb();

    const varPrice = useCallback(() => {
        if (vars !== null && vars !== undefined) {
            let price = vars.get("AVG_" + currency);
            return PrettyPrice(price!, 2);
        }
    }, [vars, currency])

    useInvoices(isRun(), 0, pageSize * 2, null, [], null, invoiceId, null,
        () => setLoadingInvoice(true),
        () => {
            setLoadingInvoice(false)
            setRequested(true);
            setRequestedWithId(userId);
            setRequestedId(invoiceId);
        },
        (e) => setError(e)
    );
    useEffect(() => {
        if (userId !== requestedWithId || requestedId !== invoiceId) {
            setRequestedWithId("");
            setRequested(false);
            setRequestedId(null);
        }
    }, [userId, authState, invoiceId, requestedId, requestedWithId])

    useMarkAsReadedEvents(markEvents,
        () => {
        },
        () => {
            setMarkEvents(null);
        },
        setError);
    useEffect(() => {
        let inv = invoice;
        if (inv === null) {
            return;
        }
        if (invoice !== undefined && invoices.newInvoicesIds.includes(inv.id)) {
            // eslint-disable-next-line eqeqeq
            let events = invoices.newEvents.filter(p => p.type === EventTypes.InvoiceNew && p.invoiceId == inv!.id);
            if (events !== undefined) {
                setMarkEvents(events);
            }
        }
    }, [invoice, invoices.newEvents, invoices.newInvoicesIds])

    useStream<SubscribePublicInvoiceResponse, SubscribePublicInvoiceResponse.AsObject>("SubscribePublicInvoiceRequest",
        metadata => {
            if (invoice) {
                let req = new SubscribePublicInvoiceRequest();
                req.setInvoiceid(invoice.id);
                return tradeApiClient.subscribePublicInvoice(req, metadata);
            } else {
                return null;
            }
        },
        data => {
            console.log(data);
            if (data.invoicedeleted) {
                setInvoiceDeleted(true);
                dispatch(InvoiceDeleted(invoice!.id))
                return;
            } else if (data.invoice) {
                dispatch(PublicInvoiceUpdated(data.invoice))
            }
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        !invoice || invoice.isprivate || invoice.owner!.id === userId
    )

    function isRun() {
        if (invoiceId == null) {
            return false;
        }
        if (requested) {
            return false;
        }
        return preload;

    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (invoice === null && !loadingInvoice && requested && !invoiceDeleted) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Alert color="danger">{errors("Invoice not found.")}</Alert>
                    </Col>
                </Row>
            </Container>
        )
    }
    if (invoiceDeleted) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Alert color="warning">{strings.invoiceDeleted}</Alert>
                    </Col>
                </Row>
            </Container>
        )
    }

    if (!invoice || loadingInvoice || !vars || vars.size === 0) {
        return (
            <Container>
                <Row className="pt-3">
                    <Col>
                        <Loading/>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Container>
            {error !== "" ?
                <Row>
                    <Col>
                        <Alert color="danger">{errors(error)}</Alert>
                    </Col>
                </Row>
                : null
            }
            {!hasPrice ?
                <Row>
                    <Col>
                        <Alert className="text-center pt-3" color="info">
                            {strings.info + " " + varPrice() + " " + currency + "/BTC"}
                        </Alert>
                    </Col>
                </Row>
                : null
            }
            <Row>
                <Col {...Col6_12}>
                    <InvoiceInfo invoice={invoice!} title={strings.invoiceTitle}/>
                </Col>
                <Col {...Col6_12}>
                    <InvoiceControl invoice={invoice!} hasPrice={hp => setHasPrice(hp)}
                                    redirect={to => setRedirect(to)}/>
                </Col>
            </Row>
            {userId === invoice.owner?.id ?
                <>
                    <Row className="pt-3">
                        <Col>
                            <SecretsList invoiceId={invoice.id} isPrivate={invoice.isprivate} isSold={false}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <SecretsList invoiceId={invoice.id} isPrivate={invoice.isprivate} isSold={true}/>
                        </Col>
                    </Row>
                </>
                : null
            }
        </Container>
    )
}