import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Collapse,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
import {DefaultCurrency} from "../MainPages/DefaultCurrency";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {Decimal} from "decimal.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LoadingBtn} from "../LoadingBtn";
import {NavLink} from "react-router-dom";
import {AutoPriceExample} from "./AutoPriceExample";
import {DecimalInput} from "../DecimalInput";
import humanizeDuration from "humanize-duration";
import {errors} from "../localization/Errors";
import {autoPriceFee} from "../global";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {BuyAutoPriceRecalcsRequest, Invoice} from "../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {ToMeInvoicesLoaded} from "../redux/actions";
import {data, IStrings} from "../localization/Options/AutoPrice";
import {useStrings} from "../Hooks";

library.add(fas);
const plusLookup: IconLookup = {prefix: 'fas', iconName: 'plus'};
const plusIconDefinition: IconDefinition = findIconDefinition(plusLookup);
const minusLookup: IconLookup = {prefix: 'fas', iconName: 'minus'};
const minusIconDefinition: IconDefinition = findIconDefinition(minusLookup);

export function AutoPrice() {
    const mapState = useCallback(
        (store: IStore) => ({
            currency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables,
            authState: store.auth.state,
            lang: store.lang.Lang
        }), []
    );
    const {currency, vars, authState, lang} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [recalcs, setRecalcs] = useState<Decimal | null>(new Decimal(1000));
    const [ads, setAds] = useState<Decimal | null>(new Decimal(1));
    const [period, setPeriod] = useState(30);
    const [error, setError] = useState("");
    const [hours, setHours] = useState(24);
    const [buy, setBuy] = useState(false);
    const [buyRunning, setBuyRunning] = useState(false);
    const [invoice, setInvoice] = useState<Invoice.AsObject | null>(null);

    const strings: IStrings=useStrings(data);

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

    useEffect(() => {
        setRecalcs(new Decimal(1000));
        changeHours(1000, period, new Decimal(1));
    }, [period]);

    function getSeconds() {
        if (!recalcs || !ads) {
            return 0;
        }
        let val = Math.floor(period * recalcs.toNumber() / ads.toNumber() / 10);
        return val * 10;
    }

    useEffect(() => {
        if (!buy || buyRunning || !recalcs || authState !== AuthState.Authed) {
            return;
        }
        setBuyRunning(true);
        setBuy(false);
        setError("");

        async function f() {
            let req = new BuyAutoPriceRecalcsRequest();
            req.setRecalcs(recalcs!.toNumber());

            try {
                let resp = await TradeGrpcRunAsync<Invoice.AsObject>(tradeApiClient.buyAutoPriceRecalcs, req, getToken());
                setInvoice(resp);
                dispatch(ToMeInvoicesLoaded([resp]));
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setBuyRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [buy, recalcs, authState, buyRunning, dispatch])

    function changeHours(recalcs: number, period: number, ads: Decimal) {
        let newVal = period * recalcs / 3600 / ads.toNumber();
        if (newVal < 1) {
            setHours(1);
        } else {
            setHours(Math.round(newVal));
        }
    }

    function changeRecalcs(hours: number, ads: Decimal) {
        let seconds = hours * 60 * 60;
        let newVal = seconds / period * ads.toNumber();
        setRecalcs(new Decimal(newVal).toDecimalPlaces(0));
    }

    function getPrice() {
        if (!recalcs) {
            return "";
        }
        let btc = recalcs.mul(autoPriceFee).toDecimalPlaces(8);
        let vprice = vars!.get(`AVG_${currency}`)!;
        return `${btc.toString()} BTC / ~${vprice.mul(btc).toDecimalPlaces(2).toString()} ${currency}`;
    }

    if (!vars || vars.size === 0 || !currency) {
        return <Loading/>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.title}</h1>
                </Col>
                <Col className="col-auto">
                    <DefaultCurrency/>
                </Col>
            </Row>
            <Row>
                <Col>
                    {strings.info1}
                    <br/>
                    {strings.info2}
                    <br/>
                    {strings.info3}
                    <br/>
                    {strings.info4}
                    <br/>
                    {strings.info5}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="mt-3">
                        <CardHeader>
                            <h5>{strings.title1}</h5>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <InputGroup>
                                        <InputGroupAddon addonType={"prepend"}>
                                            <InputGroupText>
                                                {strings.adsCount}
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <DecimalInput value={ads} onInput={val => {
                                            setAds(val);
                                            if (val && recalcs !== null) {
                                                changeHours(recalcs.toNumber(), period, val);
                                            }
                                        }}
                                                      minimalValue={1}
                                                      intOnly={true}
                                        />
                                        <InputGroupAddon addonType="append">
                                            <Button color="secondary" outline
                                                    onClick={() => {
                                                        let newVal;
                                                        if (ads === null) {
                                                            newVal = new Decimal(1);
                                                        } else if (ads.eq(1)) {
                                                            return;
                                                        } else {
                                                            newVal = ads.minus(1);
                                                        }
                                                        setAds(newVal);
                                                        if (recalcs !== null && newVal) {
                                                            changeHours(recalcs.toNumber(), period, newVal);
                                                        }
                                                    }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={minusIconDefinition}/>
                                            </Button>
                                            <Button color="secondary" outline
                                                    onClick={() => {
                                                        let newVal;
                                                        if (ads === null) {
                                                            newVal = new Decimal(1);
                                                        } else {
                                                            newVal = ads.add(1);
                                                        }
                                                        setAds(newVal);
                                                        if (recalcs !== null && newVal) {
                                                            changeHours(recalcs.toNumber(), period, newVal);
                                                        }
                                                    }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={plusIconDefinition}/>
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <InputGroupAddon addonType={"prepend"}>
                                            <InputGroupText>
                                                {strings.calcsCount}
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <DecimalInput value={recalcs}
                                                      onInput={(val) => {
                                                          setRecalcs(val);
                                                          if (val !== null && ads !== null) {
                                                              changeHours(val!.toNumber(), period, ads);
                                                          }
                                                      }}
                                                      intOnly={true}
                                                      minimalValue={100}
                                        />
                                        <Button color="secondary" outline
                                                onClick={() => {
                                                    let newVal;
                                                    if (recalcs === null) {
                                                        newVal = new Decimal(1000);
                                                    } else if (recalcs.minus(1000).lessThan(100)) {
                                                        return;
                                                    } else {
                                                        newVal = recalcs.minus(1000);
                                                    }
                                                    setRecalcs(newVal);
                                                    if (ads !== null) {
                                                        changeHours(newVal.toNumber(), period, ads);
                                                    }
                                                }}
                                        >
                                            -1000
                                        </Button>
                                        <InputGroupAddon addonType="append">
                                            <Button color="secondary" outline
                                                    onClick={() => {
                                                        let newVal;
                                                        if (recalcs === null) {
                                                            newVal = new Decimal(1000);
                                                        } else {
                                                            newVal = recalcs.add(1000);
                                                        }
                                                        setRecalcs(newVal);
                                                        if (ads !== null) {
                                                            changeHours(newVal.toNumber(), period, ads);
                                                        }
                                                    }}
                                            >
                                                +1000
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label className="mt-3">{strings.period + duration(period)}</label>
                                    <Input type="range" className="custom-range" min="10" max="3600" step="10"
                                           value={period}
                                           onInput={event => {
                                               let newVal = parseInt(event.currentTarget.value);
                                               setPeriod(newVal);
                                               if (recalcs && ads) {
                                                   changeHours(recalcs.toNumber(), newVal, ads);
                                               }
                                           }}/>
                                    <label
                                        className="mt-3">{strings.time + duration(getSeconds())}
                                    </label>
                                    <Input type="range" className="custom-range" min="1" max="720" step="1"
                                           value={hours}
                                           onInput={event => {
                                               let newVal = parseInt(event.currentTarget.value);
                                               setHours(newVal);
                                               if (ads) {
                                                   changeRecalcs(newVal, ads);
                                               }
                                           }}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-center mt-3">
                                    <span className="font-weight-bold">{strings.amount}</span>
                                    {getPrice()}
                                </Col>
                            </Row>
                            <Row className="justify-content-center mt-3">
                                <Col className="col-auto">
                                    <LoadingBtn disabled={!recalcs} loading={buyRunning} color="primary"
                                                onClick={() => setBuy(true)}
                                    >
                                        {strings.getInvoice}
                                    </LoadingBtn>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col className="col-auto">
                                    <Collapse isOpen={invoice !== null}>
                                        <Card className="mt-1 border-info">
                                            <CardBody>
                                                <span className="text-center d-block">
                                                    {strings.you}
                                                    <NavLink to={"/invoices/invoice/" + invoice?.id}>
                                                        {strings.invoice + invoice?.id}
                                                    </NavLink>
                                                </span>
                                                <span className="small text-secondary text-center d-block">
                                                    {strings.invoiceInfo}
                                                </span>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </Col>
                            </Row>
                            <Alert className="mt-1" isOpen={error !== ""} color="danger">{errors(error)}</Alert>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AutoPriceExample/>
                </Col>
            </Row>
        </Container>
    )
}