import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Invoice, InvoicePayment, PayInvoiceByPromiseRequest} from "../../Protos/api_pb";
import {Alert, Button, Card, CardBody, Col, Collapse, Input, Label, Row} from "reactstrap";
import {PromiseTextArea} from "../../Promises/PromiseTextArea";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {errors} from "../../localization/Errors";
import {data, IStrings} from "../../localization/Invoices/PayByPromise";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {InvoicePaymentsLoaded} from "../../redux/actions";
import {LoadingBtn} from "../../LoadingBtn";
import {Redirect} from "react-router-dom";
import {useStrings} from "../../Hooks";

export interface IPayByPromiseProps {
    invoice: Invoice.AsObject;
    pieces: number | null;
}


export function PayByPromise(props: IPayByPromiseProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const dispatch = useDispatch();
    const {authState} = useMappedState(mapState);

    const [isOpen, setIsOpen] = useState(false);
    const [promise, setPromise] = useState("");
    const [needPass, setNeedPass] = useState(false);
    const [pass, setPass] = useState("");
    const [formatError, setFormatError] = useState(false);
    const [pay, setPay] = useState(false);
    const [payRunning, setPayRunning] = useState(false);
    const [oddType, setOddType] = useState(PayInvoiceByPromiseRequest.OddTypes.TOPROMISE);
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        async function f() {
            if (authState === AuthState.NotAuthed || !pay || payRunning || promise === "" || formatError || (needPass && pass === "") || !props.pieces) {
                return;
            }

            setPay(false);
            setPayRunning(true);

            let req = new PayInvoiceByPromiseRequest();
            req.setInvoiceid(props.invoice.id);
            req.setPassword(pass);
            req.setPieces(props.pieces);
            req.setPromise(promise);
            req.setOddtype(oddType);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.payInvoiceByPromise, req, getToken());
                dispatch(InvoicePaymentsLoaded([resp]));
                setRedirect("/invoices/payment/" + resp.id);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setPayRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [pay, authState, needPass, formatError, oddType, payRunning, promise, pass, props.invoice.id, props.pieces, dispatch]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <>
            <Button color="primary" outline={!isOpen} className="btn-block"
                    onClick={() => setIsOpen(!isOpen)}>
                {strings.title}
            </Button>
            <Collapse isOpen={isOpen}>
                <Card className="mt-1">
                    <CardBody>
                        {strings.info}
                        <Collapse isOpen={needPass && !formatError}>
                            <Input className="mt-3" type="password" value={pass} invalid={pass === ""}
                                   placeholder={strings.passPh}
                                   valid={pass !== ""}
                                   onInput={event => {
                                       setPass(event.currentTarget.value);
                                   }}
                            />
                        </Collapse>
                        <div className="mt-3">
                            <PromiseTextArea value={promise} onChange={(value, isFormatError, needPass) => {
                                setNeedPass(needPass);
                                setPromise(value);
                                setFormatError(isFormatError);
                            }}
                                             minRows={10}/>
                        </div>
                        <Row>
                            <Col className="mt-3">
                                <input type="radio" name="oddType"
                                       checked={oddType === PayInvoiceByPromiseRequest.OddTypes.NOODD}
                                       onClick={() => {
                                           setOddType(PayInvoiceByPromiseRequest.OddTypes.NOODD);
                                       }}/>
                                <Label className="ml-1" onClick={() => {
                                    setOddType(PayInvoiceByPromiseRequest.OddTypes.NOODD);
                                }}>
                                    {strings.noOdd}
                                </Label>
                            </Col>
                        </Row>
                        {authState === AuthState.Authed ?
                            <Row>
                                <Col className="mt-3">
                                    <input type="radio" name="oddType"
                                           checked={oddType === PayInvoiceByPromiseRequest.OddTypes.TOBALANCE}
                                           onClick={() => {
                                               setOddType(PayInvoiceByPromiseRequest.OddTypes.TOBALANCE);
                                           }}/>
                                    <Label className="ml-1" onClick={() => {
                                        setOddType(PayInvoiceByPromiseRequest.OddTypes.TOBALANCE);
                                    }}>
                                        {strings.toBalance}
                                    </Label>
                                </Col>
                            </Row>
                            : null
                        }
                        <Row>
                            <Col className="mt-3">
                                <input type="radio" name="oddType"
                                       checked={oddType === PayInvoiceByPromiseRequest.OddTypes.TOPROMISE}
                                       onClick={() => {
                                           setOddType(PayInvoiceByPromiseRequest.OddTypes.TOPROMISE);
                                       }}/>
                                <Label className="ml-1" onClick={() => {
                                    setOddType(PayInvoiceByPromiseRequest.OddTypes.TOPROMISE);
                                }}>
                                    {strings.toPromise}
                                </Label>
                            </Col>
                        </Row>
                        <Alert color="danger" isOpen={error !== ""} className="text-center">{errors(error)}</Alert>
                        <LoadingBtn loading={payRunning} color="success" outline className="btn-block mt-1"
                                    disabled={promise === "" || formatError || (needPass && pass === "")}
                                    onClick={()=>setPay(true)}>
                            {strings.pay}
                        </LoadingBtn>
                    </CardBody>
                </Card>
            </Collapse>
        </>
    )
}