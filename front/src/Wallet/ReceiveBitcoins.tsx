import * as React from "react";
import {Col, Container, Nav, NavItem, Row} from "reactstrap";
import {NavLink, Redirect, Route} from "react-router-dom";
import {data, IStrings} from "../localization/Wallet/GetBitcoins";
import {ReceiveBitcoinsOnChain} from "./ReceiveBitcoinsOnChain";
import {ReceiveBitcoinsLN} from "./ReceiveBitcoinsLN";
import {useStrings} from "../Hooks";


export function ReceiveBitcoins() {
    const strings: IStrings = useStrings(data);
    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.Title}</h1>
                    <p>{strings.Description}</p>
                </Col>
            </Row>
            <Nav tabs>
                <NavItem>
                    <NavLink className="nav-link" to="/receiveBitcoins/onChain">
                        {strings.onChain}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/receiveBitcoins/ln">
                        {strings.ln}
                    </NavLink>
                </NavItem>
            </Nav>
            <Route exact path="/receiveBitcoins" render={() => (
                <Redirect push to="/receiveBitcoins/onChain"/>
            )}/>
            <Route path="/receiveBitcoins/onChain" component={ReceiveBitcoinsOnChain}/>
            <Route path="/receiveBitcoins/ln" component={ReceiveBitcoinsLN}/>
        </Container>
    );
}