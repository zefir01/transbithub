import * as React from "react";
import {Badge, Col, Nav, NavItem, Row} from "reactstrap";
import {data, IStrings} from "../localization/Dashboard/Dashboard";
import {useStrings} from "../Hooks";
import {NavLink, Redirect, Route} from "react-router-dom";
import {AvailableDisputes} from "./AvailableDisputes";
import {InWorkDisputes} from "./InWorkDisputes";
import {AuthState, IStore} from "../redux/interfaces";
import {useCallback} from "react";
import {useMappedState} from "redux-react-hook";
import {DealPage} from "./DealPage/DealPage";
import {UserInfoPage} from "../UserInfo/UserInfo";


export const Dashboard = () => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            events: store.disputes.events,
            myDisputes: store.disputes.myDisputes
        }), []
    );
    const {authState, events, myDisputes} = useMappedState(mapState);

    const eventsCountCb = useCallback(() => {
        let ids = myDisputes?.map(p => p.dealid);
        let unique = [...new Set(ids)];
        let ids1 = events.filter(p => unique.includes(p.dealnewmessage!.id)).map(p => p.dealnewmessage?.id);
        let unique1 = [...new Set(ids1)];
        return unique1.length;
    }, [events, myDisputes]);

    let eventsCount = eventsCountCb();

    return (
        <div className="container-fluid">
            <Row>
                <Col>
                    <Nav tabs>
                        <NavItem>
                            <NavLink className="nav-link" to="/dashboard/available">
                                {strings.available}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/dashboard/inWork">
                                {strings.inWork}
                                {eventsCount !== 0 ?
                                    <Badge color="danger">{eventsCount}</Badge>
                                    : null
                                }
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>

            <Route exact path="/dashboard" render={() => (
                <Redirect to="/dashboard/available"/>
            )}/>

            <Route path="/dashboard/available" component={AvailableDisputes}/>
            <Route path="/dashboard/inWork" component={InWorkDisputes}/>
            <Route path="/dashboard/dispute/:id" component={DealPage}/>
            <Route path="/dashboard/userinfo/:id" component={UserInfoPage}/>

        </div>
    );
}