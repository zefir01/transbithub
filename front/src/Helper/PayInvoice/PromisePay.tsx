import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Button, Card, CardBody, Col, Collapse, Input, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Redirect} from "react-router-dom";
import {PromiseTextArea} from "../../Promises/PromiseTextArea";
import {Col6_12} from "../../global";
import {SetCurrentPath, SetPromise} from "../../redux/actions";
import {HelperOperation, IStore} from "../../redux/store/Interfaces";
import {data, IStrings} from "../../localization/Helper/PayInvoice/PromisePay";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function PromisePay() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
        }), []
    );
    const {state} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [promise, setPromise] = useState("");
    const [pass, setPass] = useState("");
    const [needPass, setNeedPass] = useState(false);
    const [formatError, setFormatError] = useState(false);

    function isError(): boolean {
        if (promise === "") {
            return true;
        }
        if (formatError) {
            return true;
        }
        return needPass && pass === "";

    }

    useEffect(() => {
        if (!state.invoicePaymentType && state.operation===null) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.invoicePaymentType, state.operation]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/promisePay"));
    }, [state.currentPath, dispatch]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        if (state.operation === HelperOperation.PayInvoice) {
                            setRedirect("/helper/selectPaymentType");
                        } else if (state.operation === HelperOperation.UsePromise) {
                            setRedirect("/helper/selectOperation");
                        }
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <h4>{strings.title}</h4>
                    {strings.info}
                </Col>
            </Row>
            <Row>
                <Col {...Col6_12}>
                    <PromiseTextArea onChange={(value, isFormatError, needPass) => {
                        setNeedPass(needPass);
                        setPromise(value);
                        setFormatError(isFormatError);
                    }} minRows={23} value={promise}/>

                </Col>
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <Collapse isOpen={needPass}>
                                <Input invalid={pass === ""} type="password" placeholder={strings.pass}
                                       className="mb-3"
                                       onChange={event => {
                                           setPass(event.currentTarget.value);
                                       }}
                                />
                            </Collapse>
                            <Button color="success" className="btn-block" disabled={isError()}
                                    onClick={() => {
                                        dispatch(SetPromise(promise, pass));
                                        if (state.operation === HelperOperation.PayInvoice) {
                                            setRedirect("/helper/selectPromiseOddType");
                                        } else if (state.operation === HelperOperation.UsePromise) {
                                            setRedirect("/helper/usePromise");
                                        }
                                    }}>
                                {strings.ok}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}