import React, {useCallback, useEffect, useState} from "react";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Collapse,
    FormText,
    ListGroup,
    ListGroupItem,
    Row
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {Col6_12, invoiceFeePercent, pageSize, site} from "../../global";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, HelperInvoicePaymentType, IStore} from "../../redux/store/Interfaces";
import {Loading} from "../../Loading";
import {LoginRegisterComponent} from "../../Profile/LoginRegister";
import {MyDecimal} from "../../MyDecimal";
import {useInvoices, useStrings} from "../../Hooks";
import {InvoicePayment, PayInvoiceFromBalanceRequest, PayInvoiceFromLNRequest} from "../../Protos/api_pb";
import {
    NewInvoicesPayment,
    SetCurrentPath,
    SetInvoiceId,
    SetInvoicePaymentId,
    SetInvoicePaymentType
} from "../../redux/actions";
import {errors} from "../../localization/Errors";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {data, IStrings} from "../../localization/Helper/PayInvoice/SelectPaymentType";

library.add(fab);
library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);
const lnLookup: IconLookup = {prefix: 'far', iconName: 'bolt'};
const lnIconDefinition: IconDefinition = findIconDefinition(lnLookup);
const moneyLookup: IconLookup = {prefix: 'far', iconName: 'money-bill-alt'};
const moneyIconDefinition: IconDefinition = findIconDefinition(moneyLookup);
const invoiceLookup: IconLookup = {prefix: 'far', iconName: 'file-invoice-dollar'};
const invoiceIconDefinition: IconDefinition = findIconDefinition(invoiceLookup);
const walletLookup: IconLookup = {prefix: 'far', iconName: 'wallet'};
const walletIconDefinition: IconDefinition = findIconDefinition(walletLookup);

export function SelectPaymentType() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            invoices: store.invoices,
            authState: store.auth.state,
            balance: store.balances.Balance
        }), []
    );
    const {state, invoices, authState, balance} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [pay, setPay] = useState(false);
    const [payRunning, setPayRunning] = useState(false);

    const inv = useCallback(() => {
        let id = state.invoiceId;

        if (invoices.toMeInvoices === null || invoices.fromMeInvoices === null || invoices.publicInvoices === null) {
            return null;
        }

        let all = invoices.toMeInvoices.concat(invoices.fromMeInvoices).concat(invoices.publicInvoices);
        // eslint-disable-next-line eqeqeq
        let inv = all.find(p => p.id == id);
        if (inv === undefined) {
            return null;
        }
        return inv;
    }, [invoices, state.invoiceId]);
    let invoice = inv();

    function isLowBalance(): boolean {
        if (!balance || !invoice || !state.pieces) {
            return true;
        }
        let money = MyDecimal.FromPb(balance.confirmed);
        let need = MyDecimal.FromPb(invoice.currentcryptoprice).mul(state.pieces);
        let fee: MyDecimal;
        if (invoice.isprivate) {
            fee = new MyDecimal(0);
        } else {
            fee = need.dividedBy(100).mul(invoiceFeePercent);
        }
        let total = need.plus(fee);
        return money.lessThan(total);

    }

    function isDisabled(): boolean {
        if (activeItem === null) {
            return true;
        }
        if (activeItem === 1 && authState === AuthState.AnonAuthed) {
            return true;
        }
        return activeItem === 1 && authState === AuthState.Authed && isLowBalance();

    }

    useEffect(() => {
        if (!state.pieces) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.pieces]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/selectPaymentType"));
    }, [state.currentPath, dispatch]);

    useInvoices(!invoice && state.invoiceId !== null, 0, pageSize * 2, null,
        [], null, state.invoiceId, null,
        () => {
        },
        (invoices) => {
            if (invoices && invoices.length > 0) {
                dispatch(SetInvoiceId(invoices[0].id));
            } else {
                setError("Invoice not found.");
            }
        },
        (e) => setError(e)
    );
    useEffect(() => {
        if (state.invoicePaymentType !== null && !activeItem) {
            switch (state.invoicePaymentType) {
                case HelperInvoicePaymentType.Balance:
                    setActiveItem(1);
                    break;
                case HelperInvoicePaymentType.Deal:
                    setActiveItem(2);
                    break;
                case HelperInvoicePaymentType.Promise:
                    setActiveItem(3);
                    break;
                case HelperInvoicePaymentType.LN:
                    setActiveItem(4);
                    break;

            }
        }
    }, [state.invoicePaymentType, activeItem]);

    useEffect(() => {
        async function f() {
            if (payRunning || !pay || !state.pieces || !state.invoiceId || authState === AuthState.NotAuthed || activeItem !== 1) {
                return;
            }
            setPayRunning(true);
            setPay(false);

            let req = new PayInvoiceFromBalanceRequest();
            req.setInvoiceid(state.invoiceId);
            req.setPieces(state.pieces);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceFromBalance, req, getToken());
                setError("");
                dispatch(NewInvoicesPayment(resp));
                dispatch(SetInvoicePaymentId(resp.id));
                setRedirect("/helper/paymentComplete");
            } catch (e) {
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
                console.log(e.message);
            } finally {
                setPayRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [pay, payRunning, authState, state.pieces, state.invoiceId, dispatch, activeItem]);

    useEffect(() => {
        async function f() {
            if (payRunning || !pay || activeItem!==4 || !state.invoiceId || !state.pieces || authState===AuthState.NotAuthed) {
                return;
            }
            setPayRunning(true);
            setPay(false);

            try {
                let req = new PayInvoiceFromLNRequest();
                req.setInvoiceid(state.invoiceId);
                req.setPieces(state.pieces);

                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceFromLN, req, getToken());
                setError("");
                dispatch(NewInvoicesPayment(resp))
                dispatch(SetInvoicePaymentId(resp.id));
                setRedirect("/helper/payLn");
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
    }, [pay, payRunning, authState, activeItem, state.invoiceId, state.pieces, dispatch]);

    function getIconColClass(index: number) {
        if (index === activeItem) {
            return "col-auto text-warning";
        }
        return "col-auto text-primary";
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!invoice || !balance) {
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
                    <Button color="danger" outline onClick={() => setRedirect("/helper/selectPieces")}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12} className="col-auto">
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h4>{strings.title}</h4>
                                {strings.info}
                            </CardTitle>
                            <Alert isOpen={error !== ""} toggle={() => setError("")}>
                                {errors(error)}
                            </Alert>
                            <ListGroup>
                                <ListGroupItem action tag="button" active={activeItem === 1}
                                               onClick={() => setActiveItem(1)}>
                                    <Row>
                                        <Col className="align-self-center">
                                            {strings.balance}
                                            <FormText>
                                                {strings.balanceInfo}{site}
                                            </FormText>
                                        </Col>
                                        <Col className={getIconColClass(1)}>
                                            <FontAwesomeIcon icon={walletIconDefinition} size="2x"/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem action tag="button" active={activeItem === 2}
                                               onClick={() => setActiveItem(2)}>
                                    <Row>
                                        <Col className="align-self-center">
                                            {strings.fiat}
                                            <FormText>
                                                {strings.fiatInfo}
                                            </FormText>
                                        </Col>
                                        <Col className={getIconColClass(2)}>
                                            <FontAwesomeIcon icon={moneyIconDefinition} size="2x"/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem action tag="button" active={activeItem === 3}
                                               onClick={() => setActiveItem(3)}>
                                    <Row>
                                        <Col className="align-self-center">
                                            {strings.promise}
                                            <FormText>
                                                {strings.promiseInfo}
                                            </FormText>
                                        </Col>
                                        <Col className={getIconColClass(3)}>
                                            <FontAwesomeIcon icon={invoiceIconDefinition} size="2x"/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem action tag="button" active={activeItem === 4}
                                               onClick={() => setActiveItem(4)}>
                                    <Row>
                                        <Col className="align-self-center">
                                            {strings.ln}
                                            <FormText>
                                                {strings.lnInfo}
                                            </FormText>
                                        </Col>
                                        <Col className={getIconColClass(4)}>
                                            <FontAwesomeIcon icon={lnIconDefinition} size="2x"/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            </ListGroup>
                            <Collapse isOpen={activeItem === 1 && authState === AuthState.AnonAuthed}>
                                <Alert className="mt-3" color="warning">
                                    {strings.warn}
                                </Alert>
                                <LoginRegisterComponent/>
                            </Collapse>
                            <Collapse isOpen={activeItem === 1 && authState === AuthState.Authed && isLowBalance()}>
                                <Alert className="mt-3" color="warning">
                                    {strings.lowMoney}
                                </Alert>
                            </Collapse>
                            <Button color="success" className="btn-block mt-3" disabled={isDisabled()}
                                    onClick={() => {
                                        switch (activeItem) {
                                            case 1:
                                                dispatch(SetInvoicePaymentType(HelperInvoicePaymentType.Balance));
                                                setPay(true);
                                                break;
                                            case 2:
                                                dispatch(SetInvoicePaymentType(HelperInvoicePaymentType.Deal));
                                                setRedirect("/helper/buyCrypto");
                                                break;
                                            case 3:
                                                dispatch(SetInvoicePaymentType(HelperInvoicePaymentType.Promise));
                                                setRedirect("/helper/promisePay");
                                                break;
                                            case 4:
                                                dispatch(SetInvoicePaymentType(HelperInvoicePaymentType.LN));
                                                setPay(true);
                                                break;
                                        }
                                    }}
                            >
                                {strings.ok}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}