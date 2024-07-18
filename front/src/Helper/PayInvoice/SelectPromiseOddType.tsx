import React, {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    CardBody,
    Col,
    Collapse,
    ListGroup,
    ListGroupItem,
    Row,
    Card,
    CardTitle,
    FormText
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Redirect} from "react-router-dom";
import {Col6_12} from "../../global";
import {InvoicePaymentsLoaded, SetCurrentPath, SetInvoicePaymentId} from "../../redux/actions";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {InvoicePayment, PayInvoiceByPromiseRequest} from "../../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {useDispatch, useMappedState} from "redux-react-hook";
import {LoadingBtn} from "../../LoadingBtn";
import {LoginRegisterComponent} from "../../Profile/LoginRegister";
import {errors} from "../../localization/Errors";
import {data, IStrings} from "../../localization/Helper/PayInvoice/SelectPromiseOddType";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function SelectPromiseOddType() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            authState: store.auth.state
        }), []
    );
    const {state, authState} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [pay, setPay] = useState(false);
    const [payRunning, setPayRunning] = useState(false);
    const [oddType, setOddType] = useState(PayInvoiceByPromiseRequest.OddTypes.TOPROMISE);
    const [error, setError] = useState("");

    useEffect(() => {
        async function f() {
            if (authState === AuthState.NotAuthed ||
                !pay ||
                payRunning ||
                state.promise === "" ||
                !state.pieces ||
                !state.invoiceId
            ) {
                return;
            }

            setPay(false);
            setPayRunning(true);

            let req = new PayInvoiceByPromiseRequest();
            req.setInvoiceid(state.invoiceId);
            req.setPassword(state.promisePass);
            req.setPieces(state.pieces);
            req.setPromise(state.promise);
            req.setOddtype(oddType);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceByPromise, req, getToken());
                dispatch(InvoicePaymentsLoaded([resp]));
                dispatch(SetInvoicePaymentId(resp.id));
                setRedirect("/helper/paymentComplete");
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setPayRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [pay, authState, oddType, payRunning, state.promise, state.promisePass, state.invoiceId, state.pieces, dispatch]);

    function isDisabled() {
        return activeItem === 2 && (authState === AuthState.AnonAuthed || authState === AuthState.NotAuthed);

    }

    useEffect(() => {
        if (state.promise === "") {
            setRedirect("/helper/selectOperation");
        }
    }, [state.invoicePaymentType, state.promise]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/selectPromiseOddType"));
    }, [state.currentPath, dispatch]);

    useEffect(() => {
        if (activeItem === null && state.promiseOddType !== null) {
            switch (state.promiseOddType) {
                case PayInvoiceByPromiseRequest.OddTypes.NOODD:
                    setActiveItem(1);
                    break;
                case PayInvoiceByPromiseRequest.OddTypes.TOBALANCE:
                    setActiveItem(2);
                    break;
                case PayInvoiceByPromiseRequest.OddTypes.TOPROMISE:
                    setActiveItem(3)
                    break;
            }
            setOddType(state.promiseOddType);
        }
    }, [activeItem, state.promiseOddType]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        setRedirect("/helper/promisePay");
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
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h4>{strings.title}</h4>
                            </CardTitle>
                            <ListGroup>
                                <ListGroupItem action tag="button" active={activeItem === 1} onClick={() => {
                                    setOddType(PayInvoiceByPromiseRequest.OddTypes.NOODD);
                                    setActiveItem(1);
                                }}>
                                    {strings.noOdd}
                                    <FormText>{strings.noOddInfo}</FormText>
                                </ListGroupItem>
                                <ListGroupItem action tag="button" active={activeItem === 2} onClick={() => {
                                    setOddType(PayInvoiceByPromiseRequest.OddTypes.TOBALANCE);
                                    setActiveItem(2);
                                }}>
                                    {strings.balance}
                                    <FormText>{strings.balanceInfo}</FormText>
                                </ListGroupItem>
                                <ListGroupItem action tag="button" active={activeItem === 3} onClick={() => {
                                    setOddType(PayInvoiceByPromiseRequest.OddTypes.TOPROMISE);
                                    setActiveItem(3);
                                }}>
                                    {strings.promise}
                                    <FormText>{strings.promiseInfo}</FormText>
                                </ListGroupItem>
                            </ListGroup>
                            <Collapse isOpen={activeItem === 2 && authState === AuthState.AnonAuthed}>
                                <Alert className="mt-3" color="warning">
                                    {strings.warn}
                                </Alert>
                                <LoginRegisterComponent/>
                            </Collapse>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <LoadingBtn loading={payRunning} color="success" className="btn-block" disabled={isDisabled()}
                                onClick={() => {
                                    setPay(true);
                                }}>
                        {strings.ok}
                    </LoadingBtn>
                </Col>
            </Row>
        </>
    )
}