import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {persistor, store} from "./redux/store";
import {PersistGate} from "redux-persist/integration/react";
import {LoadingView} from "./LoadingView";
import {Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Layout} from "./Layout";
import {ConnectedRouter} from 'connected-react-router';
import {history} from "./redux/store";
import {StoreContext} from 'redux-react-hook';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();