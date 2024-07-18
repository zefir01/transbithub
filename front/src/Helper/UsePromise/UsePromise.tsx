import React, {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, CardTitle, Col, Collapse, ListGroup, ListGroupItem, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Col6_12} from "../../global";
import {LoadingBtn} from "../../LoadingBtn";
import {AuthState, HelperUsePromiseType, IStore} from "../../redux/store/Interfaces";
import {LoginRegisterComponent} from "../../Profile/LoginRegister";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Balance, PromiseToBalanceRequest} from "../../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {BalanceUpdated, SetCurrentPath, SetPromiseUse} from "../../redux/actions";
import {errors} from "../../localization/Errors";
import {data, IStrings} from "../../localization/Helper/UsePromise/UsePromise";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);
const walletLookup: IconLookup = {prefix: 'far', iconName: 'wallet'};
const walletIconDefinition: IconDefinition = findIconDefinition(walletLookup);
const moneyLookup: IconLookup = {prefix: 'far', iconName: 'money-bill-alt'};
const moneyIconDefinition: IconDefinition = findIconDefinition(moneyLookup);

export function UsePromise() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            authState: store.auth.state,
        }), []
    );
    const {state, authState} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [toBalance, setToBalance] = useState(false);
    const [toBalanceRunning, setToBalanceRunning] = useState(false);
    const [error, setError] = useState("");

    function getIconColClass(index: number) {
        if (index === activeItem) {
            return "col-auto text-warning";
        }
        return "col-auto text-primary";
    }

    function isDisabled(): boolean {
        if (!activeItem) {
            return true;
        }
        return activeItem === 1 && authState !== AuthState.Authed;

    }

    useEffect(() => {
        if (authState !== AuthState.Authed || state.promise === "" || !toBalance || toBalanceRunning) {
            return;
        }
        setToBalance(false);
        setToBalanceRunning(true);

        async function f() {
            let req = new PromiseToBalanceRequest();
            req.setPromise(state.promise);
            req.setPassword(state.promisePass);

            try {
                let resp = await TradeGrpcRunAsync<Balance.AsObject>(tradeApiClient.promiseToBalance, req, getToken());
                dispatch(BalanceUpdated(resp));
                setRedirect("/helper/toBalanceComplete");
            } catch (e) {
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
    }, [authState, toBalance, toBalanceRunning, state.promise, state.promisePass, dispatch]);

    useEffect(() => {
        if (state.promise === "") {
            setRedirect("/helper/selectOperation");
        }
    }, [state.promise]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/usePromise"));
    }, [state.currentPath, dispatch]);
    useEffect(() => {
        if (state.promiseUseType !== null && activeItem === null) {
            switch (state.promiseUseType) {
                case HelperUsePromiseType.Balance:
                    setActiveItem(1);
                    break;
                case HelperUsePromiseType.Sell:
                    setActiveItem(2);
                    break;
            }
        }
    }, [state.promiseUseType, activeItem])


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }


    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        setRedirect("/helper/promisePay");
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-center">
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>
                                        {errors(error)}
                                    </Alert>
                                </Col>
                            </Row>
                            <CardTitle>
                                <h4>{strings.title}</h4>
                            </CardTitle>
                            <ListGroup>
                                <ListGroupItem action tag="button" active={activeItem === 1}
                                               onClick={() => setActiveItem(1)}>
                                    <Row>
                                        <Col className="align-self-center">
                                            {strings.balance}
                                        </Col>
                                        <Col className={getIconColClass(1)}>
                                            <FontAwesomeIcon icon={walletIconDefinition} size="2x"/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem action tag="button" active={activeItem === 2}
                                               onClick={() => setActiveItem(2)}>
                                    <Row>
                                        <Col className="align-self-center">
                                            {strings.sell}
                                        </Col>
                                        <Col className={getIconColClass(2)}>
                                            <FontAwesomeIcon icon={moneyIconDefinition} size="2x"/>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            </ListGroup>
                            <Collapse isOpen={activeItem === 1 && authState === AuthState.AnonAuthed}>
                                <Alert className="mt-3" color="warning">
                                    {strings.warn}
                                </Alert>
                                <LoginRegisterComponent/>
                            </Collapse>
                            <LoadingBtn loading={false} color="success" className="btn-block mt-3"
                                        disabled={isDisabled()}
                                        onClick={() => {
                                            switch (activeItem) {
                                                case 1:
                                                    dispatch(SetPromiseUse(HelperUsePromiseType.Balance));
                                                    setToBalance(true);
                                                    break;
                                                case 2:
                                                    dispatch(SetPromiseUse(HelperUsePromiseType.Sell));
                                                    setRedirect("/helper/buyCrypto");
                                                    break;
                                            }
                                        }}>
                                Все верно
                            </LoadingBtn>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}