import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardTitle,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {Redirect} from "react-router-dom";
import {Col6_12} from "../../global";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {SetBuyAmount, SetCurrentPath} from "../../redux/actions";
import {useDispatch, useMappedState} from "redux-react-hook";
import {IStore} from "../../redux/store/Interfaces";
import {MyDecimal} from "../../MyDecimal";
import {DecimalInput} from "../../DecimalInput";
import {Loading} from "../../Loading";
import {data, IStrings} from "../../localization/Helper/BuyCrypto/EnterAmount";
import {useStrings} from "../../Hooks";

library.add(far);
library.add(fab);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);
const moneyLookup: IconLookup = {prefix: 'far', iconName: 'money-bill-alt'};
const moneyIconDefinition: IconDefinition = findIconDefinition(moneyLookup);
const btcLookup: IconLookup = {prefix: 'fab', iconName: 'btc'};
const btcIconDefinition: IconDefinition = findIconDefinition(btcLookup);

export function EnterAmount() {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            preload: store.preload.lastSearch,
            lastSearchBuy: store.profile.LastSearchBuy,
            state: store.helperState
        }), []
    );
    const {preload, lastSearchBuy, state} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [amount, setAmount] = useState<MyDecimal | null>(state.amount);
    const [isFiat, setIsFiat] = useState(state.amountIsFiat);

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
        if (state.amount !== null || !lastSearchBuy?.amount) {
            return;
        }
        setAmount(lastSearchBuy.amount);
    }, [lastSearchBuy, state.amount]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!preload) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        )
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => setRedirect("/helper/buyCrypto")}>
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
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h5>{strings.info1}</h5>
                            </CardTitle>
                            <Row>
                                <Col>
                                    <ButtonGroup className="w-100">
                                        <Button outline color={isFiat ? "primary" : "secondary"}
                                                onClick={() => {
                                                    setIsFiat(true);
                                                }}
                                                className="justify-content-end d-flex align-items-center w-50">
                                            <span className="h5 font-weight-bold">{strings.amount}{state.currency}</span>
                                            &nbsp;
                                            <span className={isFiat ? "text-warning" : ""}>
                                                <FontAwesomeIcon icon={moneyIconDefinition} size="3x"/>
                                            </span>
                                        </Button>
                                        <Button outline color={!isFiat ? "primary" : "secondary"}
                                                onClick={() => {
                                                    setIsFiat(false);
                                                }}
                                                className="d-flex align-items-center w-50">
                                            <span className={!isFiat ? "text-warning" : ""}>
                                                <FontAwesomeIcon icon={btcIconDefinition} size="3x"/>
                                            </span>
                                            &nbsp;
                                            <span className="h5 font-weight-bold">{strings.amount1}</span>
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            <Row className="pt-3">
                                <Col>
                                    <InputGroup>
                                        <DecimalInput
                                            value={amount}
                                            minimalValue={0}
                                            onInput={value => {
                                                setAmount(value);
                                            }}/>
                                        <InputGroupAddon addonType={"append"}>
                                            <InputGroupText className="bg-warning">
                                                {isFiat ? state.currency : "BTC"}
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="pt-3">
                                <Col>
                                    <Button color="success" className="btn-block" disabled={!amount || amount.eq(0)}
                                            onClick={() => {
                                                if (!amount) {
                                                    return;
                                                }
                                                dispatch(SetBuyAmount(new MyDecimal(amount), isFiat));
                                                setRedirect("/helper/selectBuyResult");
                                            }}
                                    >
                                        {strings.ok}
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}