import * as React from "react";
import {NavLink} from "react-router-dom";
import {UserInfo} from "./Protos/api_pb";
import {Col, Row} from "reactstrap";
import {MyDecimal} from "./MyDecimal";
import {data, IStrings} from "./localization/UserLink"
import {useStrings} from "./Hooks";

export interface IUserLinkProps {
    info: UserInfo.AsObject,
    isAdRate: boolean,
    style?: any;
    disableLink?: boolean;
}

export const UserLink = (props: IUserLinkProps) => {
    const strings: IStrings = useStrings(data);
    let deals = props.info.tradescount;
    let payments = props.info.paymentspayedcount + props.info.paymentsreceivedcount;

    function GetRate() {
        let rate;
        if (props.isAdRate) {
            let r = MyDecimal.FromPb(props.info.responserate).toDecimalPlaces(2).toString();
            rate = `${strings.rate} ${r}% ${strings.deals} ${deals}`
        } else {
            let r = MyDecimal.FromPb(props.info.invoiceresponserate).toDecimalPlaces(2).toString();
            rate = `${strings.rate} ${r}% ${strings.payments} ${payments}`
        }
        return (
            <span className="small mt-0">
                {rate}
            </span>
        )
    }

    return (
        <>
            <Row>
                <Col className="col-auto">
                    {!props.disableLink && props.info.id != "" ?
                        <NavLink className="nav-link py-0" style={props.style}
                                 to={"/dashboard/userinfo/" + props.info.id}>{props.info.username}</NavLink>
                        :
                        <span className="text-primary pl-3">{props.info.username}</span>
                    }
                </Col>
            </Row>
            {props.info.id != "" ?
                <Row>
                    <Col>
                        <GetRate/>
                    </Col>
                </Row>
                :
                <Row>
                    <Col>
                        <span className="text-danger small pl-3">{strings.service}</span>
                    </Col>
                </Row>
            }
        </>
    )
};