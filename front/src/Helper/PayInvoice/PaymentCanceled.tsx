import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Row} from "reactstrap";
import {HelperInvoicePaymentType, IStore} from "../../redux/store/Interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Col6_12} from "../../global";
import {HelperActionTypes, SetCurrentPath} from "../../redux/actions";
import {data, IStrings} from "../../localization/Helper/PayInvoice/PaymentCanceled";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function PaymentCanceled() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState
        }), []
    );
    const {state} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        if (!state.invoicePaymentId) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.invoicePaymentId]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/paymentCanceled"));
    }, [state.currentPath, dispatch]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        switch (state.invoicePaymentType) {
                            case HelperInvoicePaymentType.Balance:
                                setRedirect("/helper/selectPieces");
                                break;
                            case HelperInvoicePaymentType.Deal:
                                setRedirect("/helper/deal");
                                break;
                            case HelperInvoicePaymentType.Promise:
                                setRedirect("/helper/selectPromiseOddType");
                                break;
                            case HelperInvoicePaymentType.LN:
                                setRedirect("/helper/selectPaymentType");
                                break;

                        }
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-center">
                <Col className="col-auto">
                    <h4 className="text-center">
                        {strings.title}
                    </h4>
                    {strings.reasons}
                    <ul>
                        {state.invoicePaymentType === HelperInvoicePaymentType.Deal ?
                            <>
                                <li>
                                    {strings.youCancel}
                                </li>
                                <li>
                                    {strings.sellerCancel}
                                </li>
                            </>
                            : null
                        }
                        <li>
                            {strings.invoiceDeleted}
                        </li>
                        <li>
                            {strings.youCancelPayment}
                        </li>
                        {state.invoicePaymentType === HelperInvoicePaymentType.LN ?
                            <li>
                                {strings.lnExpired}
                            </li>
                            : null
                        }
                    </ul>
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <Button className="btn-block" color="success" onClick={() => {
                        dispatch({type: HelperActionTypes.RESET});
                    }}>
                        Завершить
                    </Button>
                </Col>
            </Row>
        </>
    )
}