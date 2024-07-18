import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, CardBody, CardDeck, CardTitle, Col, FormText, Row} from "reactstrap";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Redirect} from "react-router-dom";
import {HelperOperation, IStore} from "../../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../../Loading";
import {SetBuyFilter, SetCurrentPath} from "../../redux/actions";
import {
    IStrings,
    stringsBuyCrypto,
    stringsPayInvoice,
    stringsUsePromise
} from "../../localization/Helper/BuyCrypto/BuyCrypto";
import {CountrySelect} from "../../MainPages/CountrySelect";
import {CurrencySelect} from "../../MainPages/CurrencySelect";
import {PaymentTypeSelect} from "../../MainPages/PaymentTypeSelect";
import {CurrenciesCatalog, PaymentTypesCatalog} from "../../Catalog";

library.add(far);
const globeLookup: IconLookup = {prefix: 'far', iconName: 'globe'};
const globeIconDefinition: IconDefinition = findIconDefinition(globeLookup);
const exchangeLookup: IconLookup = {prefix: 'far', iconName: 'exchange'};
const exchangeIconDefinition: IconDefinition = findIconDefinition(exchangeLookup);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);
const moneyLookup: IconLookup = {prefix: 'far', iconName: 'money-bill-alt'};
const moneyIconDefinition: IconDefinition = findIconDefinition(moneyLookup);

export function BuyCrypto() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            preload: store.preload.lastSearch,
            lastSearchBuy: store.profile.LastSearchBuy,
            state: store.helperState,
            lang: store.lang
        }), []
    );
    const {preload, lastSearchBuy, state, lang} = useMappedState(mapState);

    const [redirect, setRedirect] = useState("");
    const [country, setCountry] = useState(state.country);
    const [currency, setCurrency] = useState(state.currency);
    const [paymentType, setPaymentType] = useState(state.paymentType);
    const [strings, setStrings] = useState<IStrings>(stringsBuyCrypto);

    useEffect(() => {
        if (state.operation === null) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.operation]);
    useEffect(() => {
        dispatch(SetCurrentPath("/helper/buyCrypto"));
    }, [dispatch]);

    useEffect(() => {
        if (!lastSearchBuy?.country || state.country !== "") {
            return;
        }
        setCountry(lastSearchBuy.country);
        setCurrency(lastSearchBuy.currency);
        setPaymentType(lastSearchBuy.paymentType);
    }, [lastSearchBuy, state.country]);

    useEffect(() => {
        let cur = CurrenciesCatalog.get(country);
        if (cur !== undefined)
            setCurrency(cur);
        let pt = PaymentTypesCatalog.get(country);
        if (pt !== undefined)
            setPaymentType(pt[0]);
    }, [country]);


    useEffect(() => {
        switch (state.operation) {
            case HelperOperation.BuyBtc:
                if (strings !== stringsBuyCrypto) {
                    setStrings(stringsBuyCrypto);
                }
                break;
            case HelperOperation.PayInvoice:
                if (strings !== stringsPayInvoice) {
                    setStrings(stringsPayInvoice);
                }
                break;
            case HelperOperation.UsePromise:
                if (strings !== stringsUsePromise) {
                    setStrings(stringsUsePromise);
                }
                break;
            default:
                if (strings !== stringsBuyCrypto) {
                    setStrings(stringsBuyCrypto);
                }
        }
        if (strings.getLanguage() !== lang.Lang) {
            strings.setLanguage(lang.Lang);
        }
    }, [state.operation, lang, strings]);


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
                    <Button color="danger" outline onClick={() => {
                        switch (state.operation) {
                            case HelperOperation.BuyBtc:
                                setRedirect("/helper/selectOperation");
                                break;
                            case HelperOperation.PayInvoice:
                                setRedirect("/helper/selectPaymentType");
                                break;
                            case HelperOperation.UsePromise:
                                setRedirect("/helper/usePromise");
                                break;
                        }
                    }}>
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
            <Row className="pt-3">
                <Col>
                    <CardDeck>
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col>
                                            <h5>{strings.country}</h5>
                                            <FormText>{strings.countryInfo}</FormText>
                                        </Col>
                                        <Col className="col-auto text-primary">
                                            <FontAwesomeIcon icon={globeIconDefinition} size="3x"/>
                                        </Col>
                                    </Row>
                                </CardTitle>
                                <CountrySelect onChange={countryCode => setCountry(countryCode)} value={country}/>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col>
                                            <h5>{strings.currency}</h5>
                                            <FormText>{strings.currencyInfo}</FormText>
                                        </Col>
                                        <Col className="col-auto text-primary">
                                            <FontAwesomeIcon icon={moneyIconDefinition} size="3x"/>
                                        </Col>
                                    </Row>
                                </CardTitle>
                                <CurrencySelect onChange={value => setCurrency(value)} value={currency}/>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <Row>
                                        <Col>
                                            <h5>{strings.paymentType}</h5>
                                            <FormText>{strings.paymentTypeInfo} {currency}</FormText>
                                        </Col>
                                        <Col className="col-auto text-primary">
                                            <FontAwesomeIcon icon={exchangeIconDefinition} size="3x"/>
                                        </Col>
                                    </Row>
                                </CardTitle>
                                <PaymentTypeSelect onChange={value => setPaymentType(value)} value={paymentType}
                                                   country={country}/>
                            </CardBody>
                        </Card>
                    </CardDeck>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Button color="success" className="btn-block" onClick={() => {
                        dispatch(SetBuyFilter(country, currency, paymentType));
                        switch (state.operation) {
                            case HelperOperation.BuyBtc:
                                setRedirect("/helper/enterAmount");
                                break;
                            case HelperOperation.PayInvoice:
                                setRedirect("/helper/selectAd");
                                break;
                            case HelperOperation.UsePromise:
                                setRedirect("/helper/selectAd");
                                break;
                        }
                    }}>
                        {strings.ok}
                    </Button>
                </Col>
            </Row>
        </>
    )
}