// noinspection ES6UnusedImports

import * as React from "react";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {Alert, Col, Row} from "reactstrap";
import {useDispatch, useMappedState} from "redux-react-hook";
import {
    Advertisement,
    FindAdvertisementsRequest,
    FindAdvertisementsResponse, InvoicePayment,
    PayInvoiceByDealRequest
} from "../Protos/api_pb";
import {pageSize} from "../global";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {errors} from "../localization/Errors";
import {data, IStrings} from "../localization/MainPage";
import {data as dataSs, myMap} from "../localization/PaymentTypes"
import {Redirect} from "react-router-dom";
import {Price} from "./Price";
import {UserLink} from "./UserLink";
import {AuthState, IStore, LastSearch} from "../redux/store/Interfaces";
import Decimal from "decimal.js";
import {MyDecimal} from "../MyDecimal";
import {DealLimitsComponent} from "./DealLimitsComponent";
import {LastSearchBuy, LastSearchSell, NewInvoicesPayment} from "../redux/actions";
import {Loading} from "../Loading";
import {LoadingBtn} from "../LoadingBtn";
import {IAdsList} from "./SelectAd";
import {ICreateDealLocationState} from "./CreateDealPage";
import {AdCard} from "./AdCard";
import {useStrings} from "../Hooks";

interface IMyRowProps {
    Content1: ReactNode;
    Content2: ReactNode;
    Content3: ReactNode;
    Content4: ReactNode;
    Content5: ReactNode;
    idx: number;
    className?: string;
}

const MyRow = (props: IMyRowProps) => {
    let style = undefined;
    if (props.idx === 0 || props.idx % 2 === 0)
        style = {backgroundColor: '#f9f9f9'};

    return (
        <Row className={`align-items-center ${props.className}`} style={style}>
            <Col lg={2} md={2} sm={12} xs={12}>
                {props.Content1}
            </Col>
            <Col lg={4} md={4} sm={12} xs={12}>
                {props.Content2}
            </Col>
            <Col lg={2} md={2} sm={12} xs={12}>
                {props.Content3}
            </Col>
            <Col lg={2} md={2} sm={12} xs={12}>
                {props.Content4}
            </Col>
            <Col lg={2} md={2} sm={12} xs={12}>
                {props.Content5}
            </Col>
        </Row>
    );
};

export interface IAdTableProps {
    amount?: Decimal | null;
    country?: string | null;
    currency?: string;
    paymentType?: string;
    isBuy: boolean;
    userId?: string;
    adLIst?: IAdsList;
    disabled: boolean;
}

export const AdTable = (props: IAdTableProps) => {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [ads, setAds] = useState(new Array<Advertisement.AsObject>());
    const [moreDisabled, setMoreDisabled] = useState(true);
    const [more, setMore] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [findAdvertisementsRunning, setfindAdvertisementsRunning] = useState(false);
    const [createDeal, setCreateDeal] = useState(false);
    const [createDealAdId, setCreateDealAdId] = useState<number | null>(null);
    const [sellPromise, setSellPromise] = useState<number | null>(null);
    const [doFind, setDoFind] = useState(true);
    const stateCb = useCallback(() => {
        if (props !== null && props.adLIst !== undefined && props.adLIst !== null) {
            return {
                ads: props.adLIst.adList,
                invoice: props.adLIst.invoice,
                pieces: props.adLIst.pieces,
                amount: null,
                promise: props.adLIst.promise,
                promiseAmount: props.adLIst.promiseAmount,
                promisePassword: props.adLIst.promisePassword
            }
        }
        return {
            ads: ads,
            invoice: null,
            pieces: null,
            amount: props === null ? undefined : props.amount
        }
    }, [props, ads]);
    const state = stateCb();

    const strings: IStrings = useStrings(data);
    const paymentStrings = new myMap(dataSs);


    useEffect(()=>{
        if(props.disabled){
            return;
        }
        setDoFind(true);
    }, [props.amount, props.isBuy, props.userId, props.country, props.currency, props.paymentType, props.disabled])

    useEffect(() => {
        if (props === null
            || props.country === null
            || props.currency === ""
            || props.paymentType === ""
            || findAdvertisementsRunning
            || authState === AuthState.NotAuthed
            || state.invoice !== null
            || props.disabled
            || !doFind
        ) {
            return;
        }
        setDoFind(false);
        setfindAdvertisementsRunning(true);
        setMore(false);

        async function f() {
            let req = new FindAdvertisementsRequest();
            if (props!.userId === undefined) {
                if (state.amount) {
                    req.setFiatamount(new MyDecimal(state.amount).ToPb());
                }
                if (props!.country !== null)
                    req.setCountry(props!.country!);
                req.setCurrency(props!.currency!);
                req.setPaymenttype(props!.paymentType!);
                req.setIsbuy(props!.isBuy!);
                req.setSkip((page - 1) * pageSize);
                req.setTake(pageSize);
            } else {
                req.setFiatamount(new MyDecimal(new Decimal(0)).ToPb());
                req.setCountry("");
                req.setCurrency("");
                req.setPaymenttype("");
                req.setIsbuy(props!.isBuy);
                req.setSkip((page - 1) * pageSize);
                req.setTake(pageSize);
                req.setUserid(props!.userId);
            }

            try {
                let resp = await TradeGrpcRunAsync<FindAdvertisementsResponse.AsObject>(tradeApiClient.findAdvertisements, req, getToken());
                if (!more) {
                    setAds(new Array<Advertisement.AsObject>());
                    setAds(resp.advertisementsList);
                    setMoreDisabled(resp.advertisementsList.length < pageSize);
                    setPage(1);
                    let amount = state.amount;
                    let lastSearch: LastSearch = {
                        amount: amount === undefined ? null : amount,
                        country: props!.country!,
                        currency: props!.currency!,
                        paymentType: props!.paymentType!
                    };
                    if (lastSearch.country !== undefined && lastSearch.currency !== undefined && lastSearch.paymentType !== undefined) {
                        if (props!.isBuy) {
                            dispatch(LastSearchBuy(lastSearch));
                        } else {
                            dispatch(LastSearchSell(lastSearch));
                        }
                    }
                } else {
                    let newAds = false;
                    for (let ad of resp.advertisementsList) {
                        if (ads.find(p => p.id === ad.id) === undefined) {
                            ads.push(ad);
                            newAds = true;
                        }
                    }
                    if (newAds)
                        setAds(ads.map(p => p));
                    if (resp.advertisementsList.length < pageSize)
                        setMoreDisabled(true);
                }
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setfindAdvertisementsRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [doFind, state.amount, state.invoice, ads, findAdvertisementsRunning, dispatch, page, more, authState, props.isBuy, props.paymentType, props.currency, props.country, props.amount, props.adLIst, props.userId]);
    useEffect(() => {
        if (!createDeal || authState === AuthState.NotAuthed) {
            return;
        }
        setCreateDeal(false);

        async function f() {
            if (createDealAdId === null) {
                return;
            }
            let req = new PayInvoiceByDealRequest();
            req.setAdvertisementid(createDealAdId);
            req.setInvoiceid(state.invoice!.id);
            req.setPieces(state.pieces!);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceByDeal, req, getToken());
                dispatch(NewInvoicesPayment(resp));
                setRedirect("/deal/" + resp.deal!.id);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setCreateDealAdId(null);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [createDeal, authState, createDealAdId, dispatch, state.invoice, state.pieces])


    function adClick(id: number) {
        let amount: Decimal | null | undefined = new MyDecimal(0);
        if (state.amount) {
            amount = state.amount;
        }
        if (state.invoice === null) {
            setRedirect(`/createDeal/${id}/${amount}`)
        } else if (state.promise) {
            setSellPromise(id);
        } else {
            setCreateDealAdId(id);
            setCreateDeal(true);
        }
    }

    if (sellPromise) {
        let r: ICreateDealLocationState = {
            promise: state.promise,
            promiseAmount: state.promiseAmount,
            promisePassword: state.promisePassword
        };
        return <Redirect push to={{
            pathname: "/createDeal/" + sellPromise,
            state: r
        }}/>;
    }

    if (redirect !== "")
        return <Redirect push to={redirect}/>;

    if ((ads.length === 0 && findAdvertisementsRunning) || (props.adLIst === undefined && props.disabled)) {
        return <Loading/>;
    }


    return (
        <>
            <Row>
                <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
            </Row>
            {
                MyRow({
                    Content1: (<span className="font-weight-bold">
                                    {props.isBuy ? strings.buyer : strings.seller}
                                </span>),
                    Content2: (<span className="font-weight-bold">
                                {strings.message}
                            </span>),
                    Content3: (<span className="font-weight-bold">
                            {strings.price}
                            </span>),
                    Content4: (<span className="font-weight-bold">
                            {strings.limitations}
                            </span>),
                    Content5: "",
                    idx: 0,
                    className: "d-none d-md-flex mb-1" + (state.invoice !== null ? "mx-0" : "")
                })
            }
            {
                state.ads.map((p, idx) =>
                    <React.Fragment key={p.id}>
                        {
                            MyRow({
                                    Content1: <UserLink info={p.owner!} isAdRate={true}/>,
                                    Content2: (
                                        <React.Fragment>
                                            <span className="text-primary">{paymentStrings.get(p.paymenttype)}: </span>
                                            <span>{p.title}</span>
                                        </React.Fragment>
                                    ),

                                    Content3: <Price price={MyDecimal.FromPb(p.price)}
                                                     currency={p.fiatcurrency}/>,
                                    Content4: DealLimitsComponent(p),
                                    Content5: (<LoadingBtn loading={createDealAdId === p.id} className="btn-block my-1"
                                                           outline
                                                           color="primary"
                                                           onClick={() => adClick(p.id)}>
                                        <span
                                            className="font-weight-bold">{props!.isBuy ? strings.sell : strings.buy}</span>
                                    </LoadingBtn>),
                                    idx: idx + 1,
                                    className: "d-none d-md-flex"
                                }
                            )
                        }
                        {
                            <Row className="d-md-none mt-3">
                                <Col>
                                    <AdCard ad={p} btnLoading={createDealAdId === p.id} onClick={() => adClick(p.id)}/>
                                </Col>
                            </Row>
                        }
                    </React.Fragment>
                )

            }
            {!moreDisabled ?
                <Row>
                    <Col>

                        <LoadingBtn className="btn-block" outline
                                    onClick={() => {
                                        setPage(page + 1);
                                        setMore(true);
                                    }}
                                    loading={findAdvertisementsRunning}
                        >{strings.more}</LoadingBtn>
                    </Col>
                </Row>
                : null
            }
        </>
    );

};