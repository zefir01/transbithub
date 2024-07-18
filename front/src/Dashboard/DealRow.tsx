import * as React from "react";
import {UserLink} from "../MainPages/UserLink";
import {Price} from "../MainPages/Price";
import {Deal, UserInfo} from "../Protos/api_pb";
import {IStrings} from "../localization/Dashboard/DealsTable"
import {MyDecimal} from "../MyDecimal";
import {StatusBadge} from "./StatusBadge";
import {toLocalDateTimeString} from "../helpers";

interface IDealRowProps {
    deal: Deal.AsObject,
    onClick: (id: number) => void,
    isNew: boolean,
    isNewMessage: boolean,
    isChanged: boolean
    partner: UserInfo.AsObject,
    strings: IStrings
}

export const DealRow = (props: IDealRowProps) => {
    const deal = props.deal;
    const s = props.strings;
    let isBuy: boolean;

    if (deal.initiator!.id === props.partner.id) {
        isBuy = deal.advertisement!.isbuy;
    } else {
        isBuy = !deal.advertisement!.isbuy;
    }

    return (
        <tr key={deal.id} onClick={() => props.onClick(deal.id)}>
            <th scope="row">{deal.id}</th>
            <td>{toLocalDateTimeString(deal.createdat)}</td>
            <td>{deal.advertisement!.paymenttype.toString() + ": " + (isBuy ? s.buy : s.sell)}</td>
            <td><UserLink info={props.partner} isAdRate={true}/></td>
            <td><Price price={MyDecimal.FromPb(deal.fiatamount)} currency={deal.advertisement!.fiatcurrency}/></td>
            <td>{MyDecimal.FromPb(deal.cryptoamount).toString()}</td>
            <td><Price price={MyDecimal.FromPb(deal.advertisement!.price)}
                       currency={deal.advertisement!.fiatcurrency + " / BTC"}/>
            </td>
            <td>
                <StatusBadge isNew={props.isNew} isNewMessage={props.isNewMessage} isChanged={props.isChanged}/>
            </td>
        </tr>);
};