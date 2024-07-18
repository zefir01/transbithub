import React, {useCallback} from "react";
import {Col, Container, Row} from "reactstrap";
import {Redirect, Route} from "react-router-dom";
import {SelectOperation} from "./SelectOperation";
import {BuyCrypto} from "./BuyCrypto/BuyCrypto";
import {EnterAmount} from "./BuyCrypto/EnterAmount";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {SelectAd} from "./BuyCrypto/SelectAd";
import {SelectBuyResult} from "./BuyCrypto/SelectBuyResult";
import {DealPage} from "./BuyCrypto/DealPage";
import {DealDisputed} from "./BuyCrypto/DealDisputed";
import {DealCanceled} from "./BuyCrypto/DealCanceled";
import {DealCompleted} from "./BuyCrypto/DealCompleted";
import {data, IStrings} from "../localization/Helper/Helper";
import {PayInvoice} from "./PayInvoice/PayInvoice";
import {SelectPieces} from "./PayInvoice/SelectPieces";
import {SelectPaymentType} from "./PayInvoice/SelectPaymentType";
import {PaymentComplete} from "./PayInvoice/PaymentComplete";
import {PaymentCanceled} from "./PayInvoice/PaymentCanceled";
import {PromisePay} from "./PayInvoice/PromisePay";
import {SelectPromiseOddType} from "./PayInvoice/SelectPromiseOddType";
import {PayLn} from "./PayInvoice/PayLn";
import {UsePromise} from "./UsePromise/UsePromise";
import {ToBalanceComplete} from "./UsePromise/ToBalanceComplete";
import {useStrings} from "../Hooks";

export function Helper() {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState
        }), []
    );
    const {state} = useMappedState(mapState);
    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.title}</h1>
                    {strings.info}
                </Col>
            </Row>
            <Route exact path="/helper" render={() => {
                if (state.currentPath === "") {
                    return (
                        <Redirect to="/helper/selectOperation"/>
                    );
                }
                return (
                    <Redirect push to={state.currentPath}/>
                );
            }}/>
            <Route path="/helper/selectOperation" component={SelectOperation}/>
            <Route path="/helper/buyCrypto" component={BuyCrypto}/>
            <Route path="/helper/enterAmount" component={EnterAmount}/>
            <Route path="/helper/selectBuyResult" component={SelectBuyResult}/>
            <Route path="/helper/selectAd" component={SelectAd}/>
            <Route path="/helper/deal" component={DealPage}/>
            <Route path="/helper/dealDisputed" component={DealDisputed}/>
            <Route path="/helper/dealCanceled" component={DealCanceled}/>
            <Route path="/helper/dealCompleted" component={DealCompleted}/>
            <Route path="/helper/payInvoice" component={PayInvoice}/>
            <Route path="/helper/selectPieces" component={SelectPieces}/>
            <Route path="/helper/selectPaymentType" component={SelectPaymentType}/>
            <Route path="/helper/paymentComplete" component={PaymentComplete}/>
            <Route path="/helper/paymentCanceled" component={PaymentCanceled}/>
            <Route path="/helper/promisePay" component={PromisePay}/>
            <Route path="/helper/selectPromiseOddType" component={SelectPromiseOddType}/>
            <Route path="/helper/payLn" component={PayLn}/>
            <Route path="/helper/usePromise" component={UsePromise}/>
            <Route path="/helper/toBalanceComplete" component={ToBalanceComplete}/>

        </Container>
    )
}