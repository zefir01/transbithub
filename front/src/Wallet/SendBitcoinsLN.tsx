import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {MyDecimal} from "../MyDecimal";
import {data, IStrings} from "../localization/Wallet/SendBitcoinsLN";
import {Alert, Card, CardBody, Col, Row} from "reactstrap";
import {Col6_12} from "../global";
import {Balance, LNWithdrawalRequest} from "../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {BalanceUpdated} from "../redux/actions";
import {errors} from "../localization/Errors";
import {LoadingBtn} from "../LoadingBtn";
import {Calc} from "./Calc";
import {LNDecodedInvoice, LNInvoiceInput} from "../MainPages/LNInvoiceInput";
import {useStrings} from "../Hooks";


export function SendBitcoinsLN() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            balance: store.balances.Balance,
        }), []
    );
    const {authState, balance} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [send, setSend] = useState(false);
    const [sendRunning, setSendRunning] = useState(false);
    const [success, setSuccess] = useState(false);
    const [decodedInvoice, setDecodedInvoice] = useState<LNDecodedInvoice | null>(null);
    const [amount, setAmount] = useState<MyDecimal | null>(null);

    useEffect(() => {
        async function f() {
            if (!send || sendRunning || !decodedInvoice || decodedInvoice.error || authState !== AuthState.Authed) {
                return;
            }
            if (!decodedInvoice.amount && !amount) {
                return;
            }
            setSendRunning(true);
            setSend(false);

            let req = new LNWithdrawalRequest();
            req.setInvoice(decodedInvoice.invoice);
            if (!decodedInvoice.amount) {
                req.setAmount(amount!.ToPb());
            } else {
                req.setAmountisnull(true);
            }

            try {
                setSuccess(false);
                let balance = await TradeGrpcRunAsync<Balance.AsObject>(tradeApiClient.lNWithdrawal, req, getToken());
                dispatch(BalanceUpdated(balance));
                setSuccess(true);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setSendRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [send, sendRunning, decodedInvoice, authState, amount, dispatch])


    function getBtnText() {
        let b = MyDecimal.FromPb(balance!.confirmed);
        if (decodedInvoice?.amount && b.lessThan(decodedInvoice?.amount)) {
            return strings.fundsError;
        }
        return strings.send;
    }

    function isBtnDisabled() {
        let b = MyDecimal.FromPb(balance!.confirmed);
        if (!decodedInvoice || decodedInvoice.error) {
            return true;
        }
        let am: MyDecimal | null;
        if (decodedInvoice.amount) {
            am = decodedInvoice.amount;
        } else {
            am = amount;
        }
        if (!am) {
            return true;
        }
        return b.lessThan(am) || am.lessThanOrEqualTo(0);

    }

    return (
        <Row className="justify-content-center pt-3">
            <Col {...Col6_12}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col>{strings.Balance}:</Col>
                            <Col>{MyDecimal.FromPb(balance!.confirmed).toString()} BTC</Col>
                        </Row>
                        <Row>
                            <Col>
                                <LNInvoiceInput onChange={(decoded) => {
                                    setSuccess(false);
                                    setDecodedInvoice(decoded);
                                }}/>
                            </Col>
                        </Row>
                        {decodedInvoice && !decodedInvoice?.error ?
                            <>
                                {decodedInvoice.amount ?
                                    <Row>
                                        <Col>
                                            {strings.amount}
                                        </Col>
                                        <Col>
                                            {decodedInvoice.amount?.toString()} BTC
                                        </Col>
                                    </Row>
                                    :
                                    <Row className="pb-3">
                                        <Col>
                                            <Calc newAmount={amount1 => {
                                                setAmount(new MyDecimal(amount1));
                                            }}/>
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    <Col>
                                        {strings.description}
                                    </Col>
                                    <Col>
                                        {decodedInvoice.description}
                                    </Col>
                                </Row>
                            </>
                            : null
                        }
                        <Row className="pt-3">
                            <Col>
                                <LoadingBtn loading={sendRunning} color="warning" className="btn-block"
                                            disabled={isBtnDisabled()}
                                            onClick={() => setSend(true)}
                                >
                                    {getBtnText()}
                                </LoadingBtn>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Alert isOpen={error !== ""} toggle={() => setError("")}
                                       color="danger">{errors(error)}</Alert>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Alert isOpen={success} toggle={() => setSuccess(false)}
                                       color="success">{strings.success}
                                </Alert>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}