import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {InvoicePayment} from "../Protos/api_pb";
import {Alert, Badge, Col, Container, Row, Table} from "reactstrap";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {useCancelInvoicePayment, useInvoicePayments, useStrings} from "../Hooks";
import {pageSize} from "../global";
import {PrettyPrice, toLocalDateTimeString} from "../helpers";
import {MyDecimal} from "../MyDecimal";
import {UserLink} from "../MainPages/UserLink";
import {Loading} from "../Loading";
import {errors} from "../localization/Errors";
import {LoadingBtn} from "../LoadingBtn";
import {NavLink, Redirect} from "react-router-dom";
import {data, IStrings} from "../localization/Invoices/PaymentsTable";
import {PaymentStatus} from "./PaymentStatus";

export function ToMePaymentsTable() {
    return <PaymentsTable isToMe={true}/>
}

export function FromMePaymentsTable() {
    return <PaymentsTable isToMe={false}/>
}

interface IPaymentsTableProps {
    isToMe: boolean;
}

function PaymentsTable(props: IPaymentsTableProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            payments: props.isToMe ? store.invoices.toMeInvoicePayments : store.invoices.fromMeInvoicePayments,
            preload: props.isToMe ? store.preload.toMeInvoicePayments : store.preload.fromMeInvoicePayments,
            newPayments: store.invoices.newPaymentsIds,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables,
            userId: store.profile.UserId
        }), [props.isToMe]
    );
    const {payments, preload, newPayments, currency, vars, userId} = useMappedState(mapState);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(false);
    const [loadingRunning, setLoadingRunning] = useState(false);
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState("");
    const [cancelId, setCancelId] = useState<number | null>(null);
    const [canceling, setCanceling] = useState(false);
    const hoverStyle = {
        cursor: "pointer"
    }

    useCancelInvoicePayment(cancelId,
        () => setCanceling(true),
        () => {
            setCancelId(null);
            setCanceling(false);
        },
        (e) => setError(e));

    function MyRow(payment: InvoicePayment.AsObject) {
        let isNew = newPayments.includes(payment.id);

        function getFiatAmount() {
            let crypto = MyDecimal.FromPb(payment.cryptoamount);
            let v = vars!.get("AVG_" + currency);
            let fiat = crypto.mul(v!);
            return PrettyPrice(fiat, 2);
        }

        return (
            <React.Fragment key={payment.id}>
                <tr key={payment.id} style={hoverStyle}>
                    <th scope="row" onClick={() => setRedirect("/invoices/payment/" + payment.id)}>
                        {payment.id}
                    </th>
                    <td onClick={() => setRedirect("/invoices/payment/" + payment.id)}>

                        {payment.dealisnull ?
                            <>
                            <span className="text-success font-weight-bold">
                                {PrettyPrice(MyDecimal.FromPb(payment.cryptoamount), 8) + " BTC"}
                            </span>
                                <br/>
                                <span className="small">
                                {"~" + getFiatAmount() + " " + currency}
                            </span>
                            </>
                            :
                            <>
                            <span className="text-success font-weight-bold">
                                {PrettyPrice(MyDecimal.FromPb(payment.deal!.fiatamount), 2) + payment.deal!.advertisement!.fiatcurrency}
                            </span>
                                <br/>
                                <span className="small">
                                {PrettyPrice(MyDecimal.FromPb(payment.cryptoamount), 8) + "BTC"}
                            </span>
                            </>
                        }

                    </td>
                    <td>
                        {props.isToMe ?
                            <UserLink info={payment.owner!} isAdRate={false}/>
                            :
                            <UserLink info={payment.invoice!.owner!} isAdRate={false}/>
                        }
                    </td>
                    <td onClick={() => setRedirect("/invoices/payment/" + payment.id)}>
                        <PaymentStatus payment={payment}/>
                    </td>
                    <td onClick={() => setRedirect("/invoices/payment/" + payment.id)}>
                        {toLocalDateTimeString(payment.createdat)}
                    </td>
                    <td>
                        <NavLink className="nav-link" to={"/invoices/invoice/" + payment.invoice?.id}>
                            {payment.invoice?.id.toString()}
                        </NavLink>
                    </td>
                    <td>
                        {isNew ?
                            <>
                                <Badge color="danger"
                                       onClick={() => setRedirect("/invoices/payment/" + payment.id)}>{strings.New}</Badge>
                                <br/>
                            </>
                            : null
                        }
                        {payment.owner?.id === userId && payment.status === InvoicePayment.InvoicePaymentStatus.PENDING ?
                            <LoadingBtn loading={payment.id === cancelId && canceling} color="danger" outline
                                        onClick={() => setCancelId(payment.id)}
                            >
                                {strings.cancel}
                            </LoadingBtn>
                            : null
                        }
                    </td>
                </tr>
                {payment.isrefund ?
                    <tr>
                        <td colSpan={6} className="border-top-0 table-hover pt-0">
                        <span>
                            {strings.refund}
                            <NavLink
                                to={"/invoices/payment/" + payment.invoice!.refundpaymentid}>{strings.payment + payment.invoice!.refundpaymentid}
                            </NavLink>
                            &nbsp;
                            {strings.pieces + payment.invoice!.piecesmin}
                        </span>
                        </td>
                    </tr>
                    : null
                }
            </React.Fragment>
        )
    }

    function isRun() {
        if (!preload) {
            return false;
        }
        return more;

    }

    function GetPayments(): InvoicePayment.AsObject[] {
        if (!payments) {
            return [];
        }
        return payments.filter(p => (p.owner!.id !== userId) === props.isToMe);
    }

    function getLastId() {
        if (payments === null) {
            return 0;
        }
        if (payments.length === 0) {
            return 0;
        }
        return GetPayments().map(p => p.id).reduce((a, b) => a < b ? a : b);
    }

    function getMoreCount() {
        if (payments === null) {
            return pageSize;
        }
        if (payments.length === 0) {
            return pageSize;
        }
        let need = page * pageSize - GetPayments().length;
        if (need <= 0) {
            if (more) {
                setMore(false);
            }
            return 0;
        }
        return need;
    }

    function isMoreDisabled() {
        if (payments === null) {
            return true;
        }
        return GetPayments().length < pageSize * page && !more;
    }

    useEffect(() => {
        function GetPayments(): InvoicePayment.AsObject[] {
            if (!payments) {
                return [];
            }
            return payments.filter(p => (p.owner!.id !== userId) === props.isToMe);
        }

        let p = GetPayments().length / pageSize;
        let pp = Math.ceil(p);
        if (pp < 1) {
            pp = 1;
        }
        if (page < pp) {
            setPage(pp);
        }
    }, [payments, page, userId, props.isToMe]);

    useInvoicePayments(isRun(),
        getLastId(),
        getMoreCount(),
        null,
        props.isToMe,
        () => {
            setLoadingRunning(true);
        },
        () => {
            setLoadingRunning(false);
            setMore(false);
        },
        (e) => {
            setError(e)
        }
    )

    if (payments === null || !preload || vars == null || vars.size === 0) {
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
    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <Container>
            {error !== "" ?
                <Alert color="danger">{errors(error)}</Alert>
                : null
            }
            <Row>
                <Col>
                    <Table className="rounded-0 border-top-0 border-left border-right border-bottom">
                        <thead>
                        <tr>
                            <th className="border-top-0">
                                #
                            </th>
                            <th className="border-top-0">
                                {strings.amount}
                            </th>
                            <th className="border-top-0">
                                {strings.partner}
                            </th>
                            <th className="border-top-0">
                                {strings.status}
                            </th>
                            <th className="border-top-0">
                                {strings.time}
                            </th>
                            <th className="border-top-0">
                                {strings.invoice}
                            </th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody className="table-hover">
                        {GetPayments().sort((a, b) => b.id - a.id)
                            .map(p => MyRow(p))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {!isMoreDisabled() ?
                <Row>
                    <Col>
                        <LoadingBtn className="btn-block" color="primary" outline loading={loadingRunning}
                                    onClick={() => {
                                        setPage(page + 1);
                                        setMore(true);
                                    }}
                        >{strings.more}</LoadingBtn>
                    </Col>
                </Row>
                : null
            }
        </Container>
    )
}