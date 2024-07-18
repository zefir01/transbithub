import {compose, applyMiddleware, createStore, combineReducers} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {History, createBrowserHistory} from 'history';
import {AuthReducer} from "./authReducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {IStore} from "./interfaces";
import {LangReducer} from "./LangReducer";
import {ProfileReducer} from "./profileReducer";
import {DisputesReducer} from "./DisputesReducer";
import {SupportAccountsReducer} from "./SupportAccountsReducer";
import {IDBStatesReducer} from "./IDBStatesReducer";
import {ImagesReducer} from "./ImagesReducer";

const persistConfig = {
    //blacklist: ["accessToken", "anonAccessToken", "state"],
    whitelist: ["refreshToken"],
    key: 'auth',
    storage
};
export const LangPersistConfig = {
    key: 'lang',
    storage
}


const rootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    auth: persistReducer(persistConfig, AuthReducer),
    lang: persistReducer(LangPersistConfig, LangReducer),
    profile: ProfileReducer,
    disputes: DisputesReducer,
    supportAccounts: SupportAccountsReducer,
    images: ImagesReducer,
    idbStates: IDBStatesReducer,
});

export const useMyTypedSelector: TypedUseSelectorHook<IStore> = useSelector

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