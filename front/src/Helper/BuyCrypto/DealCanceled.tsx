import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {IEvent, IStore} from "../../redux/store/Interfaces";
import {Deal} from "../../Protos/api_pb";
import {HelperActionTypes, SetCurrentPath} from "../../redux/actions";
import {NavLink, Redirect} from "react-router-dom";
import {Alert, Button, Col, Row} from "reactstrap";
import {Loading} from "../../Loading";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col6_12} from "../../global";
import {DealFeedback} from "../../MainPages/DealPage/DealFeedback";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {errors} from "../../localization/Errors";
import {useMarkAsReadedEvents, useStrings} from "../../Hooks";
import {data, IStrings} from "../../localization/Helper/BuyCrypto/DealCanceled";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function DealCanceled() {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            deals: store.deals.deals,
            newEvents: store.deals.newEvents
        }), []
    );
    const {state, deals, newEvents} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [deal, setDeal] = useState<Deal.AsObject | null>(null);
    const [markEvents, setMarkEvents] = useState<IEvent[] | null>(null)
    const [error, setError] = useState("");

    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        let d = deals.find(p => p.id == state.dealId);
        if (d) {
            setDeal(d);
        } else {
            setDeal(null);
        }
    }, [deals, state.dealId]);

    useEffect(() => {
        if (!state.dealId) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.dealId]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/dealCanceled"));
    }, [state.currentPath, dispatch]);

    useEffect(() => {
        if (!deal) {
            return;
        }
        // eslint-disable-next-line eqeqeq
        let events: IEvent[] | null = newEvents.filter(p => p.dealId == deal.id);

        setMarkEvents(events);


    }, [deal, newEvents]);

    useMarkAsReadedEvents(markEvents,
        () => {
        },
        () => {
            setMarkEvents(null);
        },
        setError);


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!deal) {
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
                    <Button color="danger" outline onClick={() => setRedirect("/helper/selectOperation")}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-center">
                <Col className="col-auto">
                    <h4 className="text-center">{strings.dealCanceled}</h4>
                    {strings.why}
                    <ul>
                        <li>
                            {strings.youCancel}
                        </li>
                        <li>
                            {strings.sellerCancel}
                        </li>
                        <li>
                            {strings.timeout}
                        </li>
                    </ul>
                    <span className="text-center">
                        {strings.info}
                    </span>
                    <br/>
                    <NavLink className="nav-link text-center" to={"/deal/" + state.dealId}>
                        {strings.go}
                    </NavLink>
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <DealFeedback deal={deal} title={strings.feedback}/>
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <Button className="btn-block" color="success" onClick={() => {
                        dispatch({type: HelperActionTypes.RESET});
                    }}>
                        {strings.end}
                    </Button>
                </Col>
            </Row>
        </>
    )
}