import * as React from "react";
import {Invoice} from "../../Protos/api_pb";
import {useCallback, useEffect, useState} from "react";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {CalcValuesView, IInvoiceCalculatedValues} from "../InvoiceCalc";
import Decimal from "decimal.js";
import {useRouteMatch} from "react-router-dom";
import {Alert, Card, CardBody, Col, Container, Row} from "reactstrap";
import {Loading} from "../../Loading";
import {Pieces} from "./InvoiceControl";
import {PayBalance} from "./PayBalance";
import {PayByLn} from "./PayByLn";
import {PayByDeal} from "./PayByDeal";
import {PayByPromise} from "./PayByPromise";
import {errors} from "../../localization/Errors";

export interface PayProps {
    invoice: Invoice.AsObject;
    hasPrice: (hasPrice: boolean) => void;
    redirect: (to: string) => void;
}

export function Pay(props: PayProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            balance: store.balances.Balance,
            vars: store.catalog.variables,
            defaultCurrency: store.profile.GeneralSettings.DefaultCurrency
        }), []
    );
    const {balance, vars, defaultCurrency} = useMappedState(mapState);
    const [bestPrice, setBestPrice] = useState<Decimal | null>(null);
    const [bestPriceCurrency, setBestPriceCurrency] = useState<string | null>(null);
    const [currency, setCurrency] = useState("");
    const [pieces, setPieces] = useState<number | null>(props.invoice.piecesmin);
    const [values, setValues] = useState<IInvoiceCalculatedValues | null>(null);
    const [error, setError] = useState("");
    const matchInvoice = useRouteMatch('/invoices/invoice/:id/:pieces?');

    useEffect(() => {
        let res;
        if (!defaultCurrency || !pieces) {
            return;
        }
        setCurrency(defaultCurrency);
        if (bestPrice !== null && bestPriceCurrency) {
            setCurrency(bestPriceCurrency);
            res = CalcValuesView(props.invoice, bestPriceCurrency, vars, bestPrice);
        } else {
            res = CalcValuesView(props.invoice, defaultCurrency, vars);
        }
        setValues(res);
        if (pieces > props.invoice.piecesmax) {
            setPieces(props.invoice.piecesmax);
        }
        if (pieces < props.invoice.piecesmin) {
            setPieces(props.invoice.piecesmin);
        }
    }, [props.invoice, vars, bestPrice, bestPriceCurrency, defaultCurrency, pieces]);

    useEffect(() => {
        if (matchInvoice) {
            // @ts-ignore
            let piecesStr: string = matchInvoice.params.pieces;
            let p = parseInt(piecesStr);
            if (isNaN(p)) {
                return;
            }
            setPieces(p);
        }
    }, [matchInvoice]);


    if (!balance || values === null || values.piecePriceCrypto === null) {
        return (
            <Container>
                <Row className="pt-3">
                    <Col>
                        <Loading/>
                    </Col>
                </Row>
            </Container>
        )
    }

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                    </Col>
                </Row>
                <Pieces invoice={props.invoice} onChange={pieces1 => {
                    setPieces(pieces1);
                }}
                        currency={currency} values={values} defaultValue={pieces === null ? undefined : pieces}/>
                <PayBalance values={values} invoice={props.invoice} pieces={pieces} redirect={props.redirect}/>
                <Row className="mt-2">
                    <Col>
                        <PayByLn invoice={props.invoice} pieces={pieces}/>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>
                        <PayByDeal invoice={props.invoice} pieces={pieces}
                                   bestPriceChanged={(price, currency) => {
                                       setBestPrice(price);
                                       setBestPriceCurrency(currency);
                                       props.hasPrice(price !== null);
                                   }}/>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col>
                        <PayByPromise invoice={props.invoice} pieces={pieces}/>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}