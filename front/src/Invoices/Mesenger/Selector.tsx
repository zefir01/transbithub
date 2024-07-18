import * as React from "react";
import {useCallback, useEffect, useRef} from "react";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Conversation} from "../../Protos/api_pb";
import {SelectorItem} from "./SelectorItem";

export interface ISelectorProps {
    conversation: Conversation.AsObject | null,
    onSelect: (conv: Conversation.AsObject) => void;
    onDelete: (conv: Conversation.AsObject) => void;
}

export function Selector(props: ISelectorProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            conversations: store.invoices.conversations
        }), []
    );
    const {conversations} = useMappedState(mapState);
    let ref=useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(!ref.current){
            return;
        }
        ref.current.style.setProperty("overflow-x", "hidden", "important");
    })

    function sorter(a: Conversation.AsObject, b: Conversation.AsObject) {
        let t1 = a.messagesList.sort((m1, m2) => m2.id - m1.id)[0].id;
        let t2 = b.messagesList.sort((m1, m2) => m2.id - m1.id)[0].id;
        return t2 - t1;
    }

    if ((!conversations || conversations.length === 0) && props.conversation === null) {
        return null;
    }

    return (
        <div className={conversations!.length > 0 ? "rounded-0 overflow-auto card" : "rounded-0 overflow-auto card"}
            ref={ref}
            style={{minHeight: "32rem"}}>
            {
                conversations?.sort((a, b) => sorter(a, b)).map(p => {
                    return <SelectorItem conversation={p} isSelected={props.conversation?.id === p.id}
                                         onSelect={() => props.onSelect(p)}
                                         onDelete={(conv) => props.onDelete(conv)}
                    />
                })
            }
        </div>
    );
}