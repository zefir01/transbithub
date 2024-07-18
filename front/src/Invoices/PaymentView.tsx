import * as React from "react";
import {Alert, Col, Container, Row} from "reactstrap";
import {Col6_12} from "../global";
import {InvoiceInfo} from "./InvoiceInfo";
import {PaymentInfo} from "./PaymentInfo";
import {EventTypes, IEvent, IStore} from "../redux/store/Interfaces";
import {createMatchSelector} from "connected-react-router";
import {useCallback, useEffect, useState} from "react";
import {useMappedState} from "redux-react-hook";
import {Invoice, InvoicePayment} from "../Protos/api_pb";
import {Loading} from "../Loading";
import {useCancelInvoicePayment, useInvoicePayments, useMarkAsReadedEvents, useStrings} from "../Hooks";
import {errors} from "../localization/Errors";
import {data, IStrings} from "../localization/Invoices/PaymentView";
import {PaymentSecretsList} from "./Secrets/PaymentSecretsList";


export function PaymentView() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            payment: getPayment(store),
            invoices: store.invoices,
            id: getId(store)
        }), []
    );
    const {payment, invoices, id} = useMappedState(mapState);
    const [markEvents, setMarkEvents] = useState<IEvent[] | null>(null);
    const [error, setError] = useState("");
    const [requested, setRequested] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [cancelPayment, setCancelPayment] = useState<number | null>(null);
    const [cancelPaymentRunning, setCancelPaymentRunning] = useState(false);

    function getId(store: IStore) {
        const matchSelector = createMatchSelector("/invoices/payment/:id(\\d+)");
        const match = matchSelector({router: store.router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id !== undefined)
            return id;
        return null;
    }

    function getPayment(store: IStore): InvoicePayment.AsObject | null {
        let id = getId(store);
        if (store.invoices.toMeInvoicePayments === null || store.invoices.fromMeInvoicePayments === null) {
            return null;
        }
        // eslint-disable-next-line eqeqeq
        let payment = store.invoices.fromMeInvoicePayments.concat(store.invoices.toMeInvoicePayments).find(p => p.id == id);
        if (payment === undefined) {
            return null;
        }
        return payment;
    }

    useCancelInvoicePayment(cancelPayment,
        () => {
            setCancelPaymentRunning(true);
            setError("");
        },
        () => {
            setCancelPaymentRunning(false);
            setCancelPayment(null);
        },
        (e) => setError(e)
    );

    useEffect(() => {
        if (payment === null) {
            return;
        }
        if (payment !== undefined && invoices.newPaymentsIds.includes(payment.id)) {
            // eslint-disable-next-line eqeqeq
            let events = invoices.newEvents.filter(p => p.type === EventTypes.InvoicePaymentNew && p.invoicePayment!.id == payment!.id);
            if (events !== undefined) {
                setMarkEvents(events);
            }
        }
    }, [payment, invoices.newEvents, invoices.newPaymentsIds])
    useInvoicePayments(!requested && id !== null && !requesting, null, 1, id, null,
        () => {
            setRequesting(true)
        },
        () => {
            setRequested(true);
            setRequesting(false);
        },
        e => setError(e));

    useMarkAsReadedEvents(markEvents,
        () => {
        },
        () => {
            setMarkEvents(null);
        },
        setError);

    if (requested && payment === null) {
        return (
            <Container>
                <Row className="pt-3">
                    <Col>
                        <Alert color="danger">{errors("Payment not found.")}</Alert>
                    </Col>
                </Row>
            </Container>
        )
    }

    if (payment === null) {
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
            {payment.status === InvoicePayment.InvoicePaymentStatus.PAID && payment.invoice?.service !== Invoice.ServiceType.AUTOPRICE ?
                <Row>
                    <Col>
                        <PaymentSecretsList payment={payment}/>
                    </Col>
                </Row>
                : null
            }
            <Row>
                <Col {...Col6_12} className="pt-3">
                    <InvoiceInfo invoice={payment.invoice!} title={strings.invoiceTitle} hideContact={true}/>
                </Col>
                <Col {...Col6_12} className="pt-3">
                    <PaymentInfo payment={payment} canceling={cancelPaymentRunning}
                                 cancel={() => setCancelPayment(payment?.id)}/>
                </Col>
            </Row>
        </Container>
    )
}