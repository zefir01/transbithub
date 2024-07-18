import * as React from "react";
import {useCallback} from "react";
import {IStore} from "../redux/interfaces";
import {useMappedState} from "redux-react-hook";
import {DisputesTable} from "./DisputesTable";

export const InWorkDisputes=()=>{
    const mapState = useCallback(
        (store: IStore) => ({
            disputes: store.disputes.myDisputes
        }), []
    );
    const {disputes} = useMappedState(mapState);

    return(
        <DisputesTable disputes={disputes}/>
    )
}