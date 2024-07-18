import * as React from "react";
import {Advertisement} from "../Protos/api_pb";
import {Card, CardBody, CardFooter, CardHeader, Col, Row} from "reactstrap";
import {data, IStrings} from "../localization/MainPage";
import {data as dataSs} from "../localization/PaymentTypes"
import {UserLink} from "./UserLink";
import {Price} from "./Price";
import {MyDecimal} from "../MyDecimal";
import {PrettyPrice} from "../helpers";
import {LoadingBtn} from "../LoadingBtn";
import {useStrings} from "../Hooks";
import {myMap} from "../localization/PaymentTypes";

export interface AdCardProps{
    ad: Advertisement.AsObject;
    btnLoading: boolean;
    onClick: (id: number)=>void;
}

export function AdCard(props: AdCardProps){

    const strings: IStrings=useStrings(data);
    const paymentStrings=new myMap(dataSs);

    return(
        <Card>
            <CardHeader>
                <Row>
                    <Col className="d-flex align-items-center">
                        <span className="font-weight-bold">
                            {!props.ad.isbuy ? strings.seller : strings.buyer}:
                        </span>
                    </Col>
                    <Col className="text-right col-auto">
                        <UserLink info={props.ad.owner!} isAdRate={true}/>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col>
                        <span className="font-weight-bold text-primary">{paymentStrings.get(props.ad.paymenttype)}:</span>
                    </Col>
                    <Col className="text-right">
                        {props.ad.title}
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <span className="font-weight-bold">
                            {strings.price + ": "}
                        </span>
                    </Col>

                    <Col className="text-right">
                        <Price price={MyDecimal.FromPb(props.ad.price)} currency={props.ad.fiatcurrency}/>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col>
                        <span className="font-weight-bold">{strings.limitations}:</span>
                    </Col>
                    <Col className="text-right">
                        {PrettyPrice(MyDecimal.FromPb(props.ad.minamount), 2) + " - " + PrettyPrice(MyDecimal.FromPb(props.ad.maxamountcalculated), 2) + " " + props.ad.fiatcurrency}
                    </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <LoadingBtn loading={props.btnLoading} className="btn-block"
                            color="primary"
                            outline
                            onClick={() => props.onClick(props.ad.id)}>
                    <span className="font-weight-bold">{props.ad.isbuy ? strings.sell : strings.buy}</span>
                </LoadingBtn>
            </CardFooter>
        </Card>
    )
}