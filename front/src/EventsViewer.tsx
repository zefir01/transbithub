import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, EventTypes, IEvent, IStore} from "./redux/store/Interfaces";
import {
    Alert,
    Badge,
    Button,
    Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledDropdown
} from "reactstrap";
import {Col10, Col2} from "./global";
import {NavLink} from "react-router-dom";
import {MarkEventsAsReadRequest} from "./Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "./helpers";
import {MarkAsReadedEvents} from "./redux/actions";
import {data, IStrings} from "./localization/EventsViewer"
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "./Hooks";
import {errors} from "./localization/Errors";


interface IItemProps {
    event: IEvent,
    mark: (event: IEvent) => void,
    strings: IStrings
}

function Item(props: IItemProps) {
    let text = "";
    let link: string = "";
    switch (props.event.type) {
        case EventTypes.DealNew:
            text = props.strings.newDeal;
            link = "/deal/" + props.event.dealId!.toString();
            break;
        case EventTypes.DealNewMessage:
            text = props.strings.newMessage;
            link = "/deal/" + props.event.dealId!.toString();
            break;
        case EventTypes.DealStatusChanged:
            text = props.strings.newStatus;
            link = "/deal/" + props.event.dealId!.toString();
            break;
        case EventTypes.DealFiatPayed:
            text = props.strings.newFiat;
            link = "/deal/" + props.event.dealId!.toString();
            break;
        case EventTypes.DealDisputeCreated:
            text = props.strings.newDisput;
            link = "/deal/" + props.event.dealId!.toString();
            break;
        case EventTypes.InvoiceNew:
            text = props.strings.newInvoice;
            link = "/invoices/invoice/" + props.event.invoiceId!.toString();
            break;
        case EventTypes.InvoicePaymentNew:
            text = props.strings.paymentReceived;
            link = "/invoices/payment/" + props.event.invoicePayment!.id;
            break;
        case EventTypes.ConversationNewMessage:
            text = props.strings.newMessage;
            link = "/invoices/messenger/" + props.event.conversation?.id;
            break;
    }
    return (
        <DropdownItem tag="div" className="p-0 m-0 text-nowrap flex-nowrap" key={props.event.id}>
            <Row className="m-0 text-nowrap flex-nowrap">
                <Col {...Col10}>
                    <NavLink isActive={() => true} className="nav-link p-0"
                             to={link}>{text}</NavLink>
                </Col>
                <Col {...Col2} className="d-flex justify-content-end">
                    <Button className="py-0 btn-sm" outline color="success"
                            onClick={() => props.mark(props.event)}
                    >
                        Ok
                    </Button>
                </Col>
            </Row>
        </DropdownItem>
    )
}

export function EventsViewer() {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            deals: store.deals,
            invoices: store.invoices
        }), []
    );
    const {authState, deals, invoices} = useMappedState(mapState);
    const [markEventsAsReadedRunning, setmarkEventsAsReadedRunning] = useState(false);
    const [markEvents, setMarkEvents] = useState<IEvent[] | null>(null);
    const [error, setError] = useState("");


    useEffect(() => {
        if (markEventsAsReadedRunning) {
            return;
        }
        if (authState === AuthState.NotAuthed) {
            return;
        }
        if (markEvents === null) {
            return;
        }

        setmarkEventsAsReadedRunning(true);

        async function f() {
            let req = new MarkEventsAsReadRequest();
            markEvents!.map(p => p.id).forEach(p => req.addId(p));

            try {
                let token = getToken();
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.markEventsAsRead, req, token);
                dispatch(MarkAsReadedEvents(markEvents!));
                setMarkEvents(null);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setmarkEventsAsReadedRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, markEvents, dispatch, markEventsAsReadedRunning]);

    if (error !== "") {
        return (
            <Alert color="danger">{error}</Alert>
        );
    }
    if (deals.newEvents.length + invoices.newEvents.length === 0) {
        return null;
    }

    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                {strings.events}
                <Badge color="danger">{deals.newEvents.length + invoices.newEvents.length}</Badge>
            </DropdownToggle>
            <DropdownMenu right>
                {deals.newEvents.length + invoices.newEvents.length > 0 ?
                    <>
                        <DropdownItem tag="div" className="py-0">
                            <Row className="justify-content-center">
                                <Button className="py-0 btn-sm" outline color="success"
                                        onClick={() => {
                                            setMarkEvents(deals.newEvents.concat(invoices.newEvents));
                                        }}>
                                    {strings.allReaded}
                                </Button>
                            </Row>
                        </DropdownItem>
                        <DropdownItem divider/>
                    </>
                    : null
                }
                {
                    deals.newEvents.concat(invoices.newEvents).sort(p => p.id).map(p => Item({
                        event: p,
                        mark: (event => {
                            setMarkEvents([event]);
                        }),
                        strings
                    }))
                }
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}