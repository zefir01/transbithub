import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Col, Container, Row, Spinner} from "reactstrap";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {Advertisement, GetAdvertisementsByIdRequest} from "../Protos/api_pb";
import {useRouteMatch} from "react-router-dom";
import {errors} from "../localization/Errors";
import {AdCard} from "../MainPages/AdCard";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {MyDecimal} from "../MyDecimal";
import {data, IStrings} from "../localization/Integration/InvoiceIframe";
import {useStrings} from "../Hooks";


export function AdIframe() {
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);
    const [ad, setAd] = useState<Advertisement.AsObject | null>(null);
    const [getRunning, setGetRunning] = useState(false);
    const [requested, setRequested] = useState(false);
    const [error, setError] = useState("");
    const [isHelper, setIsHelper] = useState(false);
    const [amount, setAmount] = useState<MyDecimal | null>(null);
    const matchAd = useRouteMatch('/iframes/advertisement/:id/:amount?');
    const matchAdHelper = useRouteMatch('/iframes/helper/advertisement/:id/:amount?/');

    const strings: IStrings=useStrings(data);

    useEffect(() => {
        async function f() {
            if ((!matchAd && !matchAdHelper) || ad !== null || getRunning || requested || authState === AuthState.NotAuthed) {
                return;
            }
            let match=matchAd?matchAd:matchAdHelper;
            // @ts-ignore
            let id = match.params.id;
            if (id === undefined || id === "") {
                return;
            }

            // @ts-ignore
            let a = match.params.amount;
            if (a !== undefined && a !== "") {
                let am = new MyDecimal(a);
                setAmount(am);
            }

            if(matchAdHelper){
                setIsHelper(true);
            }
            else {
                setIsHelper(false);
            }

            let req = new GetAdvertisementsByIdRequest();
            req.setId(parseInt(id));
            setGetRunning(true);

            try {
                let resp = await TradeGrpcRunAsync<Advertisement.AsObject>(tradeApiClient.getAdvertisementsById, req, getToken());
                setAd(resp);
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetRunning(false);
                setRequested(true);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [matchAd, ad, getRunning, requested, authState, matchAdHelper]);


    if (getRunning || !requested) {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col className="col-auto">
                        <Spinner color="primary" className="mt-3"/>
                    </Col>
                </Row>
            </Container>
        )
    }

    if (ad === null) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
                        <Alert color="danger" isOpen={error === ""}>{strings.adNotFond}</Alert>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Container>
            <AdCard ad={ad} btnLoading={false} onClick={() => {
                if (isHelper) {
                    if(amount) {
                        window.open(`/links/helper/advertisement/${ad?.id}/${amount}`, "_blank");
                    }
                    else{
                        window.open(`/links/helper/advertisement/${ad?.id}`, "_blank");
                    }
                } else {
                    if(amount){
                        window.open(`/links/advertisement/${ad?.id}/${amount}`, "_blank");
                    }
                    else {
                        window.open(`/links/advertisement/${ad?.id}`, "_blank");
                    }
                }
            }}/>
        </Container>
    )
}