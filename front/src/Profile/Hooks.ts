import {
    getToken,
    GrpcError,
    profileApiClient,
    ProfileGrpcRunAsync,
    RenewAccessToken,
    RenewAnonAccessToken,
    tradeApiClient,
    TradeGrpcRunAsync
} from "../helpers";
import {LoadDeals, NewAnonToken, NewFees, ProfileSuccess} from "../redux/actions";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {RegisterAnonymousRequest, RegisterAnonymousResponse} from "../Protos/profile_pb";
import {DealStatus, GetFeesResponse, GetMyDealsRequest, GetMyDealsResponse, MyProfileResponse} from "../Protos/api_pb";
import {pageSize} from "../global";
import {MyDecimal} from "../MyDecimal";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";


export function useDeals(isRun: boolean,
                         page: number,
                         status: DealStatus,
                         onComplete: () => void,
                         onError: (error: string) => void
) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            deals: store.deals
        }), []
    );
    const {authState, deals} = useMappedState(mapState);
    const [getMyDealsRunning, setgetMyDealsRunning] = useState(false);

    useEffect(() => {
        if (!isRun)
            return;
        if (authState === AuthState.NotAuthed)
            return;
        if (getMyDealsRunning)
            return;
        setgetMyDealsRunning(true);

        async function f() {
            let req = new GetMyDealsRequest();
            req.addStatus(status);
            if (status === DealStatus.OPENED) {
                req.addStatus(DealStatus.WAITDEPOSIT);
            }
            req.setLoadcount(pageSize * 2 * -1);
            if (deals.deals.filter(p => p.status === status).length === 0) {
                req.setDealid(0);
            } else {
                let max = deals.deals.filter(p => p.status === status).map(p => p.id).reduce(function (prev, current) {
                    return (prev > current) ? prev : current
                });
                req.setDealid(max);
            }

            try {
                let resp = await TradeGrpcRunAsync<GetMyDealsResponse.AsObject>(tradeApiClient.getMyDeals, req, getToken());
                dispatch(LoadDeals(resp.dealsList));
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    onError(e.message);
                }
            } finally {
                setgetMyDealsRunning(false);
                onComplete();
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, page, deals.deals, dispatch, getMyDealsRunning, isRun, status]);
}

export function useFees(onError: (error: string) => void) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            fee: store.catalog.fee
        }), []
    );
    const {authState, fee} = useMappedState(mapState);
    const [getFeeRunning, setGetFeerunning] = useState(false);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || getFeeRunning || fee !== null)
            return;

        setGetFeerunning(true);

        async function f() {
            let req = new Empty();

            try {
                let resp = await TradeGrpcRunAsync<GetFeesResponse.AsObject>(tradeApiClient.getFees, req, getToken());
                dispatch(NewFees(MyDecimal.FromPb(resp.fee)));
            } catch (e) {
                if (e instanceof GrpcError) {
                    onError(e.message);
                }
                console.log(e.message);
            } finally {
                setGetFeerunning(false);
            }

        }

        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, dispatch, getFeeRunning]);
}

export function useProfile() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            profile: store.profile
        }), []
    );
    const {authState, profile} = useMappedState(mapState);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (profile.UserId !== "" || authState === AuthState.NotAuthed) {
            return;
        }
        if (!profile.ProfileNeedUpdate) {
            return;
        }
        if (running) {
            return;
        }

        setRunning(true);

        async function f() {
            let req = new Empty();

            let token = getToken();
            try {

                let resp = await TradeGrpcRunAsync<MyProfileResponse.AsObject>(tradeApiClient.getMyProfile, req, getToken());
                dispatch(ProfileSuccess(resp));
            } catch (e) {
                console.log("profile error. token=" + token + " state=" + authState);
            } finally {
                setRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, profile.ProfileNeedUpdate, running, dispatch, profile.UserId]);
}

export function useAuth() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            refreshToken: store.auth.refreshToken,
            anonRefreshToken: store.auth.anonRefreshToken,
        }), []
    );
    const {refreshToken, anonRefreshToken} = useMappedState(mapState);
    const [init, setInit] = useState(false);
    const [running1, setRunning1] = useState(false);
    const [running2, setRunning2] = useState(false);

    useEffect(() => {
        if (running1)
            return;

        setRunning1(true);

        async function f() {
            let isError = true;
            while (isError) {
                try {
                    if (refreshToken !== "") {
                        await RenewAccessToken(dispatch, refreshToken);
                        setInit(true);
                    } else if (anonRefreshToken !== "") {
                        await RenewAnonAccessToken(dispatch, anonRefreshToken);
                        setInit(true);
                    } else {
                        let lang = navigator.language.toUpperCase().substr(0, 2);
                        let req = new RegisterAnonymousRequest();
                        req.setLang(lang);
                        let resp = await ProfileGrpcRunAsync<RegisterAnonymousResponse.AsObject>(profileApiClient.registerAnonymous, req);
                        dispatch(NewAnonToken(resp.accesstoken, resp.refreshtoken));
                        setInit(true);
                    }
                    isError = false;
                } catch (e) {
                    console.log(e.message);
                    isError = true;
                    await new Promise(resolve => setTimeout(resolve, 3000));
                } finally {
                    if (!isError) {
                        setRunning1(false);
                    }
                }
            }
        }

        if (!init) {
            // noinspection JSIgnoredPromiseFromCall
            f();
        }

    }, [init, refreshToken, anonRefreshToken, running1, dispatch]);


    useEffect(() => {
        if (running2 || (refreshToken === "" && anonRefreshToken === "") || !init) {
            return;
        }
        setRunning2(true);

        try {
            if (!window.authTimer) {
                window.refreshToken = refreshToken;
                window.anonRefreshToken = anonRefreshToken;
                window.authTimer = setTimeout(async function refreshCallback() {
                    if (window.refreshToken) {
                        await RenewAccessToken(dispatch, window.refreshToken);
                    } else if (window.anonRefreshToken) {
                        await RenewAnonAccessToken(dispatch, window.anonRefreshToken);
                    }
                    window.authTimer = setTimeout(refreshCallback, 60 * 1000);
                }, 60 * 1000
                );
            }
        } finally {
            setRunning2(false);
        }

    }, [init, refreshToken, anonRefreshToken, running2, dispatch]);
}