import * as React from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {apiClient} from "./helpers";
import {NewEvent, NewVariables, UpdateDispute} from "./redux/actions";
import {Event, Variables} from "./Protos/api_pb";
import {useStream} from "./Hooks";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {Dispute, DisputeEvent} from "./Protos/adminka_pb";
import {useCallback} from "react";
import {IStore} from "./redux/interfaces";



export const EventListenerComponent = () => {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            userid: store.profile.profile?.userid,
            authState: store.auth.state
        }), []
    );
    const {userid, authState} = useMappedState(mapState);

    useStream<Event, Event.AsObject>("subscribeNewEvents",
        (metadata) => {
            let req = new Empty();
            return apiClient.subscribeNewEvents(req, metadata);
        },
        data => {
            console.log(data);
            dispatch(NewEvent(data));
        },
        error=>{
            console.log(error);
        }
    );

    useStream<Variables, Variables.AsObject>("subscribeVariables",
        (metadata) => {
            let req = new Empty();
            return apiClient.subscribeVariables(req, metadata);
        },
        data => {
            console.log(data);
            dispatch(NewVariables(data));
        },
        error=>{
            console.log(error);
        }
    );

    useStream<DisputeEvent, DisputeEvent.AsObject>("subscribeDisputes",
        (metadata) => {
            let req = new Empty();
            return apiClient.subscribeDisputes(req, metadata);
        },
        data => {
            console.log(data);
            if(data.keepalive){
                return;
            }
            dispatch(UpdateDispute(data.dispute!));
        },
        error=>{
            console.log(error);
        }
    )

    return null;
};