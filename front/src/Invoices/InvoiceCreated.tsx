import * as React from "react";
import {Alert, Col, Container, Row} from "reactstrap";
import {useState} from "react";
import {Col6_12} from "../global";
import {createMatchSelector} from "connected-react-router";
import {useMappedState} from "redux-react-hook";
import {useCallback} from "react";
import {IStore} from "../redux/store/Interfaces";
import {Invoice} from "../Protos/api_pb";
import {Loading} from "../Loading";
import {InvoiceInfo} from "./InvoiceInfo";
import {data, IStrings} from "../localization/Invoices/InvoiceCreated";
import {errors} from "../localization/Errors";
import {SecretsList} from "./Secrets/SecretsList";
import {useStrings} from "../Hooks";


export interface IInvoiceCreatedProps {
    isUpdated?: boolean;
}


export const InvoiceCreated = (props: IInvoiceCreatedProps) => {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            invoices: store.invoices,
            preload: store.preload,
            invoice: getInvoice(store),
        }), []
    );
    const {invoice} = useMappedState(mapState);

    const [error, ] = useState("");


    function getId1(store: IStore) {
        const matchSelector = createMatchSelector("/invoices/created/:id(\\d+)");
        const match = matchSelector({router: store.router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id !== undefined)
            return id;
        return null;
    }

    function getId2(store: IStore) {
        const matchSelector = createMatchSelector("/invoices/updated/:id(\\d+)");
        const match = matchSelector({router: store.router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id !== undefined)
            return id;
        return null;
    }

    function getId(store: IStore): number | null {
        let id1 = getId1(store);
        let id2 = getId2(store);
        if (id1 !== null)
            return id1;
        if (id2 !== null)
            return id2;
        return null;
    }

    function getInvoice(store: IStore): Invoice.AsObject | null | undefined {
        if (store.invoices.fromMeInvoices === null || store.invoices.publicInvoices === null) {
            return null;
        }
        let id = getId(store);
        if (id === null) {
            return null;
        }
        // eslint-disable-next-line eqeqeq
        let inv = store.invoices.fromMeInvoices.concat(store.invoices.publicInvoices).find(p => p.id == id);
        if (inv === undefined) {
            if (store.preload.toMeInvoicePayments && store.preload.fromMeInvoicePayments && store.preload.fromMeInvoices && store.preload.toMeInvoices) {
                return undefined;
            }
            return null;
        }
        return inv;
    }

    if (invoice === null)
        return (
            <Container>
                <Row>
                    <Col className="pt-3">
                        <Loading/>
                    </Col>
                </Row>
            </Container>
        );
    if (invoice === undefined) {
        return (
            <Container>
                <Row>
                    <Col className="pt-3">
                        <Alert color="danger">{errors("Invoice not found.")}</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            {
                error !== "" ?
                    <Row>
                        <Col>
                            <Alert color="danger">{error}</Alert>
                        </Col>
                    </Row>
                    : null
            }
            <Row className="mt-3 justify-content-center">
                <Col {...Col6_12}>
                    <InvoiceInfo invoice={invoice!}
                                 title={props.isUpdated === undefined ? strings.invoiceCreated : strings.invoiceUpdated}/>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <SecretsList invoiceId={invoice.id} isPrivate={invoice.isprivate} isSold={false}/>
                </Col>
            </Row>
        </Container>
    );
};