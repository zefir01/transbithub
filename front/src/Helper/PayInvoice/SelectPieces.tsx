import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Col6_12} from "../../global";
import {InvoiceInfo} from "../../Invoices/InvoiceInfo";
import {HelperOperation, IStore} from "../../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../../Loading";
import {Pieces} from "../../Invoices/InvoiceControl/InvoiceControl";
import {CalcValuesView, IInvoiceCalculatedValues} from "../../Invoices/InvoiceCalc";
import {SetBuyAmount, SetCurrentPath, SetInvoicePieces} from "../../redux/actions";
import {MyDecimal} from "../../MyDecimal";
import {data, IStrings} from "../../localization/Helper/PayInvoice/SelectPieces";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function SelectPieces() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            invoices: store.invoices,
            defaultCurrency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables,
        }), []
    );
    const {state, invoices, defaultCurrency, vars} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [pieces, setPieces] = useState<number | null>(null);
    const [values, setValues] = useState<IInvoiceCalculatedValues | null>(null);

    const inv = useCallback(() => {
        let id = state.invoiceId;

        if (invoices.toMeInvoices === null || invoices.fromMeInvoices === null || invoices.publicInvoices === null) {
            return null;
        }

        let all = invoices.toMeInvoices.concat(invoices.fromMeInvoices).concat(invoices.publicInvoices);
        // eslint-disable-next-line eqeqeq
        let inv = all.find(p => p.id == id);
        if (inv === undefined) {
            return null;
        }
        return inv;
    }, [invoices, state.invoiceId]);
    let invoice = inv();

    useEffect(() => {
        if (!invoice) {
            return;
        }
        setPieces(invoice.piecesmin)
    }, [invoice]);

    useEffect(() => {
        let res;
        if (!defaultCurrency || !pieces || !invoice) {
            return;
        }
        res = CalcValuesView(invoice, defaultCurrency, vars);
        setValues(res);
        if (pieces > invoice.piecesmax) {
            setPieces(invoice.piecesmax);
        }
        if (pieces < invoice.piecesmin) {
            setPieces(invoice.piecesmin);
        }
    }, [invoice, vars, defaultCurrency, pieces]);

    useEffect(() => {
        if (state.operation !== HelperOperation.PayInvoice || !state.invoiceId) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.operation, state.invoiceId]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/selectPieces"));
    }, [state.currentPath, dispatch]);

    useEffect(() => {
        if (state.pieces !== null && (pieces === null || pieces !== state.pieces)) {
            setPieces(state.pieces);
        }
    }, [state.pieces, pieces])

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!invoice) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => setRedirect("/helper/payInvoice")}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col {...Col6_12}>
                    <InvoiceInfo invoice={invoice}/>
                </Col>
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h4>{strings.title}</h4>
                                {strings.info}
                            </CardTitle>
                            <Pieces invoice={invoice} onChange={pieces1 => setPieces(pieces1)}
                                    currency={defaultCurrency} values={values}
                                    defaultValue={pieces ? pieces : undefined}/>
                            <Button color="success" className="btn-block mt-3"
                                    disabled={!pieces}
                                    onClick={() => {
                                        if (!values || !values.piecePriceCrypto || !pieces) {
                                            return;
                                        }
                                        let crypto = new MyDecimal(values.piecePriceCrypto.mul(pieces));
                                        dispatch(SetBuyAmount(crypto, false));
                                        dispatch(SetInvoicePieces(pieces!));
                                        setRedirect("/helper/selectPaymentType");
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