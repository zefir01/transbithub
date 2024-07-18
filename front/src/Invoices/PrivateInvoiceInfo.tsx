import * as React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row
} from "reactstrap";
import {MyDecimal} from "../MyDecimal";
import {UserLink} from "../MainPages/UserLink";
import {toLocalDateTimeString} from "../helpers";
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
import {useStrings} from "../Hooks";

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


export function PrivateInvoiceInfo(props: IInvoiceInfoProps) {
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

    useEffect(() => {
        if (currency !== "" && vars !== null && vars !== undefined) {
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
        } else {
            return (
                <MyRow description={strings.partner} data={
                    <UserLink info={invoice.targetuser!} isAdRate={false} disableLink={props.disableLinks}/>
                }/>
            );
        }
    }

    function YesNo(value: boolean): string {
        return value ? strings.yes : strings.no;
    }

    function GetComment() {
        if (invoice.service === Invoice.ServiceType.NONE) {
            return (
                <>
                    {invoice.comment.split("\n").map((t, i) => <span className="d-block" key={i}>{t}</span>)}
                </>
            );
        }
        if (invoice.service === Invoice.ServiceType.AUTOPRICE) {
            return <span>{strings.autoPrice}</span>;
        }
        return null;
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
                                    <h5>
                                        {invoice.status === Invoice.InvoiceStatus.ACTIVE ?
                                            <NavLink className="nav-link p-0"
                                                     to={"/invoices/invoice/" + invoice.id}>
                                                {strings.number + " " + invoice.id.toString()}
                                            </NavLink>
                                            :
                                            <span>{strings.number + " " + invoice.id.toString()}</span>
                                        }
                                    </h5>
                                </Col>
                            </Row>
                        </Col>
                        {/* eslint-disable-next-line eqeqeq */}
                        {!props.hideContact && props.invoice.refundisnull && invoice.owner?.id != "" ?
                            <Col className="col-auto">
                                <ContactButton target={invoice} isSmall={true}/>
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
                <MyRow description={strings.comment} data=
                    {invoice.refundisnull ?
                        <>
                            <GetComment/>
                        </>
                        :
                        <>
                            <Row>
                                <Col>
                                    {strings.refund}
                                    <NavLink
                                        to={"/invoices/payment/" + invoice.refundpaymentid}>{strings.payment + invoice.refundpaymentid}
                                    </NavLink>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {strings.pieces1 + invoice.piecesmin}
                                </Col>
                            </Row>
                        </>
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
                <MyRow description={strings.amount}
                       data={
                           <span className="font-weight-bold text-success">
                               {
                                   values.amountFiatStr + " " + currency
                               }
                           </span>
                       }
                />
                <MyRow
                    description={strings.amountCrypto}
                    data={
                        <span className="font-weight-bold text-success">
                            {values.piecePriceCryptoStr + " BTC"}
                        </span>

                    }/>
                {invoice.owner!.id === userId ?
                    <MyRow description={strings.fee} data={MyDecimal.FromPb(invoice.fee) + " BTC"}/>
                    : null
                }

                <MyRow description={strings.ttl}
                       data={toLocalDateTimeString(invoice.validto!)}/>
                <MyRow description={strings.private} data={YesNo(invoice.isprivate)}/>
                <MyRow isHrDisabled={invoice.isprivate} description={strings.inCrypto}
                       data={YesNo(invoice.isbasecrypto)}/>
            </CardBody>
        </Card>
    )
}