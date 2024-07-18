import React, {useEffect, useState} from "react";
import {Card, CardBody, CardDeck, CardTitle, Col, Row} from "reactstrap";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {SetCurrentPath, SetOperation} from "../redux/actions";
import {useDispatch} from "redux-react-hook";
import {data, IStrings} from "../localization/Helper/SelectOperation";
import {HelperOperation} from "../redux/store/Interfaces";
import {useStrings} from "../Hooks";

library.add(fab);
library.add(far);
const btcLookup: IconLookup = {prefix: 'fab', iconName: 'btc'};
const btcIconDefinition: IconDefinition = findIconDefinition(btcLookup);
const giftLookup: IconLookup = {prefix: 'far', iconName: 'gift'};
const giftIconDefinition: IconDefinition = findIconDefinition(giftLookup);
const invoiceLookup: IconLookup = {prefix: 'far', iconName: 'file-invoice-dollar'};
const invoiceIconDefinition: IconDefinition = findIconDefinition(invoiceLookup);

export function SelectOperation() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState<number | null>(null);
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        dispatch(SetCurrentPath("/helper/selectOperation"));
    }, [dispatch]);

    function getCardClass(id: number): string {
        if (hovered === id) {
            return "shadow";
        }
        return "";
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <>
            <Row className="pt-3">
                <Col>
                    <h4>
                        {strings.title}
                    </h4>
                    {strings.info}
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <CardDeck>
                        <Card className={getCardClass(1)}
                              onMouseOver={() => setHovered(1)}
                              onMouseLeave={() => setHovered(null)}
                              style={{cursor: "pointer"}}
                              onClick={() => {
                                  dispatch(SetOperation(HelperOperation.BuyBtc));
                                  setRedirect("/helper/buyCrypto");
                              }}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col>
                                            <h5>{strings.buyBtc}</h5>
                                        </Col>
                                        <Col className="col-auto text-primary">
                                            <FontAwesomeIcon icon={btcIconDefinition} size="3x"/>
                                        </Col>
                                    </Row>
                                </CardTitle>
                                {strings.buyBtcInfo}
                                {strings.buyBtcInfo1}
                                <ul>
                                    <li>
                                        {strings.buyBtcAction1}
                                    </li>
                                    <li>
                                        {strings.buyBtcAction2}
                                    </li>
                                    <li>
                                        {strings.buyBtcAction3}
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                        <Card className={getCardClass(2)}
                              onMouseOver={() => setHovered(2)}
                              onMouseLeave={() => setHovered(null)}
                              style={{cursor: "pointer"}}
                              onClick={() => {
                                  dispatch(SetOperation(HelperOperation.PayInvoice));
                                  setRedirect("/helper/payInvoice");
                              }}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col>
                                            <h5>{strings.payInvoice}</h5>
                                        </Col>
                                        <Col className="col-auto text-primary">
                                            <FontAwesomeIcon icon={giftIconDefinition} size="3x"/>
                                        </Col>
                                    </Row>
                                </CardTitle>
                                {strings.pauInvoiceInfo}
                                <span className="font-weight-bold d-block">{strings.invoiceNumber}</span>
                                {strings.payInvoiceActions}
                                <ul>
                                    <li>
                                        {strings.payInvoiceAction1}
                                    </li>
                                    <li>
                                        {strings.payInvoiceAction2}
                                    </li>
                                    <li>
                                        {strings.payInvoiceAction3}
                                    </li>
                                    <li>
                                        {strings.payInvoiceAction4}
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                        <Card className={getCardClass(3)}
                              onMouseOver={() => setHovered(3)}
                              onMouseLeave={() => setHovered(null)}
                              style={{cursor: "pointer"}}
                              onClick={() => {
                                  dispatch(SetOperation(HelperOperation.UsePromise));
                                  setRedirect("/helper/promisePay");
                              }}>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col>
                                            <h5>{strings.usePromise}</h5>
                                        </Col>
                                        <Col className="col-auto text-primary">
                                            <FontAwesomeIcon icon={invoiceIconDefinition} size="3x"/>
                                        </Col>
                                    </Row>
                                </CardTitle>
                                <ul>
                                    <li>
                                        {strings.sellPromise}
                                    </li>
                                    <li>
                                        {strings.receivePromise}
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                    </CardDeck>
                </Col>
            </Row>
        </>
    )
}