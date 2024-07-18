import * as React from "react";
import {useCallback} from "react";
import {IStore} from "../redux/interfaces";
import {useMappedState} from "redux-react-hook";
import {DisputesTable} from "./DisputesTable";

export const AvailableDisputes=()=>{
    const mapState = useCallback(
        (store: IStore) => ({
            disputes: store.disputes.availableDisputes
        }), []
    );
    const {disputes} = useMappedState(mapState);

    return(
        <DisputesTable disputes={disputes}/>
    )
}