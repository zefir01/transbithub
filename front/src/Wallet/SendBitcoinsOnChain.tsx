import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, Col, FormFeedback, Input, Row} from "reactstrap";
import {Col6_12} from "../global";
import {data, IStrings} from "../localization/Wallet/SendBitcoinsOnChain";
import FormGroup from "reactstrap/lib/FormGroup";
import validate from "bitcoin-address-validation";
import {Calc} from "./Calc";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Decimal} from "decimal.js";
import {MyDecimal} from "../MyDecimal";
import {CreateTransactionRequest} from "../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";

export function SendBitcoinsOnChain() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            balance: store.balances.Balance,
            catalog: store.catalog,
        }), []
    );
    const {authState, balance, catalog} = useMappedState(mapState);

    const [amount, setAmount] = useState<Decimal | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [sendRunning, setSendRunning] = useState(false);
    const [send, setSend] = useState(false);
    const [error, setError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [success, setSuccess] = useState(false);

    const getBalanceCb = useCallback(() => {
        if (!balance)
            return null;
        return {
            confirmed: MyDecimal.FromPb(balance.confirmed),
            unConfirmed: MyDecimal.FromPb(balance.unconfirmed)
        };
    }, [balance])
    const getBalance = getBalanceCb();

    function isBtnDisabled() {
        if (!catalog.fee)
            return true;
        return address === null || addressError !== "" || amount === null || success
            || amount.plus(catalog.fee).greaterThan(getBalance!.confirmed) || amount.lessThanOrEqualTo(0);
    }

    useEffect(() => {
            function isBtnDisabled() {
                if (!catalog.fee)
                    return true;
                return address === null || addressError !== "" || amount === null || success
                    || amount.plus(catalog.fee).greaterThan(getBalance!.confirmed) || amount.lessThanOrEqualTo(0);
            }

            if (authState !== AuthState.Authed || sendRunning || !send || isBtnDisabled() || !address)
                return;
            setError("");
            setSendRunning(true);
            setSend(false);

            async function f() {
                let req = new CreateTransactionRequest();
                req.setAmount(new MyDecimal(amount).ToPb());
                req.setTargetaddress(address!);

                try {
                    await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.createTransaction, req, getToken());
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
        }, [authState, send, address, amount, sendRunning, addressError, catalog.fee, success, getBalance]
    );


    function getBtnText() {
        if (amount === null)
            return strings.SendAmount;
        if (address === null)
            return strings.DestinationAddress;
        if (addressError !== "")
            return strings.InvalidAddress;
        if (amount.plus(catalog.fee!).greaterThan(getBalance!.confirmed))
            return strings.insufficientFunds;
        if (sendRunning)
            return strings.SendRequest;
        if (success)
            return strings.Sent;
        return strings.Send1 + amount!.toString() + strings.toAddr + address;
    }

    function getAvaliableSend() {
        let av = getBalance!.confirmed.minus(catalog.fee!);
        if (av.lessThan(0))
            return "0";
        else
            return av.toString()
    }

    return (
        <Row>
            <Col {...Col6_12}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col>{strings.Balance}:</Col>
                            <Col>{getBalance!.confirmed.toString()}</Col>
                        </Row>
                        <Row>
                            <Col>{strings.Commission}:</Col>
                            <Col>{catalog.fee!.toString()}</Col>
                        </Row>
                        <Row>
                            <Col>{strings.Send}:</Col>
                            <Col>{getAvaliableSend()}</Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Input className="my-3" placeholder={strings.EnterAddress}
                                           invalid={addressError !== ""}
                                           valid={addressError === "" && address !== "" && address !== null}
                                           onInput={event => {
                                               let result = validate(event.currentTarget.value);
                                               if (result !== false) {
                                                   if (result.network !== "mainnet") {
                                                       setAddressError(strings.NetworkAddress);
                                                   }
                                                   setAddress(result.address);
                                                   setAddressError("");
                                               } else {
                                                   setAddressError(strings.WrongAddress)
                                               }
                                           }}
                                    />
                                    <FormFeedback invalid>
                                        {addressError}
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button color="warning" className="btn-block"
                                        disabled={isBtnDisabled()}
                                        onClick={() => setSend(true)}
                                >
                                    {getBtnText()}
                                </Button>
                            </Col>
                        </Row>
                        {error !== "" ?
                            <Row className="mt-3">
                                <Col>
                                    <Alert color="danger">{error}</Alert>
                                </Col>
                            </Row>
                            : null
                        }
                    </CardBody>
                </Card>
            </Col>
            < Col {...Col6_12}>
                <Calc newAmount={amount1 => setAmount(amount1)}/>
            </Col>
        </Row>
    )
}