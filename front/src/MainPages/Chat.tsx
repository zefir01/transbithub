import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    Alert,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Col,
    Row
} from "reactstrap";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Deal, DealMessage, DealStatus, SendMessageRequest, SendMessageResponse} from "../Protos/api_pb";
import {AuthState, IImage, IStore} from "../redux/store/Interfaces";
import {Loading} from "../Loading";
import {createImage, getToken, GrpcError, toDate, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {AddMessageToDeal, UploadImages} from "../redux/actions";
import {data, IStrings} from "../localization/Chat"
import {TextAreaAuto} from "../Invoices/Mesenger/TextAreaAuto";
import {MultilineContent} from "../MultilineContent";
import {ImagePreview} from "./ImagePreview";
import useResizeObserver from "use-resize-observer";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";

interface IMessageProps {
    msg: DealMessage.AsObject
    deal: Deal.AsObject;
}


function DateDelimiter(date: Date) {
    return <div key={"DateDelimiter" + date.getTime().toString()}
                className="d-block border border-gray w-100 text-center border-top-0 border-right-0 border-left-0 w-100 text-secondary small">{date.toLocaleDateString()}</div>
}

export interface IChatProps {
    deal: Deal.AsObject | null;
}

export const Chat = (props: IChatProps) => {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            userId: store.profile.UserId
        }), []
    );
    const {authState, userId} = useMappedState(mapState);

    const [sendMessage, setSendMessage] = useState("");
    const [sendMessageRunning, setSendMessageRunning] = useState(false);
    const [error, setError] = useState("");
    const [sendImage, setSendImage] = useState(new Array<IImage>());
    const [sendImageRunning, setSendImageRunning] = useState(false);
    const [messages, setMessages] = useState<Map<number, JSX.Element> | null>(null);
    const [dealId, setDealId] = useState<number | null>(props.deal?.id || null);
    let ref = useRef<HTMLDivElement>(null);
    let areaRef = useRef<HTMLDivElement>(null);

    const {width = 1, height = 1} = useResizeObserver({ref: areaRef});

    useEffect(() => {
        if (!props.deal) {
            return;
        }

        function Message(props: IMessageProps) {
            function getPartnetName() {
                if (props.deal!.adownerinfo!.id === userId)
                    return props.deal!.initiator!.username!;
                return props.deal!.adownerinfo!.username!;
            }

            let cl1;
            let color;

            let username;
            if (props.msg.ownerid === userId) {
                cl1 = "w-100 row justify-content-end";
                color = "border-success";
                username = strings.i;
            } else if (props.msg.ownerid === "") {
                cl1 = "w-100 row justify-content-start";
                color = "border-danger";
                username = strings.arbitrator;
            } else {
                cl1 = "w-100 row justify-content-start";
                color = "border-primary";
                username = getPartnetName();
            }

            return (
                <div className="my-2" key={"m" + props.msg.id}>
                    <div className={cl1}>
                        <small
                            className="text-secondary">{username + " " + toDate(props.msg.createdat).toLocaleTimeString()}</small>
                    </div>
                    <div className={cl1}>

                        <div className={`col col-auto bg-light rounded border ${color} p-1`}>
                            <MultilineContent text={props.msg.text} small={false}/>
                            <Row noGutters>
                                {props.msg.imageidsList.map(p => {
                                    return (
                                        <Col key={p} className="col-auto p-2">
                                            <ImagePreview id={p} createdAt={toDate(props.msg.createdat)}
                                                          maxSizeRem={10}/>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </div>
                    </div>
                </div>
            );
        }

        function updateMessages(source: Map<number, JSX.Element>, mess: Array<DealMessage.AsObject>, deal: Deal.AsObject) {
            let map = new Map(source);
            let prev;
            for (let msg of mess) {
                if (!map.has(msg.id)) {
                    let el = Message({
                        msg,
                        deal,
                    });
                    if (prev && toDate(prev.createdat).toLocaleDateString() !== toDate(msg.createdat).toLocaleDateString()) {
                        map.set(msg.id, (
                            <React.Fragment key={msg.id}>
                                {DateDelimiter(toDate(msg.createdat))}
                                {el}
                            </React.Fragment>
                        ));
                    } else {
                        map.set(msg.id, el);
                    }
                }
                prev = msg;
            }
            return map;
        }

        let map;
        if (messages && props.deal.messagesList.length < messages.size) {
            setMessages(new Map());
            return;
        }
        if (props.deal.id !== dealId) {
            map = new Map();
            map = updateMessages(map, props.deal.messagesList, props.deal);
            setMessages(map);
            setDealId(props.deal.id);
        }
        if (dealId && props.deal.messagesList.length !== messages?.size) {
            map = updateMessages(messages!, props.deal.messagesList, props.deal);
            setMessages(map);
        }
    }, [props.deal?.messagesList.length, props.deal?.id, messages, userId, dealId, strings.arbitrator, strings.i, props.deal])

    useEffect(() => {
        ref.current?.scrollIntoView({block: "nearest", inline: "end"});
    }, [width, height])

    useEffect(() => {
        if (authState === AuthState.NotAuthed)
            return;
        if (props.deal === null)
            return;
        if (sendMessage === "" || sendMessageRunning)
            return;
        setSendMessageRunning(true);

        async function f() {
            let req = new SendMessageRequest();
            req.setDealid(props.deal!.id);
            req.setText(sendMessage);

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<SendMessageResponse.AsObject>(tradeApiClient.sendMessage, req, token);
                setSendMessage("");
                dispatch(AddMessageToDeal(props.deal!, resp.message!))
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setSendMessageRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, sendMessage, sendMessageRunning, dispatch, props.deal]);

    useEffect(() => {
        if (authState === AuthState.NotAuthed)
            return;
        if (props.deal === null)
            return;
        if (sendImage.length === 0 || sendImageRunning)
            return;

        setSendImageRunning(true);

        async function f() {
            let req = new SendMessageRequest();
            req.setDealid(props.deal!.id);
            req.setImageidsList(sendImage.map(p => p.id));

            try {
                let token = getToken();
                let resp = await TradeGrpcRunAsync<SendMessageResponse.AsObject>(tradeApiClient.sendMessage, req, token);
                dispatch(AddMessageToDeal(props.deal!, resp.message!));
                dispatch(UploadImages(sendImage));
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setSendImage(new Array<IImage>());
                setSendImageRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, sendImage, dispatch, sendImageRunning, props.deal]);


    if (props.deal === null || userId === "")
        return <Loading/>;


    return (
        <Card className="w-100 mb-3" style={{minHeight: "32rem"}}>
            <CardHeader>
                <h5>{strings.head}</h5>
                <Alert color="danger" isOpen={error !== ""}>{error}</Alert>
            </CardHeader>
            <CardBody className="h-100 mx-0 overflow-auto" style={{maxHeight: "30rem"}}>
                <div ref={areaRef}>
                    {messages ?
                        [...messages.values()]
                        : null
                    }
                </div>
                <div ref={ref}/>
            </CardBody>
            {(props.deal.status === DealStatus.OPENED || props.deal.status === DealStatus.DISPUTED) ?
                <CardFooter className="p-0 text-center">
                    <TextAreaAuto onSend={message => setSendMessage(message)}
                                  sendingFiles={sendImageRunning}
                                  sendingMessage={sendMessageRunning}
                                  onFile={async data => {
                                      let arr = new Array<IImage>();
                                      for (let f of data.items) {
                                          arr.push(await createImage(f.getAsFile()!));
                                      }
                                      setSendImage(arr);
                                  }}
                    />
                </CardFooter>
                : null}
        </Card>
    );
};