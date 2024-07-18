import * as React from "react";
import {useCallback} from "react";
import {Col, Container, Nav, NavItem, Row} from "reactstrap";
import {NavLink, Redirect, Route} from "react-router-dom";
import {BalanceComponent} from "./BalanceComponent";
import {Transactions} from "./Transactions";
import {data, IStrings} from "../localization/Wallet/WalletPage"
import {LNTransactions} from "./LNTransactions";
import {useStrings} from "../Hooks";
import {useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Loading} from "../Loading";


export function WalletPage() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

    if (authState === AuthState.NotAuthed) {
        return <Loading/>;
    }
    if (authState === AuthState.AnonAuthed) {
        return <Redirect to="/login"/>;
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.title}</h1>
                    <p>{strings.desc}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Nav tabs className="border-bottom-0">
                        <NavItem className="text-center">
                            <NavLink className="nav-link" to="/wallet/balance">{strings.balance}</NavLink>
                        </NavItem>
                        <NavItem className="text-center">
                            <NavLink className="nav-link" to="/wallet/transactions">{strings.btcTransactions}</NavLink>
                        </NavItem>
                        <NavItem className="text-center">
                            <NavLink className="nav-link" to="/wallet/lnTransactions">Lightning Network</NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Route exact path="/wallet" render={() => (
                        <Redirect push to="/wallet/balance"/>
                    )}/>
                    <Route path="/wallet/balance" component={BalanceComponent}/>
                    <Route path="/wallet/transactions" component={Transactions}/>
                    <Route path="/wallet/lnTransactions" component={LNTransactions}/>
                </Col>
            </Row>
        </Container>
    );
}