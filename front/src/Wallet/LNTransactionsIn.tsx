import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {LNGetInvoicesRequest, LNGetInvoicesResponse, LNInvoice} from "../Protos/api_pb";
import {Alert, Card, CardBody, Col, Row} from "reactstrap";
import {MyDecimal} from "../MyDecimal";
import {getToken, GrpcError, toDate, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {Col6_12, pageSize} from "../global";
import {Loading} from "../Loading";
import humanizeDuration from "humanize-duration";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";
import {data, IStrings} from "../localization/Wallet/LNTransactionsIn";
import {NavLink} from "react-router-dom";
import {useStrings} from "../Hooks";

export function LNTransactionsIn() {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            defaultCurrency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables,
            lang: store.lang.Lang
        }), []
    );
    const {authState, defaultCurrency, vars, lang} = useMappedState(mapState);

    const [page, setPage] = useState(1);
    const [invoices, setInvoices] = useState<LNInvoice.AsObject[] | null>(null);
    const [getRunning, setGetRunning] = useState(false);
    const [pageRequested, setPageRequested] = useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function f() {
            if (getRunning || page === pageRequested || authState === AuthState.NotAuthed) {
                return;
            }
            setGetRunning(true);

            let req = new LNGetInvoicesRequest();
            req.setSkip((page - 1) * pageSize);
            req.setTake(pageSize);

            try {
                let resp = await TradeGrpcRunAsync<LNGetInvoicesResponse.AsObject>(tradeApiClient.lNGetInvoices, req, getToken());
                let arr: LNInvoice.AsObject[];
                if (invoices) {
                    arr = Array.from(invoices);
                } else {
                    arr = [];
                }
                arr.push(...resp.invoicesList);
                arr = arr.sort((a, b) => {
                    return b.createdat!.seconds - a.createdat!.seconds;
                });
                setPageRequested(page);
                setInvoices(arr);
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setGetRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, getRunning, page, pageRequested, invoices])


    function Item(invoice: LNInvoice.AsObject) {
        function calc(value: MyDecimal) {
            let vprice = vars!.get(`AVG_${defaultCurrency}`)!;
            return new MyDecimal(value.mul(vprice)).toDecimalPlaces(2);
        }

        function status(value: boolean) {
            if (value) {
                return <span className="text-success">{strings.paid}</span>
            }
            return <span className="text-danger">{strings.notPaid}</span>
        }

        function duration(seconds: number): string {
            let d = seconds * 1000;
            return humanizeDuration(d,
                {
                    language: lang,
                    largest: 2,
                    round: true,
                    fallbacks: ['en']
                }
            )
        }

        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col {...Col6_12}>
                            <span className="font-weight-bold">ID:</span> {invoice.id}
                            <br/>
                            <span
                                className="font-weight-bold">{strings.amount}</span> {MyDecimal.FromPb(invoice.amount).toString()} BTC
                            / ~{calc(MyDecimal.FromPb(invoice.amount)).toString() + " " + defaultCurrency}
                            <br/>
                            <span
                                className="font-weight-bold">{strings.created}</span> {toDate(invoice.createdat).toLocaleString()}
                        </Col>
                        <Col {...Col6_12}>
                            <span className="font-weight-bold">{strings.description}</span> {invoice.description}
                            <br/>
                            <span className="font-weight-bold">{strings.period}</span> {duration(invoice.expiresin)}
                            <br/>
                            <span
                                className="font-weight-bold">{strings.status}</span> {status(invoice.ispaid)}
                            {!invoice.norelations ?
                                <>
                                    <br/>
                                    <span className="font-weight-bold">{strings.payment}</span>
                                    &nbsp;
                                    <NavLink className="nav-link p-0"
                                             to={"/invoices/payment/" + invoice.paymentid}>{invoice.paymentid}</NavLink>
                                </>
                                : null
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {invoice.bolt11}
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        )
    }

    if (!invoices || !vars || vars.size === 0) {
        return (
            <>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Loading className="pt-3"/>
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <>
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        invoices.map(p => {
                            return (
                                <Row key={p.id} className="pt-1">
                                    <Col>
                                        {Item(p)}
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <LoadingBtn loading={getRunning} color="info" outline className="btn-block mt-3"
                                disabled={!invoices || invoices.length < page * pageSize}
                                onClick={() => {
                                    setPage(page + 1);
                                }}
                    >
                        {strings.more}
                    </LoadingBtn>
                </Col>
            </Row>
        </>
    )

}