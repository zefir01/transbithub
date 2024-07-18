import * as React from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Collapse,
    FormText,
    Input,
    Row
} from "reactstrap";
import {useCallback, useEffect, useState} from "react";
import {Col6_12} from "../global";
import {LoadingBtn} from "../LoadingBtn";
import {CountriesCatalog, CurrenciesCatalog, PaymentTypesCatalog} from "../Catalog";
import {data as dataS, myMap} from "../localization/PaymentTypes";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {
    Balance, Deal,
    GetPromiseSuitableAdvertisementsRequest,
    GetPromiseSuitableAdvertisementsResponse,
    PromiseSellByBestDealRequest, PromiseToBalanceRequest
} from "../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {MyDecimal} from "../MyDecimal";
import Decimal from "decimal.js";
import {errors} from "../localization/Errors";
import {data as data1, IStrings} from "../localization/Promises/ReceivePromise"
import {BalanceUpdated, LoadDeals} from "../redux/actions";
import {IAdsList} from "../MainPages/SelectAd";
import {Redirect} from "react-router-dom";
import {PromiseTextArea} from "./PromiseTextArea";
import {useStrings} from "../Hooks";


export function ReceivePromise() {
    const strings: IStrings = useStrings(data1);
    const paymentStrings=new myMap(dataS);
    const mapState = useCallback(
        (store: IStore) => ({
            preload: store.preload.lastSearch,
            lastSearch: store.profile.LastSearchSell,
            authState: store.auth.state,
        }), []
    );
    const {preload, lastSearch, authState} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [data, setData] = useState("");
    const [sellOpen, setSellOpen] = useState(false);
    const [country, setCountry] = useState("");
    const [currency, setCurrency] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [pass, setPass] = useState("");
    const [needPass, setNeedPass] = useState(false);
    const [bestPrice, setBestPrice] = useState<Decimal | null>(null);
    const [getBestPriceRunning, setGetBestPriceRunning] = useState(false);
    const [adError, setAdError] = useState("");
    const [formatError, setFormatError] = useState(false);
    const [getBestPrice, setGetBestPrice] = useState(false);
    const [fiatAmount, setFiatAmount] = useState<MyDecimal | null>(null);
    const [toBalance, setToBalance] = useState(false);
    const [toBalanceRunning, setToBalanceRunning] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [redirectState, setRedirectState] = useState<IAdsList | null>();
    const [redirect, setRedirect] = useState("");
    const [showAdList, setShowAdList] = useState(false);
    const [gettingAds, setGettingAds] = useState(false);
    const [sellBestDeal, setSellBestDeal] = useState(false);
    const [sellBestDealRunning, setSellBestDealRunning] = useState(false);


    useEffect(() => {
        if (lastSearch === null || lastSearch === undefined) {
            return;
        }
        setCountry(lastSearch.country);
        setCurrency(lastSearch.currency);
        setPaymentType(lastSearch.paymentType);
    }, [lastSearch])

    useEffect(() => {
        if (country === "" || currency === "" || paymentType === "" || authState === AuthState.NotAuthed || getBestPriceRunning
            || data === "" || (needPass && pass === "") || !getBestPrice
        ) {
            return;
        }
        setGetBestPriceRunning(true);
        setSuccess("");

        async function f() {
            let req = new GetPromiseSuitableAdvertisementsRequest();
            req.setCount(1);
            req.setSkip(0);
            req.setCountry(country);
            req.setCurrency(currency);
            req.setPaymenttype(paymentType);
            req.setPromise(data);
            req.setPassword(pass);

            try {
                let resp = await TradeGrpcRunAsync<GetPromiseSuitableAdvertisementsResponse.AsObject>(tradeApiClient.getPromiseSuitableAdvertisements, req, getToken());
                if (resp.advertisementsList.length === 0) {
                    setAdError("No suitable advertisement found.");
                    setBestPrice(null);
                    setGetBestPrice(false);
                } else {
                    let ad = resp.advertisementsList[0];
                    let p = MyDecimal.FromPb(ad.price);
                    let fiat = MyDecimal.FromPb(resp.fiatamountsList[0])
                    setBestPrice(p);
                    setFiatAmount(fiat);
                    setAdError("");
                }
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setAdError(e.message);
                }
            } finally {
                setGetBestPriceRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [country, currency, paymentType, authState, data, needPass, pass, getBestPrice, getBestPriceRunning])

    useEffect(() => {
        async function f() {
            if (country === "" || currency === "" || paymentType === "" || authState === AuthState.NotAuthed || gettingAds
                || data === "" || (needPass && pass === "") || !showAdList
            ) {
                return;
            }
            setGettingAds(true);
            setSuccess("");
            setShowAdList(false);

            let req = new GetPromiseSuitableAdvertisementsRequest();
            req.setCount(100);
            req.setSkip(0);
            req.setCountry(country);
            req.setCurrency(currency);
            req.setPaymenttype(paymentType);
            req.setPromise(data);
            req.setPassword(pass);

            try {
                let resp = await TradeGrpcRunAsync<GetPromiseSuitableAdvertisementsResponse.AsObject>(tradeApiClient.getPromiseSuitableAdvertisements, req, getToken());
                if (resp.advertisementsList.length === 0) {
                    setAdError("No suitable advertisement found.");
                    setBestPrice(null);
                    setGetBestPrice(false);
                } else {
                    setAdError("");
                    setRedirectState({
                        adList: resp.advertisementsList,
                        promise: data,
                        promiseAmount: MyDecimal.FromPb(resp.promiseamount).toNumber()
                    });
                    setRedirect("/promises/selectAd/");
                }
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setAdError(e.message);
                }
            } finally {
                setGettingAds(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [country, currency, paymentType, authState, data, needPass, pass, showAdList, gettingAds])

    useEffect(() => {
        if (authState !== AuthState.Authed || data === "" || (needPass && pass === "") || !toBalance || toBalanceRunning) {
            return;
        }
        setToBalance(false);
        setToBalanceRunning(true);

        async function f() {
            let req = new PromiseToBalanceRequest();
            req.setPromise(data);
            req.setPassword(pass);

            try {
                let resp = await TradeGrpcRunAsync<Balance.AsObject>(tradeApiClient.promiseToBalance, req, getToken());
                dispatch(BalanceUpdated(resp));
                setData("");
                setPass("");
                setNeedPass(false);
                setBestPrice(null);
                setFiatAmount(null);
                setSuccess(strings.toBalanceOk);
                setError("");
            } catch (e) {
                setSuccess("");
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setToBalanceRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, data, pass, needPass, toBalance, dispatch, strings.toBalanceOk, toBalanceRunning]);

    useEffect(() => {
        if (country === "" || currency === "" || paymentType === "" || authState === AuthState.NotAuthed || sellBestDealRunning
            || data === "" || (needPass && pass === "") || !sellBestDeal
        ) {
            return;
        }

        setSellBestDeal(false);
        setSellBestDealRunning(true);

        async function f() {
            let req = new PromiseSellByBestDealRequest();
            req.setCountry(country);
            req.setCurrency(currency);
            req.setPaymenttype(paymentType);
            req.setPromise(data);
            req.setPassword(pass);

            try {
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.promiseSellByBestDeal, req, getToken());
                dispatch(LoadDeals([resp]));
                setRedirect("/deal/" + resp.id);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setAdError(e.message);
                }
            } finally {
                setSellBestDealRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [country, currency, paymentType, authState, data, needPass, pass, sellBestDeal, dispatch, sellBestDealRunning]);

    function getPaymentTypes() {
        if (country === null)
            return null;
        let pt = PaymentTypesCatalog.get(country);
        if (pt === undefined)
            return null;
        return (
            <React.Fragment>
                {
                    pt.map(p => {
                        return (<option key={p} value={p}>{paymentStrings.get(p)}</option>);
                    })
                }
            </React.Fragment>
        );
    }

    if (redirect !== "") {
        if (redirectState !== null) {
            return <Redirect push to={{
                pathname: redirect,
                state: redirectState
            }}/>;
        } else {
            return <Redirect push to={redirect}/>;
        }
    }

    if (!preload) {
        return <Loading className="mt-3"/>
    }

    return (
        <>
            <Row>
                <Col {...Col6_12}>
                    <PromiseTextArea onChange={(value, isFormatError, needPass)=>{
                        setData(value);
                        setBestPrice(null);
                        setFiatAmount(null);
                        setFormatError(isFormatError);
                        setNeedPass(needPass);
                    }} minRows={23} value={data}/>

                </Col>
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <Collapse isOpen={needPass}>
                                <Input invalid={pass === ""} type="password" placeholder={strings.passPh}
                                       className="mb-3"
                                       onChange={event => {
                                           setPass(event.currentTarget.value);
                                           setBestPrice(null);
                                           setFiatAmount(null);
                                       }}
                                />
                            </Collapse>
                            <Alert isOpen={success !== ""} color="success"
                                   className="text-center">{success}</Alert>
                            <Alert isOpen={error !== ""} color="danger" className="text-center">
                                {errors(error)}
                            </Alert>
                            {authState === AuthState.Authed ?
                                <LoadingBtn className="btn-block" color="success" outline
                                            disabled={data === "" || formatError || (needPass && pass === "")}
                                            loading={toBalanceRunning}
                                            onClick={() => setToBalance(true)}>
                                    {strings.toBalance}
                                </LoadingBtn>
                                : null
                            }
                            <Button className="btn-block" color="primary" outline={!sellOpen}
                                    onClick={() => setSellOpen(!sellOpen)}>
                                {strings.sell}
                            </Button>
                            <Collapse isOpen={sellOpen}>
                                <Card className="mt-1">
                                    <CardBody>
                                        {strings.sellInfo}
                                        <Input type="select" className="mt-2" value={country}
                                               onChange={event => {
                                                   setCountry(event.currentTarget.value);
                                                   let cur = CurrenciesCatalog.get(event.currentTarget.value);
                                                   if (cur !== undefined)
                                                       setCurrency(cur);
                                                   let pt = PaymentTypesCatalog.get(event.currentTarget.value);
                                                   if (pt !== undefined)
                                                       setPaymentType(pt[0]);
                                               }}
                                        >
                                            {
                                                Array.from(CountriesCatalog.keys()).sort().map(key => {
                                                    return (
                                                        <option key={key}
                                                                value={key}>{CountriesCatalog.get(key)}</option>
                                                    )
                                                })
                                            }
                                        </Input>
                                        <FormText color="muted" className="mt-0">
                                            {strings.country}
                                        </FormText>
                                        <Input type="select" className="mt-2" value={currency}
                                               onChange={event => setCurrency(event.currentTarget.value)}>
                                            {
                                                Array.from(new Set(CurrenciesCatalog.values())).sort().map(val => {
                                                    return (
                                                        <option key={val} value={val}>{val}</option>
                                                    )
                                                })
                                            }
                                        </Input>
                                        <FormText color="muted" className="mt-0">
                                            {strings.currency}
                                        </FormText>
                                        <Input type="select" className="mt-2" value={paymentType}
                                               onChange={event => setPaymentType(event.currentTarget.value)}>
                                            {getPaymentTypes()}
                                        </Input>
                                        <FormText color="muted" className="mt-0">
                                            {strings.paymentType}
                                        </FormText>
                                        <Alert color="danger" isOpen={adError !== ""}>{errors(adError)}</Alert>
                                        {!bestPrice || !fiatAmount ?
                                            <LoadingBtn outline className="mt-3 btn-block" color="primary"
                                                        disabled={data === "" || formatError || (needPass && pass === "")}
                                                        onClick={() => setGetBestPrice(true)}
                                                        loading={getBestPriceRunning}>
                                                {strings.getPrice}
                                            </LoadingBtn>
                                            :
                                            <Card className="text-center border-success">
                                                <CardBody>
                                                    <span className="d-block">
                                                        {strings.price} {bestPrice.toString() + " " + currency + "/BTC"}
                                                    </span>
                                                    <span className="d-block">
                                                        {strings.fiat} {fiatAmount.toString()} {currency}
                                                    </span>
                                                </CardBody>
                                            </Card>
                                        }
                                        <LoadingBtn outline className="mt-3 btn-block" color="success"
                                                    onClick={() => setSellBestDeal(true)}
                                                    disabled={data === "" || formatError || (needPass && pass === "")}
                                                    loading={sellBestDealRunning}>
                                            {strings.sellBestPrice}
                                        </LoadingBtn>
                                        <LoadingBtn outline className="mt-2 btn-block" color="primary"
                                                    disabled={data === "" || formatError || (needPass && pass === "")}
                                                    onClick={() => setShowAdList(true)}
                                                    loading={gettingAds}>
                                            {strings.listAds}
                                        </LoadingBtn>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}