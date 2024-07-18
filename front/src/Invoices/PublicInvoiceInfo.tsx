import * as React from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col, Collapse, ListGroup, ListGroupItem, Modal, ModalFooter, ModalHeader,
    Row
} from "reactstrap";
import {MyDecimal} from "../MyDecimal";
import {UserLink} from "../MainPages/UserLink";
import {PrettyPrice} from "../helpers";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {CalcValuesView, IInvoiceCalculatedValues} from "./InvoiceCalc";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {data, IStrings} from "../localization/Invoices/InvoiceInfo";
import {Loading} from "../Loading";
import {NavLink} from "react-router-dom";
import {IInvoiceInfoProps} from "./InvoiceInfo";
import {ContactButton} from "./Mesenger/ContactButton";
import {Invoice} from "../Protos/api_pb";
import {ImagePreviewCarousel} from "../MainPages/ImagePrevireCarousel";
import {Col4} from "../global";
import {useStrings} from "../Hooks";


export interface LinksModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice.AsObject;
}

export function LinksModal(props: LinksModalProps) {
    const strings: IStrings = useStrings(data);
    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h5>{strings.links}</h5>
                <span className="small text-secondary">
                    {strings.linksDesc}
                </span>
            </ModalHeader>
            <ListGroup>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.link}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer'
                               href={`${process.env.PUBLIC_URL ?? ""}/links/invoice/${props.invoice.id}`}>
                                {`${window.location.origin.toString()}${process.env.PUBLIC_URL ?? ""}/links/invoice/${props.invoice.id}/{${strings.piecesParam}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.helper}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer'
                               href={`${process.env.PUBLIC_URL ?? ""}/links/helper/invoice/${props.invoice.id}`}>
                                {`${window.location.origin.toString()}${process.env.PUBLIC_URL ?? ""}/links/helper/invoice/${props.invoice.id}/{${strings.piecesParam}}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.iframe}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer'
                               href={`${process.env.PUBLIC_URL ?? ""}/iframes/invoice/${props.invoice.id}/1`}>
                                {`${window.location.origin.toString()}${process.env.PUBLIC_URL ?? ""}/iframes/invoice/${props.invoice.id}/{${strings.piecesParam}}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.iframeHelper}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer'
                               href={`${process.env.PUBLIC_URL ?? ""}/iframes/helper/invoice/${props.invoice.id}`}>
                                {`${window.location.origin.toString()}${process.env.PUBLIC_URL ?? ""}/iframes/helper/invoice/${props.invoice.id}/{${strings.piecesParam}}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
            <ModalFooter>
                <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
            </ModalFooter>
        </Modal>
    );
}

interface IMyRowProps {
    description: string;
    data: ReactNode;
    isHrDisabled?: boolean;
}

const MyRow = (props: IMyRowProps) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <span className="font-weight-bold">{props.description}</span>
                </Col>
                <Col>
                    {props.data}
                </Col>
            </Row>
            {props.isHrDisabled !== undefined && props.isHrDisabled ? null : <hr/>}
        </React.Fragment>
    );
};


export function PublicInvoiceInfo(props: IInvoiceInfoProps) {
    const strings: IStrings = useStrings(data);
    let invoice = props.invoice;
    const mapState = useCallback(
        (store: IStore) => ({
            vars: store.catalog.variables,
            userId: store.profile.UserId,
            currency: store.profile.GeneralSettings.DefaultCurrency
        }), []
    );
    const {vars, currency, userId} = useMappedState(mapState);
    const [values, setValues] = useState<IInvoiceCalculatedValues | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);

    useEffect(() => {
        if (currency !== "" && vars !== null && vars !== undefined && vars.size !== 0) {
            let res = CalcValuesView(invoice, currency, vars);
            setValues(res);
        }
    }, [invoice, vars, currency])


    function GetPartner() {
        if (userId !== invoice.owner?.id) {
            return (
                <MyRow description={strings.partner} data={
                    <UserLink info={invoice.owner!} isAdRate={false} disableLink={props.disableLinks}/>
                }/>
            )
        }
        return null;
    }

    function YesNo(value: boolean): string {
        return value ? strings.yes : strings.no;
    }

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

    if (values === null || currency === "") {
        return <Loading/>;
    }

    return (
        <Card>
            <LinksModal isOpen={linksOpen} onClose={() => setLinksOpen(false)} invoice={invoice}/>
            {!props.hideHeader ?
                <CardHeader>
                    <Row>
                        <Col>
                            <Row>
                                {props.title ?
                                    <Col>
                                        <h5>{props.title}</h5>
                                    </Col>
                                    : null
                                }
                            </Row>
                            <Row>
                                <Col className="col-auto">
                                    <h6>
                                        {invoice.status === Invoice.InvoiceStatus.ACTIVE ?
                                            <NavLink className="nav-link p-0"
                                                     to={"/invoices/invoice/" + invoice.id}>
                                                {strings.number + " " + invoice.id.toString()}
                                            </NavLink>
                                            :
                                            <span>{strings.number + " " + invoice.id.toString()}</span>
                                        }
                                    </h6>
                                </Col>
                            </Row>
                        </Col>
                        {/* eslint-disable-next-line eqeqeq */}
                        {invoice.owner?.id !== userId && !props.hideContact && invoice.owner?.id != "" && invoice.owner?.id !== userId ?
                            <Col className="col-auto">
                                <ContactButton target={invoice} isSmall={true}/>
                            </Col>
                            : null
                        }
                        {invoice.owner?.id === userId ?
                            <Col className="col-auto">
                                <Button outline color="primary" onClick={() => setLinksOpen(true)}>
                                    {strings.links}
                                </Button>
                            </Col>
                            : null
                        }
                    </Row>
                </CardHeader>
                : null
            }
            <CardBody>
                <MyRow description={strings.status} data={
                    getStatus(invoice.status)
                }/>
                <GetPartner/>
                <MyRow description={strings.comment} data={
                    <Row>
                        <Col>
                            {invoice.comment.split("\n").map((t, i) => <span className="d-block"
                                                                             key={i}>{t}</span>)}
                        </Col>
                    </Row>
                } isHrDisabled={props.invoice.imagesList.length > 0}/>
                {props.invoice.imagesList.length > 0 ?
                    <Row className="mb-3">
                        <Col>
                            <Card>
                                <CardBody className="p-1">
                                    <ImagePreviewCarousel ids={props.invoice.imagesList}/>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    : null
                }
                <MyRow description={strings.piecePrice}
                       data={
                           <span className="font-weight-bold text-success">
                               {
                                   (values.piecePriceFiatStr) + " " + currency
                               }
                           </span>
                       }
                />
                <MyRow
                    description={strings.piecePriceCrypto}
                    data={
                        <span className="font-weight-bold text-success">
                            {values.piecePriceCryptoStr + " BTC"}
                        </span>

                    }/>
                <MyRow description={strings.pieces} data={
                    invoice.piecesmin === invoice.piecesmax ?
                        invoice.piecesmin.toString()
                        :
                        invoice.piecesmin + "-" + invoice.piecesmax
                }
                />
                <MyRow isHrDisabled={true} description={"Дополнительно"} data={
                    <Button outline className="btn-block" color="info" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? strings.hide : strings.show}
                    </Button>
                }/>
                <Collapse isOpen={isOpen} className="mt-2">
                    {invoice.piecesmin !== invoice.piecesmax ?
                        <>
                            <MyRow isHrDisabled={true} description={strings.minFiatAmount}
                                   data={values.amountFiatMinStr + " " + currency}/>
                            <MyRow isHrDisabled={true} description={strings.maxFiatAmount}
                                   data={values.amountFiatMaxStr + " " + currency}/>
                            <MyRow isHrDisabled={true} description={strings.minCryptoAmount}
                                   data={values.amountCryptoMinStr + " BTC"}/>
                            <MyRow isHrDisabled={true} description={strings.maxCryptoAmount}
                                   data={values.amountCryptoMaxStr + " BTC"}/>
                        </>
                        : null
                    }
                    <MyRow isHrDisabled={true} description={strings.limit} data={YesNo(invoice.limitliquidity)}/>
                    <MyRow isHrDisabled={true} description={strings.private} data={YesNo(invoice.isprivate)}/>
                    <MyRow isHrDisabled={true} description={strings.inCrypto}
                           data={YesNo(invoice.isbasecrypto)}/>
                    <MyRow isHrDisabled={true} description={strings.totalAmountFiat}
                           data={"~" + values.totalPaidFiatStr + " " + currency}/>
                    <MyRow isHrDisabled={true} description={strings.totalAmountCrypto}
                           data={PrettyPrice(MyDecimal.FromPb(invoice.totalpayedcrypto), 8) + " BTC"}/>
                    <MyRow isHrDisabled={true} description={strings.paymentsCount}
                           data={invoice.paymentscount}/>
                </Collapse>
            </CardBody>
        </Card>
    )
}