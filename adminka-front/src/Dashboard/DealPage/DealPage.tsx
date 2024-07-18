import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Col, Container, Row,} from "reactstrap";
import {Deal} from "../../Protos/api_pb";
import {useDispatch, useMappedState} from "redux-react-hook";
import {apiClient, getToken, GrpcError, grpcRunAsync} from "../../helpers";
import {DealControl} from "./DealControl";
import {AuthState, IStore} from "../../redux/interfaces";
import {Loading} from "../../Loading";
import {Col6_12} from "../../global";
import {DealInfo} from "./DealInfo";
import {DealConditions} from "./DealConditions";
import {Calculator} from "./Calculator";
import {Redirect} from "react-router-dom";
import {GetDealRequest} from "../../Protos/adminka_pb";
import {LoadDeal} from "../../redux/actions";
import {createMatchSelector} from "connected-react-router";


enum DealType {
    AnonBuy,
    OwnDeal,
    Auth,
    NeedAuth,
    AdDeleted,
    Error
}

interface IRouteParams {
    id: number;
}

export const DealPage = () => {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            deals: store.disputes.deals,
            router: store.router,
        }), []
    );
    const {authState, deals, router} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [getDealByIdRunning, setgetDealByIdRunning] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [init, setInit] = useState(false);

    const dealIdCb = useCallback(() => {
        const matchSelector = createMatchSelector("/dashboard/dispute/:id");
        const match = matchSelector({router});
        if (match === null)
            return null;
        return (match.params as IRouteParams).id;
    }, [router]);
    let dealId = dealIdCb();

    const dealCb = useCallback(() => {
        let d = deals.find(p => p.id == dealId);
        return d;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deals, init, dealId]);
    let deal = dealCb();

    useEffect(() => {
        async function f() {
            if (getDealByIdRunning) {
                return;
            }
            if (authState === AuthState.NotAuthed) {
                return;
            }
            if (init || dealId === null) {
                return;
            }

            setgetDealByIdRunning(true);

            let req = new GetDealRequest();
            req.setDealid(dealId);

            try {
                let token = getToken();
                let resp = await grpcRunAsync<Deal.AsObject>(apiClient.getDeal, req, token);
                dispatch(LoadDeal(resp));
                setInit(true);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(e.message);
            } finally {
                setgetDealByIdRunning(false);
            }
        }

        f();
    }, [authState, getDealByIdRunning, dealId, dispatch, init]);


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }
    if (error !== "")
        return <Alert color="danger">{error}</Alert>;
    else if (!init || !deal) {
        return <Loading/>;
    }

    return (
        <Container>
            <Row>
                <Col {...Col6_12}>
                    <DealInfo ad={deal!.advertisement!} initiator={deal.initiator!} owner={deal.adownerinfo!}/>
                    <Calculator deal={deal}/>

                </Col>
                <Col {...Col6_12}>
                    <DealConditions ad={deal!.advertisement!}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DealControl deal={deal}/>
                </Col>
            </Row>
        </Container>
    );
};