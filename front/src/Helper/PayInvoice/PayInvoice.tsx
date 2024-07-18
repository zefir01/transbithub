import React, {useCallback, useEffect, useState} from "react";
import {Alert, Button, Card, CardBody, Col, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Redirect} from "react-router-dom";
import {Col6_12, pageSize} from "../../global";
import {useInvoices, useStrings} from "../../Hooks";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../../Loading";
import {SetCurrentPath, SetInvoiceId} from "../../redux/actions";
import {LoadingBtn} from "../../LoadingBtn";
import {data, IStrings} from "../../localization/Helper/PayInvoice/PayInvoice";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function PayInvoice() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            state: store.helperState,
        }), []
    );
    const {authState, state} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState("");
    const [error, setError] = useState("");
    const [invoiceId, setInvoiceId] = useState("");
    const [find, setFind] = useState(false);
    const [findRunning, setFindRunning] = useState(false);

    function filterInt(value: string) {
        return /^\d+$/.test(value);
    }

    useInvoices(find && !findRunning && invoiceId !== "" && invoiceId !== null, 0, pageSize * 2, null,
        [], null, parseInt(invoiceId), null,
        () => {
            setFindRunning(true)
            setFind(false);
        },
        (invoices) => {
            setFindRunning(false);
            if (invoices && invoices.length > 0) {
                dispatch(SetInvoiceId(invoices[0].id));
                setRedirect("/helper/selectPieces");
            } else {
                setError(strings.notFound);
            }

        },
        (e) => setError(e)
    );
    useEffect(() => {
        if (state.operation === null) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.operation]);
    useEffect(() => {
        dispatch(SetCurrentPath("/helper/payInvoice"));
    }, [state.currentPath, dispatch]);

    useEffect(() => {
        if (invoiceId === "" && state.invoiceId !== null) {
            setInvoiceId(state.invoiceId.toString());
        }
    }, [state.invoiceId, invoiceId])


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (authState === AuthState.NotAuthed) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        )
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => setRedirect("/helper/selectOperation")}>
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
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <InputGroup>
                                <Input type="text" placeholder={strings.ph}
                                       value={invoiceId}
                                       invalid={invoiceId !== "" && !filterInt(invoiceId)}
                                       onChange={event => {
                                           setError("");
                                           setInvoiceId(event.currentTarget.value);
                                       }}

                                />
                                <InputGroupAddon addonType="append">
                                    <LoadingBtn loading={findRunning} color="warning"
                                                onClick={() => {
                                                    setFind(true);
                                                }}
                                    >
                                        Найти
                                    </LoadingBtn>
                                </InputGroupAddon>
                            </InputGroup>
                            <Alert className="mt-3" color="danger" isOpen={error !== ""} toggle={() => setError("")}>
                                {error}
                            </Alert>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}