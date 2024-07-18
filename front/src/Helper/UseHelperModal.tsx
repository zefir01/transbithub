import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useDispatch, useMappedState} from "redux-react-hook";
import {IStore} from "../redux/store/Interfaces";
import {HelperActionTypes} from "../redux/actions";
import {NavLink, useHistory} from "react-router-dom";
import {data, IStrings} from "../localization/Helper/UseHelperModal";
import {useStrings} from "../Hooks";

export function UseHelperModal() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
        }), []
    );
    const {state} = useMappedState(mapState);
    const [opened, setOpened] = useState(!state.useHelperModalShowed && !state.disableUseHelperRequest);
    const history = useHistory();

    useEffect(() => {
        if (opened && !state.useHelperModalShowed) {
            dispatch({type: HelperActionTypes.USE_HELPER_MODAL_SHOWED});
        }
    }, [state.useHelperModalShowed, opened, dispatch])


    return (
        <Modal isOpen={opened} toggle={() => setOpened(false)} size="lg">
            <ModalHeader toggle={() => setOpened(false)}>
                <h5>{strings.title}</h5>
            </ModalHeader>
            <ModalBody>
                {strings.info}
                <NavLink exact className="nav-link d-inline p-0" to="/helper"
                         onClick={() => setOpened(false)}>
                    {strings.helper}
                </NavLink>
                <br/>
                {strings.desc}
                <ul>
                    <li>
                        {strings.desc1}
                    </li>
                    <li>
                        {strings.desc2}
                    </li>
                    <li>
                        {strings.desc3}
                    </li>
                </ul>
            </ModalBody>
            <ModalFooter>
                <Row className="w-100">
                    <Col>
                        <Button color="secondary" outline onClick={() => {
                            dispatch({type: HelperActionTypes.DISABLE_USE_HELPER_REQUEST});
                            setOpened(false);
                        }}>
                            {strings.close1}
                        </Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button color="primary" onClick={() => history.push("/helper")}>
                            {strings.use}
                        </Button>
                    </Col>
                </Row>
            </ModalFooter>
        </Modal>
    )
}