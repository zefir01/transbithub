import * as React from "react";
import {Card, CardBody, CardFooter, Col, Row} from "reactstrap";
import {useCallback, useEffect, useRef, useState} from "react";
import {Conversation, ConversationMessage} from "../../Protos/api_pb";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {toDate} from "../../helpers";
import {TextAreaAuto} from "./TextAreaAuto";
import {data, IStrings} from "../../localization/Invoices/Messenger/Chat";
import useResizeObserver from "use-resize-observer";
import {MultilineContent} from "../../MultilineContent";
import {ImagePreview} from "../../MainPages/ImagePreview";
import {Loading} from "../../Loading";
import {useStrings} from "../../Hooks";

export interface IChatProps {
    onSendMessage: (message: string) => void;
    onSendFiles: (files: DataTransfer) => void;
    conversation: Conversation.AsObject | null;
    sendingMessage: boolean;
    sendingFiles: boolean;
}

interface IMessageProps {
    msg: ConversationMessage.AsObject;
    conversation: Conversation.AsObject;
}

export function Chat(props: IChatProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
        }), []
    );
    const {userId} = useMappedState(mapState);
    const [messages, setMessages] = useState<Map<number, JSX.Element> | null>(null);
    const [conversationId, setConversationId] = useState<number | null>(props.conversation?.id || null);


    useEffect(() => {
        if (!props.conversation) {
            return;
        }

        function Message(props: IMessageProps) {
            let cl1;
            let cl2;
            let color;

            if (userId === props.msg.ownerid) {
                cl1 = "w-100 d-flex justify-content-end";
                cl2 = "d-block text-right";
                color = "border-success";
            } else {
                cl1 = "w-100 d-flex justify-content-start";
                cl2 = "d-block text-left";
                color = "border-primary";
            }
            let userName: string;
            if (props.conversation?.seller?.id === props.msg.ownerid) {
                userName = props.conversation?.seller.username;
            } else {
                userName = props.conversation!.buyer!.username;
            }
            if (props.msg.ownerid === userId) {
                userName = strings.you;
            }

            return (
                <div className="mb-2" key={"Message" + props.msg.id}>
                    <div className={cl1}>
                        <small
                            className="text-secondary">{userName + " " + toDate(props.msg.createdat).toLocaleTimeString()}</small>
                    </div>
                    <div className={cl1}>

                        <div className={`bg-light rounded border ${color} p-1`}>
                            <span className={cl2}>
                                <MultilineContent text={props.msg.text} small={false}/>
                                <Row noGutters>
                                    {props.msg.imagesList.map(p => {
                                        return (
                                            <Col key={p} className="col-auto p-2">
                                                <ImagePreview id={p} createdAt={toDate(props.msg.createdat)}
                                                              maxSizeRem={10}/>
                                            </Col>
                                        )
                                    })}
                        </Row>
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        function DateDelimiter(date: Date) {
            return <div key={"DateDelimiter" + date.getTime().toString()}
                        className="d-block border border-gray w-100 text-center border-top-0 border-right-0 border-left-0 w-100 text-secondary small">{date.toLocaleDateString()}</div>
        }

        function updateMessages(conversation: Conversation.AsObject) {
            let map = new Map();
            let prev;
            for (let msg of conversation.messagesList.sort((a: ConversationMessage.AsObject, b: ConversationMessage.AsObject) => {
                return a.id - b.id;
            })) {
                let el = Message({
                    msg,
                    conversation,
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
                prev = msg;
            }
            return map;
        }

        let map;
        if (props.conversation.id !== conversationId) {
            map = new Map();
            map = updateMessages(props.conversation);
            setMessages(map);
            setConversationId(props.conversation.id);
        } else if (conversationId && props.conversation.messagesList.length !== messages?.size) {
            map = updateMessages(props.conversation);
            setMessages(map);
        }
    }, [props.conversation?.messagesList.length, props.conversation?.id, props.conversation, messages, userId,
    conversationId, strings.you])


    let ref = useRef<HTMLDivElement>(null);
    let areaRef = useRef<HTMLDivElement>(null);

    const {width = 1, height = 1} = useResizeObserver({ref: areaRef});
    useEffect(() => {
        ref.current?.scrollIntoView({block: "nearest", inline: "end"});
    }, [width, height])

    if (userId === "")
        return <Loading/>;

    return (
        <Card className="rounded-0" style={{minHeight: "32rem"}}>
            <CardBody className="overflow-auto" style={{maxHeight: "32rem"}}>
                <div ref={areaRef}>
                    {messages ?
                        [...messages.values()]
                        : null
                    }
                </div>
                <div ref={ref}/>
            </CardBody>
            <CardFooter className="p-0 text-center">
                <TextAreaAuto onSend={message => props.onSendMessage(message)}
                              onFile={files => props.onSendFiles(files)}
                              sendingMessage={props.sendingMessage}
                              sendingFiles={props.sendingFiles}/>
            </CardFooter>
        </Card>
    )
}