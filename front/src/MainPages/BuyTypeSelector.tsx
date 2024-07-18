import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Card, CardBody, CardTitle, Col, Collapse, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {MyDecimal} from "../MyDecimal";
import {Decimal} from "decimal.js";
import {Advertisement} from "../Protos/api_pb";
import {InputPromisePass} from "../Promises/InputPromisePass";
import {data, IStrings} from "../localization/BuyTypeSelector";
import {BtcAddressInput} from "./BtcAddressInput";
import {useStrings} from "../Hooks";
import {LoginRegisterComponent} from "../Profile/LoginRegister";
import {LNDecodedInvoice, LNInvoiceInput} from "./LNInvoiceInput";

export enum buyTypeEnum {
    balance,
    promise,
    bitcoin,
    ln
}

export interface BuyTypeSelectorData {
    type: buyTypeEnum;
    btcWallet?: string | null;
    promisePass?: string;
    decodedInvoice: LNDecodedInvoice | null;
}

export interface BuyTypeSelectorProps {
    onChanged: (data: BuyTypeSelectorData | null) => void;
    isDisabled: boolean;
    ad: Advertisement.AsObject;
    cryptoAmount?: MyDecimal;
}

export function BuyTypeSelector(props: BuyTypeSelectorProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            catalog: store.catalog
        }), []
    );
    const {authState, catalog} = useMappedState(mapState);
    const strings: IStrings = useStrings(data);

    const [buyType, setBuyType] = useState(buyTypeEnum.balance);
    const [fee, setFee] = useState<MyDecimal | null>(null);
    const [feeFiat, setFeeFiat] = useState<Decimal | null>(null);
    const [btcWallet, setBtcWallet] = useState<string | null>("");
    const [promisePassEnabled, setPromisePassEnabled] = useState(false);
    const [promisePass, setPromisePass] = useState<string | null>("");
    const [decodedInvoice, setDecodedInvoice] = useState<LNDecodedInvoice | null>(null);

    useEffect(() => {
        if (buyType === buyTypeEnum.promise && promisePassEnabled && promisePass === null) {
            props.onChanged(null)
        }
        props.onChanged({
            type: buyType,
            btcWallet: buyType === buyTypeEnum.bitcoin ? btcWallet : null,
            promisePass: promisePassEnabled ? promisePass! : "",
            decodedInvoice
        })
    }, [buyType, btcWallet, promisePassEnabled, promisePass, decodedInvoice])

    useEffect(() => {
        if (authState === AuthState.Authed) {
            setBuyType(buyTypeEnum.balance);
            return;
        }
        setBuyType(buyTypeEnum.bitcoin);
    }, [authState]);

    useEffect(() => {
        if (catalog.fee === null)
            return;
        setFee(catalog.fee);
        setFeeFiat(catalog.fee.mul(MyDecimal.FromPb(props.ad.price)));

    }, [catalog, props.ad.price]);

    if (props.ad && props.ad.isbuy) {
        return null;
    }

    if (fee === null || feeFiat == null) {
        return (
            <Card>
                <CardBody>
                    <Loading/>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardBody>
                <CardTitle>
                    <h5>{strings.title}</h5>
                </CardTitle>
                <FormGroup check>
                    <Label>
                        <Input type="radio" name="typeRadios" checked={buyType === buyTypeEnum.balance}
                               disabled={props.isDisabled}
                               onClick={() => setBuyType(buyTypeEnum.balance)}
                        />
                        {strings.balance}
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <label>
                        <Input type="radio" name="typeRadios" checked={buyType === buyTypeEnum.promise}
                               disabled={props.isDisabled}
                               onClick={() => setBuyType(buyTypeEnum.promise)}
                        />
                        {strings.promise}
                    </label>
                </FormGroup>
                <FormGroup check>
                    <label>
                        <Input type="radio" name="typeRadios" checked={buyType === buyTypeEnum.bitcoin}
                               disabled={props.isDisabled}
                               onClick={() => setBuyType(buyTypeEnum.bitcoin)}
                        />
                        {strings.bitcoin}
                    </label>
                </FormGroup>
                <FormGroup check>
                    <label>
                        <Input type="radio" name="typeRadios" checked={buyType === buyTypeEnum.ln}
                               disabled={props.isDisabled}
                               onClick={() => setBuyType(buyTypeEnum.ln)}
                        />
                        {strings.ln}
                    </label>
                </FormGroup>
                <Collapse isOpen={buyType === buyTypeEnum.bitcoin}>
                    <Row>
                        <Col>
                            <FormGroup className="py-3">
                                <BtcAddressInput onChange={addr => setBtcWallet(addr)} disabled={props.isDisabled} defaultError={true}/>
                                <FormText>
                                    {strings.formatString(strings.walletDesc, {
                                        cryptoAmount: fee.toString(),
                                        cryptoCurrency: "BTC",
                                        fiatAmount: feeFiat.toFixed(2),
                                        fiatCurrency: props.ad.fiatcurrency
                                    })
                                    }
                                </FormText>
                            </FormGroup>
                        </Col>
                    </Row>
                </Collapse>
                <Collapse isOpen={buyType === buyTypeEnum.promise}>
                    <InputPromisePass disabled={props.isDisabled}
                                      onState={state => {
                                          setPromisePassEnabled(state.passEnabled);
                                          setPromisePass(state.password);
                                      }}/>
                </Collapse>
                <Collapse isOpen={buyType === buyTypeEnum.ln && authState !== AuthState.Authed}>
                    <Alert color="warning">
                        {strings.lnWarn}
                    </Alert>
                    <LoginRegisterComponent/>
                </Collapse>
                <Collapse isOpen={buyType === buyTypeEnum.ln && authState === AuthState.Authed}>
                    <LNInvoiceInput onChange={(decoded) => {
                        setDecodedInvoice(decoded);
                    }}/>
                </Collapse>
                <Collapse isOpen={buyType === buyTypeEnum.balance && authState !== AuthState.Authed}>
                    <Alert color="warning">
                        {strings.warnAuth}
                    </Alert>
                    <LoginRegisterComponent/>
                </Collapse>
            </CardBody>
        </Card>
    );
}