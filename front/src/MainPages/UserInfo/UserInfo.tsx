import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, CardHeader, Col, Container, Input, Row,} from "reactstrap";
import {useMappedState} from "redux-react-hook";
import {Col6_12} from "../../global";
import {
    AddUserToTrustedRequest,
    BlockUserRequest,
    CreateUserComplaintRequest,
    Feedback,
    GetUserFeedbacksRequest,
    GetUserFeedbacksResponse,
    GetUserInfoRequest,
    GetUserInfoResponse,
    IsUserBlockedRequest,
    IsUserBlockedResponse,
    IsUserTrustedRequest,
    IsUserTrustedResponse,
    RemoveFromTrustedRequest,
    UnBlockUserRequest,
    UserInfo
} from "../../Protos/api_pb";
import {getToken, GrpcError, toDate, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {Loading} from "../../Loading";
import {AdTable, IAdTableProps} from "../AdTable";
import {data, IStrings} from "../../localization/UserInfo/UserInfo";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {far, IconDefinition, IconLookup} from "@fortawesome/pro-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, library} from "@fortawesome/fontawesome-svg-core";
import {AccountStatistic} from "./AccountStatistic";
import {DealsStatistic} from "./DealsStatistic";
import {InvoiceStatistic} from "./InvoiceStatistic";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../../Hooks";
import {errors} from "../../localization/Errors";
import {useRouteMatch} from 'react-router-dom';

library.add(far);
const thumbsUpLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-up'};
const thumbsUpDefinition: IconDefinition = findIconDefinition(thumbsUpLookup);
const thumbsDownLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-down'};
const thumbsDownDefinition: IconDefinition = findIconDefinition(thumbsDownLookup);


export const UserInfoPage = () => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            catalog: store.catalog,
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [loadTime, setLoadTime] = useState<Date | null>(null);
    const [info, setInfo] = useState<UserInfo.AsObject | null>(null);
    const [tablePropsBuy, setTablePropsBuy] = useState<IAdTableProps>({
        isBuy: true,
        disabled: true
    });
    const [tablePropsSell, setTablePropsSell] = useState<IAdTableProps>({
        isBuy: false,
        disabled: true
    });

    const [feedbacks, setFeedbacks] = useState<Feedback.AsObject[] | null>(null);
    const [isUserTrusted, setIsUserTrusted] = useState<boolean | null>(null);
    const [isUserBlocked, setIsUserBlocked] = useState<boolean | null>(null);
    const [isComplaintOpen, setIsComplaintOpen] = useState(false);
    const [blockUser, setblockUser] = useState(false);
    const [blockUserRunning, setBlockUserRunning] = useState(false);
    const [trustUser, setTrustUser] = useState(false);
    const [trustUserRunning, setTrustUserRunning] = useState(false);
    const [unBlockUser, setUnBlockUser] = useState(false);
    const [unBlockUserRunning, setUnBlockUserRunning] = useState(false);
    const [unTrustUser, setUnTrustUser] = useState(false);
    const [unTrustUserRunning, setUntrustUserRunning] = useState(false);
    const [getUserInfoRunning, setGetUserInfoRunning] = useState(false);
    const [getUserFeadbacksRunning, setGetUserFeedbacksRunning] = useState(false);
    const [isIsTrustedRunning, setGetIsTrustedRunning] = useState(false);
    const [isBlockedRunning, setIsBlockingRunning] = useState(false);
    const [complaintText, setComplaintText] = useState("");
    const [complaintContact, setComplaintContact] = useState("");
    const [complaintSend, setComplaintSend] = useState(false);
    const [complaintSendRunning, setComplaintSendRunning] = useState(false);
    const [complaintSendSuccess, setComplaintSendSuccess] = useState(false);
    const idMath = useRouteMatch("/userinfo/:id");
    const userIdCb = useCallback(() => {
        // @ts-ignore
        return idMath?.params.id;
    }, [idMath])
    const userId = userIdCb();


    function Delimiter(date: Date, isPositive: boolean) {
        return <div key={"DateDelimiter" + date.getTime().toString()}
                    className="d-block border border-gray w-100 text-center border-top-0 border-right-0 border-left-0 w-100 text-secondary small">
            <FontAwesomeIcon className={isPositive ? "text-success" : "text-danger"}
                             icon={isPositive ? thumbsUpDefinition : thumbsDownDefinition}/>
            &nbsp;
            {date.toLocaleString()}
        </div>
    }

    function feedback(feedback: Feedback.AsObject, index: number) {
        return (
            <Row key={index}>
                <Col>
                    {Delimiter(toDate(feedback.createdat), feedback.ispositive)}
                    {feedback.text!.split("\n").map((t, i) => <div className="d-block" key={i}>{t}</div>)}
                </Col>
            </Row>
        );
    }

    useEffect(() => {
        if (userId === null || getUserInfoRunning || authState === AuthState.NotAuthed)
            return;
        setError("");
        setGetUserInfoRunning(true);

        async function getInfo() {
            let req = new GetUserInfoRequest();
            req.setId(userId);

            try {
                let resp = await TradeGrpcRunAsync<GetUserInfoResponse.AsObject>(tradeApiClient.getUserInfo, req, getToken());
                if (resp.userinfo !== undefined) {
                    setInfo(resp.userinfo);
                    setLoadTime(new Date());
                    setTablePropsBuy({
                        userId: resp.userinfo.id,
                        isBuy: true,
                        disabled: false
                    });
                    setTablePropsSell({
                        userId: resp.userinfo.id,
                        isBuy: false,
                        disabled: false
                    });
                }
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setGetUserInfoRunning(false);
            }
        }

        async function getIsTrusted() {
            let req = new IsUserTrustedRequest();
            req.setUserid(userId);
            try {
                let resp = await TradeGrpcRunAsync<IsUserTrustedResponse.AsObject>(tradeApiClient.isUserTrusted, req, getToken());
                setIsUserTrusted(resp.istrusted);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setGetIsTrustedRunning(false);
            }
        }

        async function getIsBlocked() {
            let req = new IsUserBlockedRequest();
            req.setUserid(userId);
            try {
                let resp = await TradeGrpcRunAsync<IsUserBlockedResponse.AsObject>(tradeApiClient.isUserBlocked, req, getToken());
                setIsUserBlocked(resp.isblocked);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setIsBlockingRunning(false);
            }
        }

        if (info === null) {
            // noinspection JSIgnoredPromiseFromCall
            getInfo();
        }
        if (isUserTrusted === null && !isIsTrustedRunning) {
            setGetIsTrustedRunning(true);
            // noinspection JSIgnoredPromiseFromCall
            getIsTrusted();
        }
        if (isUserBlocked === null && !isBlockedRunning) {
            setIsBlockingRunning(true);
            // noinspection JSIgnoredPromiseFromCall
            getIsBlocked();
        }
    }, [userId, authState, getUserInfoRunning, isUserBlocked, isUserTrusted, info, isBlockedRunning, isIsTrustedRunning]);

    useEffect(() => {
        if (!blockUser || authState === AuthState.NotAuthed || isUserBlocked || userId === null || blockUserRunning)
            return;
        setError("");
        setBlockUserRunning(true);
        setblockUser(false);

        async function f() {
            let req = new BlockUserRequest();
            req.setUserid(userId!);
            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.blockUser, req, getToken());
                setIsUserBlocked(true);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setBlockUserRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, blockUser, blockUserRunning, isUserBlocked, userId]);
    useEffect(() => {
        if (!unBlockUser || authState === AuthState.NotAuthed || !isUserBlocked || userId === null || unBlockUserRunning)
            return;
        setError("");
        setUnBlockUserRunning(true);
        setUnBlockUser(false);

        async function f() {
            let req = new UnBlockUserRequest();
            req.setUserid(userId!);
            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.unBlockUser, req, getToken());
                setIsUserBlocked(false);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setUnBlockUserRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, unBlockUser, isUserBlocked, unBlockUserRunning, userId]);
    useEffect(() => {
        if (!trustUser || authState === AuthState.NotAuthed || isUserTrusted || userId === null || trustUserRunning)
            return;
        setError("");
        setTrustUser(false);
        setTrustUserRunning(true);

        async function f() {
            let req = new AddUserToTrustedRequest();
            req.setUserid(userId!);
            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.addUserToTrusted, req, getToken());
                setIsUserTrusted(true);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setTrustUserRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, trustUser, isUserTrusted, trustUserRunning, userId]);
    useEffect(() => {
        if (!unTrustUser || authState === AuthState.NotAuthed || !isUserTrusted || userId === null || unTrustUserRunning)
            return;
        setError("");
        setUnTrustUser(false);
        setUntrustUserRunning(true);

        async function f() {
            let req = new RemoveFromTrustedRequest();
            req.setUserid(userId!);
            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.removeFromTrustedUsers, req, getToken());
                setIsUserTrusted(false);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setUntrustUserRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, unTrustUser, isUserTrusted, unTrustUserRunning, userId]);
    useEffect(() => {
        if (!complaintSend || authState === AuthState.NotAuthed || complaintSendSuccess || userId === null || complaintSendRunning)
            return;
        setError("");
        setComplaintSendRunning(true);
        setComplaintSend(false);

        async function f() {
            let req = new CreateUserComplaintRequest();
            req.setUserid(userId!);
            req.setText(complaintText);
            req.setContact(complaintContact);

            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.createUserComplaint, req, getToken());
                setComplaintSendSuccess(true);
                setIsComplaintOpen(false);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setComplaintSendRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, complaintSend, complaintContact, complaintSendRunning, complaintSendSuccess, complaintText, userId]);

    useEffect(() => {
        if (userId == null || getUserFeadbacksRunning || authState === AuthState.NotAuthed || feedbacks !== null)
            return;
        setError("");
        setGetUserFeedbacksRunning(true);

        async function f() {
            let req = new GetUserFeedbacksRequest();
            req.setUserid(userId!);
            req.setStartid(0);
            req.setCount(-10);
            req.setIsdealsfeedbacks(true);

            let ff: Feedback.AsObject[] = [];

            try {
                let resp = await TradeGrpcRunAsync<GetUserFeedbacksResponse.AsObject>(tradeApiClient.getUserFeedbacks, req, getToken());
                ff = ff.concat(resp.feedbacksList);
                req.setIsdealsfeedbacks(false);
                resp = await TradeGrpcRunAsync<GetUserFeedbacksResponse.AsObject>(tradeApiClient.getUserFeedbacks, req, getToken());
                ff = ff.concat(resp.feedbacksList);
                ff = ff.sort((a, b) => b.id - a.id);
                setFeedbacks(ff);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setGetUserFeedbacksRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [userId, authState, getUserFeadbacksRunning]);

    if (info === null || isUserBlocked === null || isUserTrusted === null || loadTime == null) {
        return (
            <React.Fragment>
                <Loading/>
                {AdTable(tablePropsBuy)}
                {AdTable(tablePropsSell)}
            </React.Fragment>
        );
    }


    return (
        <Container>
            <Row>
                <Col>
                    <h3>{strings.info}{info.username}</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""}>{error}</Alert>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col {...Col6_12}>
                    <Row>
                        <Col>
                            <AccountStatistic info={info} loadTime={loadTime}/>
                        </Col>
                    </Row>
                    {(authState !== AuthState.NotAuthed && userId === profile.UserId) || authState === AuthState.NotAuthed || userId === null ? null :
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        {!isUserTrusted ?
                                            <Button outline disabled={authState !== AuthState.Authed} color="warning"
                                                    className="btn-block"
                                                    onClick={() => setTrustUser(true)}
                                            >
                                                {authState === AuthState.Authed ? strings.toTrustEnabled : strings.toTrustDisabled}
                                            </Button>
                                            :
                                            <Button outline disabled={authState !== AuthState.Authed} color="warning"
                                                    className="btn-block"
                                                    onClick={() => setUnTrustUser(true)}
                                            >
                                                {authState === AuthState.Authed ? strings.removeTrust : strings.toTrustDisabled}
                                            </Button>
                                        }
                                        {!isComplaintOpen && !complaintSendSuccess ?
                                            <Button outline disabled={authState !== AuthState.Authed}
                                                    className="btn-block"
                                                    onClick={() => setIsComplaintOpen(true)}
                                            >
                                                {authState === AuthState.Authed ? strings.complainEnabled : strings.complainDisabled}
                                            </Button>
                                            : null
                                        }
                                        {isComplaintOpen && !complaintSendSuccess ?
                                            <>
                                            <textarea className="w-100 mt-3" rows={3}
                                                      placeholder={strings.complaintPh}
                                                      onChange={event => setComplaintText(event.currentTarget.value)}
                                            />
                                                <Input className="w-100 mb-1"
                                                       placeholder={strings.complaintContactPh}
                                                       onChange={event => setComplaintContact(event.currentTarget.value)}
                                                />
                                                <Button className="mb-3 w-100"
                                                        onClick={() => setComplaintSend(true)}
                                                >{strings.complaintSend}</Button>
                                            </>
                                            : null
                                        }
                                        {complaintSendSuccess ?
                                            <Button outline disabled={true}
                                                    className="my-2 w-100">{strings.complaintSent}</Button>
                                            : null
                                        }
                                        {!isUserBlocked ?
                                            <Button outline disabled={authState !== AuthState.Authed} color="danger"
                                                    className="btn-block"
                                                    onClick={() => setblockUser(true)}
                                            >
                                                {authState === AuthState.Authed ? strings.blockUser : strings.blockUserAuth}
                                            </Button>
                                            :
                                            <Button outline disabled={authState !== AuthState.Authed} color="danger"
                                                    className="btn-block"
                                                    onClick={() => setUnBlockUser(true)}
                                            >
                                                {authState === AuthState.Authed ? strings.unblockUser : strings.blockUserAuth}
                                            </Button>
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <Card className="mt-3">
                                <CardHeader>
                                    <h6>{strings.feedbacks}</h6>
                                </CardHeader>
                                <CardBody>
                                    {feedbacks === null || feedbacks.length === 0 ?
                                        strings.noFeedbacks
                                        :
                                        feedbacks.map((t, i) => feedback(t, i))
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col {...Col6_12}>
                    <Row>
                        <Col>
                            <DealsStatistic info={info} loadTime={loadTime}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InvoiceStatistic info={info}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="my-3">
                        <CardHeader>
                            {strings.ad}<span className="font-weight-bold">{info.username}</span>{strings.buy}
                        </CardHeader>
                        <CardBody>
                            {AdTable(tablePropsBuy)}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>
                            {strings.ad}<span className="font-weight-bold">{info.username}</span>{strings.sell}
                        </CardHeader>
                        <CardBody>
                            {AdTable(tablePropsSell)}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};