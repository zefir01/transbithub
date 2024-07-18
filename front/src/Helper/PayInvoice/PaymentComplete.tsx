import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {HelperInvoicePaymentType, IStore} from "../../redux/store/Interfaces";
import {Alert, Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Loading} from "../../Loading";
import {PaymentSecretsList} from "../../Invoices/Secrets/PaymentSecretsList";
import {useInvoicePayments, useStrings} from "../../Hooks";
import {Col6_12} from "../../global";
import {HelperActionTypes, SetCurrentPath} from "../../redux/actions";
import {errors} from "../../localization/Errors";
import {MultilineContent} from "../../MultilineContent";
import {data, IStrings} from "../../localization/Helper/PayInvoice/PaymentComplete";
import {PaymentFeedback} from "../../Invoices/PaymentFeedback";
import {DealFeedback} from "../../MainPages/DealPage/DealFeedback";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function PaymentComplete() {
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
    const [requested, setRequested] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [error, setError] = useState("");
    useInvoicePayments(!requested && !requesting, null, 1, state.invoicePaymentId, null,
        () => {
            setRequesting(true)
        },
        () => {
            setRequested(true);
            setRequesting(false);
        },
        e => setError(e),
        true);
    const pcb = useCallback(() => {
        if (!invoices.fromMeInvoicePayments) {
            return null;
        }
        // eslint-disable-next-line eqeqeq
        let pp = invoices.fromMeInvoicePayments?.find(p => p.id == state.invoicePaymentId);
        if (!pp) {
            return null;
        }
        return pp;
    }, [state.invoicePaymentId, invoices.fromMeInvoicePayments]);
    const payment = pcb();

    useEffect(() => {
        if (!state.invoicePaymentId) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.invoicePaymentId]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/paymentComplete"));
    }, [state.currentPath, dispatch]);

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
                        switch (state.invoicePaymentType) {
                            case HelperInvoicePaymentType.Balance:
                                setRedirect("/helper/selectPieces");
                                break;
                            case HelperInvoicePaymentType.Deal:
                                setRedirect("/helper/deal");
                                break;
                            case HelperInvoicePaymentType.Promise:
                                setRedirect("/helper/promisePay");
                                break;
                            case HelperInvoicePaymentType.LN:
                                setRedirect("/helper/selectPaymentType");
                                break;

                        }
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-center">
                <Col className="col-auto">
                    <h4 className="text-center text-success">
                        {strings.title}
                    </h4>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <PaymentSecretsList payment={payment}/>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <PaymentFeedback payment={payment}/>
                </Col>
            </Row>
            {payment.deal ?
                <Row className="pt-3">
                    <Col>
                        <DealFeedback payment={payment} deal={payment.deal}/>
                    </Col>
                </Row>
                : null
            }
            {payment.oddpromise !== "" ?
                <Row className="pt-3 justify-content-center">
                    <Col {...Col6_12}>
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <h5>{strings.oddPromise}</h5>
                                </CardTitle>
                                <MultilineContent text={payment.oddpromise} small={true} disableModify={true}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                : null
            }
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <Button className="btn-block" color="success" onClick={() => {
                        dispatch({type: HelperActionTypes.RESET});
                    }}>
                        {strings.complete}
                    </Button>
                </Col>
            </Row>
        </>
    )
}