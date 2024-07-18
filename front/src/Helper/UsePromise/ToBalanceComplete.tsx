import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Col6_12} from "../../global";
import {HelperActionTypes, SetCurrentPath} from "../../redux/actions";
import {useDispatch, useMappedState} from "redux-react-hook";
import {IStore} from "../../redux/store/Interfaces";
import {data, IStrings} from "../../localization/Helper/UsePromise/ToBalanceComplete";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function ToBalanceComplete() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
        }), []
    );
    const {state} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        if (state.promiseUseType === null) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.promiseUseType]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/toBalanceComplete"));
    }, [state.currentPath, dispatch]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }


    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => {
                        setRedirect("/helper/promisePay");
                    }}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-center">
                <Col className="col-auto text-success">
                    <h4>{strings.title}</h4>
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12}>
                    <Button className="btn-block" color="success" onClick={() => {
                        dispatch({type: HelperActionTypes.RESET});
                    }}>
                        {strings.complete}
                    </Button>
                </Col>
            </Row>
        </>
    )
}