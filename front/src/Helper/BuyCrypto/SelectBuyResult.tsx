import React, {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Collapse,
    ListGroup,
    ListGroupItem,
    Row,
} from "reactstrap";
import {Col6_12} from "../../global";
import {InputPromisePass} from "../../Promises/InputPromisePass";
import {BtcAddressInput} from "../../MainPages/BtcAddressInput";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, HelperBuyResultType, IStore} from "../../redux/store/Interfaces";
import {LoginRegisterComponent} from "../../Profile/LoginRegister";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {SetBuyResult, SetCurrentPath} from "../../redux/actions";
import {data, IStrings} from "../../localization/Helper/BuyCrypto/SelectBuyResult";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function SelectBuyResult() {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            state: store.helperState
        }), []
    );
    const {authState, state} = useMappedState(mapState);

    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [btcAddress, setBtcAddress] = useState<string | null>("");
    const [promisePassEnabled, setPromisePassEnabled] = useState(false);
    const [promisePass, setPromisePass] = useState<string | null>("");
    const [redirect, setRedirect] = useState("");


    useEffect(() => {
        if (state.currentPath === "") {
            setRedirect("/helper/selectOperation");
        }
    }, [state.currentPath]);

    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/enterAmount"));
    }, [state.currentPath, dispatch]);

    useEffect(() => {
        if (!state.buyResult) {
            return;
        }
        switch (state.buyResult.type) {
            case HelperBuyResultType.Balance:
                setActiveItem(1);
                setBtcAddress(null);
                setPromisePassEnabled(false);
                setPromisePass("");
                break;
            case HelperBuyResultType.Bitcoin:
                setActiveItem(2);
                setBtcAddress(state.buyResult.btcAddress);
                setPromisePassEnabled(false);
                setPromisePass(null);
                break;
            case HelperBuyResultType.Promise:
                setActiveItem(3);
                setBtcAddress(null);
                setPromisePassEnabled(state.buyResult.promisePass !== "");
                setPromisePass(state.buyResult.promisePass);
                break;

        }
    }, [state.buyResult])


    function isError() {
        if (!activeItem) {
            return true;
        }
        switch (activeItem) {
            case 1: {
                if (authState !== AuthState.Authed) {
                    return true;
                }
                break;
            }
            case 2: {
                if (!btcAddress || btcAddress === "") {
                    return true;
                }
                break;
            }
            case 3: {
                if (promisePassEnabled && (!promisePass || promisePass === "")) {
                    return true;
                }
                break;
            }
        }
        return false;
    }


    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => setRedirect("/helper/enterAmount")}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <h4>{strings.title}</h4>
                    {strings.info}
                </Col>
            </Row>
            <Row className="justify-content-center pt-3">
                <Col {...Col6_12} className="col-auto">
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h5>{strings.what}</h5>
                            </CardTitle>
                            <ListGroup>
                                <ListGroupItem tag="button" action active={activeItem === 1}
                                               onClick={() => setActiveItem(1)}>
                                    {strings.info1}
                                </ListGroupItem>
                                <ListGroupItem tag="button" action active={activeItem === 2}
                                               onClick={() => setActiveItem(2)}>
                                    {strings.info2}
                                </ListGroupItem>
                                <ListGroupItem tag="button" action active={activeItem === 3}
                                               onClick={() => setActiveItem(3)}>
                                    {strings.info3}
                                </ListGroupItem>
                            </ListGroup>
                            <Collapse isOpen={activeItem === 2} className="mt-3">
                                <BtcAddressInput onChange={addr => setBtcAddress(addr)} defaultError={true}/>
                            </Collapse>
                            <Collapse isOpen={activeItem === 3} className="mt-3">
                                <InputPromisePass disabled={false}
                                                  onState={state => {
                                                      setPromisePassEnabled(state.passEnabled);
                                                      setPromisePass(state.password);
                                                  }}/>
                            </Collapse>
                            <Collapse isOpen={activeItem === 1 && authState === AuthState.AnonAuthed}>
                                <Alert className="mt-3" color="warning">{strings.alert}</Alert>
                                <LoginRegisterComponent/>
                            </Collapse>
                            <Button color="success" className="btn-block mt-3"
                                    disabled={isError()}
                                    onClick={() => {
                                        switch (activeItem) {
                                            case 1:
                                                dispatch(SetBuyResult({
                                                    type: HelperBuyResultType.Balance,
                                                    btcAddress: "",
                                                    promisePass: ""
                                                }));
                                                break;
                                            case 2:
                                                dispatch(SetBuyResult({
                                                    type: HelperBuyResultType.Bitcoin,
                                                    btcAddress: btcAddress!,
                                                    promisePass: ""
                                                }));
                                                break;
                                            case 3:
                                                dispatch(SetBuyResult({
                                                    type: HelperBuyResultType.Promise,
                                                    btcAddress: "",
                                                    promisePass: promisePass ? promisePass : ""
                                                }));
                                                break;
                                        }
                                        setRedirect("/helper/selectAd");
                                    }}
                            >
                                {strings.ok}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}