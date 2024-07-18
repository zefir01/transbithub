import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Feedback, InvoicePayment, SendInvoicePaymentFeedbackRequest} from "../Protos/api_pb";
import {Alert, Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {data, IStrings} from "../localization/Invoices/PaymentFeedback";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {errors} from "../localization/Errors";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {InvoicePaymentsLoaded} from "../redux/actions";
import {useStrings} from "../Hooks";

library.add(far);
const thumbsUpLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-up'};
const thumbsUpDefinition: IconDefinition = findIconDefinition(thumbsUpLookup);
const thumbsDownLookup: IconLookup = {prefix: 'far', iconName: 'thumbs-down'};
const thumbsDownDefinition: IconDefinition = findIconDefinition(thumbsDownLookup);

export interface IPaymentFeedbackProps {
    payment: InvoicePayment.AsObject;
}

export function PaymentFeedback(props: IPaymentFeedbackProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
            authState: store.auth.state
        }), []
    );
    const {userId, authState} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isPositive, setIsPositive] = useState(true);
    const [text, setText] = useState("");
    const [send, setSend] = useState(false);
    const [sendRunning, setSendRunning] = useState(false);


    useEffect(() => {
        function clear(){
            setError("");
            setIsDisabled(false);
            setIsPositive(true);
            setText("");
            setSend(false);
        }

        if (props.payment.owner?.id === userId) {
            if (props.payment.ownerfeedback) {
                setIsDisabled(true);
                setText(props.payment.ownerfeedback!.text);
                setIsPositive(props.payment.ownerfeedback!.ispositive);
            }
            else{
                clear();
            }
        } else {
            if (props.payment.sellerfeedback) {
                setIsDisabled(true);
                setText(props.payment.sellerfeedback.text);
                setIsPositive(props.payment.sellerfeedback.ispositive);
            }
            else{
                clear();
            }
        }
    }, [props.payment, userId])

    useEffect(() => {
        if (!send || isDisabled || sendRunning || authState === AuthState.NotAuthed) {
            return;
        }
        setSend(false);
        setSendRunning(true);

        async function f() {
            let req = new SendInvoicePaymentFeedbackRequest();
            req.setPaymentid(props.payment.id);
            let feedback = new Feedback();
            feedback.setIspositive(isPositive);
            feedback.setText(text);
            req.setFeedback(feedback);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.sendInvoicePaymentFeedback, req, getToken());
                dispatch(InvoicePaymentsLoaded([resp]));
                setError("");
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setSendRunning(false);
            }

        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [send, isDisabled, authState, dispatch, isPositive, props.payment.id, sendRunning, text])

    // eslint-disable-next-line eqeqeq
    if (props.payment.status === InvoicePayment.InvoicePaymentStatus.PENDING || props.payment.isrefund || props.payment.invoice?.owner?.id == "") {
        return null;
    }

    return (
        <Card className="mt-3">
            <CardHeader>
                <h6>{props.payment.owner?.id === userId ? strings.title : strings.title1}</h6>
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
                                       disabled={isDisabled}
                                       onClick={() => setIsPositive(true)}
                                       checked={isPositive}
                                />
                                <FontAwesomeIcon icon={thumbsUpDefinition}/>{strings.positive}</Label>
                        </FormGroup>
                        <FormGroup check inline>
                            <label>
                                <Input type="radio" name="typeRadios"
                                       disabled={isDisabled}
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
                                              disabled={isDisabled}
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
                                disabled={isDisabled}>
                            {strings.feedbackBtn}
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}