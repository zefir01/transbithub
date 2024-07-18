import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "./helpers";
import {RefObject, useCallback, useEffect, useRef, useState} from "react";
import {
    absDependencies,
    ceilDependencies,
    cosDependencies,
    create,
    divideDependencies,
    evaluateDependencies,
    floorDependencies,
    maxDependencies,
    meanDependencies,
    medianDependencies,
    minDependencies,
    modDependencies,
    roundDependencies,
    sinDependencies,
    tanDependencies
} from "mathjs";
import {useDispatch, useMappedState} from "redux-react-hook";
import {AuthState, IEvent, IStore, LastSearch} from "./redux/store/Interfaces";
import {MyDecimal} from "./MyDecimal";
import {
    FromMeInvoicesLoaded,
    InvoiceDeleted,
    InvoicePaymentsLoaded,
    LastSearchBuy,
    LastSearchSell,
    LoadConversations,
    MarkAsReadedEvents,
    PreloadActionTypes,
    PublicInvoicesLoaded,
    ToMeInvoicesLoaded
} from "./redux/actions";
import {
    CancelInvoicePaymentRequest,
    DeleteInvoiceRequest, DeleteInvoiceResponse,
    GetConversationsByIdRequest,
    GetConversationsResponse,
    GetInvoicePaymentsRequest,
    GetInvoicePaymentsResponse,
    GetInvoicesRequest,
    GetInvoicesResponse,
    GetLastAdSearchParamsResponse,
    Invoice,
    InvoicePayment,
    MarkEventsAsReadRequest
} from "./Protos/api_pb";
import {ClientReadableStream, Error} from "grpc-web";
import * as jspb from "google-protobuf";
import grpcWeb from "grpc-web";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {IStrings} from "./localization/MainPage";
import LocalizedStrings, {GlobalStrings} from "react-localization";
import {streamsKeepAliveTimeout} from "./global";

export function useScrollToTop() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init) {
            window.scrollTo(0, 0);
            setInit(true);
        }
    }, [init]);
}

export function useConversations(invoiceId: number | null,
                                 paymentId: number | null,
                                 onRunning: () => void,
                                 onComplete: () => void,
                                 onError: (error: string) => void,
                                 disabled: boolean
) {
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state
        }), []
    );
    const {authState} = useMappedState(mapState);
    const dispatch = useDispatch();
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isRunning || authState === AuthState.NotAuthed || disabled) {
            return;
        }
        setIsRunning(true);
        onRunning();

        async function getAll() {
            let req = new Empty();

            try {
                let res = await TradeGrpcRunAsync<GetConversationsResponse.AsObject>(tradeApiClient.getConversations, req, getToken());
                dispatch(LoadConversations(res.conversationsList));
                onComplete();
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    onError(e.message);
                }
            } finally {
                setIsRunning(false);
            }
        }

        async function getByIds() {
            let req = new GetConversationsByIdRequest();
            if (invoiceId) {
                req.setInvoiceid(invoiceId);
            } else {
                req.setPaymentid(paymentId!);
            }

            try {
                let res = await TradeGrpcRunAsync<GetConversationsResponse.AsObject>(tradeApiClient.getConversationsById, req, getToken());
                dispatch(LoadConversations(res.conversationsList));
                onComplete();
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    onError(e.message);
                }
            } finally {
                setIsRunning(false);
            }
        }

        if (invoiceId || paymentId) {
            // noinspection JSIgnoredPromiseFromCall
            getByIds();
        } else {
            // noinspection JSIgnoredPromiseFromCall
            getAll();
        }


    }, [invoiceId, paymentId, authState, dispatch, isRunning, disabled])
}

export function useLastSearch() {
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            preload: store.preload
        }), []
    );
    const {authState, preload} = useMappedState(mapState);
    const dispatch = useDispatch();
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || preload.lastSearch || isRunning) {
            return;
        }
        setIsRunning(true);

        async function f() {
            let req = new Empty();
            try {
                let res = await TradeGrpcRunAsync<GetLastAdSearchParamsResponse.AsObject>(tradeApiClient.getLastAdSearchParams, req, getToken());
                if (res.lastbuysearchhasvalue) {
                    let lastSearch: LastSearch = {
                        amount: MyDecimal.FromPb(res.lastbuysearch!.amount),
                        country: res.lastbuysearch!.country,
                        currency: res.lastbuysearch!.currency,
                        paymentType: res.lastbuysearch!.paymenttype
                    };
                    dispatch(LastSearchBuy(lastSearch));
                }
                if (res.lastsellsearchhasvalue) {
                    let lastSearch: LastSearch = {
                        amount: MyDecimal.FromPb(res.lastsellsearch!.amount),
                        country: res.lastsellsearch!.country,
                        currency: res.lastsellsearch!.currency,
                        paymentType: res.lastsellsearch!.paymenttype
                    };
                    dispatch(LastSearchSell(lastSearch));
                }
                dispatch({type: PreloadActionTypes.LAST_SEARCH})
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                }
            } finally {
                setIsRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f()
    }, [authState, dispatch, isRunning, preload.lastSearch])
}

export function useDeleteInvoice(invoice: Invoice.AsObject | null,
                                 onRunning: () => void,
                                 onComplete: () => void,
                                 onError: (error: string) => void
) {
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            events: store.invoices.newEvents,
            userId: store.profile.UserId
        }), []
    );
    const {authState, events,} = useMappedState(mapState);
    const dispatch = useDispatch();
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (invoice === null || isRunning || authState === AuthState.NotAuthed) {
            return;
        }
        setIsRunning(true);
        onRunning();

        async function f() {
            let req = new DeleteInvoiceRequest();
            req.setInvoiceid(invoice!.id);

            try {
                let resp = await TradeGrpcRunAsync<DeleteInvoiceResponse.AsObject>(tradeApiClient.deleteInvoice, req, getToken());
                dispatch(InvoiceDeleted(invoice!.id));
                if (!resp.refundisnull) {
                    dispatch(InvoicePaymentsLoaded([resp.paymentrefund!]));
                }
                let ev = events.filter(p => p.invoiceId === invoice!.id);
                if (ev.length > 0) {
                    let req1 = new MarkEventsAsReadRequest();
                    ev.map(p => p.id).forEach(p => req1.addId(p));
                    await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.markEventsAsRead, req1, getToken());
                    dispatch(MarkAsReadedEvents(ev!));
                }
            } catch (e) {
                if (e instanceof GrpcError) {
                    onError(e.message);
                }
                console.log(e.message);
            } finally {
                setIsRunning(false);
                onComplete();
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, invoice, dispatch, isRunning, events])

}

export function useMarkAsReadedEvents(markEvents: IEvent[] | null,
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
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.markEventsAsRead, req, getToken());
                dispatch(MarkAsReadedEvents(markEvents!));
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError)
                    onError(e.message);
            } finally {
                setMarkEventsAsReadedRunning(false);
                onComplete();
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, markEvents, dispatch, markEventsAsReadedRunning]);
}

export function useCancelInvoicePayment(paymentId: number | null,
                                        onRunning: () => void,
                                        onComplete: (isError: boolean) => void,
                                        onError: (error: string) => void) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            invoices: store.invoices,
        }), []
    );
    const {authState, invoices} = useMappedState(mapState);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || paymentId === null || isRunning) {
            return;
        }
        setIsRunning(true);
        onRunning();

        async function f() {
            let req = new CancelInvoicePaymentRequest();
            req.setPaymentid(paymentId!);

            try {
                let resp = await TradeGrpcRunAsync<InvoicePayment.AsObject>(tradeApiClient.cancelInvoicePayment, req, getToken());
                dispatch(InvoicePaymentsLoaded([resp]));

                let evts = invoices.newEvents.filter(p => p.invoicePayment && p.invoicePayment.id === paymentId);
                if (evts.length > 0) {
                    let req = new MarkEventsAsReadRequest();
                    evts!.map(p => p.id).forEach(p => req.addId(p));
                    await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.markEventsAsRead, req, getToken());
                    dispatch(MarkAsReadedEvents(evts!));
                }

                onComplete(false);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    onError(e.message);
                }
                onComplete(true);
            } finally {
                setIsRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, paymentId, dispatch, isRunning, invoices.newEvents]);
}

export function useInvoicePayments(isRun: boolean,
                                   lastId: number | null,
                                   count: number,
                                   paymentId: number | null,
                                   isToMe: boolean | null,
                                   onRunning: () => void,
                                   onComplete: () => void,
                                   onError: (error: string) => void,
                                   force?: boolean
) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            invoices: store.invoices,
            userId: store.profile.UserId
        }), []
    );
    const {authState, invoices, userId} = useMappedState(mapState);
    const [getPaymentsRunning, setGetPaymentsRunning] = useState(false);

    if (paymentId !== null && invoices.toMeInvoicePayments != null && invoices.fromMeInvoicePayments != null && (force === undefined || !force)) {
        let i = invoices.fromMeInvoicePayments.concat(invoices.toMeInvoicePayments);
        if (i.map(p => p.id).includes(paymentId)) {
            isRun = false;
        }
    }
    if (count === 0) {
        isRun = false;
    }

    useEffect(() => {
        if (!isRun || getPaymentsRunning || authState === AuthState.NotAuthed || userId === "") {
            return;
        }
        onRunning();
        setGetPaymentsRunning(true);

        async function f() {
            let req = new GetInvoicePaymentsRequest();
            req.setCount(count);
            if (lastId !== null) {
                req.setLastid(lastId);
            } else {
                req.setLastid(0);
            }
            if (paymentId !== null) {
                req.setPaymentid(paymentId);
            } else {
                req.setPaymentid(0);
            }
            if (isToMe !== null) {
                req.setIstomehasvalue(true);
                req.setIstome(isToMe);
            }

            try {
                let resp = await TradeGrpcRunAsync<GetInvoicePaymentsResponse.AsObject>(tradeApiClient.getInvoicePayments, req, getToken());
                dispatch(InvoicePaymentsLoaded(resp.paymentsList));
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    onError(e.message);
                }
            } finally {
                setGetPaymentsRunning(false);
                onComplete();
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [isRun, lastId, count, paymentId, isToMe, authState, invoices, userId, dispatch, getPaymentsRunning])
}

export function useInvoices(isRun: boolean,
                            lastId: number,
                            count: number,
                            isOwner: boolean | null,
                            statuses: Array<Invoice.InvoiceStatus>,
                            isPrivate: boolean | null,
                            id: number | null,
                            toUser: string | null,
                            onRunning: () => void,
                            onComplete: (invoices: Invoice.AsObject[] | null) => void,
                            onError: (error: string) => void,
) {
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            userId: store.profile.UserId,
        }), []
    );
    const {authState, userId} = useMappedState(mapState);
    const [getInvoicesRunning, setGetInvoicesRunning] = useState(false);

    if (userId === "" || count === 0 || getInvoicesRunning) {
        isRun = false;
    }

    useEffect(() => {
        async function f() {
            if (!isRun) {
                return;
            }
            if (authState === AuthState.NotAuthed)
                return;
            if (getInvoicesRunning)
                return;
            setGetInvoicesRunning(true);
            onRunning();

            let invoices: Invoice.AsObject[] | null = null;
            let req = new GetInvoicesRequest();
            req.setCount(count);
            req.setLastid(lastId);
            if (isOwner !== null) {
                req.setIsownerhasvalue(true);
                req.setIsowner(isOwner);
            }
            req.setStatusesList(statuses);
            if (isPrivate !== null) {
                req.setIsprivatehasvalue(true);
                req.setIsprivate(isPrivate);
            }
            if (id !== null) {
                req.setId(id);
            }
            if (toUser !== null) {
                req.setTouser(toUser);
            }


            try {
                let resp = await TradeGrpcRunAsync<GetInvoicesResponse.AsObject>(tradeApiClient.getInvoices, req, getToken());
                let fromMe = new Array<Invoice.AsObject>();
                let toMe = new Array<Invoice.AsObject>();
                let pub = new Array<Invoice.AsObject>();
                invoices = resp.invoicesList;
                for (let i of resp.invoicesList) {
                    if (!i.isprivate) {
                        pub.push(i);
                    } else if (userId === i.owner!.id) {
                        fromMe.push(i);
                    } else {
                        toMe.push(i);
                    }
                }
                dispatch(FromMeInvoicesLoaded(fromMe));
                dispatch(ToMeInvoicesLoaded(toMe));
                dispatch(PublicInvoicesLoaded(pub));
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    onError(e.message);
                }
            } finally {
                setGetInvoicesRunning(false);
                onComplete(invoices);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, isRun, lastId.toString(), count, isOwner, isPrivate, toUser, id, userId, getInvoicesRunning, dispatch])
}

export function initMathjs(variables: Map<string, string>) {
    const config = {};
    const math = create({
        modDependencies,
        minDependencies,
        maxDependencies,
        meanDependencies,
        medianDependencies,
        absDependencies,
        sinDependencies,
        cosDependencies,
        tanDependencies,
        ceilDependencies,
        floorDependencies,
        roundDependencies,
        divideDependencies,
        evaluateDependencies
    }, config);
    let vars: any = {};
    variables.forEach((k, v) => {
        vars[v] = parseFloat(k)
    });
    if (math.import !== undefined) {
        math.import({
            ...vars,
            trunc: Math.trunc,
            sgn: Math.sign

        }, {});
        math.import({
            'import': function () {
                throw new Error('Function import is disabled')
            },
            'createUnit': function () {
                throw new Error('Function createUnit is disabled')
            },
            'simplify': function () {
                throw new Error('Function simplify is disabled')
            },
            'derivative': function () {
                throw new Error('Function derivative is disabled')
            }
        }, {override: true})
    }
    return math;
}

export function useMathjs(callback: (math: ReturnType<typeof initMathjs> | null, error: string) => void, run: boolean) {
    const mapState = useCallback(
        (store: IStore) => ({
            catalog: store.catalog
        }), []
    );
    const {catalog} = useMappedState(mapState);

    useEffect(() => {
        if (!run || catalog.variables === null)
            return;
        let m = new Map<string, string>();
        catalog.variables.forEach((value: MyDecimal, key: string) => {
            m.set(key, value.toString());
        });
        callback(initMathjs(m), "");
    }, [catalog.variables, run]);
}

interface hasKeepAlive {
    getKeepalive: () => boolean;
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
            if (!disabled) {
                setTimeout(refreshCallback, timerSeconds * 1000);
            }
        }, timerSeconds * 1000);
        setTimer(t);
    }, [timer, timerSeconds, disabled, eventsStreamStarted])

    // noinspection ExceptionCaughtLocallyJS
    useEffect(() => {
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
        if (eventsStreamStarted && streamRef.current !== null && streamForUser === profile.UserId && health) {
            return;
        }
        if (eventsStreamStarting) {
            return;
        }
        if (streamStartCounter >= counter && streamForUser === profile.UserId && health) {
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
            if (streamRef.current !== null) {
                streamRef.current?.cancel();
                streamRef.current = null;
            }
            if (eventsStreamStarted) {
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
                let deadline = new Date();
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
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(`${name} Null in create function result.`);
                }

                setStreamForUser(profile.UserId);
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
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState,
        profile.UserId,
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


export function useStrings<TData extends GlobalStrings<any>>(data: TData) {
    const mapState = useCallback(
        (store: IStore) => ({
            lang: store.lang.Lang
        }), []
    );
    const {lang} = useMappedState(mapState);
    const [strings, setStrings] = useState(new LocalizedStrings(data));

    useEffect(() => {
        let s: IStrings = new LocalizedStrings(data);
        s.setLanguage(lang);
        setStrings(s);
    }, [lang, data]);

    return strings;
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

