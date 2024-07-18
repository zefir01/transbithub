import * as React from "react";
import {Button, Col, Row} from "reactstrap";
import {useState} from "react";
import {LNTransactionsIn} from "./LNTransactionsIn";
import {LNTransactionsOut} from "./LNTransactionsOut";
import {data, IStrings} from "../localization/Wallet/LNTransactions";
import {useStrings} from "../Hooks";


export function LNTransactions() {
    const strings: IStrings=useStrings(data);
    const [isInActive, setIsInActive] = useState(true);


    return (
        <>
            <Row>
                <Col>
                    <Button color="info" className="btn-block" outline={!isInActive}
                            onClick={() => setIsInActive(true)}>
                        {strings.in}
                    </Button>
                </Col>
                <Col>
                    <Button color="info" className="btn-block" outline={isInActive}
                            onClick={() => setIsInActive(false)}>
                        {strings.out}
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {isInActive ?
                        <LNTransactionsIn/>
                        :
                        <LNTransactionsOut/>
                    }
                </Col>
            </Row>
        </>
    )
}