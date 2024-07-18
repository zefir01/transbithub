import React, {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Col6_12} from "../../global";
import {QRCode} from "react-qr-svg";
import {useDispatch, useMappedState} from "redux-react-hook";
import {IStore} from "../../redux/store/Interfaces";
import {Loading} from "../../Loading";
import {LoadingBtn} from "../../LoadingBtn";
import {InvoicePayment} from "../../Protos/api_pb";
import {SetCurrentPath} from "../../redux/actions";
import {useCancelInvoicePayment, useStrings} from "../../Hooks";
import {errors} from "../../localization/Errors";
import {data, IStrings} from "../../localization/Helper/PayInvoice/PayLn";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

interface IQRProps {
    uri: string;
}

const QR = React.memo((props: IQRProps) => {
    return (
        <QRCode
            className="d-block mx-auto"
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            style={{width: 256}}
            value={props.uri}
        />
    );
});

export function PayLn() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            invoices: store.invoices,
        }), []
    );
    const {state, invoices} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [cancel, setCancel] = useState(false);
    const [cancelRunning, setCancelRunning] = useState(false);
    const [error, setError] = useState("");
    const pcb = useCallback(() => {
        if (!state.invoicePaymentId || !invoices.fromMeInvoicePayments) {
            return null;
        }
        // eslint-disable-next-line eqeqeq
        let pp = invoices.fromMeInvoicePayments.find(p => p.id == state.invoicePaymentId);
        if (!pp) {
            return null;
        }
        return pp;
    }, [state.invoicePaymentId, invoices.fromMeInvoicePayments]);
    let payment = pcb();

    useEffect(() => {
        if (!payment) {
            return;
        }
        if (payment.status === InvoicePayment.InvoicePaymentStatus.PAID) {
            setRedirect("/helper/paymentComplete");
            return;
        }
        if (payment.status === InvoicePayment.InvoicePaymentStatus.CANCELED) {
            setRedirect("/helper/paymentCanceled");
            return;
        }
    }, [payment]);

    useEffect(() => {
        if (!state.invoicePaymentId) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.invoicePaymentId]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/payLn"));
    }, [state.currentPath, dispatch]);

    function cancelPaymentId() {
        if (!cancel || !payment || payment.status !== InvoicePayment.InvoicePaymentStatus.PENDING) {
            return null;
        }
        return payment.id;
    }

    useCancelInvoicePayment(cancelPaymentId(),
        () => {
            setCancelRunning(true);
            setCancel(false);
        },
        () => {
            setCancelRunning(false);
        },
        (e) => setError(e)
    );

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!payment) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        setRedirect("/helper/selectPaymentType");
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-center">
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h4>{strings.title}</h4>
                                {strings.info}
                            </CardTitle>
                            <Row>
                                <Col>
                                    <QR uri={`lightning:${payment.lninvoice}`}/>
                                </Col>
                            </Row>
                            <span className="font-weight-bold h5 d-block pt-3">
                                {strings.request}
                            </span>
                            <span>
                                {`lightning:${payment.lninvoice}`}
                            </span>
                            <LoadingBtn loading={cancelRunning} color="danger" className="btn-block mt-3"
                                        disabled={!payment || payment.status !== InvoicePayment.InvoicePaymentStatus.PENDING}
                                        onClick={() => setCancel(true)}>
                                {strings.cancel}
                            </LoadingBtn>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}