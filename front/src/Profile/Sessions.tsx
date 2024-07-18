import {useMappedState} from "redux-react-hook";
import React, {useState, useEffect, useCallback} from 'react';
import {
    Alert,
    Button,
    Col, Collapse,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    NavItem, NavLink,
    Row,
    Table
} from "reactstrap";
import TwoFaPin from "./TwoFaPin";
import {data, IStrings} from "../localization/Profile/Sessions";
import {Loading} from "../Loading";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync, toDate, getToken} from "../helpers";
import * as profile_proto from "../Protos/profile_pb";
import humanizeDuration from "humanize-duration";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";

class Session {
    id: string;
    ip: string;
    createdat?: Date;
    expiredat?: Date;
    clientname: string;
    lastonline?: number;

    constructor(data: profile_proto.Session.AsObject) {
        this.id = data.id;
        this.ip = data.ip;
        this.createdat = toDate(data.createdat);
        this.expiredat = toDate(data.expiredat);
        this.clientname = data.clientname;
        this.lastonline = new Date().getTime() - toDate(data.lastonline).getTime();
    }
}

class Event {
    Ip: string;
    Time: Date;
    ClientName: string;
    Event: string;

    constructor(data: profile_proto.SessionEvent.AsObject) {
        this.Ip = data.ip;
        this.Time = toDate(data.time);
        this.ClientName = data.clientname;
        this.Event = data.event;
    }
}

class Data {
    Sessions: Session[];
    Events: Event[];


    constructor(data?: profile_proto.GetMySessionsResponse.AsObject) {
        if (data !== undefined) {
            this.Sessions = data.sessionsList.map((p) => new Session(p));
            this.Events = data.eventsList.map((p) => new Event(p));
        } else {
            this.Sessions = new Array<Session>();
            this.Events = new Array<Event>();
        }
    }

    RemoveSession(id: string): Data {
        let ret = new Data();
        ret.Events = this.Events;
        ret.Sessions = this.Sessions.filter(p => p.id !== id);
        return ret;
    }
}


const Sessions = () => {
    const strings: IStrings = useStrings(data);
    const [modal, setModal] = useState(false);
    const [tab, setTab] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [sessions, setSessions] = useState<Data | null>(null);
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [killingSession, setKillingSession] = useState("");
    const [killBtn, setKillBtn] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            lang: store.lang.Lang
        }), []
    );
    const {profile, authState, lang} = useMappedState(mapState);

    function duration(date: number): string {
        if (date < 75000)
            return "Online";

        return humanizeDuration(date,
            {
                language: lang,
                largest: 2,
                round: true,
                fallbacks: ['en']
            }
        );
    }

    function getLastOnline(date: number | undefined) {
        if (date === undefined)
            return "";
        let d = duration(date);
        if (d === "Online")
            return <strong className="text-success">{d}</strong>;
        return d;
    }

    useEffect(() => {
        if (authState !== AuthState.Authed || profile.UserId === "" || sessions !== null)
            return;

        async function f() {
            let req = new Empty();

            try {
                let resp = await ProfileGrpcRunAsync<profile_proto.GetMySessionsResponse.AsObject>(profileApiClient.getMySessions, req, getToken());
                setSessions(new Data(resp));
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    });
    useEffect(() => {
        if (authState !== AuthState.Authed || profile.Username === "" || killingSession === "" || (profile.EnabledTwoFA && (!pinOk || !killBtn)))
            return;
        setSuccess(false);
        setError("");
        setKillingSession("");
        setKillBtn(false);
        setSendLoading(true);

        async function f() {
            let req = new profile_proto.KillSessionRequest();
            req.setId(killingSession);
            req.setTwofa(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.killSession, req, getToken());
                setSessions(sessions !== null ? sessions.RemoveSession(killingSession) : sessions);
                setSuccess(true);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, profile.Username, profile.EnabledTwoFA, pinOk, killBtn, pin, sessions, killingSession]);


    if (authState !== AuthState.Authed || profile.Username === "" || sessions===null)
        return <Loading/>;

    return (
        <React.Fragment>
            <Modal isOpen={modal}>
                <ModalHeader>
                    {strings.TwoFa}
                </ModalHeader>
                <ModalBody>
                    <TwoFaPin onChanged={(status, value) => {
                        setPin(value);
                        setPinOk(status);
                    }}/>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" disabled={!pinOk || pin === ""}
                            onClick={() => {
                                setModal(false);
                                setKillBtn(true)
                            }}
                    >{strings.Kill}</Button>
                    <Button color="secondary"
                            onClick={() => {
                                setModal(false);
                                setKillingSession("");
                            }
                            }
                    >{strings.cancel}</Button>
                </ModalFooter>
            </Modal>

            <Container>
                <Row>
                    <Col>
                        <h1>{strings.Title}</h1>
                        <p>{strings.Info1}</p>
                        <p>{strings.Info2}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Nav tabs>
                            <NavItem>
                                <NavLink href="#" active={tab === 0}
                                         onClick={() => {
                                             if (tab !== 0)
                                                 setTab(0);
                                         }}>
                                    {strings.ActiveSessions}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#" active={tab === 1}
                                         onClick={() => {
                                             if (tab !== 1)
                                                 setTab(1);
                                         }}>
                                    {strings.SessionEvents}
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Collapse isOpen={tab === 0}>
                            <Collapse isOpen={error !== ""}>
                                <Alert color="danger">{error}</Alert>
                            </Collapse>
                            <Collapse isOpen={success}>
                                <Alert color="success">{strings.killSuccess}</Alert>
                            </Collapse>
                            <Table>
                                <thead>
                                <tr>
                                    <th scope="col">{strings.Ip}</th>
                                    <th scope="col">{strings.CreatedAt}</th>
                                    <th scope="col">{strings.ExpiredAt}</th>
                                    <th scope="col">{strings.ClientName}</th>
                                    <th scope="col">{strings.LastOnline}</th>
                                    <th scope="col"/>
                                </tr>
                                </thead>
                                <tbody>


                                {sessions !== null && sessions.Sessions.sort((a, b) => {
                                    if (a.createdat !== undefined && b.createdat !== undefined && a.createdat < b.createdat) return 1;
                                    if (a.createdat !== undefined && b.createdat !== undefined && a.createdat > b.createdat) return -1;
                                    return 0;
                                }).map((p) => {
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.ip}</td>
                                            <td>{p.createdat !== undefined ? p.createdat.toLocaleString() : ""}</td>
                                            <td>{p.expiredat !== undefined ? p.expiredat.toLocaleString() : ""}</td>
                                            <td>{p.clientname}</td>

                                            <td>{getLastOnline(p.lastonline)}</td>
                                            <td>
                                                <LoadingBtn loading={sendLoading} color="danger"
                                                        onClick={() => {
                                                            if (profile.EnabledTwoFA) {
                                                                setPin("");
                                                                setPinOk(false);
                                                                setModal(true);
                                                            }
                                                            setKillingSession(p.id);
                                                        }}
                                                >{strings.Kill}</LoadingBtn>
                                            </td>
                                        </tr>
                                    );
                                })}


                                </tbody>
                            </Table>
                        </Collapse>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Collapse isOpen={tab === 1}>
                            <Table>
                                <thead>
                                <tr>
                                    <th scope="col">{strings.Ip}</th>
                                    <th scope="col">{strings.Time}</th>
                                    <th scope="col">{strings.ClientName}</th>
                                    <th scope="col">{strings.Event}</th>
                                    <th scope="col"></th>
                                </tr>

                                {sessions !== null && sessions.Events.sort((a, b) => {
                                    if (a.Time !== undefined && b.Time !== undefined && a.Time < b.Time) return 1;
                                    if (a.Time !== undefined && b.Time !== undefined && a.Time > b.Time) return -1;
                                    return 0;
                                }).map(p => {
                                    return (
                                        <tr key={p.Time.toLocaleString()}>
                                            <td>{p.Ip}</td>
                                            <td>{p.Time.toLocaleString()}</td>
                                            <td>{p.ClientName}</td>
                                            <td>{p.Event}</td>
                                        </tr>);
                                })}

                                </thead>
                            </Table>
                        </Collapse>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Sessions;