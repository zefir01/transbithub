import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Col, Collapse, Container, Row} from "reactstrap";
import {
    Advertisement,
    CreateDealLnBuyRequest,
    CreateDealLnSellRequest,
    CreateDealRequest,
    Deal,
    GetAdvertisementsByIdRequest,
    PromiseSellByDealRequest,
} from "../Protos/api_pb";
import {useMappedState} from "redux-react-hook";
import {createMatchSelector} from "connected-react-router";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Loading} from "../Loading";
import {DealHeader} from "./DealPage/DealHeader";
import {Col6_12} from "../global";
import {DealInfo} from "./DealPage/DealInfo";
import {Calculator, CalculatorInputeHandlers, DealType} from "./DealPage/Calculator";
import {MyDecimal} from "../MyDecimal";
import {Redirect} from "react-router-dom";
import {useStrings} from "../Hooks";
import {buyTypeEnum, BuyTypeSelector, BuyTypeSelectorData} from "./BuyTypeSelector";
import {data, IStrings} from "../localization/DealPage/Calculator";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";
import {AdChangesListener} from "./AdChangesListener";
import {sellTypeEnum, SellTypeSelector, SellTypeSelectorData} from "./SellTypeSelector";
import {DealConditions} from "./DealPage/DealConditions";

interface IRouteParams {
    id?: number;
    amount?: number;
}

export interface ICreateDealLocationState {
    promise?: string;
    promiseAmount?: number;
    promisePassword?: string;
}

export const CreateDealPage = () => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            router: store.router,
            fee: store.catalog.fee
        }), []
    );
    const {profile, authState, router, fee} = useMappedState(mapState);


    const [adId, setAdId] = useState<number | undefined>(getParams() === undefined ? undefined : getParams()!.id);
    const [ad, setAd] = useState<Advertisement.AsObject | null>(null);
    const [error, setError] = useState("");
    const [adDeleted, setAdDeleted] = useState(false);
    const [createDeal, setCreateDeal] = useState(false);
    const [dealCreating, setDealCreating] = useState(false);
    const [fiat, setFiat] = useState<MyDecimal | null>(null);
    const [crypto, setCrypto] = useState<MyDecimal | null>(null);
    const [redirect, setRedirect] = useState("");
    const [dealType, setDealType] = useState<DealType>(DealType.AnonBuy);
    const [sellPromise, setSellPromise] = useState(false);
    const [sellPromiseRunning, setSellPromiseRunning] = useState(false);
    const [buySelectorData, setBuySelectorData] = useState<BuyTypeSelectorData | null>(null);
    const [defaultAmount, setDefaultAmount] = useState<MyDecimal | null>(null);
    const [sellSelectorData, setSellSelectorData] = useState<SellTypeSelectorData | null>(null);


    const calcRef = useRef<CalculatorInputeHandlers>(null);

    function getParams(): IRouteParams | undefined {
        const matchSelector = createMatchSelector("/createDeal/:id/:amount?");
        const match = matchSelector({router});
        if (match === null)
            return undefined;
        return match.params as IRouteParams;
    }

    useEffect(() => {
        if (defaultAmount) {
            return;
        }

        function getParams(): IRouteParams | undefined {
            const matchSelector = createMatchSelector("/createDeal/:id/:amount?");
            const match = matchSelector({router});
            if (match === null)
                return undefined;
            return match.params as IRouteParams;
        }

        let par = getParams();
        if (par !== undefined && par.amount !== undefined && par !== "null") {
            setDefaultAmount(new MyDecimal(par.amount));
        }
    }, [defaultAmount, router])

    useEffect(() => {
        if (calcRef.current && buySelectorData) {
            if (buySelectorData.type === buyTypeEnum.bitcoin) {
                calcRef.current.setMinAmount(fee);
            } else {
                calcRef.current.setMinAmount(null);
            }
        }
    }, [buySelectorData, fee])


    useEffect(() => {
        if (ad !== null || adId === undefined || authState === AuthState.NotAuthed)
            return;

        async function f() {
            let req = new GetAdvertisementsByIdRequest();
            req.setId(adId!);

            try {
                let resp = await TradeGrpcRunAsync<Advertisement.AsObject>(tradeApiClient.getAdvertisementsById, req, getToken());
                setAd(resp);
                setAdDeleted(false);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [adId, ad, authState]);


    useEffect(() => {
        async function f() {
            if (!createDeal || dealCreating || !ad || !fiat || authState === AuthState.NotAuthed) {
                return;
            }
            if ((!ad.isbuy && !buySelectorData) || (ad.isbuy && !sellSelectorData)) {
                return;
            }
            if (sellSelectorData?.type === sellTypeEnum.ln || buySelectorData?.type === buyTypeEnum.ln) {
                return;
            }
            setCreateDeal(false);
            setDealCreating(true);

            let req = new CreateDealRequest();
            req.setAdvertisementid(adId!);
            req.setFiatamount(fiat.ToPb());
            if (!ad.isbuy && buySelectorData) {
                switch (buySelectorData.type) {
                    case buyTypeEnum.promise:
                        req.setBuypromise(true)
                        req.setPromisepassword(buySelectorData.promisePass!);
                        break;
                    case buyTypeEnum.balance:
                        break;
                    case buyTypeEnum.bitcoin:
                        req.setBtcwallet(buySelectorData.btcWallet!)
                        break;
                }
            }

            try {
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.createDeal, req, getToken());
                let deal = resp!;
                setError("");
                setRedirect("/deal/" + deal.id.toString());
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setDealCreating(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [createDeal, buySelectorData, ad, fiat, dealCreating, authState, adId, sellSelectorData]);

    useEffect(() => {
        async function f() {
            if (!ad || !adId || !createDeal || dealCreating || !fiat || authState === AuthState.NotAuthed) {
                return;
            }
            if (!createDeal || dealCreating) {
                return;
            }
            if (!sellSelectorData || sellSelectorData.type !== sellTypeEnum.ln) {
                return;
            }

            setCreateDeal(false);
            setDealCreating(true);

            try {
                let req = new CreateDealLnSellRequest();
                req.setAdvertisementid(adId);
                req.setFiatamount(fiat.ToPb());
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.createDealLnSell, req, getToken());
                let deal = resp!;
                setError("");
                setRedirect("/deal/" + deal.id.toString());
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setDealCreating(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [createDeal, buySelectorData, ad, fiat, dealCreating, authState, adId, sellSelectorData]);

    useEffect(() => {
        async function f() {
            if (!ad || !adId || !createDeal || dealCreating || !crypto || authState === AuthState.NotAuthed) {
                return;
            }
            if (!createDeal || dealCreating) {
                return;
            }
            if (!buySelectorData || buySelectorData.type !== buyTypeEnum.ln) {
                return;
            }
            if (!buySelectorData.decodedInvoice || !buySelectorData.decodedInvoice.invoice) {
                return;
            }

            setCreateDeal(false);
            setDealCreating(true);

            try {
                let req = new CreateDealLnBuyRequest();
                req.setAdvertisementid(adId!);
                req.setLninvoice(buySelectorData.decodedInvoice.invoice)
                if (buySelectorData.decodedInvoice.amount === null) {
                    req.setFiatamount(fiat?.ToPb());
                } else {
                    req.setAmountisnull(true);
                }
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.createDealLnBuy, req, getToken());
                let deal = resp!;
                setError("");
                setRedirect("/deal/" + deal.id.toString());
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setDealCreating(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [createDeal, buySelectorData, ad, fiat, dealCreating, authState, adId, crypto])


    useEffect(() => {
        async function f() {
            if (!sellPromise || sellPromiseRunning || !sellSelectorData || sellSelectorData.error
                || sellSelectorData.type !== sellTypeEnum.promise || authState === AuthState.NotAuthed) {
                return;
            }

            setSellPromise(false);
            setSellPromiseRunning(true);

            let req = new PromiseSellByDealRequest();
            req.setPromise(sellSelectorData.promise);
            req.setPassword(sellSelectorData.pass);
            req.setAdvertisementid(adId!);

            try {
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.promiseSellByDeal, req, getToken());
                setError("");
                setRedirect("/deal/" + resp.id.toString());
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setSellPromiseRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [sellPromise, authState, sellPromiseRunning, adId, sellSelectorData])

    useEffect(() => {
        if (authState === AuthState.NotAuthed)
            return;
        if (ad == null)
            return;


        if (adDeleted) {
            setDealType(DealType.AdDeleted);
        } else if (authState === AuthState.Authed) {
            if (ad.owner!.id === profile.UserId) {
                setDealType(DealType.OwnDeal);
            } else {
                setDealType(DealType.Auth);
            }
        } else if (authState === AuthState.AnonAuthed && !ad!.isbuy) {
            setDealType(DealType.AnonBuy);
        } else if (authState === AuthState.AnonAuthed && ad!.isbuy) {
            setDealType(DealType.NeedAuth);
        } else {
            setDealType(DealType.Error);
        }


    }, [authState, profile, ad, adDeleted]);

    function DealButton() {
        if (!ad!.isbuy && dealType !== DealType.SellPromise) {
            if (dealType === null || (dealType !== DealType.AnonBuy && dealType !== DealType.Auth)) {
                return null;
            }
        }

        let isDisabled: boolean = false;
        if (!ad!.isbuy) {
            if (!fiat || !crypto) {
                isDisabled = true;
            }
            if (!buySelectorData) {
                isDisabled = true;
            } else {
                switch (buySelectorData.type) {
                    case buyTypeEnum.promise:
                        break;
                    case buyTypeEnum.balance:
                        if (authState !== AuthState.Authed) {
                            isDisabled = true;
                        }
                        break;
                    case buyTypeEnum.bitcoin:
                        if (!buySelectorData.btcWallet) {
                            isDisabled = true;
                        }
                        break;
                    case buyTypeEnum.ln:
                        if (authState !== AuthState.Authed) {
                            isDisabled = true;
                        }
                        if (buySelectorData.decodedInvoice?.invoice === "") {
                            isDisabled = true;
                        }
                        if (buySelectorData.decodedInvoice?.error) {
                            isDisabled = true;
                        }
                        break;
                }
            }
        } else {
            if (!sellSelectorData) {
                isDisabled = true;
            } else {
                if (sellSelectorData.error) {
                    isDisabled = true;
                }
                if (sellSelectorData.type !== sellTypeEnum.promise) {
                    if (authState !== AuthState.Authed) {
                        isDisabled = true;
                    }
                    if (!fiat || !crypto) {
                        isDisabled = true;
                    }
                } else if (sellSelectorData.promise === "") {
                    isDisabled = true;
                }
            }
        }


        return (
            <Row>
                <Col>
                    <LoadingBtn loading={dealCreating || sellPromiseRunning}
                                className="btn-block font-weight-bold mt-3" outline
                                disabled={isDisabled}
                                color="info"
                                onClick={() => {
                                    if (sellSelectorData?.type === sellTypeEnum.promise) {
                                        setSellPromise(true);
                                    } else if (authState !== AuthState.NotAuthed) {
                                        setCreateDeal(true);
                                    }
                                }}>
                        {!ad?.isbuy ? strings.buy : strings.sell}
                    </LoadingBtn>

                </Col>
            </Row>
        );
    }

    function Alerts() {
        return (
            <>
                {
                    error ?
                        <Row>
                            <Col>
                                <Alert toggle={() => setError("")} className="mt-3"
                                       color="danger">{errors(error)}</Alert>
                            </Col>
                        </Row>
                        : undefined
                }
                <Row>
                    <Col>
                        <Alert className="mt-3" color="warning"
                               isOpen={dealType !== null && dealType === DealType.OwnDeal}>
                            {strings.ownDeal}
                        </Alert>
                        <Alert className="mt-3" color="warning"
                               isOpen={dealType === DealType.AdDeleted}>
                            {!ad?.isbuy ? strings.adDeleted
                                : strings.adDeleted1}
                        </Alert>
                    </Col>
                </Row>
            </>
        );
    }

    function isCalcOpen(): boolean {
        if (!ad) {
            return false;
        }
        if (ad.isbuy) {
            if (!sellSelectorData) {
                return false;
            }
            if (sellSelectorData.type === sellTypeEnum.balance || sellSelectorData.type === sellTypeEnum.ln) {
                return true;
            }
        } else {
            if (!buySelectorData) {
                return false;
            }
            if (buySelectorData.type === buyTypeEnum.bitcoin ||
                buySelectorData.type === buyTypeEnum.balance ||
                buySelectorData.type === buyTypeEnum.promise ||
                buySelectorData.type === buyTypeEnum.ln
            ) {
                return true;
            }
        }
        return false;
    }

    function isCalcReadonly(): boolean {
        if (buySelectorData?.type !== buyTypeEnum.ln) {
            return false
        }
        if (buySelectorData.decodedInvoice?.error) {
            return true;
        }
        if (buySelectorData.decodedInvoice?.invoice === "" ||
            !buySelectorData.decodedInvoice?.invoice) {
            return true;
        }
        return buySelectorData.decodedInvoice.amount !== null;

    }


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (ad == null || fee === null) {
        return (
            <Container>
                <Loading/>
            </Container>
        )
    }
    return (
        <Container>
            <AdChangesListener ad={ad} adDeleted={() => setAdDeleted(true)} adChanged={ad => setAd(ad)}/>
            <Row>
                <Col>
                    <DealHeader ad={ad!} partner={ad.owner!}/>
                </Col>
            </Row>
            <Row>
                <Col {...Col6_12}>
                    <DealInfo ad={ad!} partner={ad.owner!}/>
                    <Collapse isOpen={isCalcOpen()}>
                        <Calculator ref={calcRef}
                                    ad={ad}
                                    defaultAmount={defaultAmount ? defaultAmount : undefined}
                                    error={error}
                                    userId={profile.UserId}
                                    valueChanged={(fiatAmount, cryptoAmount) => {
                                        setFiat(fiatAmount);
                                        setCrypto(cryptoAmount);
                                    }}
                                    readonly={isCalcReadonly()}
                                    cryptoAmount={buySelectorData?.type === buyTypeEnum.ln && buySelectorData.decodedInvoice?.amount !== null ?
                                        buySelectorData.decodedInvoice?.amount : undefined}
                        />
                    </Collapse>
                    {error !== "" || dealType === DealType.OwnDeal || dealType === DealType.NeedAuth || dealType === DealType.AdDeleted ?
                        <Alerts/>
                        : null
                    }
                    <BuyTypeSelector ad={ad}
                                     cryptoAmount={!crypto ? undefined : crypto}
                                     isDisabled={false}
                                     onChanged={data => setBuySelectorData(data)}/>
                    <SellTypeSelector ad={ad} onChanged={data => setSellSelectorData(data)}/>
                    <DealButton/>

                </Col>
                <Col {...Col6_12}>
                    <DealConditions ad={ad}/>
                </Col>
            </Row>
        </Container>
    );
};