import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {GetInputAddressResponse} from "../Protos/api_pb";
import {
    getToken,
    GrpcError,
    tradeApiClient,
    TradeGrpcRunAsync
} from "../helpers";
import {Loading} from "../Loading";
import {Col6_12} from "../global";
import {QRCode} from "react-qr-svg";
import {Decimal} from "decimal.js";
import {Calc} from "./Calc";
import {data, IStrings} from "../localization/Wallet/GetBitcoins";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";

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

export function ReceiveBitcoinsOnChain() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            catalog: store.catalog
        }), []
    );
    const {authState, catalog} = useMappedState(mapState);
    const [getAddressRunning, setGetAddressRunning] = useState(false);
    const [legacyAddress, setLegacyAddress] = useState("");
    const [bech32Address, setbech32Address] = useState("");
    const [, setError] = useState("");
    const [amount, setAmount] = useState<Decimal | null>(null);
    const [isBech32, setIsBach32] = useState(true);


    useEffect(() => {
        if (authState !== AuthState.Authed || legacyAddress !== "" || bech32Address !== "" || getAddressRunning)
            return;
        setError("");
        setGetAddressRunning(true);

        async function f() {
            let req = new Empty();

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<GetInputAddressResponse.AsObject>(tradeApiClient.getInputAddress, req, token);
                setLegacyAddress(resp.btcaddress!.legacy);
                setbech32Address(resp.btcaddress!.bech32);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setGetAddressRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, bech32Address, getAddressRunning, legacyAddress]);


    function GetUri() {
        if (isBech32) {
            return `bitcoin:${bech32Address}` + (amount !== null ? `?amount=${amount!.toString()}` : "");
        }
        return `bitcoin:${legacyAddress}` + (amount !== null ? `?amount=${amount!.toString()}` : "");
    }

    if (catalog.variables === null || legacyAddress === "" || bech32Address === "")
        return <Loading/>;

    return (
        <>
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardBody>
                            <Row>
                                <Col>
                                    <FormGroup check>
                                        <Label>
                                            <Input type="radio" name="radio1"
                                                   checked={isBech32}
                                                   onClick={() => setIsBach32(true)}
                                            />{' '}
                                            {strings.Bech32}
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <div className="text-muted">
                                        {strings.Bech32Description}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup check>
                                        <Label>
                                            <Input type="radio" name="radio1"
                                                   checked={!isBech32}
                                                   onClick={() => setIsBach32(false)}
                                            />{' '}
                                            {strings.Legacy}
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <div className="text-muted">
                                        {strings.LegacyDesctiption}
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <QR uri={GetUri()}/>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col {...Col6_12}>
                    <Calc newAmount={amount1 => setAmount(amount1)}/>
                    <Card>
                        <CardBody>
                            <p>
                                {strings.Inst1}
                                <span className="d-block"><a href={GetUri()}>{GetUri()}</a></span>
                                {strings.Inst2}
                                <span
                                    className="d-block font-weight-bold">{isBech32 ? bech32Address : legacyAddress}
                                </span>
                            </p>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}