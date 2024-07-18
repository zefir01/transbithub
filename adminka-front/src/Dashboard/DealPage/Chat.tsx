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
import {Deal, DealMessage, DealStatus, SendMessageRequest} from "../../Protos/api_pb";
import {AuthState, IImage, IStore} from "../../redux/interfaces";
import {Loading} from "../../Loading";
import {createImage, getToken, GrpcError, toDate, apiClient, grpcRunAsync} from "../../helpers";
import {LoadDeal, UploadImages} from "../../redux/actions";
import {data, IStrings} from "../../localization/DealPage/Chat"
import {TextAreaAuto} from "./TextAreaAuto";
import {MultilineContent} from "./MultilineContent";
import {ImagePreview} from "./ImagePreview";
import useResizeObserver from "use-resize-observer";
import {useStrings} from "../../Hooks";

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
            userId: store.profile.profile?.userid,
            support: store.supportAccounts.accounts
        }), []
    );
    const {authState, userId, support} = useMappedState(mapState);

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
            function getPartnerName() {
                if (props.deal!.adownerinfo!.id === props.msg.ownerid)
                    return props.deal!.adownerinfo!.username!;
                return props.deal!.initiator!.username!;
            }

            let cl1 = "";
            let cl2 = "";
            let color = "";

            let username;
            let sup = support?.find(p => p.id === props.msg.ownerid);
            if (props.msg.ownerid === userId) {
                cl1 = "w-100 row justify-content-end";
                cl2 = "d-block text-right";
                color = "border-success";
                username = strings.i;
            } else if (sup) {
                cl1 = "w-100 row justify-content-start";
                cl2 = "d-block text-left";
                color = "border-danger";
                username = sup.username;
            } else {
                cl1 = "w-100 row justify-content-start";
                cl2 = "d-block text-left";
                color = "border-primary";
                username = getPartnerName();
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
    }, [props.deal?.messagesList.length, props.deal?.id, props.deal, props.deal, messages, userId])

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
                let resp = await grpcRunAsync<Deal.AsObject>(apiClient.sendMessage, req, token);
                setSendMessage("");
                dispatch(LoadDeal(resp))
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(e.message);
            } finally {
                setSendMessageRunning(false);
            }
        }

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
                let resp = await grpcRunAsync<Deal.AsObject>(apiClient.sendMessage, req, token);
                dispatch(LoadDeal(resp));
                dispatch(UploadImages(sendImage));
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(e.message);
            } finally {
                setSendImage(new Array<IImage>());
                setSendImageRunning(false);
            }
        }

        f();
    }, [authState, sendImage, dispatch, props.deal, sendImageRunning]);


    if (props.deal === null || userId === "")
        return <Loading/>;

    return (
        <Card className="w-100 mb-3" style={{minHeight: "32rem"}}>
            {error !== "" ?
                <CardHeader>
                    <Alert color="danger" isOpen={error !== ""}>{error}</Alert>
                </CardHeader>
                : null
            }
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