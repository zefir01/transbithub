import * as React from "react";
import {useCallback} from "react";
import {Col, Container, Nav, NavItem, Row} from "reactstrap";
import {NavLink, Redirect, Route} from "react-router-dom";
import MyAdvirtisments from "./MyAdvirtisments";
import {OpenedDeals} from "./OpenedDeals";
import {CompletedDeals} from "./CompletedDeals";
import {CanceledDeals} from "./CanceledDeals";
import {DisputedDeals} from "./DisputedDeals";
import {useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {data, IStrings} from "../localization/Dashboard/Dashboard"
import {DealStatus} from "../Protos/api_pb";
import {StatusBadge} from "./StatusBadge";
import {AutoPrice} from "../Options/AutoPrice";
import {useStrings} from "../Hooks";

const Dashboard = () => {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            deals: store.deals
        }), []
    );
    const {authState, deals} = useMappedState(mapState);

    function getStatus(status: DealStatus) {
        let res = {
            isNew: false,
            isNewMessage: false,
            isChanged: false
        };

        let ids: number[];
        if(status===DealStatus.OPENED){
            ids= deals.deals.filter(p => p.status === DealStatus.OPENED || p.status === DealStatus.WAITDEPOSIT).map(p => p.id);
        }
        else {
            ids = deals.deals.filter(p => p.status === status).map(p => p.id);
        }
        res.isNew = deals.newDeals.filter(p => ids.includes(p)).length > 0;
        res.isChanged = deals.newStatusDeals.filter(p => ids.includes(p)).length > 0;
        res.isNewMessage = deals.newMessageDeals.filter(p => ids.includes(p)).length > 0;
        return (
            <StatusBadge isNew={res.isNew} isNewMessage={res.isNewMessage} isChanged={res.isChanged}/>
        )
    }


    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.head}</h1>
                    <p>{strings.desc}<a href={"https://t.me/"+process.env.REACT_APP_NOTIFY_BOT}>@{process.env.REACT_APP_NOTIFY_BOT}</a></p>
                    <br/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Nav tabs>
                        {authState === AuthState.Authed ?
                            <NavItem>
                                <NavLink className="nav-link"
                                         to="/dashboard/MyAdvirtisments">{strings.advertisements}</NavLink>
                            </NavItem>
                            : null
                        }
                        <NavItem>
                            <NavLink className="nav-link" to="/dashboard/openedDeals">
                                {strings.opened + " "}
                                {getStatus(DealStatus.OPENED)}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/dashboard/completedDeals">
                                {strings.completed + " "}
                                {getStatus(DealStatus.COMPLETED)}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/dashboard/canceledDeals">
                                {strings.canceled + " "}
                                {getStatus(DealStatus.CANCELED)}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/dashboard/disputedDeals">
                                {strings.disputed + " "}
                                {getStatus(DealStatus.DISPUTED)}
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    {authState === AuthState.Authed ?
                        <Route exact path="/dashboard" render={() => (
                            <Redirect to="/dashboard/MyAdvirtisments"/>
                        )}/>
                        :
                        <Route exact path="/dashboard" render={() => (
                            <Redirect to="/dashboard/openedDeals"/>
                        )}/>
                    }
                    <Route path="/dashboard/MyAdvirtisments" component={MyAdvirtisments}/>
                    <Route path="/dashboard/openedDeals" component={OpenedDeals}/>
                    <Route path="/dashboard/completedDeals" component={CompletedDeals}/>
                    <Route path="/dashboard/canceledDeals" component={CanceledDeals}/>
                    <Route path="/dashboard/disputedDeals" component={DisputedDeals}/>
                    <Route path="/dashboard/buyAutoPrice" component={AutoPrice}/>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;