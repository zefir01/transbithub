import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Button, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import {useMappedState} from "redux-react-hook";
import {data, IStrings} from "../localization/MainPage";
import {AdTable, IAdTableProps} from "./AdTable";
import {Loading} from "../Loading";
import {IStore} from "../redux/store/Interfaces";
import {DecimalInput} from "../DecimalInput";
import Decimal from "decimal.js";
import {CurrenciesCatalog, PaymentTypesCatalog} from "../Catalog";
import {CountrySelect} from "./CountrySelect";
import {CurrencySelect} from "./CurrencySelect";
import {PaymentTypeSelect} from "./PaymentTypeSelect";
import {UseHelperModal} from "../Helper/UseHelperModal";
import {useStrings} from "../Hooks";
import {useRouteMatch} from "react-router-dom";
import {MyDecimal} from "../MyDecimal";


export const MainPage = () => {
    const mapState = useCallback(
        (store: IStore) => ({
            preload: store.preload.lastSearch,
            lastSearchBuy: store.profile.LastSearchBuy,
            lastSearchSell: store.profile.LastSearchSell,
        }), []
    );
    const {preload, lastSearchBuy, lastSearchSell} = useMappedState(mapState);

    const [isBuy, setIsBuy] = useState(false);
    const [amount, setAmount] = useState<MyDecimal | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [currency, setCurrency] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [tableProps, setTableProps] = useState<IAdTableProps>({
        isBuy: false,
        disabled: true
    });
    const [findInit, setFindInit]=useState(false);

    const strings: IStrings = useStrings(data);

    const matchFind = useRouteMatch('/find/:isBuy/:country/:currency/:paymentType/:amount?');
    useEffect(()=>{
        if(!matchFind || findInit){
            return;
        }

        // @ts-ignore
        let isBuy=matchFind.params.isBuy;
        // @ts-ignore
        let country=matchFind.params.country;
        // @ts-ignore
        let currency=matchFind.params.currency;
        // @ts-ignore
        let paymentType=matchFind.params.paymentType;
        // @ts-ignore
        let amount=matchFind.params.amount;

        if(!isBuy || !country || !currency || !paymentType){
            return;
        }

        setIsBuy(isBuy!=="buy");
        setCountry(country);
        setCurrency(currency);
        setPaymentType(paymentType);
        if(amount){
            setAmount(new MyDecimal(amount));
        }

        setTableProps({
            amount: !amount ? new Decimal(0) : amount,
            country: country,
            currency: currency,
            paymentType: paymentType,
            isBuy: isBuy!=="buy",
            disabled: false
        });
        setFindInit(true);
    }, [matchFind, findInit])


    useEffect(() => {
        if (!preload || matchFind) {
            return;
        }
        if (!isBuy && lastSearchSell !== null) {
            setCountry(lastSearchSell.country);
            setCurrency(lastSearchSell.currency);
            setPaymentType(lastSearchSell.paymentType);
            setTableProps({
                amount: lastSearchSell.amount === null ? new Decimal(0) : lastSearchSell.amount,
                country: lastSearchSell.country,
                currency: lastSearchSell.currency,
                paymentType: lastSearchSell.paymentType,
                isBuy,
                disabled: false
            });
        } else if (isBuy && lastSearchBuy !== null) {
            setCountry(lastSearchBuy.country);
            setCurrency(lastSearchBuy.currency);
            setPaymentType(lastSearchBuy.paymentType);
            setTableProps({
                amount: lastSearchBuy.amount === null ? new Decimal(0) : lastSearchBuy.amount,
                country: lastSearchBuy.country,
                currency: lastSearchBuy.currency,
                paymentType: lastSearchBuy.paymentType,
                isBuy,
                disabled: false
            });
        }
    }, [preload, lastSearchBuy, lastSearchSell, isBuy, matchFind]);

    if (tableProps === null || !preload) {
        return <Loading/>
    }

    return (
        <Container>
            <UseHelperModal/>
            <Row className="pb-3">
                <Col className="px-0">
                    <Nav tabs className="border-0">
                        <NavItem active={!isBuy} className="w-50 text-right">
                            <NavLink active={!isBuy}
                                     className={!isBuy ? "nav-link font-weight-bold text-uppercase border border-primary border-bottom-0" : "nav-link font-weight-bold text-uppercase border-0"}
                                     href="#"
                                     onClick={() => setIsBuy(false)}
                            >
                                {strings.fastBuy}
                            </NavLink>
                        </NavItem>
                        <NavItem active={isBuy} className="w-50">
                            <NavLink active={isBuy}
                                     className={!isBuy ? "nav-link font-weight-bold text-uppercase border-0" : "nav-link font-weight-bold text-uppercase border border-primary border-bottom-0"}
                                     href="#"
                                     onClick={() => setIsBuy(true)}
                            >
                                {strings.fastSell}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent>
                        <TabPane role="tabpanel" className="active border border-primary">
                            <Row className="p-3 mx-auto">
                                <Col className="p-0" lg={2} md={2} sm={12} xs={12}>
                                    <DecimalInput onInput={value => setAmount(value)}
                                                  defaultValue={amount}
                                                  placeHolder={strings.amount}
                                                  minimalValue={0}
                                    />
                                </Col>
                                <Col className="p-0" lg={4} md={4} sm={12} xs={12}>
                                    <CountrySelect value={country !== null ? country : undefined}
                                                   onChange={countryCode => {
                                                       setCountry(countryCode);
                                                       let cur = CurrenciesCatalog.get(countryCode);
                                                       if (cur !== undefined)
                                                           setCurrency(cur);
                                                       let pt = PaymentTypesCatalog.get(countryCode);
                                                       if (pt !== undefined)
                                                           setPaymentType(pt[0]);
                                                   }}
                                    />
                                </Col>
                                <Col className="p-0" lg={2} md={2} sm={12} xs={12}>
                                    <CurrencySelect onChange={value => setCurrency(value)} value={currency}/>
                                </Col>
                                <Col className="p-0" lg={3} md={2} sm={12} xs={12}>
                                    <PaymentTypeSelect onChange={value => setPaymentType(value)} value={paymentType}
                                                       country={country}/>
                                </Col>
                                <Col className="p-0" lg={1} md={2} sm={12} xs={12}>
                                    <Button className="btn-block" color="warning"
                                            onClick={() => {
                                                let am = amount === null ? new Decimal(0) : amount;
                                                setTableProps({
                                                    amount: am,
                                                    country,
                                                    currency,
                                                    paymentType,
                                                    isBuy,
                                                    disabled: false
                                                });
                                            }}>{strings.search}</Button>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
            
            <AdTable {...tableProps}/>

        </Container>
    );
};