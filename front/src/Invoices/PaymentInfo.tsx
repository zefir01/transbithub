import * as React from "react";
import {InvoicePayment} from "../Protos/api_pb";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Collapse,
    Row,
} from "reactstrap";
import {PrettyPrice, toLocalDateTimeString} from "../helpers";
import {MyDecimal} from "../MyDecimal";
import {UserLink} from "../MainPages/UserLink";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/Invoices/PaymentInfo"
import {PaymentStatus} from "./PaymentStatus";
import {NavLink, useLocation} from "react-router-dom";
import {PaymentFeedback} from "./PaymentFeedback";
import {DealFeedback} from "../MainPages/DealPage/DealFeedback";
import {LoadingBtn} from "../LoadingBtn";
import {ContactButton} from "./Mesenger/ContactButton";
import {CreateRefund} from "./CreateRefund";
import {PromiseModal} from "../Promises/Promises";
import {PayByLNModal} from "./PayByLNModal";
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

export interface PaymentInfoRouteState {
    lnInvoiceOpen: boolean;
}

function isPaymentInfoRouteState(object: any): object is PaymentInfoRouteState {
    if (!object) {
        return false;
    }
    return 'lnInvoiceOpen' in object;
}

export interface IPaymentInfoProps {
    payment: InvoicePayment.AsObject,
    canceling: boolean;
    cancel: () => void;
    hideContact?: boolean;
}

export function PaymentInfo(props: IPaymentInfoProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables
        }), []
    );
    const {userId, currency, vars} = useMappedState(mapState);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [refundOpen, setRefundOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [lnInvoiceOpen, setLnInvoiceOpen] = useState(false);
    const [prevStatus, setPrevStatus] = useState<InvoicePayment.InvoicePaymentStatus | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (!location) {
            return;
        }
        if (isPaymentInfoRouteState(location.state)) {
            setLnInvoiceOpen(location.state.lnInvoiceOpen);
            console.log(true);
        }
    }, [location]);

    useEffect(() => {
        if (props.payment.status !== prevStatus) {
            if (prevStatus !== null) {
                setLnInvoiceOpen(false);
                console.log(false);
            }
            setPrevStatus(props.payment.status);
        }
    }, [props.payment.status, prevStatus])


    function getFiatAmount() {
        let crypto = MyDecimal.FromPb(props.payment.cryptoamount);
        let v = vars!.get("AVG_" + currency);
        let fiat = crypto.mul(v!);
        return PrettyPrice(fiat, 2);
    }

    if (userId === "" || currency === "" || !vars) {
        return <Loading/>
    }
    return (
        <>
            <Card>
                {props.payment.lninvoice !== "" ?
                    <PayByLNModal isOpen={lnInvoiceOpen} onClose={() => setLnInvoiceOpen(false)}
                                  payment={props.payment}/>
                    : null
                }
                <PromiseModal isOpen={modalOpen} onClose={() => setModalOpen(false)}
                              promise={props.payment.oddpromise}/>
                <CardHeader>
                    <Row>
                        <Col>
                            <h5>{strings.title + props.payment.id}</h5>
                        </Col>
                    </Row>
                    <Row>
                        {props.payment.status === InvoicePayment.InvoicePaymentStatus.PENDING && userId === props.payment.owner?.id ?
                            <Col className="col-auto d-flex align-items-center">
                                <LoadingBtn outline isSmall={true} color="secondary" loading={props.canceling}
                                            onClick={props.cancel}>
                                    {strings.cancel}
                                </LoadingBtn>
                            </Col>
                            : null
                        }
                        {/* eslint-disable-next-line eqeqeq */}
                        {!props.hideContact && !props.payment.isrefund && props.payment.invoice!.owner!.id != "" ?
                            <Col className="col-auto">
                                <ContactButton isSmall={true} target={props.payment}/>
                            </Col>
                            : null
                        }
                        {props.payment.lninvoice !== "" && props.payment.status === InvoicePayment.InvoicePaymentStatus.PENDING ?
                            <Col className="col-auto">
                                <Button outline className="btn-sm" color="info"
                                        onClick={() => setLnInvoiceOpen(true)}>
                                    Lighting Network
                                </Button>
                            </Col>
                            : null
                        }
                        {props.payment.owner?.id !== userId && !props.payment.isrefund ?
                            <Col>
                                <Button outline className="btn-sm" color="danger"
                                        onClick={() => setRefundOpen(!refundOpen)}>
                                    {strings.refund}
                                </Button>
                            </Col>
                            : null
                        }
                    </Row>
                    {!props.payment.dealisnull ?
                        <Row>
                            <Col className="col-auto">
                                <NavLink className="nav-link p-0"
                                         to={"/deal/" + props.payment.deal!.id}>{strings.deal + props.payment.deal!.id}</NavLink>
                            </Col>
                        </Row>
                        : null
                    }
                </CardHeader>
                <CardBody>
                    <CreateRefund payment={props.payment} isOpen={refundOpen}/>
                    <MyRow description={strings.status} data={
                        <Row>
                            <Col>
                                <PaymentStatus payment={props.payment}/>
                            </Col>
                        </Row>
                    }/>
                    {!props.payment.invoice?.isprivate ?
                        <MyRow description={strings.pieces} data={
                            <>
                                <span className="d-block">{strings.purchased + props.payment.pieces}</span>
                                {(props.payment.refunded !== 0 || props.payment.refunding !== 0) ?
                                    <>
                                        <span className="d-block">{strings.refunding + props.payment.refunding}</span>
                                        <span className="d-block">{strings.refunded + props.payment.refunded}</span>
                                    </>
                                    : null
                                }

                            </>
                        }/>
                        : null
                    }
                    {props.payment.owner!.id !== userId ?
                        <MyRow description={strings.payer}
                               data={<UserLink info={props.payment.owner!} isAdRate={false}/>}/>
                        :
                        <MyRow description={strings.seller}
                               data={<UserLink info={props.payment.invoice?.owner!} isAdRate={false}/>}/>
                    }
                    <MyRow description={strings.createdAt} data={toLocalDateTimeString(props.payment.createdat)}/>
                    {!props.payment.dealisnull ?
                        <>
                            <MyRow description={strings.fiatAmount}
                                   data={
                                       < span className="font-weight-bold text-success">
                                   {MyDecimal.FromPb(props.payment.deal!.fiatamount).toString() + " " + props.payment.deal!.advertisement!.fiatcurrency}
                               </span>
                                   }/>
                            <MyRow description={strings.btcPrice}
                                   data={PrettyPrice(MyDecimal.FromPb(props.payment.deal!.advertisement!.price)) + " " + props.payment.deal!.advertisement!.fiatcurrency + "/BTC"}/>
                        </>
                        :
                        <MyRow description={strings.fiatAmount}
                               data={
                                   < span className="font-weight-bold text-success">
                                   {"~" + getFiatAmount() + " " + currency}
                               </span>
                               }/>
                    }
                    <MyRow description={strings.cryptoAmount}
                           data={
                               < span className="font-weight-bold text-success">
                               {PrettyPrice(MyDecimal.FromPb(props.payment.cryptoamount), 8) + " BTC"}
                           </span>
                           }/>
                    {props.payment.status === InvoicePayment.InvoicePaymentStatus.PAID ?
                        <>
                            {props.payment.oddpromise !== "" ?
                                <MyRow description={strings.promise} data={
                                    <Button color="info" outline onClick={() => setModalOpen(true)}>
                                        {strings.show}
                                    </Button>
                                }/>
                                : null
                            }
                            <MyRow description={strings.confirmation} isHrDisabled={true}
                                   data={

                                       <Button outline color="info" className="btn-block"
                                               onClick={() => setIsConfirmOpen(!isConfirmOpen)}>
                                           {isConfirmOpen ? strings.hide : strings.show}
                                       </Button>
                                   }/>
                            <Collapse isOpen={isConfirmOpen}>
                                <Card className="mt-2">
                                    <CardHeader>
                                        {strings.confInfo}
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                <small className="form-text">
                                                    {props.payment.confirmation.split("\n").map((t, i) => {
                                                        if (t === "") {
                                                            return (
                                                                <br key={i}/>
                                                            );
                                                        }
                                                        return (
                                                            <span style={{display: "block"}} className="small m-0"
                                                                  key={i}>{t}</span>
                                                        );
                                                    })}
                                                </small>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </>
                        : null
                    }
                    <PaymentFeedback payment={props.payment}/>
                    <DealFeedback deal={props.payment.deal} payment={props.payment}/>
                </CardBody>
            </Card>
        </>
    );
}