import {compose, applyMiddleware, createStore, combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {SystemReducer} from "../reducers/system";
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {History, createBrowserHistory} from 'history';
import {AuthReducer} from "../reducers/auth";
import {ProfileReducer} from "../reducers/profile";
import {CatalogReducer} from "../reducers/CatalogReducer";
import {DealsReducer} from "../reducers/DealsReducer";
import {PreloadReducer} from "../reducers/PreloadReducer";
import {BalanceReducer} from "../reducers/BalanceReducer";
import {InvoicesReducer} from "../reducers/InvoicesReducer";
import {ImagesReducer} from "../reducers/ImagesReducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {IStore} from "./Interfaces";
import {IDBStatesReducer} from "../reducers/IDBStatesReducer";
import {HelperReducer} from "../reducers/HelperReducer";
import {LangReducer} from "../reducers/LangReducer";

const persistConfig = {
    //blacklist: ["accessToken", "anonAccessToken", "state"],
    whitelist: ["refreshToken", "anonRefreshToken"],
    key: 'auth',
    storage
};
export const LangPersistConfig = {
    key: 'lang',
    storage
}

export const helperPersistConfig = {
    whitelist: ["disableUseHelperRequest"],
    key: 'helper',
    storage
};


const rootReducer = (history: History) => combineReducers({
    system: SystemReducer,
    router: connectRouter(history),
    auth: persistReducer(persistConfig, AuthReducer),
    profile: ProfileReducer,
    catalog: CatalogReducer,
    deals: DealsReducer,
    preload: PreloadReducer,
    balances: BalanceReducer,
    invoices: InvoicesReducer,
    images: ImagesReducer,
    idbStates: IDBStatesReducer,
    helperState: persistReducer(helperPersistConfig, HelperReducer),
    lang: persistReducer(LangPersistConfig, LangReducer),
});

export const history = createBrowserHistory({basename: process.env.PUBLIC_URL});
const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer(history),
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history),
        ),
    )
);

const persistor = persistStore(store);
export {store, persistor};