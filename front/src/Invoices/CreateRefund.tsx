import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    CreateRefundRequest, CreateRefundResponse, Invoice,
    InvoicePayment
} from "../Protos/api_pb";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Collapse,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
} from "reactstrap";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DecimalInput} from "../DecimalInput";
import {Decimal} from 'decimal.js';
import {calcValuesInvoice} from "./InvoiceCalc";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {errors} from "../localization/Errors";
import {LoadingBtn} from "../LoadingBtn";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {useDispatch} from "react-redux";
import {RefundCreated} from "../redux/actions";
import {NavLink, Redirect} from "react-router-dom";
import {data, IStrings} from "../localization/Invoices/CreateRefund";
import {Loading} from "../Loading";
import {useStrings} from "../Hooks";


library.add(fas);
const plusLookup: IconLookup = {prefix: 'fas', iconName: 'plus'};
const plusIconDefinition: IconDefinition = findIconDefinition(plusLookup);
const minusLookup: IconLookup = {prefix: 'fas', iconName: 'minus'};
const minusIconDefinition: IconDefinition = findIconDefinition(minusLookup);


export interface ICreateRefundProps {
    payment: InvoicePayment.AsObject;
    isOpen: boolean;
}

export function CreateRefund(props: ICreateRefundProps) {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            vars: store.catalog.variables,
            authState: store.auth.state
        }), []
    );
    const {vars, authState} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [pieces, setPieces] = useState<Decimal | null>(new Decimal(availablePieces()));
    const [cryptoAmount, setCryptoAmount] = useState("");
    const [fiatAmount, setFiatAmount] = useState("");
    const [createRefund, setCreateRefund] = useState(false);
    const [refundCreating, setRefundCreating] = useState(false);
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");

    function availablePieces() {
        return props.payment.pieces - props.payment.refunding - props.payment.refunded;
    }

    useEffect(() => {
        if (!vars || vars.size === 0) {
            return;
        }
        if (pieces == null) {
            setCryptoAmount("");
            setFiatAmount("");
            return;
        }
        let values = calcValuesInvoice(props.payment.invoice!, vars);
        if (values == null) {
            return;
        }
        if (!props.payment.invoice?.isprivate) {
            setCryptoAmount(values.piecePriceCrypto!.mul(pieces).toDecimalPlaces(8).toString());
            setFiatAmount(values.piecePriceFiat!.mul(pieces).toString());
        } else {
            setCryptoAmount(values.piecePriceCrypto!.toDecimalPlaces(8).toString());
            setFiatAmount(values.amountFiatStr);
        }

    }, [props.payment, pieces, vars])

    useEffect(() => {
        if (!createRefund || refundCreating || authState !== AuthState.Authed || pieces === null) {
            return;
        }
        setRefundCreating(true);
        setCreateRefund(false);
        setError("");

        async function f() {
            let req = new CreateRefundRequest();
            req.setPaymentid(props.payment.id);
            req.setPieces(pieces!.toNumber());

            try {
                let resp = await TradeGrpcRunAsync<CreateRefundResponse.AsObject>(tradeApiClient.createRefund, req, getToken());
                dispatch(RefundCreated(resp));
                setRedirect("/invoices/invoice/" + resp.refund?.id);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setRefundCreating(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [createRefund, authState, dispatch, pieces, props.payment.id, refundCreating])

    function getStatus(invoice: Invoice.AsObject) {
        switch (invoice.status) {
            case Invoice.InvoiceStatus.ACTIVE:
                return strings.active;
            case Invoice.InvoiceStatus.DELETED:
                return strings.deleted;
            case Invoice.InvoiceStatus.PAYED:
                return strings.payed;
            case Invoice.InvoiceStatus.PENDINGPAY:
                return strings.pending;
        }
    }

    function Refunds() {
        return (
            <>
                <hr/>
                <Row>
                    <Col>
                        <span className="font-weight-bold">{strings.toRefund}</span>
                    </Col>
                </Row>
                {props.payment.refundsList.map(p => {
                    return (
                        <Row key={p.id}>
                            {p.status === Invoice.InvoiceStatus.ACTIVE || p.status === Invoice.InvoiceStatus.PENDINGPAY ?
                                <Col>
                                    <NavLink to={"/invoices/invoice/" + p.id}>{strings.invoice + p.id}</NavLink>
                                </Col>
                                :
                                <Col>
                                    {strings.invoice + p.id}
                                </Col>
                            }
                            <Col>
                                {strings.pieces + p.piecesmax}
                            </Col>
                            <Col>
                                {getStatus(p)}
                            </Col>
                        </Row>
                    );
                })}
            </>

        );
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>
    }

    if (!vars || vars.size === 0) {
        return <Loading/>;
    }

    if (props.payment.owner!.isanonymous) {
        return (
            <Collapse isOpen={props.isOpen}>
                <Card className="mb-3">
                    <CardBody>
                        {strings.err1}
                    </CardBody>
                </Card>
            </Collapse>
        );
    }

    if (props.payment.refunded + props.payment.refunding >= props.payment.pieces) {
        return (
            <Collapse isOpen={props.isOpen}>
                <Card className="mb-3">
                    <CardBody>
                        {strings.err2}
                        <Refunds/>
                    </CardBody>
                </Card>
            </Collapse>
        );
    }

    return (
        <Collapse isOpen={props.isOpen}>
            <Card className="mb-3">
                <CardBody>
                    <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
                    {strings.info}
                    {!props.payment.invoice!.isprivate ?
                        <InputGroup className="mt-2">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText className="font-weight-bold">{strings.pieces}</InputGroupText>
                            </InputGroupAddon>
                            <DecimalInput
                                intOnly={true}
                                value={pieces}
                                maximumValue={availablePieces()}
                                minimalValue={1}
                                onInput={value => setPieces(value)}/>
                            <InputGroupAddon addonType="append">
                                <Button color="secondary" outline
                                        onClick={() => {
                                            if (pieces?.eq(1)) {
                                                return;
                                            }
                                            if (pieces) {
                                                setPieces(pieces.minus(1));
                                            } else {
                                                setPieces(new Decimal(props.payment.pieces));
                                            }
                                        }}
                                >
                                    <FontAwesomeIcon
                                        icon={minusIconDefinition}/>
                                </Button>
                                <Button color="secondary" outline
                                        onClick={() => {
                                            if (pieces?.eq(availablePieces())) {
                                                return;
                                            }
                                            if (pieces) {
                                                setPieces(pieces.plus(1));
                                            } else {
                                                setPieces(new Decimal(props.payment.pieces));
                                            }
                                        }}
                                >
                                    <FontAwesomeIcon
                                        icon={plusIconDefinition}/>
                                </Button>
                                <LoadingBtn loading={refundCreating} onClick={() => setCreateRefund(true)}
                                            color="danger">
                                    {strings.refund}
                                </LoadingBtn>
                            </InputGroupAddon>
                        </InputGroup>
                        :
                        <Row className="justify-content-center">
                            <Col className="col-auto">
                                <LoadingBtn className="mb-3" loading={refundCreating}
                                            onClick={() => setCreateRefund(true)}
                                            color="danger">
                                    {strings.refund}
                                </LoadingBtn>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col className="font-weight-bold">
                            {strings.fiatAmount}
                        </Col>
                        <Col className="font-weight-bold text-success">
                            {fiatAmount} {props.payment.invoice?.fiatcurrency}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="font-weight-bold">
                            {strings.cryptoAmount}
                        </Col>
                        <Col>
                            {cryptoAmount} BTC
                        </Col>
                    </Row>
                    <Refunds/>
                </CardBody>
            </Card>
        </Collapse>
    )
}