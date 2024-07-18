import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    Badge,
    Button,
    Col,
    Container,
    Nav,
    NavItem,
    Row
} from "reactstrap";
import {NavLink, Redirect, Route, useLocation} from "react-router-dom";
import {CreateInvoice} from "./CreateInvoice";
import {InvoiceCreated} from "./InvoiceCreated";
import {AuthState, EventTypes, InvoiceType, IStore} from "../redux/store/Interfaces";
import {InvoiceView} from "./InvoiceView";
import {PaymentView} from "./PaymentView";
import {FromMePaymentsTable, ToMePaymentsTable} from "./PaymentsTable";
import {data, IStrings} from "../localization/Invoices/Invoices"
import {PublicInvoicesTable} from "./PublicInvoicesTable";
import {Finder} from "./Finder";
import {useMappedState} from "redux-react-hook";
import {SelectAd} from "../MainPages/SelectAd";
import {Messenger} from "./Mesenger/Messenger";
import {DefaultCurrency} from "../MainPages/DefaultCurrency";
import {FromMeInvoices, ToMeInvoices} from "./InvoicesTable";
import {useStrings} from "../Hooks";
import {Col6_12} from "../global";


export function CreateInvoiceBtn() {
    const strings: IStrings=useStrings(data);
    const [redirect, setRedirect] = useState("");
    const [prevPass, setPrevPass]=useState("");
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname!==prevPass){
            setRedirect("");
            setPrevPass(location.pathname);
        }
    }, [prevPass, location.pathname]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>
    }
    return (
        <Button color="primary" onClick={() => {
            if(prevPass!==location.pathname){
                setPrevPass(location.pathname);
            }
            setRedirect("/invoices/create")
        }}>
            {strings.createInvoice}
        </Button>
    );
}

export function Invoices() {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            invoices: store.invoices,
            currency: store.profile.GeneralSettings.DefaultCurrency
        }), []
    );
    const {authState, invoices} = useMappedState(mapState);

    return (
        <div className="container-fluid">
            <Container>
                <Row>
                    <Col {...Col6_12}>
                        <h1>{strings.title}</h1>
                        <p>{strings.info}<a href={"https://t.me/"+process.env.REACT_APP_NOTIFY_BOT}>@{process.env.REACT_APP_NOTIFY_BOT}</a></p>
                    </Col>

                    <Col {...Col6_12}>
                        <DefaultCurrency/>
                        <Row className="pb-3">
                            <Col>
                                <Finder/>
                            </Col>
                            {authState === AuthState.Authed ?
                                <Col className="col-auto">
                                    <CreateInvoiceBtn/>
                                </Col>
                                : null
                            }
                        </Row>
                    </Col>
                </Row>
                <Row>
                    {authState === AuthState.Authed ?
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/to-me">
                                        <>
                                            {strings.toMeInvoices}
                                            {invoices.newEvents.filter(p => p.invoiceType === InvoiceType.toMe).length > 0 ?
                                                <>
                                                    &nbsp;
                                                    <Badge color="danger">
                                                        {invoices.newEvents.filter(p => p.invoiceType === InvoiceType.toMe).length}
                                                    </Badge>
                                                </>
                                                : null
                                            }
                                        </>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/from-me">
                                        {strings.fromMeInvoices}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/public">
                                        {strings.publicInvoices}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/payments/to-me">
                                        <>
                                            {strings.toMePayments}

                                            {invoices.newEvents.filter(p => p.type === EventTypes.InvoicePaymentNew).length > 0 ?
                                                <>
                                                    &nbsp;
                                                    <Badge color="danger">
                                                        {invoices.newEvents.filter(p => p.type === EventTypes.InvoicePaymentNew).length}
                                                    </Badge>
                                                </>
                                                : null
                                            }
                                        </>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/payments/from-me">
                                        {strings.fromMePayments}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/messenger/">
                                        {strings.messages}
                                        {invoices.newEvents.filter(p=>p.type===EventTypes.ConversationNewMessage).length>0?
                                            <Badge color="danger">{invoices.newEvents.filter(p=>p.conversation).length}</Badge>
                                            :null
                                        }
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                        :
                        <Col>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/payments/from-me">
                                        {strings.fromMePayments}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices/messenger/">
                                        {strings.messages}
                                        {invoices.newEvents.filter(p=>p.type===EventTypes.ConversationNewMessage).length>0?
                                            <Badge color="danger">{invoices.newEvents.filter(p=>p.conversation).length}</Badge>
                                            :null
                                        }
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    }
                    {authState === AuthState.Authed ?
                        <>
                            <Route exact path="/invoices" render={() => (
                                <Redirect to="/invoices/to-me"/>
                            )}/>
                            <Route exact path="/invoices/create" component={CreateInvoice}/>
                            <Route path="/invoices/create/:id(\d+)" component={CreateInvoice}/>
                            <Route path="/invoices/created/:id(\d+)" component={InvoiceCreated}/>
                            <Route path="/invoices/updated/:id(\d+)"
                                   component={() => InvoiceCreated({isUpdated: true})}/>
                            <Route path="/invoices/to-me" component={ToMeInvoices}/>
                            <Route path="/invoices/from-me" component={FromMeInvoices}/>
                            <Route path="/invoices/payments/to-me" component={ToMePaymentsTable}/>
                            <Route path="/invoices/public" component={PublicInvoicesTable}/>

                        </>
                        :
                        <Route exact path="/invoices" render={() => (
                            <Redirect to="/invoices/payments/from-me"/>
                        )}/>
                    }
                    <Route path="/invoices/invoice/:id(\d+)" component={InvoiceView}/>
                    <Route path="/invoices/payment/:id(\d+)" component={PaymentView}/>
                    <Route path="/invoices/payments/from-me" component={FromMePaymentsTable}/>
                    <Route path="/invoices/selectAd/" component={SelectAd}/>
                </Row>
            </Container>
            <Route path="/invoices/messenger/" component={Messenger}/>
        </div>
    );
}