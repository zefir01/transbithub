import * as React from "react";
import {FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Alert, Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Row
} from "reactstrap";
import {CurrenciesCatalog} from "../Catalog";
import {AuthState, IImage, IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {DecimalInput} from "../DecimalInput";
import {Decimal} from 'decimal.js';
import {LoadingBtn} from "../LoadingBtn";
import {
    CreateInvoiceRequest, CreateInvoiceSecretRequest,
    Invoice, InvoiceSecret,
    IsUserExistRequest, IsUserExistResponse,
    UpdatePublicInvoiceRequest, Webhook
} from "../Protos/api_pb";
import {createImage, getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {Loading} from "../Loading";
import {MyDecimal} from "../MyDecimal";
import {data, IStrings} from "../localization/Invoices/CreateInvoice";
import {errors} from "../localization/Errors";
import {InvoiceCreated, PublicInvoiceUpdated, UploadImages} from "../redux/actions";
import {Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {calcValues, calcValuesInvoice, IInvoiceCalculatedValues} from "./InvoiceCalc";
import {Col4, invoiceFeePercent, MB10, minimalAmountBtc, pageSize} from "../global";
import {createMatchSelector} from "connected-react-router";
import {useInvoices, useStrings} from "../Hooks";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {ImagePreview} from "../MainPages/ImagePreview";
import {useImages} from "../IDBLoader";
import {SecretsList} from "./Secrets/SecretsList";
import {IntegrationParams, InvoiceIntegration} from "./InvoiceIntergration";

const plusLookup: IconLookup = {prefix: 'fas', iconName: 'plus'};
const plusIconDefinition: IconDefinition = findIconDefinition(plusLookup);
const minusLookup: IconLookup = {prefix: 'fas', iconName: 'minus'};
const minusIconDefinition: IconDefinition = findIconDefinition(minusLookup);

library.add(fas);
const attacheLookup: IconLookup = {prefix: 'fas', iconName: 'paperclip'};
const attacheIconDefinition: IconDefinition = findIconDefinition(attacheLookup);

interface IMyRowProps {
    content1?: ReactNode;
    content2?: ReactNode;
    content3?: ReactNode;

}

const MyRow: FunctionComponent<IMyRowProps> = (props) => {

    return (
        <Row className="pt-3">
            <Col sm={2} className="font-weight-bold">
                {props.content1}
            </Col>
            <Col sm={4}>
                {props.content2}
            </Col>
            <Col sm={6}>
                <div className="text-muted">
                    {props.content3}
                </div>
            </Col>
        </Row>
    );
};

export function CreateInvoice() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            vars: store.catalog.variables,
            balance: store.balances.Balance,
            id: getId(store),
            invoices: store.invoices,
            preload: store.preload,
            lastSearch: store.profile.LastSearchBuy
        }), []
    );
    const {authState, vars, balance, id, invoices, preload, lastSearch} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [isPrivate, setIsPrivate] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);
    const [currency, setCurrency] = useState("USD");
    const [priceVar, setPriceVar] = useState("Average");
    const [error, setError] = useState("");
    const [timeUnits, setTimeUnits] = useState("day");
    const [timeError, setTimeError] = useState(false);
    const [time, setTime] = useState("30");
    const [amount, setAmount] = useState<Decimal | null>(null);
    const [priceError, setPriceError] = useState(true);
    const [userNameError, setUserNameError] = useState(true);
    const [checkUser, setCheckUser] = useState(false);
    const [checkUserRunning, setCheckUserRunning] = useState(false);
    const [userNameValid, setUserNameValid] = useState(false);
    const [isBaseCryptoCurrency, setIsBaseCryptoCurrency] = useState(false);
    const [create, setCreate] = useState(false);
    const [createRunning, setCreateRunning] = useState(false);
    const [createError, setCreateError] = useState("");
    const [created, setCreated] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [piecesMin, setPiecesMin] = useState<Decimal | null>(new Decimal(1));
    const [piecesMax, setPiecesMax] = useState<Decimal | null>(new Decimal(1));
    const [resultValues, setResultValues] = useState<IInvoiceCalculatedValues | null>(null);
    const [limitLiquidity, setLimitLiquidity] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [init, setInit] = useState(false);
    const [invoice, setInvoice] = useState<Invoice.AsObject | null>(null);
    const [update, setUpdate] = useState(false);
    const [updateRunning, setUpdateRunning] = useState(false);
    const [updated, setUpdated] = useState<number | null>(null);
    const [priceChanged, setPriceChanged] = useState(false);
    const [imagesIds, setImagesIds] = useState<string[]>([]);
    const [secrets, setSecrets] = useState<InvoiceSecret.AsObject[]>([]);
    const [integration, setIntegration] = useState<IntegrationParams | null>();

    const inputRef = useRef<HTMLInputElement>(null);


    const currenciesMemo = useMemo(() =>
            Array.from(new Set(CurrenciesCatalog.values())).sort().map(p => {
                return (
                    <option key={p}
                            value={p}>{p}</option>
                )
            })

        , []
    );

    let loadedImages = useImages(imagesIds, true);

    const isBalanceErrorCb=useCallback(()=>{
        if (!isPrivate) {
            return false;
        }
        if (balance === undefined) {
            return true;
        }
        let amount = MyDecimal.FromPb(balance!.confirmed);
        if (resultValues === null) {
            return true;
        }
        if (resultValues.piecePriceCrypto === null) {
            return false;
        }
        let fee = resultValues.piecePriceCrypto.dividedBy(100).mul(invoiceFeePercent);
        return amount.lessThan(fee);
    }, [balance, isPrivate, resultValues])
    const isBalanceError=isBalanceErrorCb();

    const isPiecesErrorCb=useCallback(()=>{
        if (piecesMin === null || piecesMax === null) {
            return false;
        }
        return piecesMin!.greaterThan(piecesMax!);
    }, [piecesMin, piecesMax])
    const isPiecesError=isPiecesErrorCb();

    const isErrorCb=useCallback(()=>{
        let error = false;
        if (isPrivate) {
            if (userName === "") {
                error = true;
            }
            if (userNameError) {
                error = true;
            }
        }
        if (amount === null) {
            error = true;
        }
        if (timeError) {
            error = true;
        }
        if (isPiecesError) {
            return true;
        }
        if (comment.length > 1000) {
            return true;
        }
        if (isBalanceError) {
            return true;
        }
        if (amount !== null && amount.eq(0)) {
            return true;
        }
        if (loadedImages.length !== imagesIds.length) {
            return true;
        }
        if (!integration || integration.error) {
            return true;
        }
        return error;
    }, [amount, comment.length, imagesIds.length, integration, isBalanceError, isPiecesError, isPrivate, loadedImages.length,
        timeError, userName, userNameError])
    const isError=isErrorCb();

    useEffect(() => {
        function getVarPrice() {
            let vprice;
            if (priceVar === "Average") {
                vprice = vars!.get(`AVG_${currency}`)!;
            } else {
                let fiatRate = vars!.get(currency)!;
                vprice = vars!.get(priceVar)!.mul(fiatRate);
            }
            return vprice;
        }

        if (id === null && vars && preload && !priceChanged) {
            if (isBaseCryptoCurrency) {
                setAmount(new Decimal(minimalAmountBtc));
            } else {
                let vprice = getVarPrice();
                let min = getMinimalAmountFiat(vprice);
                setAmount(min);
            }
        }
    }, [id, vars, preload, priceChanged, priceVar, currency, isBaseCryptoCurrency])

    useEffect(() => {
        if (preload.lastSearch && lastSearch !== null && lastSearch.currency !== "USD") {
            setCurrency(lastSearch.currency);
            ///////////////////////////
        }
    }, [preload.lastSearch, lastSearch]);

    useEffect(() => {
        if (userName === null || userName.length === 0 || checkUserRunning || !checkUser || authState === AuthState.NotAuthed)
            return;
        setCheckUserRunning(true);
        setUserNameError(false);
        setUserNameValid(false);
        setCheckUser(false);

        async function f() {
            let req = new IsUserExistRequest();
            req.setUsername(userName!);

            try {
                let resp = await TradeGrpcRunAsync<IsUserExistResponse.AsObject>(tradeApiClient.isUserExist, req, getToken());
                if (resp.isexist) {
                    setUserNameValid(true);
                    setUserNameError(false);
                } else {
                    setUserNameValid(false);
                    setUserNameError(true);
                }
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setCheckUserRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [checkUser, authState, checkUserRunning, userName]);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || !create || createRunning || isError)
            return;
        setCreate(false);
        setCreateRunning(true);

        async function f() {
            let req = new CreateInvoiceRequest();
            req.setPrice(new MyDecimal(amount).ToPb());
            req.setUsername(userName === null ? "" : userName);
            let val = parseInt(time);
            let minutes = 0;
            if (timeUnits === "min") {
                minutes = val;
            } else if (timeUnits === "hour") {
                minutes = val * 60;
            } else if (timeUnits === "day") {
                minutes = val * 1440;
            }
            req.setTtlminutes(minutes);
            req.setIsprivate(isPrivate);
            req.setIsbasecrypto(isBaseCryptoCurrency);
            req.setFiatcurrency(currency);
            req.setPricevariable(priceVar);
            req.setPiecesmin(piecesMin!.toNumber());
            req.setPiecesmax(piecesMax!.toNumber());
            req.setComment(comment);
            req.setLimitliquidity(limitLiquidity);
            req.setImagesList(imagesIds);
            if (integration && !integration.disabled) {
                if (integration.redirect !== "") {
                    req.setRedirect(integration.redirect);
                } else if (integration.webhook) {
                    let webhook = new Webhook();
                    webhook.setUrl(integration.webhook.url);
                    webhook.setClientcrt(integration.webhook.clientCert);
                    webhook.setClientkey(integration.webhook.clientKey);
                    webhook.setServercrt(integration.webhook.serverCert);
                    webhook.setRequired(integration.webhook.required);
                    req.setWebhook(webhook);
                }
            } else {
                req.setNointegration(true);
            }
            for (let sec of secrets) {
                let r = new CreateInvoiceSecretRequest();
                r.setImagesList(sec.imagesList);
                r.setText(sec.text);
                req.addSecrets(r);
            }

            try {
                let resp = await TradeGrpcRunAsync<Invoice.AsObject>(tradeApiClient.createInvoice, req, getToken());
                dispatch(InvoiceCreated(resp));
                setCreated(resp.id);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setCreateError(e.message);
                }
            } finally {
                setCreateRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, create, amount, comment, createRunning, currency, dispatch, imagesIds, integration, isError,
    isBaseCryptoCurrency, isPrivate, limitLiquidity, piecesMax, piecesMin, priceVar, secrets, time, timeUnits, userName]);

    useEffect(() => {
        let val = calcValues(amount, currency, priceVar, piecesMin, piecesMax, isBaseCryptoCurrency, isPrivate, vars);
        setResultValues(val);
    }, [amount, currency, priceVar, piecesMin, piecesMax, isBaseCryptoCurrency, isPrivate, vars]);

    const getInvoiceByIdCb=useCallback(()=>{
        let arr = new Array<Invoice.AsObject>();
        if (invoices.toMeInvoices !== null) {
            arr = arr.concat(invoices.toMeInvoices);
        }
        if (invoices.fromMeInvoices !== null) {
            arr = arr.concat(invoices.fromMeInvoices);
        }
        if (invoices.publicInvoices !== null) {
            arr = arr.concat(invoices.publicInvoices);
        }
        // eslint-disable-next-line eqeqeq
        let inv = arr.find(p => p.id == id);
        if (inv !== undefined) {
            return inv;
        }
        return null;
    }, [id, invoices.fromMeInvoices, invoices.publicInvoices, invoices.toMeInvoices])
    const getInvoiceById=getInvoiceByIdCb();

    function isPreloadDone() {
        return preload.publicInvoices && preload.fromMeInvoices;
    }

    useInvoices(id !== null && isPreloadDone() && !invoice, 0, pageSize * 2, true, [], false, id, null,
        () => setInvoiceLoading(true),
        () => {
            setInvoiceLoading(false);
            if (error === "") {
                setInit(true);
                setInvoice(getInvoiceById);
            }
        },
        (e) => setError(e));

    useEffect(() => {
        if (id === null || invoice !== null) {
            return;
        }
        let inv = getInvoiceById;
        if (inv !== null) {
            setInvoice(inv);
        }

    }, [invoices, id, invoice, getInvoiceById])

    useEffect(() => {
        if (invoice === null) {
            return;
        }
        let val = calcValuesInvoice(invoice, vars);
        setResultValues(val);
        setIsPrivate(invoice.isprivate);
        setUserName(invoice.targetuser?.username ?? "");
        setUserNameError(false);
        setUserNameValid(true);
        setCurrency(invoice.fiatcurrency);
        setPriceVar(invoice.pricevariable);
        setAmount(MyDecimal.FromPb(invoice.price));
        setPriceError(false);
        setIsBaseCryptoCurrency(invoice.isbasecrypto);
        setPiecesMin(new Decimal(invoice.piecesmin));
        setPiecesMax(new Decimal(invoice.piecesmax))
        setLimitLiquidity(invoice.limitliquidity);
        setComment(invoice.comment);
        setImagesIds(invoice.imagesList);

    }, [invoice, preload, amount, comment, createRunning, currency, dispatch, imagesIds, integration,
        isBaseCryptoCurrency, isPrivate, limitLiquidity, piecesMax, piecesMin, priceVar, secrets, time, timeUnits, userName, vars])

    useEffect(() => {
        if (!update || updateRunning || authState !== AuthState.Authed) {
            return;
        }
        setUpdateRunning(true);
        setUpdate(false);

        async function f() {
            let req = new UpdatePublicInvoiceRequest();
            req.setInvoiceid(invoice!.id);
            req.setPrice(new MyDecimal(amount).ToPb());
            req.setIsbasecrypto(isBaseCryptoCurrency);
            req.setFiatcurrency(currency);
            req.setPricevariable(priceVar);
            req.setPiecesmin(piecesMin!.toNumber());
            req.setPiecesmax(piecesMax!.toNumber());
            req.setComment(comment);
            req.setLimitliquidity(limitLiquidity);
            req.setImagesList(imagesIds);
            if (integration && !integration.disabled) {
                if (integration.redirect !== "") {
                    req.setRedirect(integration.redirect);
                } else if (integration.webhook) {
                    let webhook = new Webhook();
                    webhook.setUrl(integration.webhook.url);
                    webhook.setClientcrt(integration.webhook.clientCert);
                    webhook.setClientkey(integration.webhook.clientKey);
                    webhook.setServercrt(integration.webhook.serverCert);
                    webhook.setRequired(integration.webhook.required);
                    req.setWebhook(webhook);
                }
            } else {
                req.setNointegration(true);
            }

            try {
                let resp = await TradeGrpcRunAsync<Invoice.AsObject>(tradeApiClient.updatePublicInvoice, req, getToken());
                dispatch(PublicInvoiceUpdated(resp));
                setUpdated(resp.id);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setCreateError(e.message);
                }
            } finally {
                setUpdateRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [update, authState, amount, comment, createRunning, currency, dispatch, imagesIds, integration, invoice, updateRunning,
        isBaseCryptoCurrency, isPrivate, limitLiquidity, piecesMax, piecesMin, priceVar, secrets, time, timeUnits, userName])


    function getPriceInfo() {
        switch (priceVar) {
            case "Average":
                return strings.avgInfo;
            default:
                let name = priceVar.split("_")[0];
                name = name[0].toUpperCase() + name.slice(1);
                return strings.exchInfo + name;
        }
    }


    function getResultValues() {
        if (resultValues == null) {
            return null;
        }
        if (isBaseCryptoCurrency) {
            if (amount === null || priceError)
                return null;
            return (
                <>
                    <br/>
                    {!isPiecesError && !isPrivate ?
                        <>
                            {strings.cryptoPiecePrice}
                            <span className="font-weight-bold text-success">
                                {resultValues.piecePriceCryptoStr} BTC
                            </span>
                            <br/>
                            {strings.minPiecePriceCrypto}
                            <span className="font-weight-bold text-success">
                                {resultValues.amountCryptoMinStr} BTC
                            </span>
                            <br/>
                            {strings.maxPicePriceCrypto}
                            <span className="font-weight-bold text-success">
                                {resultValues.amountCryptoMaxStr} BTC
                            </span>
                        </>
                        :
                        <>
                            {strings.amountCrypto}
                            <span className="font-weight-bold text-success">
                                {resultValues.piecePriceCryptoStr} BTC
                            </span>
                        </>
                    }
                </>
            )
        }
        if (amount === null || priceError)
            return (
                <>
                    {strings.priceBtc}
                    <span className="font-weight-bold text-success">
                        {resultValues.variablePriceStr} {currency}
                    </span>
                </>
            );
        return (
            <>
                {strings.priceBtc}
                <span className="font-weight-bold text-success">
                    {resultValues.variablePriceStr} {currency}
                </span>
                <br/>
                {isPrivate ? strings.amountCrypto : strings.cryptoPiecePrice}
                <span className="font-weight-bold text-success">
                            {resultValues.piecePriceCryptoStr} BTC
                        </span>
                <br/>
                {!isPiecesError && !isPrivate ?
                    <>
                        {strings.minPiecePriceCrypto}
                        <span className="font-weight-bold text-success">
                            {resultValues.amountCryptoMinStr} BTC
                        </span>
                        <br/>
                        {strings.maxPicePriceCrypto}
                        <span className="font-weight-bold text-success">
                            {resultValues.amountCryptoMaxStr} BTC
                        </span>
                        <br/>
                    </>
                    : null
                }
                {isPrivate ? strings.amountFiat : strings.fiatPiecePrice}
                <span className="font-weight-bold text-success">
                    {amount.toString()} {currency}
                </span>
                <br/>
                {!isPiecesError && !isPrivate ?
                    <>
                        {strings.minFiatAmount}
                        <span className="font-weight-bold text-success">
                            {resultValues.amountCryptoMinStr} {currency}
                        </span>
                        <br/>
                        {strings.maxFiatAmount}
                        <span className="font-weight-bold text-success">
                            {resultValues.amountCryptoMaxStr} {currency}
                        </span>
                    </>
                    : null
                }
            </>
        )
    }


    function getId(store: IStore) {
        const matchSelector = createMatchSelector("/invoices/create/:id(\\d+)");
        const match = matchSelector({router: store.router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id !== undefined)
            return id;
        return null;
    }

    function getMinimalAmountFiat(price: Decimal | null): Decimal | null {
        if (price === null) {
            return null;
        }
        let minFiat = price.mul(minimalAmountBtc).toDecimalPlaces(2, 2);
        if (minFiat.lessThan(0.01)) {
            minFiat = new Decimal(0.01);
        }
        return minFiat;
    }

    function getMinimalAmount() {
        if (isBaseCryptoCurrency) {
            return minimalAmountBtc;
        }
        if (!resultValues?.variablePrice) {
            return undefined;
        }
        let min = getMinimalAmountFiat(resultValues?.variablePrice);
        if (!min) {
            return undefined;
        }
        return min;
    }

    async function onFile(data: DataTransfer) {
        let arr = new Array<IImage>();
        let ids = Array.from(imagesIds);
        for (let i of data.items) {
            if (ids.length === 10) {
                break;
            }
            let f = await createImage(i.getAsFile()!)
            arr.push(f);
            ids.push(f.id);
        }
        setImagesIds(ids);
        dispatch(UploadImages(arr));
    }

    if (authState !== AuthState.Authed
        || !preload.lastSearch
        || vars === undefined
        || vars === null
        || vars.size === 0
        || (id !== null && invoiceLoading))
        return (
            <Container>
                <Row>
                    <Col className="pt-3">
                        <Loading/>
                    </Col>
                </Row>
            </Container>
        );
    if (id !== null && !invoiceLoading && invoice === null && init) {
        return (
            <Container>
                <Row>
                    <Col className="pt-3">
                        <Alert color="danger">{errors("Invoice not found.")}</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (created !== null) {
        return <Redirect push to={`/invoices/created/${created}`}/>
    }
    if (updated !== null) {
        return <Redirect push to={`/invoices/updated/${updated}`}/>
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Card className="border-top-0 rounded-0">
                        <CardHeader>
                            {invoice === null ?
                                <h5>{strings.title}</h5>
                                :
                                <h5>{strings.titleUpdate + " " + invoice.id}</h5>
                            }
                            <p>{strings.info}</p>
                        </CardHeader>
                        <CardBody>
                            {
                                error !== "" ?
                                    <Row>
                                        <Col>
                                            <Alert color="danger">
                                                {errors(error)}
                                            </Alert>
                                        </Col>
                                    </Row>
                                    : null
                            }
                            {invoice === null ?
                                <MyRow content1={strings.type}
                                       content2={
                                           <>
                                               <FormGroup check>
                                                   <Label>
                                                       <Input type="radio" name="typeRadios" checked={isPrivate}
                                                              onClick={() => setIsPrivate(true)}/>
                                                       {strings.private}
                                                   </Label>
                                               </FormGroup>
                                               <FormGroup check>
                                                   <label>
                                                       <Input type="radio" name="typeRadios" checked={!isPrivate}
                                                              onClick={() => setIsPrivate(false)}/>
                                                       {strings.public}
                                                   </label>
                                               </FormGroup>
                                           </>
                                       }
                                       content3={
                                           <>
                                               {strings.typeInfo1}
                                               <br/>
                                               {strings.typeInfo2}
                                           </>
                                       }
                                />
                                : null
                            }
                            <MyRow content1={strings.baseCurrency}
                                   content2={
                                       <>
                                           <FormGroup check>
                                               <Label>
                                                   <Input type="radio" name="typeRadios1" checked={isBaseCryptoCurrency}
                                                          onClick={() => {
                                                              setIsBaseCryptoCurrency(true);
                                                          }}/>
                                                   {strings.cryptoCurrency}
                                               </Label>
                                           </FormGroup>
                                           <FormGroup check>
                                               <label>
                                                   <Input type="radio" name="typeRadios1"
                                                          checked={!isBaseCryptoCurrency}
                                                          onClick={() => {
                                                              setIsBaseCryptoCurrency(false);
                                                          }}/>
                                                   {strings.fiatCurrency}
                                               </label>
                                           </FormGroup>
                                       </>
                                   }
                                   content3={
                                       <>
                                           {strings.currencyInfo1}
                                           <br/>
                                           {strings.currencyInfo2}
                                       </>
                                   }
                            />
                            {isPrivate ?
                                <MyRow content1={strings.partner}
                                       content2={
                                           <InputGroup>
                                               <Input onInput={event => {
                                                   setUserName(event.currentTarget.value);
                                                   setUserNameError(false);
                                                   setUserNameValid(false);
                                               }}
                                                      invalid={userNameError}
                                                      valid={userNameValid}
                                                      value={userName ?? ""}
                                               />
                                               <InputGroupAddon addonType="append">
                                                   <LoadingBtn loading={checkUserRunning} color="warning" outline
                                                               onClick={() => {
                                                                   setCheckUser(true);
                                                               }}>
                                                       {strings.check}
                                                   </LoadingBtn>
                                               </InputGroupAddon>
                                           </InputGroup>
                                       }
                                       content3={strings.partnerInfo}

                                />
                                : null
                            }
                            {
                                isBaseCryptoCurrency ?
                                    <MyRow content1={isPrivate ? strings.amount : strings.price}
                                           content2={
                                               <>
                                                   <InputGroup>
                                                       <DecimalInput defaultsErrors={true}
                                                                     minimalValue={getMinimalAmount()}
                                                                     value={amount}
                                                                     maxDecimals={8}
                                                                     onErrorChanged={val => {
                                                                         setPriceError(val);
                                                                     }}
                                                                     onInput={a => {
                                                                         setAmount(a);
                                                                         setPriceChanged(true);
                                                                     }}/>
                                                       <InputGroupAddon addonType="append">
                                                           <InputGroupText>BTC</InputGroupText>
                                                       </InputGroupAddon>
                                                   </InputGroup>
                                                   {isBalanceError ?
                                                       <Alert color="danger">
                                                           {strings.balanceError}
                                                       </Alert>
                                                       : null
                                                   }
                                               </>
                                           }
                                           content3={strings.priceInfo + getMinimalAmount()?.toString() + "BTC"}
                                    />
                                    :
                                    <MyRow content1={isPrivate ? strings.amount : strings.price}
                                           content2={
                                               <>
                                                   <InputGroup>
                                                       <DecimalInput defaultsErrors={true}
                                                                     minimalValue={getMinimalAmount()}
                                                                     value={amount}
                                                                     maxDecimals={2}
                                                                     onErrorChanged={val => {
                                                                         setPriceError(val);
                                                                     }}
                                                                     onInput={a => {
                                                                         setAmount(a);
                                                                         setPriceChanged(true);
                                                                     }}/>
                                                       <InputGroupAddon addonType="append">
                                                           <select key="currency" className="select form-control"
                                                                   onChange={event => {
                                                                       setCurrency(event.currentTarget.value);
                                                                   }
                                                                   }
                                                                   value={currency}
                                                           >
                                                               {currenciesMemo}
                                                           </select>
                                                       </InputGroupAddon>
                                                   </InputGroup>
                                                   {isBalanceError ?
                                                       <Alert color="danger">
                                                           {strings.balanceError}
                                                       </Alert>
                                                       : null
                                                   }
                                               </>
                                           }
                                           content3={strings.priceInfo2 + getMinimalAmount()?.toString() + currency}
                                    />
                            }
                            {
                                isPrivate ?
                                    <MyRow content1={strings.ttl}
                                           content2={
                                               <InputGroup>
                                                   <Input value={time}
                                                          invalid={timeError}
                                                          onInput={event => {
                                                              let minutes = 0;
                                                              setTime(event.currentTarget.value);
                                                              let val = parseInt(event.currentTarget.value);
                                                              if (isNaN(val)) {
                                                                  setTimeError(true);
                                                                  return;
                                                              }

                                                              if (timeUnits === "min") {
                                                                  minutes = val;
                                                              } else if (timeUnits === "hour") {
                                                                  minutes = val * 60;
                                                              } else if (timeUnits === "day") {
                                                                  minutes = val * 1440;
                                                              }
                                                              if (minutes > 1440 * 30 || minutes < 15) {
                                                                  setTimeError(true);
                                                              } else {
                                                                  setTimeError(false);
                                                              }
                                                          }
                                                          }/>
                                                   <InputGroupAddon addonType="append">
                                                       <select defaultValue={timeUnits} className="select form-control"
                                                               onChange={event => setTimeUnits(event.currentTarget.value)}>
                                                           <option value="min">{strings.minute}</option>
                                                           <option value="hour">{strings.hour}</option>
                                                           <option value="day">{strings.day}</option>
                                                       </select>
                                                   </InputGroupAddon>
                                               </InputGroup>
                                           }
                                           content3={strings.ttlInfo}
                                    />
                                    : null
                            }
                            {isPrivate ? null :
                                <>
                                    <MyRow content1={strings.minPieces}
                                           content2={
                                               <InputGroup>
                                                   <DecimalInput minimalValue={1}
                                                                 intOnly={true}
                                                                 value={piecesMin}
                                                                 forceError={isPiecesError}
                                                                 onInput={(value) => {
                                                                     setPiecesMin(value);
                                                                 }
                                                                 }/>
                                                   <InputGroupAddon addonType="append">
                                                       <Button color="secondary" outline
                                                               onClick={() => {
                                                                   if (piecesMin === null) {
                                                                       setPiecesMin(new Decimal(1));
                                                                       return;
                                                                   }
                                                                   if (piecesMin!.eq(1)) {
                                                                       return;
                                                                   }
                                                                   setPiecesMin(piecesMin!.minus(1));
                                                               }}
                                                       >
                                                           <FontAwesomeIcon
                                                               icon={minusIconDefinition}/>
                                                       </Button>
                                                       <Button color="secondary" outline
                                                               onClick={() => {
                                                                   if (piecesMin === null) {
                                                                       setPiecesMin(new Decimal(1));
                                                                       return;
                                                                   }
                                                                   setPiecesMin(piecesMin!.plus(1));
                                                               }}
                                                       >
                                                           <FontAwesomeIcon
                                                               icon={plusIconDefinition}/>
                                                       </Button>
                                                   </InputGroupAddon>
                                               </InputGroup>
                                           }
                                           content3={strings.minPiecesInfo}
                                    />
                                    <MyRow content1={strings.maxPieces}
                                           content2={
                                               <InputGroup>
                                                   <DecimalInput minimalValue={1}
                                                                 intOnly={true}
                                                                 value={piecesMax}
                                                                 forceError={isPiecesError}
                                                                 onInput={(value) => {
                                                                     setPiecesMax(value);
                                                                 }
                                                                 }/>
                                                   <InputGroupAddon addonType="append">
                                                       <Button color="secondary" outline
                                                               onClick={() => {
                                                                   if (piecesMax === null) {
                                                                       setPiecesMax(new Decimal(1));
                                                                       return;
                                                                   }
                                                                   if (piecesMax!.eq(1)) {
                                                                       return;
                                                                   }
                                                                   setPiecesMax(piecesMax!.minus(1));
                                                               }}
                                                       >
                                                           <FontAwesomeIcon
                                                               icon={minusIconDefinition}/>
                                                       </Button>
                                                       <Button color="secondary" outline
                                                               onClick={() => {
                                                                   if (piecesMax === null) {
                                                                       setPiecesMax(new Decimal(1));
                                                                       return;
                                                                   }
                                                                   setPiecesMax(piecesMax!.plus(1));
                                                               }}
                                                       >
                                                           <FontAwesomeIcon
                                                               icon={plusIconDefinition}/>
                                                       </Button>
                                                   </InputGroupAddon>
                                               </InputGroup>
                                           }
                                           content3={strings.maxPiecesInfo}
                                    />
                                </>
                            }
                            {
                                !isBaseCryptoCurrency ?
                                    <>
                                        <MyRow content1={strings.useExchRate}
                                               content2={
                                                   <Input type="select" value={priceVar}
                                                          onChange={event => {
                                                              setPriceVar(event.currentTarget.value);
                                                          }}
                                                   >
                                                       <option value="Average">{strings.avg}</option>
                                                       {
                                                           Array.from(vars!.keys()).filter(p => p.endsWith("_usd")).sort()
                                                               .map(p => {
                                                                   let name = p.split("_")[0];
                                                                   name = name[0].toUpperCase() + name.slice(1);
                                                                   return {
                                                                       var: p,
                                                                       name
                                                                   }
                                                               })
                                                               .map(p => {
                                                                   return (
                                                                       <option key={p.var}
                                                                               value={p.var}>{p.name}</option>
                                                                   )
                                                               })
                                                       }
                                                   </Input>

                                               }
                                               content3={getPriceInfo()}
                                        />
                                    </>
                                    : null
                            }
                            <MyRow content1={strings.currentValues}
                                   content2={
                                       getResultValues()
                                   }

                                   content3={strings.valuesInfo}
                            />
                            {!isPrivate ?
                                <MyRow content1={strings.limit}
                                       content2={<input type="checkbox" defaultChecked={limitLiquidity}
                                                        onClick={() => setLimitLiquidity(!limitLiquidity)}/>}
                                       content3={strings.limitInfo}/>
                                : null
                            }
                            <MyRow content1={strings.comment}
                                   content2={
                                       <textarea rows={10} cols={40}
                                                 className={comment.length > 1000 ? "textarea form-control is-invalid" : "textarea form-control"}
                                                 onChange={event => setComment(event.currentTarget.value)}
                                                 value={comment}

                                       />
                                   }
                                   content3={strings.commentInfo}
                            />
                            <MyRow content1={strings.images}
                                   content2={
                                       <Row noGutters>
                                           {
                                               imagesIds.map(p => {
                                                   return (
                                                       <Col {...Col4} className="pb-3 px-1 justify-content-center"
                                                            key={p}>
                                                           <ImagePreview id={p} deleteEnable={true}
                                                                         onDelete={id => {
                                                                             let arr = Array.from(imagesIds);
                                                                             arr = arr.filter(k => k !== id);
                                                                             setImagesIds(arr);
                                                                         }}
                                                           />
                                                       </Col>
                                                   )
                                               })
                                           }
                                           {imagesIds.length < 10 ?
                                               <Col {...Col4} className="text-center pb-3 px-1">
                                                   <input type="file" id="file" ref={inputRef} style={{display: "none"}}
                                                          accept="image/x-png, image/gif, image/jpeg"
                                                          multiple={true}
                                                          onChange={event => {
                                                              event.stopPropagation();
                                                              event.preventDefault();
                                                              if (event.target.files && onFile) {
                                                                  const dt = new DataTransfer()
                                                                  let err = "";
                                                                  if (event.target.files.length > 10) {
                                                                      err = strings.max;
                                                                      setError(err);
                                                                      return;
                                                                  }
                                                                  for (let f of event.target.files) {
                                                                      if (f.size > MB10) {
                                                                          err += `${f.name} has size over 10MB\n`;
                                                                      } else {
                                                                          dt.items.add(f);
                                                                      }
                                                                  }
                                                                  if (err !== "") {
                                                                      setError(err);
                                                                  }
                                                                  if (dt.items.length > 0) {
                                                                      // noinspection JSIgnoredPromiseFromCall
                                                                      onFile(dt);
                                                                  }
                                                              }
                                                              if (inputRef?.current?.value) {
                                                                  inputRef.current.value = "";
                                                              }
                                                          }}
                                                   />
                                                   <FontAwesomeIcon className="text-secondary m-1"
                                                                    style={{cursor: "pointer"}}
                                                                    icon={attacheIconDefinition} size="2x"
                                                                    onClick={() => {
                                                                        inputRef.current?.click();
                                                                    }}
                                                   />
                                               </Col>
                                               : null
                                           }
                                       </Row>
                                   }
                                   content3={strings.imagesInfo}/>
                            <InvoiceIntegration className="mt-3" onChange={params => setIntegration(params)}
                                                invoice={invoice}/>
                            <Row className="pt-3">
                                <Col>
                                    <SecretsList isPrivate={isPrivate} isSold={false}
                                                 onUpdate={secrets => {
                                                     setSecrets(secrets);
                                                 }}
                                    />
                                </Col>
                            </Row>
                            {invoice === null ?
                                <Row className="pt-3 justify-content-end">
                                    <LoadingBtn loading={createRunning} color="success" className="mr-3"
                                                onClick={() => setCreate(true)}
                                                disabled={isError}
                                    >
                                        {strings.create}
                                    </LoadingBtn>
                                </Row>
                                :
                                <Row className="pt-3 justify-content-end">
                                    <LoadingBtn loading={updateRunning} color="success" className="mr-3"
                                                onClick={() => setUpdate(true)}
                                                disabled={isError}
                                    >
                                        {strings.btnUpdate}
                                    </LoadingBtn>
                                </Row>
                            }

                            {
                                createError !== "" ?
                                    <Row>
                                        <Col>
                                            <Alert color="danger" className="pt-3">
                                                {errors(createError)}
                                            </Alert>
                                        </Col>
                                    </Row>
                                    : null
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}