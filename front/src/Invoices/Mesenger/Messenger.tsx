import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Col, Container, Row} from "reactstrap";
import {Col2, Col4} from "../../global";
import {Chat} from "./Chat";
import {Selector} from "./Selector";
import {
    Conversation,
    DeleteConversationRequest,
    Invoice,
    InvoicePayment,
    SendInvoiceMessageRequest,
    SendInvoicePaymentMessageRequest
} from "../../Protos/api_pb";
import {useLocation} from "react-router-dom";
import {PaymentInfo} from "../PaymentInfo";
import {InvoiceInfo} from "../InvoiceInfo";
import {AuthState, IEvent, IImage, IStore} from "../../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {createImage, getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {ConversationDeleted, LoadConversation, UploadImages} from "../../redux/actions";
import {Loading} from "../../Loading";
import {useMarkAsReadedEvents, useStrings} from "../../Hooks";
import {createMatchSelector} from "connected-react-router";
import {data, IStrings} from "../../localization/Invoices/Messenger/Messenger";
import {errors} from "../../localization/Errors";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export interface IContactLocationProps {
    target: Invoice.AsObject | InvoicePayment.AsObject,
}

export function isInvoice(obj: Invoice.AsObject | InvoicePayment.AsObject): obj is Invoice.AsObject {
    return (obj as Invoice.AsObject).isprivate !== undefined;
}

export function Messenger() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            convs: store.invoices.conversations,
            userId: store.profile.UserId,
            authState: store.auth.state,
            preload: store.preload.conversations,
            invoices: store.invoices,
            id: getId(store),
            vars: store.catalog.variables
        }), []
    );
    const {convs, userId, authState, preload, invoices, id, vars} = useMappedState(mapState);
    const dispatch = useDispatch();

    function isContactProps(object: any): object is IContactLocationProps {
        if (!object) {
            return false;
        }
        return (object as IContactLocationProps).target !== undefined;
    }

    const location = useLocation();
    const [sendMessage, setSendMessage] = useState("");
    const [sendMessageRunning, setSendMessageRunning] = useState(false);
    const [error, setError] = useState("");
    const [conversation, setConversation] = useState<Conversation.AsObject | null>(null);
    const [deleteConv, setDeleteConv] = useState<Conversation.AsObject | null>(null);
    const [deleteConvRunning, setDeleteConvRunnig] = useState(false);
    const [markEvents, setMarkEvents] = useState<Array<IEvent> | null>(null);
    const [sendImages, setSendImages] = useState(new Array<IImage>());
    const [sendImagesRunning, setSendImagesRunning] = useState(false);
    function getId(store: IStore) {
        const matchSelector = createMatchSelector("/invoices/messenger/:id(\\d+)");
        const match = matchSelector({router: store.router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id !== undefined)
            return id;
        return null;
    }

    const getContactCb=useCallback(()=>{
        if (conversation !== null) {
            if (conversation.invoice) {
                return conversation.invoice;
            }
            if (conversation.payment) {
                return conversation.payment;
            }
        }
        if (isContactProps(location.state)) {
            return location.state.target;
        }
        return null;
    }, [conversation, location.state])
    const contact=getContactCb();


    useEffect(() => {
        let evts = invoices.newEvents.filter(p => p.conversation?.id === conversation?.id);
        setMarkEvents(evts);
    }, [conversation, invoices.newEvents])

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line eqeqeq
            let c = convs?.find(p => p.id == id);
            if (c) {
                let evts = invoices.newEvents.filter(p => p.conversation?.id === c!.id);
                setMarkEvents(evts);
                setConversation(c);
            }
        }
    }, [id, convs, invoices.newEvents]);

    useEffect(() => {
        if (conversation === null) {
            return;
        }

        function sorter(a: Conversation.AsObject, b: Conversation.AsObject) {
            let t1 = a.messagesList.sort((m1, m2) => m2.id - m1.id)[0].id;
            let t2 = b.messagesList.sort((m1, m2) => m2.id - m1.id)[0].id;
            return t2 - t1;
        }

        let newConv = convs?.find(p => p.id === conversation.id);
        if (!newConv) {
            let c = convs?.sort((a, b) => sorter(a, b))[0];
            if (c === undefined) {
                setConversation(null);
                return;
            }
            setConversation(c);
        } else {
            setConversation(newConv);
        }
    }, [convs, conversation])

    useEffect(() => {
        if(!contact){
            return;
        }
        if (conversation !== null) {
            delete location.state;
        }
        if (convs && convs.length > 0 && !isContactProps(location.state) && conversation === null) {
            let c = convs.sort((a, b) => b.id - a.id)[0];
            setConversation(c);
        } else {
            if (convs && convs.length > 0 && isContactProps(location.state) && conversation === null) {
                if (isInvoice(contact)) {
                    let partnerId: string;
                    let c: Conversation.AsObject | undefined;
                    if (contact.owner?.id === userId) {
                        partnerId = contact.targetuser!.id;
                        c = convs.find(p => p.invoice?.id === contact.id && p.buyer?.id === partnerId);
                    } else {
                        partnerId = contact.owner!.id;
                        c = convs.find(p => p.invoice?.id === contact.id && p.seller?.id === partnerId);
                    }
                    if (!c) {
                        setConversation(null);
                        return;
                    }
                    setConversation(c);
                } else {
                    let partnerId: string;
                    let c: Conversation.AsObject | undefined;
                    if (contact.owner?.id === userId) {
                        partnerId = contact.invoice!.owner!.id;
                        c = convs.find(p => p.payment?.id === contact.id && p.seller?.id === partnerId);
                    } else {
                        partnerId = contact.owner!.id;
                        c = convs.find(p => p.payment?.id === contact.id && p.buyer?.id === partnerId);
                    }
                    if (!c) {
                        setConversation(null);
                        return;
                    }
                    setConversation(c);
                }
            }
        }
    }, [location.state, convs, conversation, userId, contact])

    useEffect(() => {
        async function f() {
            if (sendMessageRunning || sendMessage === "" || contact === null || authState === AuthState.NotAuthed) {
                return;
            }
            setSendMessageRunning(true);

            if (!contact)
                return;
            let payment = contact as InvoicePayment.AsObject;

            try {
                let resp: Conversation.AsObject;
                if (!isInvoice(contact)) {
                    let req = new SendInvoicePaymentMessageRequest();
                    req.setPaymentid(payment.id);
                    req.setText(sendMessage);
                    resp = await TradeGrpcRunAsync<Conversation.AsObject>(tradeApiClient.sendInvoicePaymentMessage, req, getToken());
                    setSendMessage("");
                } else {
                    let inv = contact as Invoice.AsObject;
                    let req = new SendInvoiceMessageRequest();
                    if (inv.owner?.id === userId) {
                        if (inv.isprivate) {
                            if (conversation === null) {
                                req.setTouserid(inv.targetuser!.id);
                            } else {
                                req.setTouserid(conversation.buyer!.id);
                            }
                        } else {
                            if (!conversation) {
                                setError("Conversation not found.");
                                // noinspection ExceptionCaughtLocallyJS
                                throw new Error("Conversation not found.");
                            } else {
                                req.setTouserid(conversation.buyer!.id);
                            }
                        }
                    } else {
                        req.setTouserid("");
                    }
                    req.setInvoiceid(inv.id);
                    req.setText(sendMessage);
                    resp = await TradeGrpcRunAsync<Conversation.AsObject>(tradeApiClient.sendInvoiceMessage, req, getToken());
                    setSendMessage("");
                }
                dispatch(LoadConversation(resp));
                setConversation(resp);
                setError("");
            } catch (e) {
                setSendMessage("");
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setSendMessageRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [conversation, sendMessageRunning, sendMessage, userId, contact, dispatch, authState])
    useEffect(() => {
        async function f() {
            if (sendImagesRunning || sendImages.length === 0 || contact === null || authState === AuthState.NotAuthed) {
                return;
            }
            setSendImagesRunning(true);

            if (!contact)
                return;
            let payment = contact as InvoicePayment.AsObject;

            try {
                let resp: Conversation.AsObject;
                if (!isInvoice(contact)) {
                    let req = new SendInvoicePaymentMessageRequest();
                    req.setPaymentid(payment.id);
                    req.setImageidsList(sendImages.map(p => p.id));
                    resp = await TradeGrpcRunAsync<Conversation.AsObject>(tradeApiClient.sendInvoicePaymentMessage, req, getToken());
                    setSendImages([]);
                } else {
                    let inv = contact as Invoice.AsObject;
                    let req = new SendInvoiceMessageRequest();
                    if (inv.owner?.id === userId) {
                        if (conversation === null) {
                            req.setTouserid("");
                        } else {
                            req.setTouserid(conversation.buyer!.id);
                        }
                    } else {
                        req.setTouserid("");
                    }
                    req.setInvoiceid(inv.id);
                    req.setImageidsList(sendImages.map(p => p.id));
                    resp = await TradeGrpcRunAsync<Conversation.AsObject>(tradeApiClient.sendInvoiceMessage, req, getToken());
                    setSendImages([]);
                }
                dispatch(LoadConversation(resp));
                setConversation(resp);
                setError("");
                dispatch(UploadImages(sendImages));
            } catch (e) {
                setSendImages([]);
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setSendImagesRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [sendImages, conversation, sendImagesRunning, userId, contact, dispatch, authState])

    useEffect(() => {
        if (!deleteConv || deleteConvRunning || authState === AuthState.NotAuthed) {
            return;
        }
        setDeleteConvRunnig(true);

        async function f() {
            let req = new DeleteConversationRequest();
            req.setConversationid(deleteConv!.id);

            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.deleteConversation, req, getToken()!);
                setError("");
                dispatch(ConversationDeleted(deleteConv!.id));
                if (conversation?.id === deleteConv?.id) {
                    setConversation(null);
                }
                setDeleteConv(null);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setDeleteConv(null);
                setDeleteConvRunnig(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [deleteConv, authState, conversation?.id, deleteConvRunning, dispatch])
    useMarkAsReadedEvents(markEvents, () => {
        },
        () => setMarkEvents(null),
        err => setError(err));

    if (!convs || !preload || !vars || vars.size === 0) {
        return (
            <Container>
                <Row>
                    <Col>
                        <Loading className="pt-3"/>
                    </Col>
                </Row>
            </Container>
        )
    }

    if ((!convs || convs?.length === 0) && contact === null) {
        return (
            <Container>
                <Row className="pt-3">
                    <Col className="text-center">
                        {strings.noMessages}
                    </Col>
                </Row>
            </Container>
        )
    }


    return (
        <div className="container-fluid">
            {error !== "" ?
                <Row>
                    <Col>
                        <Alert color="danger">{errors(error)}</Alert>
                    </Col>
                </Row>
                : null
            }
            <Row className="no-gutters">
                {convs && convs.length > 0 ?
                    <Col {...Col2}>
                        <Selector conversation={conversation}
                                  onSelect={(conv => setConversation(conv))}
                                  onDelete={(conv) => setDeleteConv(conv)}
                        />
                    </Col>
                    : null
                }
                <Col>
                    <Chat sendingMessage={sendMessageRunning}
                          sendingFiles={sendImagesRunning}
                          onSendFiles={async data => {
                              let arr = new Array<IImage>();
                              for (let f of data.items) {
                                  arr.push(await createImage(f.getAsFile()!));
                              }
                              setSendImages(arr);
                          }}
                          onSendMessage={message => {
                              setSendMessage(message);
                          }} conversation={conversation}/>
                </Col>
                <Col {...Col4}>
                    {contact !== null && !isInvoice(contact) ?
                        <PaymentInfo hideContact={true} payment={contact} canceling={false} cancel={() => {
                        }}/>
                        : null
                    }
                    {contact !== null && isInvoice(contact) ?
                        <InvoiceInfo invoice={contact} title={""} hideContact={true}/>
                        : null
                    }
                </Col>
            </Row>
        </div>
    );
}