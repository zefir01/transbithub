import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Invoice} from "../Protos/api_pb";
import {Alert, Badge, Col, Container, Row, Table} from "reactstrap";
import {InvoiceType, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {UserLink} from "../MainPages/UserLink";
import {MyDecimal} from "../MyDecimal";
import {pageSize} from "../global";
import {PrettyPrice, toLocalDateTimeString} from "../helpers";
import {LoadingBtn} from "../LoadingBtn";
import {Loading} from "../Loading";
import {Redirect} from "react-router-dom";
import {useDeleteInvoice, useInvoices, useStrings} from "../Hooks";
import {data, IStrings} from "../localization/Invoices/InvoiceTable"
import {errors} from "../localization/Errors";
import {CalcValuesView} from "./InvoiceCalc";
import {NavLink} from "react-router-dom";

export function ToMeInvoices() {
    return <InvoiceTable type={InvoiceType.toMe}/>
}

export function FromMeInvoices() {
    return <InvoiceTable type={InvoiceType.fromMe}/>
}

interface IInvoiceTableProps {
    type: InvoiceType;
}

function InvoiceTable(props: IInvoiceTableProps) {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            invoices: props.type === InvoiceType.toMe ? store.invoices.toMeInvoices : store.invoices.fromMeInvoices,
            preload: props.type === InvoiceType.toMe ? store.preload.toMeInvoices : store.preload.fromMeInvoices,
            vars: store.catalog.variables,
            newInvoices: store.invoices.newInvoicesIds,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            userId: store.profile.UserId
        }), [props.type]
    );
    const {invoices, preload, vars, newInvoices, currency, userId} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [deleteRunning, setDeleteRunning] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [deleteInvoice, setDeleteInvoice] = useState<Invoice.AsObject | null>(null);

    useInvoices(getRunState(), getLastId(), pageSize,
        props.type === InvoiceType.fromMe,
        [],
        true, null, null,
        () => setIsRunning(true),
        () => {
            setIsRunning(false);
            setError("");
            setMore(false);
        },
        err => {
            setError(err);
            setIsRunning(false);
        });
    useDeleteInvoice(deleteInvoice, () => {
            setDeleteRunning(true);
            setError("");
        },
        () => {
            setDeleteRunning(false)
            setDeleteInvoice(null);
        },
        (e) => setError(e));

    function GetInvoices(): Invoice.AsObject[] {
        if (!invoices) {
            return [];
        }
        return invoices.filter(p => (p.owner?.id === userId) === (props.type === InvoiceType.fromMe))
            .filter(p => p.status !== Invoice.InvoiceStatus.PAYED && p.isprivate);
    }

    function getRunState(): boolean {
        if (invoices === null) {
            return false;
        }
        if (!preload) {
            return false;
        }
        if (!more) {
            return false;
        }
        if (isRunning) {
            return false;
        }
        let needCount = page * pageSize;
        let count = GetInvoices().length;
        if (count >= needCount) {
            if (more) {
                setMore(false);
            }
            return false;
        }
        //setMore(false);
        return true;
    }

    function getLastId() {
        let lastId = 0;
        if (invoices !== null && GetInvoices().length > 0) {
            lastId = GetInvoices()
                .map(p => p.id).reduce((a, b) => a < b ? a : b);
        }
        return lastId;
    }

    function IsMoreEnable() {
        if (!invoices) {
            return false;
        }
        return GetInvoices().length >= page * pageSize || more;
    }

    useEffect(() => {
        function GetInvoices(): Invoice.AsObject[] {
            if (!invoices) {
                return [];
            }
            return invoices.filter(p => (p.owner?.id === userId) === (props.type === InvoiceType.fromMe))
                .filter(p => p.status === Invoice.InvoiceStatus.ACTIVE && p.isprivate);
        }

        let p = GetInvoices().length / pageSize;
        let pp = Math.ceil(p);
        if (pp < 1) {
            pp = 1;
        }
        if (page < pp) {
            setPage(pp);
        }
    }, [invoices, page, props.type, userId]);

    const hoverStyle = {
        cursor: "pointer"
    }

    function MyRow(invoice: Invoice.AsObject) {
        let isNew = newInvoices.includes(invoice.id);
        let values = CalcValuesView(invoice, currency, vars)!;

        function getStatus(status: Invoice.InvoiceStatus){
            switch (status) {
                case Invoice.InvoiceStatus.ACTIVE:
                    return <span className="text-primary">{strings.active}</span>;
                case Invoice.InvoiceStatus.PENDINGPAY:
                    return <span className="text-warning">{strings.pendingPay}</span>;
                case Invoice.InvoiceStatus.NOPIECES:
                    return <span className="text-danger">{strings.noPieces}</span>;
                case Invoice.InvoiceStatus.PAYED:
                    return <span className="text-success">{strings.payed}</span>;
                case Invoice.InvoiceStatus.DELETED:
                    return "";

            }
        }

        return (
            <React.Fragment key={invoice.id}>
                <tr>
                    <th scope="row" style={hoverStyle}>
                        {invoice.id}
                    </th>
                    <td className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }} style={hoverStyle}>
                        {invoice.isbasecrypto ?
                            <>
                        <span className="font-weight-bold text-success">
                                        {PrettyPrice(MyDecimal.FromPb(invoice.price!), 8)}
                                    </span>
                                <span className="text-success small">{" BTC "}</span>
                                <span className="small">
                                    {"~" + values.piecePriceFiatStr + " " + currency}
                                </span>
                            </>
                            :
                            <>
                            <span className="small">
                                {values.piecePriceCryptoStr + " BTC "}
                            </span>
                                <span className="font-weight-bold text-success">
                                {PrettyPrice(MyDecimal.FromPb(invoice.price), 2) + " " + currency}
                            </span>
                            </>
                        }
                    </td>
                    {props.type === InvoiceType.fromMe ?
                        <td className="pb-0">
                            <UserLink info={invoice.targetuser!} isAdRate={false}/>
                        </td>
                        : null
                    }
                    {props.type === InvoiceType.toMe ?
                        <td className="pb-0">
                            <UserLink info={invoice.owner!} isAdRate={false}/>
                        </td>
                        : null
                    }
                    <td style={hoverStyle} className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {toLocalDateTimeString(invoice.validto)}
                    </td>
                    <td style={hoverStyle} className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {getStatus(invoice.status)}
                    </td>
                    <td style={hoverStyle} className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {isNew ?
                            <>
                                <Badge color="danger">{strings.New}</Badge>
                                <br/>
                            </>
                            : null
                        }
                    </td>
                    <td style={{width: "1%"}} className="pb-0">
                        <LoadingBtn loading={deleteRunning && deleteInvoice === invoice} color="danger" outline
                                    onClick={() => setDeleteInvoice(invoice)}
                        >{strings.delete}</LoadingBtn>
                    </td>
                </tr>
                {invoice.comment !== "" && invoice.refundisnull ?
                    <tr>
                        <td colSpan={6} className="border-top-0 table-hover pt-0">
                        <span className="small">
                            {invoice.comment.replace("\n", " ")}
                        </span>
                        </td>
                    </tr>
                    : null
                }
                {!invoice.refundisnull ?
                    <tr>
                        <td colSpan={6} className="border-top-0 table-hover pt-0">
                        <span>
                            {strings.refund}
                            <NavLink
                                to={"/invoices/payment/" + invoice.refundpaymentid}>{strings.payment + invoice.refundpaymentid}
                            </NavLink>
                            &nbsp;
                            {strings.pieces + invoice.piecesmin}
                        </span>
                        </td>
                    </tr>
                    : null
                }
            </React.Fragment>
        );
    }

    if (vars === null || vars.size === 0 || invoices === null) {
        return <Container>
            <Row className="pt-3">
                <Col>
                    <Loading/>
                </Col>
            </Row>
        </Container>
    }
    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <Container>
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
                                {strings.validTo}
                            </th>
                            <th className="border-top-0">
                                {strings.status}
                            </th>
                            <th className="border-top-0">
                            </th>
                            <th className="border-top-0">
                            </th>
                        </tr>
                        </thead>
                        <tbody className="table-hover">
                        {
                            GetInvoices().sort((a, b) => b.id - a.id)
                                .map(p => MyRow(p))
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {
                IsMoreEnable() ?
                    <Row>
                        <Col>
                            <LoadingBtn outline color="primary" className="btn-block" loading={isRunning}
                                        onClick={() => {
                                            setPage(value => value + 1);
                                            setMore(true);
                                        }}>
                                {strings.load}
                            </LoadingBtn>
                        </Col>
                    </Row>
                    : null
            }
        </Container>
    );
}