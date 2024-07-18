import * as React from "react";
import {Dispute} from "../Protos/adminka_pb";
import {toLocalDateTimeString} from "../helpers";
import {UserLink} from "../UserLink";
import {IStrings} from "../localization/Dashboard/DisputeItem";
import {MyDecimal} from "../MyDecimal";
import {Price} from "../Price";
import {LoadingBtn} from "../LoadingBtn";
import {Badge} from "reactstrap";

export interface DisputeItemProps {
    dispute: Dispute.AsObject;
    strings: IStrings;
    onClick: (id: number) => void,
    loading: boolean,
    toWork: (id: number) => void,
    stopWork: (id: number) => void,
    giveAway: (id: number) => void,
    eventsCount: number
}

export const DisputeItem = (props: DisputeItemProps) => {
    let dispute = props.dispute;
    let s = props.strings;

    function onClick() {
        if (props.dispute.arbitorid !== "") {
            props.onClick(dispute.dealid);
        }
    }

    return (
        <tr key={dispute.dealid}>
            <th scope="row" onClick={() => props.onClick(dispute.dealid)}>{dispute.dealid}</th>
            <td onClick={() => onClick()}>{toLocalDateTimeString(dispute.createdat)}</td>
            <td onClick={() => onClick()}>{dispute.paymenttype.toString() + ": " + (dispute.isbuy ? s.buy : s.sell)}</td>
            <td onClick={() => onClick()}><Price price={MyDecimal.FromPb(dispute.fiatamount)}
                                                 currency={dispute.fiatcurrency}/></td>
            <td><UserLink info={dispute.initiator!} isAdRate={true}/></td>
            <td><UserLink info={dispute.adownerinfo!} isAdRate={true}/></td>
            <td>
                {props.dispute.arbitorid === "" ?
                    <LoadingBtn onClick={() => props.toWork(dispute.dealid)} className="btn-block"
                                loading={props.loading} color="success">
                        {s.toWork}
                    </LoadingBtn>
                    :
                    <>
                        <LoadingBtn onClick={() => props.giveAway(dispute.dealid)} className="btn-block small"
                                    loading={props.loading} color="warning">
                            {s.giveAway}
                        </LoadingBtn>
                        <LoadingBtn onClick={() => props.stopWork(dispute.dealid)} className="btn-block small"
                                    loading={props.loading} color="danger">
                            {s.stopWork}
                        </LoadingBtn>
                    </>
                }
            </td>
            <td>
                {props.eventsCount !== 0 ?
                    <Badge color="danger">{props.eventsCount}</Badge>
                    : null
                }
            </td>
        </tr>
    );
}