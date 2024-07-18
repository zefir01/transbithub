import * as React from "react";
import {useCallback, useState} from "react";
import {Conversation, UserInfo} from "../../Protos/api_pb";
import {Badge, Card, Col, Row} from "reactstrap";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CalcValuesView} from "../InvoiceCalc";
import {MyDecimal} from "../../MyDecimal";
import {PrettyPrice} from "../../helpers";
import {data, IStrings} from "../../localization/Invoices/Messenger/SelectorItem";
import {useStrings} from "../../Hooks";


library.add(fas);
const trash: IconLookup = {prefix: 'far', iconName: 'trash-alt'};
const trashIconDefinition: IconDefinition = findIconDefinition(trash);


export interface ISelectorItemProps {
    conversation: Conversation.AsObject,
    isSelected: boolean
    onSelect: () => void;
    onDelete: (conv: Conversation.AsObject) => void;
}

export function SelectorItem(props: ISelectorItemProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
            vars: store.catalog.variables,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            newEvents: store.invoices.newEvents
        }), []
    );
    const {userId, vars, currency, newEvents} = useMappedState(mapState);
    const [isOver, setIsOver] = useState(false);

    const valuesInvoice = useCallback(() => {
        if (!props.conversation.invoice) {
            return null;
        }
        return CalcValuesView(props.conversation.invoice!, currency, vars);
    }, [props.conversation.invoice, currency, vars]);

    const valuesPayment = useCallback(() => {
        if (!props.conversation.payment) {
            return null;
        }
        let vprice = vars!.get(`AVG_${currency}`)!;
        return MyDecimal.FromPb(props.conversation.payment!.cryptoamount).mul(vprice);
    }, [props.conversation.payment, vars, currency]);

    function getPartner(): UserInfo.AsObject {
        if (props.conversation.buyer?.id !== userId) {
            return props.conversation.buyer!;
        }
        return props.conversation.seller!;
    }

    function getPrice(): string {
        if (props.conversation.invoice) {
            let valInv = valuesInvoice();
            return valInv?.piecePriceFiatStr + " " + currency;
        }
        if (props.conversation.payment) {
            let valPayment = valuesPayment();
            return PrettyPrice(valPayment, 2) + " " + currency;
        }
        return "";
    }

    function getComment(): string {
        if (props.conversation.invoice) {
            return props.conversation.invoice.comment;
        }
        if (props.conversation.payment) {
            return props.conversation.payment.invoice!.comment;
        }
        return "";
    }

    function getClass() {
        let cl = "rounded-0";
        if (props.isSelected) {
            cl = "rounded-0 text-white bg-secondary";
        }
        if (isOver) {
            cl = cl + " border-primary";
        } else {
            //cl = cl + " border-top-0 border-left-0 border-right-0";
        }
        return cl;
    }

    function GetRate() {
        let info = getPartner();
        let rate;
        let r = MyDecimal.FromPb(info.invoiceresponserate).toDecimalPlaces(2).toString();
        rate = `${strings.rate} ${r}% ${strings.payments} ${info.paymentspayedcount + info.paymentsreceivedcount}`
        return (
            <span className="small mt-0">
                {rate}
            </span>
        )
    }

    function isNew(): boolean {
        return !!newEvents.find(p => p.conversation?.id === props.conversation.id);
    }

    return (
        <Row key={props.conversation.id}>
            <Col>
                <Card style={{cursor: "default"}}
                      onMouseOver={() => {
                          setIsOver(true);
                      }}
                      onMouseOut={() => {
                          setIsOver(false);
                      }}
                      onClick={() => props.onSelect()}
                      className={getClass()}>
                    {isNew() ?
                        <Row>
                            <Col className="col-auto">
                                <Badge color="danger">{strings.newMessage}</Badge>
                            </Col>
                        </Row>
                        : null
                    }
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <span className={!props.isSelected ? "text-primary pl-3" : "pl-3"}>
                                        {getPartner().username}
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <span className="small mt-0">
                                        {GetRate()}
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="col-auto m-1">
                            <FontAwesomeIcon style={{cursor: "pointer"}}
                                             onClick={() => props.onDelete(props.conversation)}
                                             icon={trashIconDefinition}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {props.conversation.invoice ? `${strings.invoice}${props.conversation.invoice.id}` : `${strings.payment}${props.conversation.payment?.id}`}
                        </Col>
                        <Col>
                            <span className={props.isSelected ? "" : "font-weight-bold text-success"}>
                                {getPrice()}
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {getComment()}
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    )
}