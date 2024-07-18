import * as React from "react";
import {Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, Row} from "reactstrap";
import {NavLink, Redirect, Route} from "react-router-dom";
import {CreatePromise} from "./CreatePromise";
import {promiseFee} from "../global";
import {ReceivePromise} from "./ReceivePromise";
import {SelectAd} from "../MainPages/SelectAd";
import {MultilineContent} from "../MultilineContent";
import {data, IStrings} from "../localization/Promises/Promises"
import {useStrings} from "../Hooks";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Loading} from "../Loading";
import {useCallback} from "react";
import {useMappedState} from "redux-react-hook";

export interface IPromiseModalProps {
    isOpen: boolean;
    onClose: () => void;
    promise: string;
}

export function PromiseModal(props: IPromiseModalProps) {
    const strings: IStrings = useStrings(data);
    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h5>{strings.promise}</h5>
            </ModalHeader>
            <ModalBody>
                <MultilineContent text={props.promise} small={true} disableModify={true}/>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
            </ModalFooter>
        </Modal>
    );
}


export function Promises() {
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
                </Col>
            </Row>
            <Row>
                <Col>
                    {strings.info1}
                    <br/>
                    {strings.info2}
                    <br/>
                    {strings.info3}
                    <br/>
                    {strings.info4}
                    <br/>
                    {strings.info5}
                    <br/>
                    {strings.info6}
                    <br/>
                    {strings.info7}
                    <br/>
                    {strings.info8 + (promiseFee * 100) + strings.info9}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Nav tabs>
                        <NavItem>
                            <NavLink className="nav-link" to="/promises/createPromise">
                                {strings.create}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/promises/receivePromise">
                                {strings.receive}
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>
            <Route path="/promises/createPromise" component={CreatePromise}/>
            <Route path="/promises/receivePromise" component={ReceivePromise}/>
            <Route path="/promises/selectAd/" component={SelectAd}/>
            <Route exact path="/promises" render={() => (
                <Redirect to="/promises/receivePromise"/>
            )}/>
        </Container>
    );
}