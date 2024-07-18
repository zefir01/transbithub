import {useDispatch} from "redux-react-hook";
import {useStream} from "./Hooks";
import {Variables} from "./Protos/api_pb";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {tradeApiClient} from "./helpers";
import {NewVariables} from "./redux/actions";


export function VariablesListenerComponent(){
    const dispatch = useDispatch();

    useStream<Variables, Variables.AsObject>("subscribeVariables",
        (metadata) => {
            let req = new Empty();
            return tradeApiClient.subscribeVariables(req, metadata);
        },
        data => {
            console.log(data);
            dispatch(NewVariables(data));
        },
        error=>{
            console.log(error);
        }
    )

    return null;
}