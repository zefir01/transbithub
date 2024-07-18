import {apiClient, getToken, GrpcError, grpcRunAsync, RenewAccessToken,} from "./helpers";
import {RefObject, useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, IStore} from "./redux/interfaces";
import grpcWeb, {ClientReadableStream, Error} from "grpc-web";
import * as jspb from "google-protobuf";
import LocalizedStrings, {GlobalStrings, LocalizedStringsMethods} from "react-localization";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {GetDisputesResponse, GetSupportAccountsResponse, Profile} from "./Protos/adminka_pb";
import {LoadedAccounts, MarkAsReadEvents, ProfileLoaded, UpdateDispute} from "./redux/actions";
import {Event as evt, MarkEventsAsReadRequest} from "./Protos/api_pb";
import {streamsKeepAliveTimeout} from "./global";

export function useMarkAsReadedEvents(markEvents: evt.AsObject[] | null,
                                      onRunning: () => void,
                                      onComplete: () => void,
                                      onError: (error: string) => void
) {
    const [markEventsAsReadedRunning, setMarkEventsAsReadedRunning] = useState(false);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state
        }), []
    );
    const {authState} = useMappedState(mapState);

    useEffect(() => {
        if (markEventsAsReadedRunning) {
            return;
        }
        if (authState === AuthState.NotAuthed) {
            return;
        }
        if (markEvents === null || markEvents.length === 0) {
            return;
        }

        setMarkEventsAsReadedRunning(true);
        onRunning();

        async function f() {
            let req = new MarkEventsAsReadRequest();
            markEvents!.map(p => p.id).forEach(p => req.addId(p));

            try {
                await grpcRunAsync<Empty.AsObject>(apiClient.markEventsAsRead, req, getToken());
                dispatch(MarkAsReadEvents(markEvents!));
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError)
                    onError(e.message);
            } finally {
                setMarkEventsAsReadedRunning(false);
                onComplete();
            }
        }

        f();

    }, [authState, markEvents, dispatch, markEventsAsReadedRunning, onComplete, onError, onRunning]);
}

export function useMyDisputes() {
    const dispatch = useDispatch();
    const [running, setRunning] = useState(false);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            myDisputes: store.disputes.myDisputes
        }), []
    );
    const {authState, myDisputes} = useMappedState(mapState);

    useEffect(()=> {
        async function f() {
            if (running || authState === AuthState.NotAuthed || myDisputes !== undefined) {
                return;
            }
            let req = new Empty();
            try {
                let resp = await grpcRunAsync<GetDisputesResponse.AsObject>(apiClient.getMyDisputes, req, getToken());
                for (let dispute of resp.disputesList) {
                    dispatch(UpdateDispute(dispute));
                }
            } catch (e) {
                console.log(e);
            } finally {
                setRunning(false);
            }
        }

        f();
    }, [authState, dispatch, myDisputes, running]);
}

export function useAuth() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            refreshToken: store.auth.refreshToken,
        }), []
    );
    const {refreshToken} = useMappedState(mapState);
    const [running1, setRunning1] = useState(false);
    const [running2, setRunning2] = useState(false);
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (running1)
            return;

        async function f() {
            try {
                if (refreshToken !== "") {
                    await RenewAccessToken(dispatch, refreshToken);
                    setInit(true);
                }
            } finally {
                setRunning1(false);
            }
        }

        if (!init) {
            f();
        }
    }, [init, refreshToken, running1, dispatch]);


    useEffect(() => {
        if (running2 || refreshToken === "") {
            return;
        }
        setRunning2(true);

        try {
            if (!window.authTimer) {
                window.refreshToken = refreshToken;
                window.authTimer = setTimeout(async function refreshCallback() {
                    if (window.refreshToken) {
                        await RenewAccessToken(dispatch, window.refreshToken);
                    }
                    window.authTimer = setTimeout(refreshCallback, 60 * 1000);
                }, 60 * 1000
                );
            }
        } finally {
            setRunning2(false);
        }

    }, [refreshToken, dispatch, running2]);
}

interface hasKeepAlive {
    getKeepalive: () => boolean;
}

export function useEventListener<T extends HTMLElement = HTMLDivElement>(
    eventName: string,
    handler: Function,
    element?: RefObject<T>,
) {
    // Create a ref that stores handler
    const savedHandler = useRef<Function>()
    useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current || window
        if (!(targetElement && targetElement.addEventListener)) {
            return
        }
        // Update saved handler if necessary
        if (savedHandler.current !== handler) {
            savedHandler.current = handler
        }
        // Create event listener that calls handler function stored in ref
        const eventListener = (event: Event) => {
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!savedHandler?.current) {
                savedHandler.current(event)
            }
        }
        targetElement.addEventListener(eventName, eventListener);
        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        }
    }, [eventName, element, handler])
}

export function useStrings<TData extends GlobalStrings<any>, ISTR extends LocalizedStringsMethods>(data: TData): ISTR {
    const mapState = useCallback(
        (store: IStore) => ({
            lang: store.lang.Lang
        }), []
    );
    const {lang} = useMappedState(mapState);
    const [strings, setStrings] = useState(new LocalizedStrings(data));

    useEffect(() => {
        let s: ISTR = new LocalizedStrings(data);
        s.setLanguage(lang);
        setStrings(s);
    }, [lang, data]);

    return strings;
}

export function useStream<DataType extends jspb.Message, ObjectDataType>(
    name: string,
    create: (metadata: grpcWeb.Metadata) => ClientReadableStream<DataType> | null,
    onData: (data: ObjectDataType) => void,
    onError?: (err: Error | string) => void,
    onStarting?: () => void,
    onStarted?: () => void,
    onEnd?: () => void,
    timerSeconds: number = 3,
    disabled: boolean = false
) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    const [counter, setCounter] = useState(0);
    const [streamStartCounter, setStreamStartCounter] = useState(-1);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [eventsStreamStarted, setEventsStreamStarted] = useState(false);
    const streamRef = useRef<ClientReadableStream<DataType> | null>(null);
    const [eventsStreamStarting, setEventsStreamStarting] = useState(false);
    const [streamForUser, setStreamForUser] = useState("");
    const [lastKeepAlive, setLastKeepAlive] = useState<number | null>(null);

    useEffect(() => {
        return () => {
            if (streamRef.current)
                streamRef.current.cancel();
        }
    }, []);

    useEffect(() => {
        if (!disabled || !timer) {
            return;
        }
        clearTimeout(timer);
    }, [disabled, timer]);

    useEffect(() => {
        if (timer || disabled || eventsStreamStarted) {
            return;
        }
        const t = setTimeout(async function refreshCallback() {
            setCounter(val => {
                return val + 1;
            });
            if(!disabled) {
                setTimeout(refreshCallback, timerSeconds * 1000);
            }
        }, timerSeconds * 1000);
        setTimer(t);
    }, [timer, timerSeconds, disabled, eventsStreamStarted])

    useEffect(() => {

        console.log(profile.profile?.userid);

        function isHealth(): boolean {
            if (lastKeepAlive === null) {
                return true;
            }
            if (Date.now() - lastKeepAlive > streamsKeepAliveTimeout) {
                console.log(`Stream ${name} keep-alive failed.`)
                return false;
            }
            return true;
        }

        let health = isHealth();

        if (disabled) {
            return;
        }
        if (authState === AuthState.NotAuthed)
            return;
        if (eventsStreamStarted && streamRef.current !== null && streamForUser === profile.profile?.userid && health) {
            return;
        }
        if (eventsStreamStarting) {
            return;
        }
        if (streamStartCounter >= counter && streamForUser === profile.profile?.userid && health) {
            return;
        }
        if(!profile.profile?.userid){
            return;
        }
        setEventsStreamStarting(true);

        function isHasKeepAlive(object: any): object is hasKeepAlive {
            return (object as hasKeepAlive).getKeepalive !== undefined;
        }

        function isObject(object: any): object is ObjectDataType {
            return true;
        }

        async function f() {
            if (eventsStreamStarted && streamRef.current !== null) {
                streamRef.current?.cancel();
                setEventsStreamStarted(false);
                if (lastKeepAlive !== null) {
                    setLastKeepAlive(null);
                }
                //dispatch({type: EventsActionTypes.CLEAR});
            }
            let stream: ClientReadableStream<DataType> | null;
            try {
                if (onStarting) {
                    onStarting();
                }
                console.log(`Stream ${name} starting.`);
                let token = getToken();
                var deadline = new Date();
                deadline.setDate(deadline.getDate() + 1);
                let metadata: grpcWeb.Metadata = {
                    Authorization: "Bearer " + token,
                    deadline: deadline.getTime().toString()
                };
                stream = create(metadata);
                if (stream) {
                    streamRef.current = stream;
                } else {
                    setEventsStreamStarted(false);
                    throw new Error(`${name} Null in create function result.`);
                }

                setStreamForUser(profile.profile!.userid);
                setEventsStreamStarted(true);
                setStreamStartCounter(counter);
                if (onStarted) {
                    onStarted();
                }
                setLastKeepAlive(Date.now());
            } catch (e) {
                console.log(e);
                setEventsStreamStarted(false);
                if (onError) {
                    onError(e);
                }
                return;
            } finally {
                setEventsStreamStarting(false);
            }
            stream.on('error', (err: Error) => {
                console.log(`${name} Stream error.`);
                if (onError) {
                    onError(err);
                }
                setEventsStreamStarted(false);
                if (lastKeepAlive !== null) {
                    setLastKeepAlive(null);
                }
            });
            stream.on('data', function (response: DataType) {
                if (isHasKeepAlive(response)) {
                    if (!response.getKeepalive()) {
                        let obj = response.toObject(false);
                        if (isObject(obj)) {
                            onData(obj);
                        }
                    } else {
                        setLastKeepAlive(Date.now());
                    }
                }
            });
            stream.on('status', function (status) {
                if (status.code === 14 || status.code === 2) {
                    setEventsStreamStarted(false);
                    if (lastKeepAlive !== null) {
                        setLastKeepAlive(null);
                    }
                    if (onError) {
                        onError(`${name} Stream stop with code ${status.code} ${status.details}`);
                    }
                }
                console.log(status.code);
                console.log(status.details);
                console.log(status.metadata);
            });
            stream.on('end', function () {
                console.log(`${name} Stream end`);
                setEventsStreamStarted(false);
                if (lastKeepAlive !== null) {
                    setLastKeepAlive(null);
                }
                if (onEnd) {
                    onEnd();
                }
            });
        }

        f();

    }, [authState, profile.profile,
        profile.profile?.userid,
        eventsStreamStarted,
        eventsStreamStarting,
        streamForUser,
        dispatch,
        streamStartCounter,
        counter,
        onData,
        create,
        onEnd,
        onError,
        onStarted,
        onStarting,
        disabled,
        name,
        lastKeepAlive
    ]);
}

export function useProfile() {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            profile: store.profile.profile
        }), []
    );
    const {authState, profile} = useMappedState(mapState);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (profile !== undefined || authState === AuthState.NotAuthed) {
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

                let resp = await grpcRunAsync<Profile.AsObject>(apiClient.getMyProfile, req, getToken());
                dispatch(ProfileLoaded(resp));
            } catch (e) {
                console.log("profile error. token=" + token + " state=" + authState);
            } finally {
                setRunning(false);
            }
        }

        f();
    }, [authState, profile, running, dispatch]);
}

export const useSupportAccounts = () => {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            accounts: store.supportAccounts.accounts
        }), []
    );
    const {authState, accounts} = useMappedState(mapState);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        async function f() {
            if (authState === AuthState.NotAuthed || accounts !== undefined || running) {
                return;
            }

            try {
                let req = new Empty();
                let resp = await grpcRunAsync<GetSupportAccountsResponse.AsObject>(apiClient.getSupportAccounts, req, getToken());
                dispatch(LoadedAccounts(resp.supportaccountsList));
            } catch (e) {
                console.log(e);
            } finally {
                setRunning(false);
            }
        }

        f();
    }, [authState, accounts, running, dispatch])
}