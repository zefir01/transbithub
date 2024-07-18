import * as React from "react";
import {Dispute, DisputeRequest, GiveAwayDisputeRequest} from "../Protos/adminka_pb";
import {
    Alert,
    Button, Col,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from "reactstrap";
import {data, IStrings} from "../localization/Dashboard/DisputeItem";
import {useMarkAsReadedEvents, useStrings} from "../Hooks";
import {DisputeItem} from "./DisputeItem";
import {useCallback, useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {apiClient, getToken, GrpcError, grpcRunAsync} from "../helpers";
import {useDispatch, useMappedState} from "redux-react-hook";
import {UpdateDispute} from "../redux/actions";
import {errors} from "../localization/Errors";
import {IStore} from "../redux/interfaces";
import {Event} from "../Protos/api_pb";

export interface DisputesTableProps {
    disputes?: Dispute.AsObject[]
}

interface SupportSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    select: (userId: string) => void;
}

const SupportSelectorModal = (props: SupportSelectorModalProps) => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userid: store.profile.profile?.userid,
            accounts: store.supportAccounts.accounts
        }), []
    );
    const {userid, accounts} = useMappedState(mapState);
    const [selected, setSelected] = useState("");

    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h5>{strings.selectUser}</h5>
            </ModalHeader>
            <ModalBody>
                <ListGroup>
                    {accounts === undefined || accounts.filter(p => p.id !== userid) ?
                        <p>{strings.notFound}</p>
                        :
                        accounts.map(p => {
                            return (
                                <ListGroupItem key={p.id} active={selected === p.id} tag="button" action
                                               onClick={() => setSelected(p.id)}>
                                    {p.username}
                                </ListGroupItem>
                            )
                        })
                    }
                </ListGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
                <Button disabled={selected === ""} color="primary"
                        onClick={() => props.select(selected)}>{strings.select}</Button>
            </ModalFooter>
        </Modal>
    );
}

export const DisputesTable = (props: DisputesTableProps) => {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            events: store.disputes.events
        }), []
    );
    const {events} = useMappedState(mapState);

    const [redirect, setRedirect] = useState("");
    const [toWork, setToWork] = useState<number | null>(null);
    const [stopWork, setStopWork] = useState<number | null>(null);
    const [giveAway, setGiveAway] = useState<number | null>(null);
    const [giveAwayUserId, setGiveAwayUserId] = useState("");
    const [running, setRunning] = useState(false);
    const [error, setError] = useState("");
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [markEvents, setMarkEvents] = useState<Event.AsObject[]>([]);

    useEffect(() => {
        async function f() {
            if (toWork === null || running) {
                return;
            }
            setRunning(true);
            let req = new DisputeRequest();
            req.setDisputeid(toWork);
            try {
                let resp = await grpcRunAsync<Dispute.AsObject>(apiClient.toWorkDispute, req, getToken());
                dispatch(UpdateDispute(resp));
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(e.message);
                }
            } finally {
                setRunning(false);
                setToWork(null);
            }
        }

        f();
    }, [toWork, running, dispatch]);

    useEffect(() => {
        async function f() {
            if (stopWork === null || running) {
                return;
            }
            setRunning(true);
            let req = new DisputeRequest();
            req.setDisputeid(stopWork);
            try {
                let resp = await grpcRunAsync<Dispute.AsObject>(apiClient.stopWorkDispute, req, getToken());
                dispatch(UpdateDispute(resp));
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(e.message);
                }
            } finally {
                setRunning(false);
                setStopWork(null);
            }
        }

        f();
    }, [stopWork, running, dispatch]);

    useEffect(() => {
        async function f() {
            if (giveAway === null || giveAwayUserId === "" || running) {
                return;
            }
            setRunning(true);
            let req = new GiveAwayDisputeRequest();
            req.setDisputeid(giveAway);
            req.setUserid(giveAwayUserId);
            try {
                let resp = await grpcRunAsync<Dispute.AsObject>(apiClient.giveAwayDispute, req, getToken());
                dispatch(UpdateDispute(resp));
                let ev = events.filter(p => p.dealnewmessage?.id === giveAway);
                setMarkEvents(ev);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(e.message);
                }
            } finally {
                setRunning(false);
                setGiveAway(null);
                setGiveAwayUserId("");
            }
        }

        f();
    }, [giveAway, running, dispatch, giveAwayUserId, events]);

    useMarkAsReadedEvents(markEvents,
        () => {
        },
        () => {
            setMarkEvents([]);
        },
        setError);

    function getEventsCount(disputeId: number): number {
        return events.filter(p => p.dealnewmessage?.id === disputeId).length;
    }

    if (redirect !== "") {
        return (
            <Redirect to={redirect}/>
        )
    }

    if (props.disputes === undefined || props.disputes.length === 0) {
        return (
            <Row>
                <Col>
                    <Alert color="secondary">No disputes</Alert>
                </Col>
            </Row>
        )
    }

    return (
        <Row>
            <SupportSelectorModal isOpen={selectorOpen} onClose={() => {
                setGiveAwayUserId("");
                setSelectorOpen(false);
            }} select={select => {
                setGiveAwayUserId(select);
                setSelectorOpen(false);
            }}/>
            <Alert toggle={() => setError("")} isOpen={error !== ""} color="danger">{errors(error)}</Alert>
            <Table hover>
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{strings.createdAt}</th>
                    <th scope="col">{strings.dealType}</th>
                    <th scope="col">{strings.amount}</th>
                    <th scope="col">{strings.initiator}</th>
                    <th scope="col">{strings.owner}</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {
                    props.disputes.map(p => DisputeItem({
                        dispute: p,
                        strings: strings,
                        onClick: (id) => {
                            setRedirect("/dashboard/dispute/" + id);
                        },
                        loading: running && (toWork == p.dealid || stopWork == p.dealid || giveAway == p.dealid),
                        toWork: (id) => {
                            setToWork(id);
                            setRedirect("/dashboard/inWork");
                        },
                        stopWork: (id) => {
                            setStopWork(id);
                            let ev = events.filter(p => p.dealnewmessage?.id === id);
                            setMarkEvents(ev);
                        },
                        giveAway: (id) => {
                            setGiveAway(id);
                            setSelectorOpen(true);
                        },
                        eventsCount: getEventsCount(p.dealid)
                    }))
                }
                </tbody>
            </Table>
        </Row>
    );
}