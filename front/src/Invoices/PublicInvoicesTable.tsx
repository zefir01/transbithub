import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Col, Container, Row, Table} from "reactstrap";
import {errors} from "../localization/Errors";
import {IStore} from "../redux/store/Interfaces";
import {LoadingBtn} from "../LoadingBtn";
import {useMappedState} from "redux-react-hook";
import {pageSize} from "../global";
import {Loading} from "../Loading";
import {Invoice} from "../Protos/api_pb";
import {CalcValuesView} from "./InvoiceCalc";
import {useDeleteInvoice, useInvoices, useStrings} from "../Hooks";
import {Redirect} from "react-router-dom";
import {data, IStrings} from "../localization/Invoices/PublicInvoicesTable";


export function PublicInvoicesTable() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            invoices: store.invoices.publicInvoices,
            preload: store.preload.publicInvoices,
            vars: store.catalog.variables,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            userId: store.profile.UserId
        }), []
    );
    const {invoices, preload, vars, currency, userId} = useMappedState(mapState);

    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [delInvoice, setDelInvoice] = useState<Invoice.AsObject | null>(null);
    const [redirect, setRedirect] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    useDeleteInvoice(delInvoice,
        () => {
            setIsDeleting(true)
            setError("");
        },
        () => {
            setIsDeleting(false);
            setDelInvoice(null);
        },
        (e) => setError(e)
    );

    function GetInvoices(): Invoice.AsObject[] {
        if (!invoices) {
            return [];
        }
        return invoices.filter(p => p.owner?.id === userId && !p.isprivate);
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

    useInvoices(getRunState(), getLastId(), pageSize,
        true, [], false, null, null,
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

    function MyRow(invoice: Invoice.AsObject) {
        const hoverStyle = {
            cursor: "pointer"
        }
        let values = CalcValuesView(invoice, currency, vars);
        if (values === null)
            return null;

        function getStatus(status: Invoice.InvoiceStatus) {
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
                <tr style={hoverStyle}>
                    <th scope="row" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {invoice.id}
                    </th>
                    <td className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {invoice.isbasecrypto ?
                            <span className="font-weight-bold text-success">
                                {values.piecePriceCryptoStr + " BTC"}
                            </span>
                            :
                            <>
                                <span className="font-weight-bold text-success">
                                    {values.piecePriceFiatStr + " " + currency}
                                </span>
                                <br/>
                                <span className="small">
                                    {"~" + values.piecePriceCryptoStr + " BTC"}
                                </span>
                            </>
                        }
                    </td>
                    <td className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {invoice.piecesmax === invoice.piecesmin ?
                            invoice.piecesmin
                            :
                            invoice.piecesmin + "-" + invoice.piecesmax
                        }
                    </td>
                    <td className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {invoice.isbasecrypto ?
                            <span className="text-success">
                                {values.amountCryptoMinStr + " BTC"}
                            </span>
                            :
                            <>
                                <span className="text-success">
                                    {values.amountFiatMinStr + " " + currency}
                                </span>
                                <br/>
                                <span className="small">
                                    {"~" + values.amountCryptoMinStr + " BTC"}
                                </span>
                            </>
                        }
                    </td>
                    <td className="pb-0" onClick={() => {
                        setRedirect("/invoices/invoice/" + invoice.id)
                    }}>
                        {invoice.isbasecrypto ?
                            <span className="text-success">
                                {values.amountCryptoMaxStr + " BTC"}
                            </span>
                            :
                            <>
                                <span className="text-success">
                                    {values.amountFiatMaxStr + " " + currency}
                                </span>
                                <br/>
                                <span className="small">
                                    {"~" + values.amountCryptoMaxStr + " BTC"}
                                </span>
                            </>
                        }
                    </td>
                    <td className="pb-0">
                        {invoice.secretscount}
                    </td>
                    <td className="pb-0">
                        {getStatus(invoice.status)}
                    </td>
                    <td className={invoice.comment !== "" ? "pb-0" : ""}>
                        <LoadingBtn loading={isDeleting && delInvoice === invoice} color="danger"
                                    outline
                                    onClick={() => setDelInvoice(invoice)}
                        >
                            {strings.delete}
                        </LoadingBtn>
                    </td>
                </tr>
                {invoice.comment !== "" ?
                    <tr>
                        <td colSpan={8} className="border-top-0 table-hover pt-0">
                            <span style={{overflowWrap: "anywhere"}} className="small">
                                {invoice.comment.replace("\n", " ")}
                            </span>
                        </td>
                    </tr>
                    : null
                }
            </React.Fragment>
        );
    }

    function IsMoreEnable() {
        return GetInvoices().length >= page * pageSize || more;
    }

    useEffect(() => {
        function GetInvoices(): Invoice.AsObject[] {
            if (!invoices) {
                return [];
            }
            return invoices.filter(p => p.owner?.id === userId && !p.isprivate);
        }

        let p = GetInvoices().length / pageSize;
        let pp = Math.ceil(p);
        if (pp < 1) {
            pp = 1;
        }
        if (page < pp) {
            setPage(pp);
        }
    }, [invoices, page, userId]);


    if (invoices === null || !preload || vars === null || vars.size === 0) {
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
                                {strings.piecesPrice}
                            </th>
                            <th className="border-top-0">
                                {strings.pieces}
                            </th>
                            <th className="border-top-0">
                                {strings.minAmount}
                            </th>
                            <th className="border-top-0">
                                {strings.maxAmount}
                            </th>
                            <th className="border-top-0">
                                {strings.secrets}
                            </th>
                            <th className="border-top-0">
                                {strings.status}
                            </th>
                            <th className="border-top-0">
                            </th>
                        </tr>
                        </thead>
                        <tbody className="table-hover">
                        {
                            GetInvoices().sort((a, b) => b.id - a.id).map(p => MyRow(p))
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
                                            setPage(page + 1);
                                            setMore(true)
                                        }}>
                                {strings.more}
                            </LoadingBtn>
                        </Col>
                    </Row>
                    : null
            }
        </Container>
    );
}