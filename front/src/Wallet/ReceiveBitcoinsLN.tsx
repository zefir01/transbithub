import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {QRCode} from "react-qr-svg";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {Alert, Card, CardBody, Col, Input, Row} from "reactstrap";
import {Col6_12} from "../global";
import {Calc} from "./Calc";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";
import {MyDecimal} from "../MyDecimal";
import {LNDepositRequest, LNDepositResponse} from "../Protos/api_pb";
import humanizeDuration from "humanize-duration";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {data, IStrings} from "../localization/Wallet/ReceiveBitcoinsLN";
import {useStrings} from "../Hooks";

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

export function ReceiveBitcoinsLN() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            catalog: store.catalog,
            lang: store.lang.Lang
        }), []
    );
    const {authState, catalog, lang} = useMappedState(mapState);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState<MyDecimal | null>(null);
    const [invoice, setInvoice] = useState("");
    const [create, setCreate] = useState(false);
    const [createRunning, setCreateRunning] = useState(false);
    const [description, setDescription] = useState("");
    const [expires, setExpires] = useState(3600);

    useEffect(() => {
        async function f() {
            if (!create || createRunning || authState !== AuthState.Authed || !amount || description.length > 300) {
                return;
            }
            setCreateRunning(true);

            let req = new LNDepositRequest();
            req.setAmount(amount.ToPb())
            req.setDescription(description);
            req.setExpiresin(expires);

            try {
                let resp = await TradeGrpcRunAsync<LNDepositResponse.AsObject>(tradeApiClient.lNDeposit, req, getToken());
                setInvoice(resp.invoice);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setCreate(false);
                setCreateRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, create, createRunning, amount, description, expires])


    function GetUri() {
        return `lightning:${invoice}`;
    }

    function duration(seconds: number): string {
        let d = seconds * 1000;
        return humanizeDuration(d,
            {
                language: lang,
                largest: 2,
                round: true,
                fallbacks: ['en']
            }
        )
    }

    if (catalog.variables === null)
        return <Loading/>;

    return (
        <Row>
            <Col {...Col6_12}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col>
                                <Calc newAmount={amount1 => setAmount(new MyDecimal(amount1))}/>
                            </Col>
                        </Row>
                        <Row className="pt-3">
                            <Col>
                                <Input placeholder={strings.descriptionPh}
                                       onChange={event => {
                                           setDescription(event.currentTarget.value);
                                       }}
                                       invalid={description.length > 300}
                                />
                                <div className="invalid-feedback show">
                                    {strings.descriptionError}
                                </div>
                            </Col>
                        </Row>
                        <Row className="pt-3">
                            <Col>
                                <label className="mt-3">
                                    {strings.timeLimit + duration(expires)}
                                </label>
                                <Input type="range" className="custom-range" min="60" max="3600" step="10"
                                       value={expires}
                                       onInput={event => {
                                           let newVal = parseInt(event.currentTarget.value);
                                           setExpires(newVal);
                                       }}/>
                            </Col>
                        </Row>
                        <Row className="pt-3">
                            <Col>
                                <LoadingBtn loading={createRunning} color="warning" className="btn-block"
                                            disabled={!amount || amount.lessThanOrEqualTo(0) || description.length > 300}
                                            onClick={() => setCreate(true)}
                                >
                                    {strings.create}
                                </LoadingBtn>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Alert color="danger" isOpen={error !== ""}
                                       toggle={() => setError("")}>{errors(error)}</Alert>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col {...Col6_12}>
                {invoice !== "" ?
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <QR uri={GetUri()}/>
                                </Col>
                            </Row>
                            <span className="font-weight-bold h5 d-block pt-3">
                                {strings.copy}
                            </span>
                            <span>
                                {GetUri()}
                            </span>
                        </CardBody>
                    </Card>
                    : null
                }
            </Col>
        </Row>
    );
}