import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Alert, Button, Card, CardBody, Col, Collapse, Row} from "reactstrap";
import {data, IStrings} from "../../localization/Invoices/InvoiceControl";
import {LoginRegisterComponent} from "../../Profile/LoginRegister";
import {MyDecimal} from "../../MyDecimal";
import {LoadingBtn} from "../../LoadingBtn";
import {Invoice, InvoicePayment, PayInvoiceFromBalanceRequest} from "../../Protos/api_pb";
import {IInvoiceCalculatedValues} from "../InvoiceCalc";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {NewInvoicesPayment} from "../../redux/actions";
import {Redirect} from "react-router-dom";
import {useStrings} from "../../Hooks";
import {errors} from "../../localization/Errors";

export interface PayBalanceProps {
    invoice: Invoice.AsObject;
    pieces: number | null;
    values: IInvoiceCalculatedValues | null;
    redirect: (to: string) => void;
}

export function PayBalance(props: PayBalanceProps) {
    const strings: IStrings=useStrings(data);
    enum Status {
        self,
        balance,
    }

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
            balance: store.balances.Balance,
            authState: store.auth.state,
        }), []
    );
    const {userId, balance, authState} = useMappedState(mapState);
    const [pay, setPay] = useState(false);
    const [payRunning, setPayRunning] = useState(false);
    const [, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        async function f() {
            if (payRunning || !pay || !props.pieces || authState === AuthState.NotAuthed) {
                return;
            }
            setPayRunning(true);
            setPay(false);

            let req = new PayInvoiceFromBalanceRequest();
            req.setInvoiceid(props.invoice.id);
            req.setPieces(props.pieces);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceFromBalance, req, getToken());
                setError("");
                dispatch(NewInvoicesPayment(resp));
                setRedirect("/invoices/payment/" + resp.id);
                props.redirect("/invoices/payment/" + resp.id);
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
    }, [pay, payRunning, authState, dispatch, props.invoice.id, props.pieces]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!balance) {
        return null;
    }

    if (authState === AuthState.AnonAuthed) {
        return (
            <Row>
                <Col>
                    <Button outline={!isOpen} color="primary" className="btn-block" onClick={() => setIsOpen(!isOpen)}>
                        {strings.pay}
                    </Button>
                    <Collapse isOpen={isOpen} className="mt-1">
                        <Card>
                            <CardBody>
                                <Alert className="mb-0 mb-3" color="warning">{strings.needAuth}</Alert>
                                <LoginRegisterComponent/>
                            </CardBody>
                        </Card>
                    </Collapse>
                </Col>
            </Row>
        );
    }

    let status: Status | null = null;
    if (userId === props.invoice.owner!.id) {
        status = Status.self;
    }
    if (status === null && (!props.pieces || MyDecimal.FromPb(balance!.confirmed).mul(props.pieces).lessThan(props.values!.piecePriceCrypto!))) {
        status = Status.balance;
    }


    if (status === Status.self) {
        return (
            <Row>
                <Col>
                    <Button disabled={true} outline color="success" className="btn-block">
                        {strings.self}
                    </Button>
                </Col>
            </Row>
        );
    }
    if (status === Status.balance) {
        return (
            <>
                <Row>
                    <Col>
                        <Button disabled={true} outline color="success" className="btn-block">
                            {strings.balance}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button disabled={true} outline color="success" className="btn-block">
                            {strings.payLn}
                        </Button>
                    </Col>
                </Row>
            </>
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <LoadingBtn loading={payRunning} outline color="success" className="btn-block"
                                disabled={!props.pieces}
                                onClick={() => setPay(true)}
                    >
                        {strings.pay}
                    </LoadingBtn>
                </Col>
            </Row>
        </>
    );
}