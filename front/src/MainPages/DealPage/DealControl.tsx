import * as React from "react";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Collapse, Row} from "reactstrap";
import {Col6_12} from "../../global";
import {Chat} from "../Chat";

import {
    CancelDealRequest,
    CancelDealResponse,
    CreateDisputeRequest,
    CreateDisputeResponse, Deal,
    DealStatus,
    IPayedRequest,
    IPayedResponse,
} from "../../Protos/api_pb";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, IEvent, IStore} from "../../redux/store/Interfaces";
import {getToken, GrpcError, toDate, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {DealCanceled, LoadDeals, MarkAsReadedDeal} from "../../redux/actions";
import {data, IStrings} from "../../localization/DealPage/DealControl"
import {useMarkAsReadedEvents, useStrings} from "../../Hooks";
import {DealFeedback} from "./DealFeedback";
import {errors} from "../../localization/Errors";
import {DealLnFunding} from "./DealLnFunding";


export interface IDealControlProps {
    dealId: number;
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
            userId: store.profile.UserId,
            authState: store.auth.state,
            deals: store.deals
        }), []
    );
    const {userId, authState, deals} = useMappedState(mapState);

    const [cancelDeal, setCancelDeal] = useState(false);
    const [iPayed, setIpayed] = useState(false);
    const [creteDispute, setCreateDispute] = useState(false);
    const [cancelDealRunning, setCancelDealRunning] = useState(false);
    const [iPayedRunning, setIpayedRunning] = useState(false);
    const [creteDisputeRunning, setCreateDisputeRunning] = useState(false);
    const [error, setError] = useState("");
    const [dealCanceledAlert, setDealCanceledAlert] = useState(false);
    const [dealCompletedAlert, setDealCompletedAlert] = useState(false);
    const [dealDisputedAlert, setDealDisputedAlert] = useState(false);
    const [dealFiatPayedAlert, setDealFiatPayedAlert] = useState(false);
    const [markEvents, setMarkEvents] = useState<IEvent[] | null>(null);
    const [memoId, setMemoId] = useState<number | null>(null);
    const [memoStatus, setMemoStatus] = useState<DealStatus | null>(null);
    const [memoFiatPaid, setMemoFiatPaid] = useState<boolean | null>(null);
    const dealCb = useCallback(() => {
        let id = props.dealId;
        // eslint-disable-next-line eqeqeq
        let d = deals.deals.find(p => p.id == id);
        if (d === undefined) {
            return null;
        }
        return d;
    }, [props.dealId, deals.deals]);
    let deal = dealCb();

    useEffect(() => {
        if (!deal) {
            return;
        }
        if (memoId !== deal.id) {
            setMemoId(deal!.id);
            setMemoStatus(deal!.status);
            setMemoFiatPaid(deal!.isfiatpayed);
        }

        if (memoStatus !== null && (memoStatus !== deal.status || memoFiatPaid !== deal.isfiatpayed)) {
            setMemoStatus(deal.status);
            setMemoFiatPaid(deal.isfiatpayed);
            DealStatusChanged(deal!.status, iPayed);
        }
    }, [deal, iPayed, memoId, memoStatus, memoFiatPaid]);

    useEffect(() => {
        if (deal && memoFiatPaid !== null && memoFiatPaid !== deal.isfiatpayed) {
            setMemoFiatPaid(deal.isfiatpayed);
            setDealFiatPayedAlert(true);
        }
    }, [memoFiatPaid, deal])

    useEffect(() => {
        setDealCanceledAlert(false);
        setDealCompletedAlert(false);
        setDealDisputedAlert(false);
        setDealFiatPayedAlert(false);
    }, [props.dealId])

    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        let events: IEvent[] | null = deals.newEvents.filter(p => p.dealId == props.dealId);
        if (deal === null) {
            events = null;
        } else {
            dispatch(MarkAsReadedDeal(deal));
        }

        if (authState === AuthState.NotAuthed) {
            events = null;
        }
        setMarkEvents(events);


    }, [props.dealId, deals, authState, deal, dispatch]);

    useMarkAsReadedEvents(markEvents,
        () => {
        },
        () => {
            setMarkEvents(null);
            if (deal) {
                dispatch(MarkAsReadedDeal(deal));
            }
        },
        setError);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || userId === "" || !cancelDeal || cancelDealRunning)
            return;
        setCancelDeal(false);
        setCancelDealRunning(true);
        setError("");

        async function f() {
            let req = new CancelDealRequest();
            req.setDealid(props.dealId);

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<CancelDealResponse.AsObject>(tradeApiClient.cancelDeal, req, token);
                dispatch(DealCanceled(resp.deal!));
                DealStatusChanged(resp.deal!.status);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setCancelDealRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, userId, cancelDeal, cancelDealRunning, dispatch, props.dealId]);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || userId === "" || !iPayed || iPayedRunning)
            return;
        setIpayed(false);
        setIpayedRunning(true);
        setError("");

        async function f() {
            let req = new IPayedRequest();
            req.setDealid(props.dealId);

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<IPayedResponse.AsObject>(tradeApiClient.iPayed, req, token);
                let arr = [resp.deal!];
                dispatch(LoadDeals(arr));
                DealStatusChanged(resp.deal!.status, true);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setIpayedRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, userId, iPayed, iPayedRunning, dispatch, props.dealId]);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || userId === "" || !creteDispute || creteDisputeRunning)
            return;
        setCreateDispute(false);
        setCreateDisputeRunning(true);
        setError("");

        async function f() {
            let req = new CreateDisputeRequest();
            req.setDealid(props.dealId);

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<CreateDisputeResponse.AsObject>(tradeApiClient.createDispute, req, token);
                let arr = [resp.deal!];
                dispatch(LoadDeals(arr));
                DealStatusChanged(resp.deal!.status);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setCreateDisputeRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, userId, creteDispute, creteDisputeRunning, dispatch, props.dealId]);

    function DealStatusChanged(status: DealStatus, isPayed?: boolean) {
        if (status === DealStatus.DISPUTED) {
            setDealDisputedAlert(true);
        } else if (status === DealStatus.CANCELED) {
            setDealCanceledAlert(true);
        } else if (status === DealStatus.COMPLETED) {
            setDealCompletedAlert(true);
        } else if (status === DealStatus.OPENED && isPayed) {
            setDealFiatPayedAlert(true);
        }
    }

    function getDealStatusLocalized() {
        const DealStatus = {
            0: strings.opened,
            1: strings.completed,
            2: strings.canceled,
            3: strings.disputed,
            4: strings.waitDeposit
        };
        //return DealStatus[props.deal!.getStatus()]
        return DealStatus[deal!.status]
    }


    function isDisputeAvailable() {
        if (deal!.status === DealStatus.OPENED)
            return true;
        if (deal!.status === DealStatus.DISPUTED)
            return false;
        if (toDate(deal!.disputedat).getFullYear() !== 1)
            return false;
        if (toDate(deal?.createdat).getTime() + deal!.advertisement!.window * 60000 < new Date().getTime()) {
            return false;
        }
    }

    function isPartnerPayed() {
        if (deal!.initiator!.id === userId) {// i am initiator
            if (deal!.advertisement!.isbuy) {
                return deal!.isfiatpayed;
            }
            return deal!.status === DealStatus.COMPLETED;
        } else {
            if (deal!.advertisement!.isbuy) {
                return deal!.status === DealStatus.COMPLETED;
            }
            return deal!.isfiatpayed;
        }

    }

    function getPartnerCurrency() {
        if (deal!.initiator!.id === userId) {// i am initiator
            if (deal!.advertisement!.isbuy) {
                return deal!.advertisement!.fiatcurrency;
            }
            return "BTC";
        } else {
            if (deal!.advertisement!.isbuy) {
                return "BTC";
            }
            return deal!.advertisement!.fiatcurrency;
        }
    }

    function isIPayFiat() {
        if (deal!.initiator!.id === userId) {// i am initiator
            return !deal!.advertisement!.isbuy;

        } else {
            return deal!.advertisement!.isbuy;

        }
    }

    function getMyCurrency() {
        if (deal!.initiator!.id === userId) {// i am initiator
            if (deal!.advertisement!.isbuy) {
                return "BTC";
            }
            return deal!.advertisement!.fiatcurrency;
        } else {
            if (deal!.advertisement!.isbuy) {
                return deal!.advertisement!.fiatcurrency;
            }
            return "BTC";
        }
    }

    if (deal == null)
        return null;

    return (
        <Row>
            <Col {...Col6_12}>
                <Collapse isOpen={deal.status === DealStatus.WAITDEPOSIT}>
                    <DealLnFunding deal={deal}/>
                </Collapse>
                <Collapse isOpen={deal.status !== DealStatus.WAITDEPOSIT}>
                    <Chat deal={deal}/>
                </Collapse>
            </Col>
            <Col {...Col6_12}>
                <Card>
                    <CardHeader>
                        <MyRow isHrDisabled={true} description={strings.dealStatus} data={
                            <h6>{getDealStatusLocalized()}</h6>
                        }/>
                        {!isIPayFiat() ?
                            <MyRow isHrDisabled={true}
                                   description={strings.partnerPaid + " " + getPartnerCurrency() + ":"}
                                   data={
                                       <h6>{isPartnerPayed() ? strings.yes : strings.no}</h6>
                                   }/>
                            : null
                        }
                    </CardHeader>
                    {deal.withdrawalstatus?.status === Deal.WithdrawalStatusMsg.StatusEnum.NONE ?
                        <CardBody>
                            {error !== "" ?
                                <Alert color="danger">{error}</Alert>
                                : null
                            }
                            <Row>
                                <Col>
                                    <Alert color="secondary" isOpen={dealCanceledAlert}
                                           toggle={() => setDealCanceledAlert(false)}>
                                        {strings.dealCanceled}
                                    </Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert color="success" isOpen={dealCompletedAlert}
                                           toggle={() => setDealCompletedAlert(false)}>
                                        {strings.dealCompleted}
                                    </Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert color="danger" isOpen={dealDisputedAlert}
                                           toggle={() => setDealDisputedAlert(false)}>
                                        {strings.dealDisputed}
                                    </Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Alert color="warning" isOpen={dealFiatPayedAlert}
                                           toggle={() => setDealFiatPayedAlert(false)}>
                                        {strings.dealFiatPayed}
                                    </Alert>
                                </Col>
                            </Row>
                            <Row className="p-2">
                                <Col>
                                    <Button outline className="btn-block"
                                            disabled={deal!.status !== DealStatus.OPENED || (isIPayFiat() && deal!.isfiatpayed)}
                                            onClick={() => setIpayed(true)}
                                            color="success">
                                        {isIPayFiat() ?
                                            strings.ipaid + getMyCurrency()
                                            :
                                            strings.transfer + getMyCurrency()
                                        }
                                    </Button>
                                </Col>
                                <Col>
                                    {isIPayFiat() ?
                                        <small className="text-secondary">
                                            {strings.payDesc1}
                                        </small>
                                        :
                                        <small className="text-secondary">
                                            {strings.payDesc2}
                                        </small>
                                    }
                                </Col>
                            </Row>
                            <Row className="p-2">
                                <Col>
                                    <Button outline className="btn-block"
                                            disabled={!isDisputeAvailable()}
                                            onClick={() => setCreateDispute(true)}
                                            color="danger">
                                        {strings.createDispute}
                                    </Button>
                                </Col>
                                <Col>
                                    <small className="text-secondary">
                                        {strings.arbitr}
                                    </small>
                                </Col>
                            </Row>
                            <Row className="p-2">
                                <Col>
                                    <Button outline className="btn-block"
                                            onClick={() => setCancelDeal(true)}
                                            disabled={(deal!.status !== DealStatus.OPENED && deal!.status !== DealStatus.WAITDEPOSIT) || deal!.isfiatpayed}
                                    >
                                        {strings.cancelDeal}
                                    </Button>
                                </Col>
                                <Col>
                                    <small className="text-secondary">
                                        {strings.cancelDealDesc}
                                    </small>
                                </Col>
                            </Row>
                        </CardBody>
                        :
                        <CardBody>
                            <CardTitle>
                                <h6>
                                    {strings.withdraw}
                                </h6>
                            </CardTitle>
                            <Alert color="success"
                                   isOpen={deal.withdrawalstatus?.status === Deal.WithdrawalStatusMsg.StatusEnum.SUCCESS}>
                                {strings.withdrawSuccess}
                            </Alert>
                            <Alert color="warning"
                                   isOpen={deal.withdrawalstatus?.status === Deal.WithdrawalStatusMsg.StatusEnum.STARTED}>
                                {strings.withdrawStarted}
                            </Alert>
                            <Alert color="info"
                                   isOpen={deal.withdrawalstatus?.status === Deal.WithdrawalStatusMsg.StatusEnum.WAITING}>
                                {strings.withdrawStarted}
                            </Alert>
                            <Alert color="danger"
                                   isOpen={deal.withdrawalstatus?.status === Deal.WithdrawalStatusMsg.StatusEnum.FAILED}>
                                {strings.withdrawFailed}
                                {deal.withdrawalstatus?.error}{" "}
                                {strings.withdrawFailed1}
                            </Alert>
                        </CardBody>
                    }
                </Card>
                {props.hideFeedback ? null :
                    <DealFeedback deal={deal!}/>
                }
            </Col>
        </Row>
    );
};