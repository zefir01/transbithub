import * as React from "react";
import {Deal, InvoicePayment, SendFeedbackRequest} from "../../Protos/api_pb";
import {Alert, Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {data, IStrings} from "../../localization/DealPage/DealControl";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {LoadDeals} from "../../redux/actions";
import {errors} from "../../localization/Errors";
import {useStrings} from "../../Hooks";

library.add(far);
const thumbsUpLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-up'};
const thumbsUpDefinition: IconDefinition = findIconDefinition(thumbsUpLookup);
const thumbsDownLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-down'};
const thumbsDownDefinition: IconDefinition = findIconDefinition(thumbsDownLookup);

export interface IDealFeedbackProps {
    deal?: Deal.AsObject;
    title?: string;
    payment?: InvoicePayment.AsObject;
}

export function DealFeedback(props: IDealFeedbackProps) {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
            authState: store.auth.state
        }), []
    );
    const {userId, authState} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [isPositive, setIsPositive] = useState(true);
    const [text, setText] = useState("");
    const [send, setSend] = useState(false);
    const [sendRunning, setSendRunning] = useState(false);

    useEffect(() => {
        if(!props.deal){
            return;
        }
        if (userId === props.deal.adownerinfo!.id && !props.deal.adownerfeedbackisnull) {
            setIsPositive(props.deal.adownerfeedback!.ispositive);
            setText(props.deal.adownerfeedback!.text);
        }
        if (userId === props.deal.initiator!.id && !props.deal.initiatorfeedbackisnull) {
            setIsPositive(props.deal.initiatorfeedback!.ispositive);
            setText(props.deal.initiatorfeedback!.text);
        }
    }, [props.deal, userId])

    useEffect(() => {
        if (authState === AuthState.NotAuthed || userId === "" || !send || sendRunning || !props.deal)
            return;
        setSend(false);
        setSendRunning(true);
        setError("");

        async function f() {
            let req = new SendFeedbackRequest();
            req.setDealid(props.deal!.id);
            req.setIspositive(isPositive);
            req.setText(text);

            try {
                let token = getToken();
                let deal = await TradeGrpcRunAsync<Deal.AsObject>(tradeApiClient.sendFeedback, req, token);
                dispatch(LoadDeals([deal]));
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setSendRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, userId, send, dispatch, isPositive, sendRunning, text, props.deal]);


    function isFeedbackDisabled() {
        if(!props.deal){
            return true;
        }
        if (userId === props.deal.adownerinfo!.id && props.deal.adownerfeedback) {
            return true;
        }
        return !!(userId === props.deal.initiator!.id && props.deal.initiatorfeedback);

    }

    if(!props.deal || props.payment?.isrefund){
        return null;
    }

    return (
        <Card className="mt-3">
            <CardHeader>
                <h6>{props.title === undefined ? strings.feedback : props.title}</h6>
            </CardHeader>
            <CardBody>
                {error !== "" ?
                    <Row>
                        <Col>
                            <Alert color="danger">{errors(error)}</Alert>
                        </Col>
                    </Row>
                    : null
                }
                <Row>
                    <Col>
                        <FormGroup check inline>
                            <Label>
                                <Input type="radio" name="typeRadios"
                                       disabled={isFeedbackDisabled()}
                                       onClick={() => setIsPositive(true)}
                                       checked={isPositive}
                                />
                                <FontAwesomeIcon icon={thumbsUpDefinition}/>{strings.positive}</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <label>
                                <Input type="radio" name="typeRadios"
                                       disabled={isFeedbackDisabled()}
                                       onClick={() => setIsPositive(false)}
                                       checked={!isPositive}
                                />
                                <FontAwesomeIcon icon={thumbsDownDefinition}/>{strings.negative}</label>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                                    <textarea rows={2} cols={40}
                                              disabled={isFeedbackDisabled()}
                                              className={isPositive ? "textarea form-control border-success" : "textarea form-control border-danger"}
                                              placeholder="+"
                                              value={text}
                                              onInput={(event) => setText(event.currentTarget.value)}
                                    />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button outline className="btn-block mt-2"
                                onClick={() => setSend(true)}
                                disabled={isFeedbackDisabled()}>
                            {strings.feedbackBtn}
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}