import * as React from "react";
import {useCallback} from "react";
import {Col, Container, Nav, NavItem, Row} from "reactstrap";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/Wallet/SendBitcoinsOnChain";
import {SendBitcoinsOnChain} from "./SendBitcoinsOnChain";
import {NavLink, Redirect, Route} from "react-router-dom";
import {SendBitcoinsLN} from "./SendBitcoinsLN";
import {useStrings} from "../Hooks";


export function SendBitcoins() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            balance: store.balances.Balance,
            catalog: store.catalog,
        }), []
    );
    const {balance, catalog} = useMappedState(mapState);

    if (!balance || catalog.fee === null)
        return <Loading/>;

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.SendBitcoins}</h1>
                    <p>{strings.bitcoinsAccount}</p>
                </Col>
            </Row>
            <Nav tabs>
                <NavItem>
                    <NavLink className="nav-link" to="/sendBitcoins/onChain">
                        {strings.onChain}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link" to="/sendBitcoins/ln">
                        {strings.ln}
                    </NavLink>
                </NavItem>
            </Nav>
            <Route exact path="/sendBitcoins" render={() => (
                <Redirect push to="/sendBitcoins/onChain"/>
            )}/>
            <Route path="/sendBitcoins/onChain" component={SendBitcoinsOnChain}/>
            <Route path="/sendBitcoins/ln" component={SendBitcoinsLN}/>
        </Container>
    )
}