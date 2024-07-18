import React from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';
import {Footer} from "./Footer";
import {history} from "./redux/store/store";
import {ConnectedRouter} from "connected-react-router";
import TotpSetup from "./Profile/TotpSetup";
import Profile from "./Profile/Profile";
import TotpDisable from "./Profile/TotpDisable";
import LoginRegister from "./Profile/LoginRegister";
import ChangePassword from "./Profile/ChangePassword";
import ChangeEmail from "./Profile/ChangeEmail";
import Header from "./Header";
import Sessions from "./Profile/Sessions";
import Tokens from "./Profile/Tokens";
import ResetPassword from "./Profile/ResetPassword";
import {useAuth} from "./Profile/Hooks";
import RemoveAccount from "./Profile/RemoveAccount";
import Dashboard from "./Dashboard/Dashboard";
import CreateAdvertisement from "./Dashboard/CreateAdvertisement";
import {MainPage} from "./MainPages/MainPage";
import {UserInfoPage} from "./MainPages/UserInfo/UserInfo";
import {CreateDealPage} from "./MainPages/CreateDealPage";
import {DealPage} from "./MainPages/DealPage";
import {EventListenerComponent} from "./EventListenerComponent";
import {PreloadComponent} from "./PreloadComponent";
import {WalletPage} from "./Wallet/WalletPage";
import {SendBitcoins} from "./Wallet/SendBitcoins";
import {Invoices} from "./Invoices/Invoices";
import {Promises} from "./Promises/Promises";
import {ImageLoader} from "./ImageLoader";
import {OriginalModal} from "./MainPages/ImageOriginal";
import {IDBLoader} from "./IDBLoader";
import {ReceiveBitcoins} from "./Wallet/ReceiveBitcoins";
import {Helper} from "./Helper/Helper";
import {LinksManager} from "./Integration/LinksManager";
import {AdIframe} from "./Integration/AdIframe";
import {InvoiceIframe} from "./Integration/InvoiceIframe";
import {VarsList} from "./MainPages/VarsList";
import {VariablesListenerComponent} from "./VariablesListenerComponent";

export const Layout = () => {
    useAuth();
    const location = useLocation();
    let regexp = new RegExp('^\\/(?!iframes\\/).*$');

    return (
        <>
            <PreloadComponent/>
            <EventListenerComponent/>
            <VariablesListenerComponent/>
            <ImageLoader/>
            {regexp.test(location.pathname) ?
                <Header/>
                : null
            }
            <OriginalModal/>
            <IDBLoader/>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={MainPage}/>
                    <Route exact path="/find/:isBuy/:country/:currency/:paymentType/:amount?" component={MainPage}/>
                    <Route path="/login" component={LoginRegister}/>
                    <Route exact path="/profile" component={Profile}/>
                    <Route path="/profile/totpsetup" component={TotpSetup}/>
                    <Route path="/profile/totpdisable" component={TotpDisable}/>
                    <Route path="/profile/changePassword" component={ChangePassword}/>
                    <Route path="/profile/changeEmail" component={ChangeEmail}/>
                    <Route path="/profile/sessions" component={Sessions}/>
                    <Route path="/profile/tokens" component={Tokens}/>
                    <Route path="/profile/resetpassword" component={ResetPassword}/>
                    <Route path="/profile/removeaccount" component={RemoveAccount}/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/createAdvertisement/:id(\d+)?" component={CreateAdvertisement}/>
                    <Route path="/userinfo/:id" component={UserInfoPage}/>
                    <Route path="/createDeal/:id/:amount?" component={CreateDealPage}/>
                    <Route path="/deal/:id" component={DealPage}/>
                    <Route path="/wallet" component={WalletPage}/>
                    <Route path="/receiveBitcoins" component={ReceiveBitcoins}/>
                    <Route path="/sendBitcoins" component={SendBitcoins}/>
                    <Route path="/invoices" component={Invoices}/>
                    <Route path="/promises" component={Promises}/>
                    <Route path="/helper" component={Helper}/>
                    <Route path="/links" component={LinksManager}/>
                    <Route path="/iframes/advertisement/:id/:amount?" component={AdIframe}/>
                    <Route path="/iframes/helper/advertisement/:id/:amount?" component={AdIframe}/>
                    <Route path="/iframes/invoice/:id/:pieces?/" component={InvoiceIframe}/>
                    <Route path="/iframes/helper/invoice/:id/:pieces?" component={InvoiceIframe}/>
                    <Route path="/vars" component={VarsList}/>
                </Switch>
            </ConnectedRouter>
            {regexp.test(location.pathname) ?
                <Footer/>
                : null
            }
        </>
    );
};
