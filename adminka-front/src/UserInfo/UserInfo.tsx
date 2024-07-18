import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Card, CardBody, CardHeader, Col, Container, Row,} from "reactstrap";
import {useMappedState} from "redux-react-hook";
import {Col6_12} from "../global";
import {createMatchSelector} from "connected-react-router";
import {
    Feedback,
    GetUserFeedbacksRequest,
    GetUserFeedbacksResponse,
    GetUserInfoRequest,
    GetUserInfoResponse,
    UserInfo
} from "../Protos/api_pb";
import {getToken, GrpcError, toDate, apiClient, grpcRunAsync} from "../helpers";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/UserInfo/UserInfo";
import {AuthState, IStore} from "../redux/interfaces";
import {far, IconDefinition, IconLookup} from "@fortawesome/pro-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, library} from "@fortawesome/fontawesome-svg-core";
import {AccountStatistic} from "./AccountStatistic";
import {DealsStatistic} from "./DealsStatistic";
import {InvoiceStatistic} from "./InvoiceStatistic";
import {useStrings} from "../Hooks";

library.add(far);
const thumbsUpLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-up'};
const thumbsUpDefinition: IconDefinition = findIconDefinition(thumbsUpLookup);
const thumbsDownLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-down'};
const thumbsDownDefinition: IconDefinition = findIconDefinition(thumbsDownLookup);


export const UserInfoPage = () => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            router: store.router,
        }), []
    );
    const {authState, router} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [loadTime, setLoadTime] = useState<Date | null>(null);
    const [info, setInfo] = useState<UserInfo.AsObject | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback.AsObject[] | null>(null);
    const [getUserInfoRunning, setGetUserInfoRunning] = useState(false);
    const [getUserFeadbacksRunning, setGetUserFeedbacksRunning] = useState(false);


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
        if (getUserInfoRunning || authState === AuthState.NotAuthed)
            return;
        setError("");
        setGetUserInfoRunning(true);

        function getId() {
            const matchSelector = createMatchSelector("/dashboard/userinfo/:id");
            const match = matchSelector({router});
            if (match === null)
                return null;
            const id = (match.params as { id?: string }).id;
            if (id !== undefined)
                return id;
            return null;
        }

        async function getInfo() {
            let req = new GetUserInfoRequest();
            req.setId(getId()!);

            try {
                let resp = await grpcRunAsync<GetUserInfoResponse.AsObject>(apiClient.getUserInfo, req, getToken());
                if (resp.userinfo !== undefined) {
                    setInfo(resp.userinfo);
                    setLoadTime(new Date());
                }
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(e.message);
                }
            } finally {
                setGetUserInfoRunning(false);
            }
        }


        if (info === null) {
            getInfo();
        }
    }, [authState, getUserInfoRunning, info, router]);


    useEffect(() => {
        if (getUserFeadbacksRunning || authState === AuthState.NotAuthed || feedbacks !== null)
            return;
        setFeedbacks(null);
        setError("");
        setGetUserFeedbacksRunning(true);

        function getId() {
            const matchSelector = createMatchSelector("/dashboard/userinfo/:id");
            const match = matchSelector({router});
            if (match === null)
                return null;
            const id = (match.params as { id?: string }).id;
            if (id !== undefined)
                return id;
            return null;
        }

        async function f() {
            let req = new GetUserFeedbacksRequest();
            req.setUserid(getId()!);
            req.setStartid(0);
            req.setCount(-10);
            req.setIsdealsfeedbacks(true);

            let ff: Feedback.AsObject[] = [];

            try {
                let resp = await grpcRunAsync<GetUserFeedbacksResponse.AsObject>(apiClient.getUserFeedbacks, req, getToken());
                ff = ff.concat(resp.feedbacksList);
                req.setIsdealsfeedbacks(false);
                resp = await grpcRunAsync<GetUserFeedbacksResponse.AsObject>(apiClient.getUserFeedbacks, req, getToken());
                ff = ff.concat(resp.feedbacksList);
                ff = ff.sort((a, b) => b.id - a.id);
                setFeedbacks(ff);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(e.message);
                }
            } finally {
                setGetUserFeedbacksRunning(false);
            }
        }

        f();

    }, [authState, getUserFeadbacksRunning, feedbacks, router]);

    if (info === null || loadTime == null) {
        return (
            <Loading/>
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

        </Container>
    );
};