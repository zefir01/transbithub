import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Col, Container, Row,} from "reactstrap";
import {Deal, DealStatus, GetDealByIdRequest} from "../Protos/api_pb";
import {useDispatch, useMappedState} from "redux-react-hook";
import {createMatchSelector} from "connected-react-router";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {DealControl} from "./DealPage/DealControl";
import {AuthState, IProfile, IStore} from "../redux/store/Interfaces";
import {LoadDeals} from "../redux/actions";
import {Loading} from "../Loading";
import {DealHeader} from "./DealPage/DealHeader";
import {Col6_12} from "../global";
import {DealInfo} from "./DealPage/DealInfo";
import {DealConditions} from "./DealPage/DealConditions";
import {Calculator} from "./DealPage/Calculator";
import {Redirect} from "react-router-dom";
import {errors} from "../localization/Errors";


interface IRouteParams {
    id: number;
}

export const DealPage = () => {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            router: store.router,
            deals: store.deals
        }), []
    );
    const {profile, authState, router, deals} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [getDealByIdRunning, setgetDealByIdRunning] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [redirectId, setRedirectId] = useState<number | null>(null);
    const [dealStatus, setDealStatus] = useState<DealStatus | null>(null);

    const dealIdCb = useCallback(() => {
        const matchSelector = createMatchSelector("/deal/:id");
        const match = matchSelector({router});
        if (match === null)
            return null;
        return (match.params as IRouteParams).id;
    }, [router]);
    let dealId = dealIdCb();

    const dealCb = useCallback(() => {
        const matchSelector = createMatchSelector("/deal/:id");
        const match = matchSelector({router});
        if (match === null) {
            return null;
        }
        let id = (match.params as IRouteParams).id;
        // eslint-disable-next-line eqeqeq
        let deal = deals.deals.find(p => p.id == id);
        if (deal === undefined) {
            return null;
        }

        return deal;
    }, [router, deals.deals]);
    let deal = dealCb();

    useEffect(() => {
        let d = deal;
        if (d === null) {
            return;
        }
        if (redirectId !== null && redirectId !== d.id) {
            setRedirectId(dealId);
            setRedirect("");
            setDealStatus(null);
        }

        if ((d.status === DealStatus.COMPLETED || d.status === DealStatus.CANCELED)
            && dealStatus !== null
            && dealStatus !== d.status
            && !d.paymentisnull
            && d.payment!.owner!.id === profile.UserId
        ) {
            setRedirectId(d.id);
            setRedirect("/invoices/payment/" + d.payment!.id);
        } else {
            if (dealStatus !== d.status) {
                setDealStatus(d.status);
            }
        }
    }, [deal, deal?.status, dealId, dealStatus, redirectId, profile.UserId])


    useEffect(() => {
        if (getDealByIdRunning) {
            return;
        }
        if (authState === AuthState.NotAuthed) {
            return;
        }
        if (dealId === null || deal !== null) {
            return;
        }

        setgetDealByIdRunning(true);

        async function f() {
            let req = new GetDealByIdRequest();
            req.setId(dealId!);

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.getDealById, req, token);
                let arr = new Array<Deal.AsObject>();
                arr.push(resp);
                dispatch(LoadDeals(arr));
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setgetDealByIdRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, dealId, deal, dispatch, getDealByIdRunning]);

    function GetDealPartner(deal: Deal.AsObject, profile: IProfile) {
        if (deal!.adownerinfo!.id === profile.UserId)
            return deal!.initiator!;
        return deal!.adownerinfo!;
    }


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }
    if (error !== "")
        return <Alert color="danger">{error}</Alert>;
    else if (dealId == null || deal === null)
        return <Loading/>;

    return (
        <Container>
            <Row>
                <Col>
                    <DealHeader ad={deal!.advertisement!} partner={GetDealPartner(deal!, profile)}/>
                </Col>
            </Row>
            <Row>
                <Col {...Col6_12}>
                    <DealInfo ad={deal!.advertisement!} partner={GetDealPartner(deal!, profile)}
                              promise={deal?.promisewithdrawal}/>
                    <Calculator deal={deal} userId={profile.UserId}/>

                </Col>
                <Col {...Col6_12}>
                    <DealConditions ad={deal!.advertisement!}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DealControl dealId={dealId!}/>
                </Col>
            </Row>
        </Container>
    );
};