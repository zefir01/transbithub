import * as React from "react";
import {Col, Container, Row} from "reactstrap";
import {DealStatus} from "../Protos/api_pb";
import {data, IStrings} from "../localization/Dashboard/DisputedDeals"
import {DealsTable} from "./DealsTable";
import {useStrings} from "../Hooks";


export const DisputedDeals = () => {
    const strings: IStrings=useStrings(data);
    return (
        <Container>
            <Row>
                <Col>
                    <h2>{strings.disputedDeals}</h2>
                    <p>{strings.desc}</p>
                </Col>
            </Row>
            <DealsTable status={DealStatus.DISPUTED}/>
        </Container>
    );
};