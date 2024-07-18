import * as React from "react";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {Col6_12} from "../../global";
import {Chat} from "./Chat";

import {
    Deal,
    Event,
} from "../../Protos/api_pb";
import {useDispatch, useMappedState} from "redux-react-hook";
import {IStore} from "../../redux/interfaces";
import {data, IStrings} from "../../localization/DealPage/DealControl"
import {useMarkAsReadedEvents, useStrings} from "../../Hooks";
import {CancelDisputeRequest, Dispute} from "../../Protos/adminka_pb";
import {apiClient, getToken, GrpcError, grpcRunAsync} from "../../helpers";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {MarkAsReadEvents, UpdateDispute} from "../../redux/actions";
import {LoadingBtn} from "../../LoadingBtn";
import {Redirect} from "react-router-dom";


export interface IDealControlProps {
    deal: Deal.AsObject;
    hideFeedback?: boolean;
}

interface IMyRowProps {
    description: string;
    data: ReactNode;
    isHrDisabled?: boolean;
}

const MyRow = (props: IMyRowProps) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <span className="font-weight-bold">{props.description}</span>
                </Col>
                <Col>
                    {props.data}
                </Col>
            </Row>
            {props.isHrDisabled !== undefined && props.isHrDisabled ? null : <hr/>}
        </React.Fragment>
    );
};

export const DealControl = (props: IDealControlProps) => {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.profile?.userid,
            authState: store.auth.state,
            events: store.disputes.events
        }), []
    );
    const {userId, authState, events} = useMappedState(mapState);

    const [cancelDispute, setCancelDispute] = useState(false);
    const [cancelDisputeRunning, setCancelDisputeRunning] = useState(false);
    const [completeDispute, setCompleteDispute] = useState(false);
    const [completeDisputeRunning, setCompleteDisputeRunning] = useState(false);
    const [error, setError] = useState("");
    const [markEvents, setMarkEvents] = useState<Event.AsObject[]>([]);
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        async function f() {
            if (!cancelDispute || cancelDisputeRunning) {
                return;
            }
            setCancelDisputeRunning(true);
            let req = new CancelDisputeRequest();
            req.setDisputeid(props.deal.id);
            try {
                let resp = await grpcRunAsync<Dispute.AsObject>(apiClient.cancelDispute, req, getToken());
                dispatch(UpdateDispute(resp));
                setRedirect("/dashboard");
            } catch (e) {
                console.log(e.message);
            } finally {
                setCancelDisputeRunning(false);
                setCancelDispute(false);
            }
        }

        f();
    }, [cancelDispute, dispatch, cancelDisputeRunning, props.deal.id]);

    useEffect(() => {
        async function f() {
            if (!completeDispute || completeDisputeRunning) {
                return;
            }
            setCompleteDisputeRunning(true);
            let req = new CancelDisputeRequest();
            req.setDisputeid(props.deal.id);
            try {
                let resp = await grpcRunAsync<Dispute.AsObject>(apiClient.completeDispute, req, getToken());
                dispatch(UpdateDispute(resp));
                setRedirect("/dashboard");
            } catch (e) {
                console.log(e.message);
            } finally {
                setCompleteDisputeRunning(false);
                setCompleteDispute(false);
            }
        }

        f();
    }, [completeDispute, dispatch, completeDisputeRunning, props.deal.id]);

    useEffect(() => {
        let ev = events.filter(p => p.dealnewmessage?.id === props.deal.id);
        setMarkEvents(ev);
    }, [props.deal.id, events]);

    useMarkAsReadedEvents(markEvents,
        () => {
        },
        () => {
            setMarkEvents([]);
        },
        setError);


    function getDealStatusLocalized() {
        const DealStatus = {
            0: strings.opened,
            1: strings.completed,
            2: strings.canceled,
            3: strings.disputed,
            4: strings.waitDeposit
        };
        //return DealStatus[props.deal!.getStatus()]
        return DealStatus[props.deal.status]
    }

    if (redirect !== "") {
        return (
            <Redirect to={redirect}/>
        )
    }

    return (
        <Row>
            <Col {...Col6_12}>
                <Chat deal={props.deal}/>
            </Col>
            <Col {...Col6_12}>
                <Card>
                    <CardHeader>
                        <MyRow isHrDisabled={true} description="Статус сделки:" data={
                            <h6>{getDealStatusLocalized()}</h6>
                        }/>
                    </CardHeader>
                    <CardBody>
                        {error !== "" ?
                            <Alert color="danger">{error}</Alert>
                            : null
                        }
                        <Row className="p-2">
                            <Col>
                                <LoadingBtn loading={completeDisputeRunning} outline className="btn-block"
                                            onClick={() => setCompleteDispute(true)}
                                            color="success">
                                    {strings.complete}
                                </LoadingBtn>
                            </Col>
                        </Row>
                        <Row className="p-2">
                            <Col>
                                <LoadingBtn loading={cancelDisputeRunning} outline className="btn-block" color="danger"
                                            onClick={() => setCancelDispute(true)}>
                                    {strings.cancelDeal}
                                </LoadingBtn>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};