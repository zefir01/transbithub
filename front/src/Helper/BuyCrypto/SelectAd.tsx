import React, {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, CardFooter, Col, Fade, Row} from "reactstrap";
import {LoadDeals, NewInvoicesPayment, SetCurrentPath, SetDealId, SetInvoicePaymentId} from "../../redux/actions";
import {Redirect} from "react-router-dom";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, HelperBuyResultType, HelperOperation, IStore} from "../../redux/store/Interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {Col6_12} from "../../global";
import {MultilineContent} from "../../MultilineContent";
import {
    Advertisement,
    CreateDealRequest,
    Deal,
    FindAdvertisementsRequest,
    FindAdvertisementsResponse,
    GetAdvertisementsByIdRequest,
    GetInvoiceSuitableAdvertisementResponse,
    GetInvoiceSuitableAdvertisementsRequest,
    GetPromiseSuitableAdvertisementsRequest,
    GetPromiseSuitableAdvertisementsResponse,
    InvoicePayment,
    PayInvoiceByDealRequest,
    PromiseSellByDealRequest
} from "../../Protos/api_pb";
import {Loading} from "../../Loading";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {MyDecimal} from "../../MyDecimal";
import humanizeDuration from "humanize-duration";
import {errors} from "../../localization/Errors";
import {LoadingBtn} from "../../LoadingBtn";
import {data, IStrings} from "../../localization/Helper/BuyCrypto/SelectAd";
import {useStrings} from "../../Hooks";

library.add(far);
library.add(fab);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function SelectAd() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            authState: store.auth.state,
            lang: store.lang.Lang,
            userId: store.profile.UserId
        }), []
    );
    const {state, authState, lang, userId} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [ads, setAds] = useState<Advertisement.AsObject[] | null>(null);
    const [getRunning, setGetRunning] = useState(false);
    const [error, setError] = useState("");
    const [isShow, setIsShow] = useState(true);
    const [currentAd, setCurrentAd] = useState(0);
    const [createDeal, setCreateDeal] = useState(false);
    const [createDealRunning, setCreateDealRunning] = useState(false);

    useEffect(() => {
        if (state.currentPath === "") {
            setRedirect("/helper/selectOperation");
        }
    }, [state.currentPath]);

    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/selectAd"));
    }, [dispatch, state.currentPath]);

    useEffect(() => {
        async function f() {
            if (ads !== null ||
                getRunning ||
                state.country === "" ||
                state.operation !== HelperOperation.BuyBtc ||
                authState === AuthState.NotAuthed) {
                return;
            }
            setGetRunning(true);
            setError("");

            let req = new FindAdvertisementsRequest();
            req.setIsbuy(false);
            req.setCountry(state.country);
            req.setCurrency(state.currency);
            req.setPaymenttype(state.paymentType);
            if (state.amountIsFiat) {
                req.setFiatamount(state.amount?.ToPb());
            } else {
                req.setCryptoamount(state.amount?.ToPb());
            }
            req.setTake(100);
            req.setSkip(0);

            try {
                let resp = await TradeGrpcRunAsync<FindAdvertisementsResponse.AsObject>(tradeApiClient.findAdvertisements, req, getToken());
                setAds(resp.advertisementsList.filter(p => p.owner?.id !== userId));
            } catch (e) {
                setAds([]);
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [ads, getRunning, state.amount, state.country, state.currency, state.paymentType, state.amountIsFiat, authState, state.operation, userId]);

    useEffect(() => {
        async function f() {
            if (ads !== null ||
                getRunning ||
                !state.adId ||
                authState === AuthState.NotAuthed) {
                return;
            }
            setGetRunning(true);
            setError("");

            let req = new GetAdvertisementsByIdRequest();
            req.setId(state.adId);

            try {
                let resp = await TradeGrpcRunAsync<Advertisement.AsObject>(tradeApiClient.getAdvertisementsById, req, getToken());
                setAds([resp]);
            } catch (e) {
                setAds([]);
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [ads, getRunning, state.amount, state.country, state.currency, state.paymentType, state.amountIsFiat, authState, state.operation, state.adId]);

    useEffect(() => {
        async function f() {
            if (ads ||
                authState === AuthState.NotAuthed ||
                getRunning ||
                !state.pieces ||
                state.operation !== HelperOperation.PayInvoice ||
                !state.invoiceId
            ) {
                return;
            }
            setGetRunning(true);
            setAds(null);
            setError("");

            let req = new GetInvoiceSuitableAdvertisementsRequest();
            req.setCount(100);
            req.setSkip(0);
            req.setCountry(state.country);
            req.setCurrency(state.currency);
            req.setPaymenttype(state.paymentType);
            req.setInvoiceid(state.invoiceId);
            req.setPieces(state.pieces);

            try {
                let resp = await TradeGrpcRunAsync<GetInvoiceSuitableAdvertisementResponse.AsObject>(tradeApiClient.getInvoiceSuitableAdvertisements, req, getToken());
                setAds(resp.advertisementsList);
            } catch (e) {
                setAds([]);
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, ads, getRunning, state.pieces, state.operation, state.invoiceId, state.country, state.currency, state.paymentType]);

    useEffect(() => {
        async function f() {
            if (state.country === "" ||
                state.currency === "" ||
                state.paymentType === "" ||
                authState === AuthState.NotAuthed ||
                getRunning ||
                state.promise === "" ||
                ads ||
                state.operation !== HelperOperation.UsePromise
            ) {
                return;
            }
            setGetRunning(true);

            let req = new GetPromiseSuitableAdvertisementsRequest();
            req.setCount(100);
            req.setSkip(0);
            req.setCountry(state.country);
            req.setCurrency(state.currency);
            req.setPaymenttype(state.paymentType);
            req.setPromise(state.promise);
            req.setPassword(state.promisePass);

            try {
                let resp = await TradeGrpcRunAsync<GetPromiseSuitableAdvertisementsResponse.AsObject>(tradeApiClient.getPromiseSuitableAdvertisements, req, getToken());
                setAds(resp.advertisementsList);
            } catch (e) {
                setAds([]);
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, ads, state.country, state.currency, state.paymentType, getRunning, state.promise, state.operation, state.promisePass])

    useEffect(() => {
        async function f() {
            if (!createDeal ||
                !ads ||
                !state.invoiceId ||
                !state.pieces ||
                state.operation !== HelperOperation.PayInvoice ||
                authState === AuthState.NotAuthed
            ) {
                return;
            }
            setCreateDeal(false);
            setCreateDealRunning(true)

            let req = new PayInvoiceByDealRequest();
            req.setAdvertisementid(ads[currentAd].id);
            req.setInvoiceid(state.invoiceId);
            req.setPieces(state.pieces);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceByDeal, req, getToken());
                dispatch(NewInvoicesPayment(resp));
                dispatch(SetDealId(resp.deal!.id));
                dispatch(LoadDeals([resp.deal!]));
                dispatch(SetInvoicePaymentId(resp.id));
                setRedirect("/helper/deal");
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setCreateDealRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, createDeal, ads, state.invoiceId, state.pieces, state.operation, currentAd, dispatch])


    useEffect(() => {
        async function f() {
            if (!createDeal ||
                createDealRunning ||
                !ads || !state.amount ||
                !state.buyResult ||
                state.operation !== HelperOperation.BuyBtc ||
                authState === AuthState.NotAuthed) {
                return;
            }
            setCreateDealRunning(true);
            setCreateDeal(false);
            setError("");
            let ad = ads[currentAd];
            let req = new CreateDealRequest();
            req.setAdvertisementid(ad.id);
            if (state.amountIsFiat) {
                req.setFiatamount(state.amount.ToPb());
            } else {
                req.setCryptoamount(state.amount.ToPb());
            }
            switch (state.buyResult.type) {
                case HelperBuyResultType.Balance:
                    break;
                case HelperBuyResultType.Bitcoin:
                    req.setBtcwallet(state.buyResult.btcAddress);
                    break;
                case HelperBuyResultType.Promise:
                    req.setBuypromise(true)
                    req.setPromisepassword(state.buyResult.promisePass);
                    break;

            }

            try {
                let deal = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.createDeal, req, getToken());
                setError("");
                dispatch(LoadDeals([deal]));
                dispatch(SetDealId(deal.id));
                setRedirect("/helper/deal");
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setCreateDealRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [createDeal, createDealRunning, ads, currentAd, state.amount, state.amountIsFiat, state.buyResult, dispatch, state.operation, authState]);

    useEffect(() => {
        async function f() {
            if (!createDeal ||
                createDealRunning ||
                state.promise === "" ||
                !ads ||
                state.operation !== HelperOperation.UsePromise ||
                authState === AuthState.NotAuthed
            ) {
                return;
            }

            setCreateDealRunning(true);
            setCreateDeal(false);

            let req = new PromiseSellByDealRequest();
            req.setPromise(state.promise);
            req.setPassword(state.promisePass);
            req.setAdvertisementid(ads[currentAd].id);

            try {
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.promiseSellByDeal, req, getToken());
                setError("");
                dispatch(LoadDeals([resp]));
                dispatch(SetDealId(resp.id));
                setRedirect("/helper/deal");
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setCreateDealRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, createDeal, createDealRunning, state.promise, state.promisePass, state.operation, dispatch, ads, currentAd])

    function Data(ad: Advertisement.AsObject) {
        function duration(mins: number): string {
            let d = mins * 60 * 1000;
            return humanizeDuration(d,
                {
                    language: lang,
                    largest: 2,
                    round: true,
                    fallbacks: ['en']
                }
            )
        }

        return (
            <>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className="font-weight-bold">{strings.adName}</span>
                    </Col>
                    <Col>
                        <span>{ad.title}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className="font-weight-bold">{strings.price}</span>
                    </Col>
                    <Col>
                        <span
                            className="font-weight-bold text-success">{MyDecimal.FromPb(ad.price).toString()} {ad.fiatcurrency}/BTC</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className="font-weight-bold">{strings.window}</span>
                    </Col>
                    <Col>
                        <span className="font-weight-bold">{duration(ad.window)}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className="font-weight-bold">{strings.terms}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <MultilineContent text={ad.message} small={false}/>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (ads === null) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        )
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        switch (state.operation) {
                            case HelperOperation.BuyBtc:
                                setRedirect("/helper/selectBuyResult");
                                break;
                            case HelperOperation.PayInvoice:
                                setRedirect("/helper/buyCrypto");
                                break;
                            case HelperOperation.UsePromise:
                                setRedirect("/helper/buyCrypto");
                                break;

                        }
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>
                        {errors(error)}
                    </Alert>
                </Col>
            </Row>
            {ads && ads.length > 0 ?
                <>
                    <Row className="pt-3">
                        <Col>
                            <h4>{strings.title}</h4>
                        </Col>
                    </Row>
                    <Row className="justify-content-center pt-3">
                        <Col {...Col6_12}>
                            <Card>
                                <CardBody>
                                    <Fade in={isShow}
                                          onExited={() => {
                                              setIsShow(true);
                                          }}
                                    >
                                        <Data {...ads[currentAd]}/>
                                    </Fade>
                                </CardBody>
                                <CardFooter>
                                    <LoadingBtn loading={createDealRunning} color="success" className="btn-block"
                                                onClick={() => {
                                                    setCreateDeal(true);
                                                }}>
                                        {strings.ok}
                                    </LoadingBtn>
                                    <Button color="primary" className="btn-block mt-2"
                                            onClick={() => {
                                                if (currentAd === ads?.length - 1) {
                                                    setCurrentAd(0);
                                                } else {
                                                    setCurrentAd(currentAd + 1);
                                                }
                                                setIsShow(false);
                                            }}>
                                        {strings.next}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </>
                :
                <Row className="pt-3">
                    <Col>
                        <Alert isOpen={error === ""} color="warning">{strings.error}</Alert>
                    </Col>
                </Row>
            }
        </>
    );
}