import * as React from "react";
import {LNGetInvoicesRequest, LNGetPaymentsResponse, LNPayment, LNPaymentStatus} from "../Protos/api_pb";
import {Alert, Card, CardBody, Col, Row} from "reactstrap";
import {Col6_12, pageSize} from "../global";
import {MyDecimal} from "../MyDecimal";
import {useCallback, useEffect, useState} from "react";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {getToken, GrpcError, toDate, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {errors} from "../localization/Errors";
import {Loading} from "../Loading";
import {LoadingBtn} from "../LoadingBtn";
import {data, IStrings} from "../localization/Wallet/LNTransactionsOut";
import {useStrings} from "../Hooks";

export function LNTransactionsOut() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            defaultCurrency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables
        }), []
    );
    const {authState, defaultCurrency, vars} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [payments, setPayments] = useState<LNPayment.AsObject[] | null>(null);
    const [getRunning, setGetRunning] = useState(false);
    const [pageRequested, setPageRequested] = useState<number | null>(null);
    const [page, setPage] = useState(1);


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
                let resp = await TradeGrpcRunAsync<LNGetPaymentsResponse.AsObject>(tradeApiClient.lNGetPayments, req, getToken());
                let arr: LNPayment.AsObject[];
                if (payments) {
                    arr = Array.from(payments);
                } else {
                    arr = [];
                }
                arr.push(...resp.lnpaymentsList);
                arr = arr.sort((a, b) => {
                    return b.createdat!.seconds - a.createdat!.seconds;
                });
                setPageRequested(page);
                setPayments(arr);
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
    }, [authState, getRunning, page, pageRequested, payments])

    function Status(props: { payment: LNPayment.AsObject }) {
        switch (props.payment.status) {
            case LNPaymentStatus.STARTED:
                return <span className="text-info font-weight-bold">{strings.started}</span>
            case LNPaymentStatus.PENDING:
                return <span className="text-warning font-weight-bold">{strings.pending}</span>
            case LNPaymentStatus.SUCCESS:
                return <span className="text-success font-weight-bold">{strings.success}</span>
            case LNPaymentStatus.FAILED:
                return (
                    <>
                        <span className="text-danger font-weight-bold">{strings.failed}: </span>
                        <span className="text-danger">{props.payment.error}</span>
                    </>
                )

        }
    }

    function item(payment: LNPayment.AsObject) {
        function calc(value: MyDecimal) {
            let vprice = vars!.get(`AVG_${defaultCurrency}`)!;
            return new MyDecimal(value.mul(vprice)).toDecimalPlaces(2);
        }

        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col {...Col6_12}>
                            <span className="font-weight-bold">ID:</span> {payment.id}
                            <br/>
                            <span
                                className="font-weight-bold">{strings.amount}</span> {MyDecimal.FromPb(payment.amount).toString()} BTC
                            / ~{calc(MyDecimal.FromPb(payment.amount)).toString() + " " + defaultCurrency}
                        </Col>
                        <Col {...Col6_12}>
                            <span className="font-weight-bold">{strings.description}</span> {payment.description}
                            <br/>
                            <span
                                className="font-weight-bold">{strings.created}</span> {toDate(payment.createdat).toLocaleString()}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {payment.bolt11}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <span className="font-weight-bold">{strings.status}</span> <Status payment={payment}/>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }

    if (!payments || !vars || vars.size === 0) {
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
                        payments.map(p => {
                            return (
                                <Row key={p.id} className="pt-1">
                                    <Col>
                                        {item(p)}
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
                                disabled={!payments || payments.length < page * pageSize}
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