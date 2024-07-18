import * as React from "react";

import {Redirect} from "react-router-dom";
import {Container, Row, Col, NavItem, Nav, NavLink, Collapse} from "reactstrap";
import Register from "./Register";
import Login from "./Login";
import {useMappedState} from "redux-react-hook";
import {useCallback, useState} from "react";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Col6_12} from "../global";
import {data, IStrings} from "../localization/Profile/Login";
import {useStrings} from "../Hooks";

export function LoginRegisterComponent() {
    const strings: IStrings=useStrings(data);
    const [activeItem, setActiveItem] = useState(1);
    return (
        <>
            <Nav tabs>
                <NavItem>
                    <NavLink href="#" active={activeItem === 1} onClick={() => setActiveItem(1)}>
                        {strings.loginTitle}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="#" active={activeItem === 2} onClick={() => setActiveItem(2)}>
                        {strings.register}
                    </NavLink>
                </NavItem>
            </Nav>
            <Collapse isOpen={activeItem === 1}>
                <Login/>
            </Collapse>
            <Collapse isOpen={activeItem === 2}>
                <Register/>
            </Collapse>
        </>
    );
}

const LoginRegister = () => {

    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state
        }), []
    );
    const {authState} = useMappedState(mapState);

    if (authState !== AuthState.Authed)
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col {...Col6_12} className="col-auto">
                        <LoginRegisterComponent/>
                    </Col>
                </Row>
            </Container>
        );
    else
        return (
            <Redirect push to="/profile"/>
        );

};


export default LoginRegister;