import React, {useCallback} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {history} from "./redux/store";
import {ConnectedRouter} from "connected-react-router";
import {useAuth, useMyDisputes, useProfile, useSupportAccounts} from "./Hooks";
import {EventListenerComponent} from "./EventListenerComponent";
import {Dashboard} from "./Dashboard/Dashboard";
import {AuthState, IStore} from "./redux/interfaces";
import {useMappedState} from "redux-react-hook";
import {Login} from "./Login/Login";
import {PrivateRoute} from "./PrivateRoute";
import {ImageLoader} from "./ImageLoader";
import {OriginalModal} from "./Dashboard/DealPage/ImageOriginal";
import {IDBLoader} from "./IDBLoader";


export const Layout = () => {
    useAuth();
    useProfile();
    useSupportAccounts();
    useMyDisputes();

    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

    return (
        <>
            <EventListenerComponent/>
            <ImageLoader/>
            <OriginalModal/>
            <IDBLoader/>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" render={() => (
                        <Redirect to="/dashboard"/>
                    )}/>
                    <Route path="/login" component={Login}/>
                    <PrivateRoute isSignedIn={authState===AuthState.Authed} path="/dashboard" component={Dashboard}/>
                </Switch>
            </ConnectedRouter>
        </>
    );
}
