import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {persistor, store} from "./redux/store/store";
import {PersistGate} from "redux-persist/integration/react";
import {LoadingView} from "./LoadingView";
import {Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Layout} from "./Layout";
import {ConnectedRouter} from 'connected-react-router';
import {history} from "./redux/store/store";
import {StoreContext} from 'redux-react-hook';
import {site} from "./global";


ReactDOM.render(
    <Provider store={store}>
        <StoreContext.Provider value={store}>
            <PersistGate loading={<LoadingView/>} persistor={persistor}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path="/" component={Layout}/>
                    </Switch>
                </ConnectedRouter>
            </PersistGate>
        </StoreContext.Provider>
    </Provider>
    , document.getElementById('root'));

document.title = site;


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
