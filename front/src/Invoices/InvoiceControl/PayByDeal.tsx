import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, Collapse, FormText, Input,} from "reactstrap";
import {CountriesCatalog, CurrenciesCatalog, PaymentTypesCatalog} from "../../Catalog";
import {data as dataS, myMap} from "../../localization/PaymentTypes"
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {Loading} from "../../Loading";
import {useDispatch, useMappedState} from "redux-react-hook";
import {LastSearchSell, LoadDeals, NewInvoicesPayment} from "../../redux/actions";
import {
    GetInvoiceSuitableAdvertisementResponse,
    GetInvoiceSuitableAdvertisementsRequest,
    Invoice,
    InvoicePayment,
    PayInvoiceByBestDealRequest
} from "../../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {Redirect} from "react-router-dom";
import {LoadingBtn} from "../../LoadingBtn";
import {errors} from "../../localization/Errors";
import {data, IStrings} from "../../localization/Invoices/PayByDeal";
import Decimal from "decimal.js";
import {MyDecimal} from "../../MyDecimal";
import {IAdsList} from "../../MainPages/SelectAd";
import {useStrings} from "../../Hooks";


export interface IPayByDealProps {
    invoice: Invoice.AsObject,
    pieces: number | null,
    bestPriceChanged: (price: Decimal | null, currency: string) => void;
}

export function PayByDeal(props: IPayByDealProps) {
    const strings: IStrings = useStrings(data);
    const paymentStrings=new myMap(dataS);
    const mapState = useCallback(
        (store: IStore) => ({
            preload: store.preload.lastSearch,
            lastSearch: store.profile.LastSearchSell,
            authState: store.auth.state
        }), []
    );
    const {preload, lastSearch, authState} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [country, setCountry] = useState("");
    const [currency, setCurrency] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [payBestDeal, setPayBestDeal] = useState(false);
    const [payBetDealRunning, setPayBetDealRunning] = useState(false);
    const [listAds, setListAds] = useState(false);
    const [listAdsRunning, setListAdsRunning] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [redirectState, setRedirectState] = useState<IAdsList | null>()
    const [bestPrice, setBestPrice] = useState<Decimal | null>(null);
    const [getBestPriceRunning, setGetBestPriceRunning] = useState(false);

    useEffect(() => {
        if (lastSearch === null || lastSearch === undefined) {
            return;
        }
        setCountry(lastSearch.country);
        setCurrency(lastSearch.currency);
        setPaymentType(lastSearch.paymentType);
    }, [lastSearch])

    useEffect(() => {
        async function f() {
            if (country === "" || currency === "" || paymentType === "" || authState === AuthState.NotAuthed || getBestPriceRunning || !props.pieces) {
                return;
            }
            setGetBestPriceRunning(true);
            let req = new GetInvoiceSuitableAdvertisementsRequest();
            req.setCount(1);
            req.setSkip(0);
            req.setCountry(country);
            req.setCurrency(currency);
            req.setPaymenttype(paymentType);
            req.setInvoiceid(props.invoice.id);
            req.setPieces(props.pieces);

            try {
                let resp = await TradeGrpcRunAsync<GetInvoiceSuitableAdvertisementResponse.AsObject>(tradeApiClient.getInvoiceSuitableAdvertisements, req, getToken());
                if (resp.advertisementsList.length === 0) {
                    setError("No suitable advertisement found.");
                    setBestPrice(null);
                    props.bestPriceChanged(null, currency);
                } else {
                    let ad = resp.advertisementsList[0];
                    let p = MyDecimal.FromPb(ad.price);
                    setBestPrice(p);
                    setError("");
                    props.bestPriceChanged(p, currency);
                }
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetBestPriceRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [country, currency, paymentType, props.invoice.id, props.pieces, authState, getBestPriceRunning])

    useEffect(() => {
        async function f() {
            if (!payBestDeal ||
                country === "" ||
                currency === "" ||
                paymentType === "" ||
                lastSearch === null ||
                !props.pieces ||
                authState === AuthState.NotAuthed
            ) {
                return;
            }
            setPayBestDeal(false);
            setPayBetDealRunning(true);
            setError("");
            dispatch(LastSearchSell({
                ...lastSearch,
                country,
                currency,
                paymentType
            }));

            let req = new PayInvoiceByBestDealRequest();
            req.setCountry(country);
            req.setCurrency(currency);
            req.setPaymenttype(paymentType);
            req.setInvoiceid(props.invoice.id);
            req.setPieces(props.pieces);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceByBestDeal, req, getToken());
                dispatch(NewInvoicesPayment(resp));
                dispatch(LoadDeals([resp.deal!]));
                setRedirect("/deal/" + resp.deal!.id.toString());
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setPayBetDealRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [payBestDeal, authState, country, currency, dispatch, lastSearch, paymentType, props.invoice.id, props.pieces])
    useEffect(() => {
        async function f() {
            if (!listAds || authState === AuthState.NotAuthed || listAdsRunning || !props.pieces) {
                return;
            }
            setListAds(false);
            setListAdsRunning(true);
            setError("");
            setRedirectState(null);

            let req = new GetInvoiceSuitableAdvertisementsRequest();
            req.setCount(100);
            req.setSkip(0);
            req.setCountry(country);
            req.setCurrency(currency);
            req.setPaymenttype(paymentType);
            req.setInvoiceid(props.invoice.id);
            req.setPieces(props.pieces);

            try {
                let resp = await TradeGrpcRunAsync<GetInvoiceSuitableAdvertisementResponse.AsObject>(tradeApiClient.getInvoiceSuitableAdvertisements, req, getToken());
                if (resp.advertisementsList.length === 0) {
                    setError("No suitable advertisement found.");
                } else {
                    setRedirectState({
                        invoice: props.invoice,
                        pieces: props.pieces,
                        adList: resp.advertisementsList,
                        invoiceId: props.invoice.id
                    });
                    setRedirect("/invoices/selectAd/")
                }
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setListAdsRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, listAds, country, currency, listAdsRunning, paymentType, props.invoice, props.pieces]);

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
        <div>
            <Button outline={!isOpen} className="btn-block" color="primary" onClick={() => setIsOpen(!isOpen)}>
                {strings.title}
            </Button>
            <Collapse isOpen={isOpen}>
                <Card className="mt-2">
                    <CardBody className="pt-1">
                        {strings.info}
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
                                        <option key={key} value={key}>{CountriesCatalog.get(key)}</option>
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
                            {strings.fiat}
                        </FormText>
                        <Input type="select" className="mt-2" value={paymentType}
                               onChange={event => setPaymentType(event.currentTarget.value)}>
                            {getPaymentTypes()}
                        </Input>
                        <FormText color="muted" className="mt-0">
                            {strings.paymentType}
                        </FormText>
                        {error !== "" ?
                            <Alert className="mt-3 mb-0" color="danger">{errors(error)}</Alert>
                            : null
                        }
                        <LoadingBtn loading={payBetDealRunning || getBestPriceRunning} outline color="success"
                                    className="btn-block mt-3"
                                    disabled={!getBestPriceRunning && bestPrice === null}
                                    onClick={() => setPayBestDeal(true)}>
                            {bestPrice === null ? strings.bestDeal : `${strings.bestDeal} ${bestPrice.toString()} ${currency}/BTC`}
                        </LoadingBtn>
                        <FormText color="muted">
                            {strings.bestInfo}
                        </FormText>
                        <LoadingBtn loading={listAdsRunning || getBestPriceRunning} outline color="success"
                                    className="btn-block mt-3"
                                    disabled={!getBestPriceRunning && bestPrice === null}
                                    onClick={() => setListAds(true)}>
                            {strings.selectAd}
                        </LoadingBtn>
                        <FormText color="muted">
                            {strings.selectAdInfo}
                        </FormText>
                    </CardBody>
                </Card>
            </Collapse>
        </div>
    )
}