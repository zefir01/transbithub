import * as React from "react";
import {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
import {Decimal} from "decimal.js";
import {data, IStrings} from "../../localization/DealPage/Calculator"
import {MyDecimal} from "../../MyDecimal";
import {Advertisement, Deal} from "../../Protos/api_pb";
import {useStrings} from "../../Hooks";

export enum DealType {
    AnonBuy,
    OwnDeal,
    Auth,
    NeedAuth,
    AdDeleted,
    Error,
    SellPromise
}

export interface CalculatorParams {
    fiatCurrency: string;
    title?: string,
    isbuy: boolean,
    price: MyDecimal
}

export interface ICalculatorProps {
    ad?: Advertisement.AsObject;
    deal?: Deal.AsObject | null;
    params?: CalculatorParams;
    price?: MyDecimal;
    defaultAmount?: MyDecimal;
    className?: string,
    valueChanged?: (fiatAmount: Decimal | null, cryptoAmount: Decimal | null) => void,
    error?: string,
}

export const Calculator = (props: ICalculatorProps) => {
    const [fiat, setFiat] = useState("");
    const [crypto, setCrypto] = useState("");
    const [cryptoError, setCryptoError] = useState(false);
    const [fiatError, setFiatError] = useState(false);
    const strings: IStrings = useStrings(data);

    function getParams(): CalculatorParams {
        if (props.params) {
            return props.params;
        }
        let ad: Advertisement.AsObject;
        if (props.ad) {
            ad = props.ad;
        }
        if (props.deal?.advertisement) {
            ad = props.deal.advertisement;
        }
        return {
            fiatCurrency: ad!.fiatcurrency,
            isbuy: ad!.isbuy,
            price: MyDecimal.FromPb(ad!.price)
        }
    }

    function CalcFiat(value: string, dontNotify=false) {
        try {
            setFiat(value);
            let val = new Decimal(value);
            let cr = val.dividedBy(getParams().price);
            cr = cr.toDecimalPlaces(8, Decimal.ROUND_UP);
            setCrypto(cr.toString());
            setFiatError(false);
            setCryptoError(false);
            if (props.ad && (MyDecimal.FromPb(props.ad.minamount).greaterThan(val) || MyDecimal.FromPb(props.ad.maxamountcalculated).lessThan(val))) {
                setFiatError(true);
                setCryptoError(true);
                if (props.valueChanged !== undefined && !dontNotify) {
                    props.valueChanged(null, null);
                }
                return;
            }
            if (props.valueChanged !== undefined && !dontNotify) {
                props.valueChanged(new MyDecimal(val), new MyDecimal(cr));
            }
        } catch (e) {
            setCrypto("");
            setFiatError(true);
            if (props.valueChanged !== undefined && !dontNotify) {
                props.valueChanged(null, null);
            }
        }
    }

    useEffect(() => {
        if (props.params?.price && fiat !== "") {
            CalcFiat(fiat, true);
        }
    }, [props.params?.price, fiat]);

    function CalcCrypto(value: string) {
        try {
            setCrypto(value);
            let val = new Decimal(value);
            let f = getParams().price.mul(val);
            f = f.toDecimalPlaces(2, Decimal.ROUND_UP);
            setFiat(f.toString());
            setCryptoError(false);
            setFiatError(false);
            if (props.ad && (MyDecimal.FromPb(props.ad.minamount).greaterThan(f) || MyDecimal.FromPb(props.ad.maxamountcalculated).lessThan(f))) {
                setFiatError(true);
                setCryptoError(true);
                if (props.valueChanged !== undefined) {
                    props.valueChanged(null, null);
                }
                return;
            }
            if (props.valueChanged !== undefined) {
                props.valueChanged(new MyDecimal(f), new MyDecimal(val));
            }
        } catch (e) {
            setFiat("");
            setCryptoError(true);
            console.log(e.message);
            if (props.valueChanged !== undefined) {
                props.valueChanged(null, null);
            }
        }
        setCrypto(value);
    }

    useEffect(() => {
        if (fiat === "")
            return;
        try {
            let val = new Decimal(fiat);
            let cr = val.dividedBy(getParams().price);
            cr = cr.toDecimalPlaces(8, Decimal.ROUND_UP);
            setCrypto(cr.toString());
            setFiatError(false);
            setCryptoError(false);
        } catch (e) {
            setFiatError(true);
            console.log(e.message);
        }
    }, [props.ad?.price, props.deal?.advertisement?.price]);


    useEffect(() => {
        if (props.deal) {
            setFiat(MyDecimal.FromPb(props.deal.fiatamount).toDecimalPlaces(2).toString());
            setCrypto(MyDecimal.FromPb(props.deal.cryptoamount).toDecimalPlaces(8).toString());
        } else if (props.defaultAmount) {
            CalcFiat(props.defaultAmount.toString(), true);
        }

    }, [props.deal]);


    return (
        <Card className={props.className !== undefined ? props.className : "my-3"}>
            <CardBody>
                <Row>
                    <Col>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText
                                    className="bg-info text-white font-weight-bold">{getParams().fiatCurrency}</InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="0.00" value={fiat}
                                   name="fiatAmount" autoComplete="off"
                                   id="fiatAmount"
                                   invalid={fiatError}
                                   disabled={props.deal !== null && props.deal !== undefined}
                                   onInput={event => {
                                       CalcFiat(event.currentTarget.value);
                                   }}/>
                        </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText
                                    className="bg-info text-white font-weight-bold">BTC</InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="0.00" value={crypto} invalid={cryptoError}
                                   name="cryptoAmount" autoComplete="off" id="cryptoAmount"
                                   disabled={props.deal !== null && props.deal !== undefined}
                                   onInput={event => {
                                       CalcCrypto(event.currentTarget.value);
                                   }}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );

};