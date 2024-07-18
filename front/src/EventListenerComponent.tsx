import {useDispatch} from "redux-react-hook";
import {tradeApiClient} from "./helpers";
import {NewEvent} from "./redux/actions";
import {Event} from "./Protos/api_pb";
import {useStream} from "./Hooks";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export const EventListenerComponent = () => {
    const dispatch = useDispatch();

    useStream<Event, Event.AsObject>("subscribeNewEvents",
        (metadata) => {
            let req = new Empty();
            return tradeApiClient.subscribeNewEvents(req, metadata);
        },
        data => {
            console.log(data);
            dispatch(NewEvent(data));
        },
        error=>{
            console.log(error);
        }
    )

    return null;
};