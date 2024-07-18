import * as React from "react";
import {FunctionComponent, ReactNode, useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    Col,
    Collapse,
    Container,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Row,
} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import {findIconDefinition, IconDefinition, IconLookup, library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {Decimal} from 'decimal.js';
import {useMappedState} from "redux-react-hook";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SimplePeriodPicker} from "./SimpleTimePicker";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {Loading} from "../Loading";
import {Redirect} from "react-router-dom";
import {data, IStrings} from "../localization/Dashboard/CreateAdvertisement";
import {initMathjs, useMathjs, useStrings} from "../Hooks";
import {createMatchSelector} from "connected-react-router";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {
    Advertisement,
    AdvertisementData,
    GetAdvertisementsByIdRequest,
    ModifyAdvertisementRequest,
    TimeTableItem
} from "../Protos/api_pb";
import {MyDecimal} from "../MyDecimal";
import {DecimalInput} from "../DecimalInput";
import {CurrenciesCatalog, PaymentTypesCatalog} from "../Catalog";
import {defaultRateVar, minimalAmountBtc} from "../global";
import {errors} from "../localization/Errors";
import {AutoPriceInfo, AutoPriceModal} from "./AutoPriceInfo";
import {CountrySelect} from "../MainPages/CountrySelect";
import {CurrencySelect} from "../MainPages/CurrencySelect";
import {PaymentTypeSelect} from "../MainPages/PaymentTypeSelect";
import {VarsModalLink} from "../MainPages/VarsList";


library.add(fas);
const plusLookup: IconLookup = {prefix: 'fas', iconName: 'plus'};
const plusIconDefinition: IconDefinition = findIconDefinition(plusLookup);
const minusLookup: IconLookup = {prefix: 'fas', iconName: 'minus'};
const minusIconDefinition: IconDefinition = findIconDefinition(minusLookup);

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


const CreateAdvertisement = () => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            router: store.router,
            vars: store.catalog.variables
        }), []
    );
    const {authState, router, vars} = useMappedState(mapState);

    const [san, setSan] = useState({start: -1, end: -1, isValid: true});
    const [mon, setMon] = useState({start: -1, end: -1, isValid: true});
    const [tue, setTue] = useState({start: -1, end: -1, isValid: true});
    const [wed, setWed] = useState({start: -1, end: -1, isValid: true});
    const [thu, setThu] = useState({start: -1, end: -1, isValid: true});
    const [fri, setFri] = useState({start: -1, end: -1, isValid: true});
    const [sat, setSat] = useState({start: -1, end: -1, isValid: true});

    const [type, setType] = useState(false);
    const [countryShort, setCountryShort] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [paymentType, setPaymentType] = useState("");
    const [profit, setProfit] = useState<Decimal | null>(new Decimal(0));
    const [price, setPrice] = useState<Decimal | null>(null);

    const [expression, setExpression] = useState(`${defaultRateVar}*1`);
    const [minTransactionLimit, setMinTransactionLimit] = useState<Decimal | null>(null);
    const [maxTransactionLimit, setMaxTransactionLimit] = useState<Decimal | null>(null);
    const [minTransError, setMinTransError] = useState(false);
    const [maxTransError, setMaxTransError] = useState(false);
    const [terms, setTerms] = useState("");
    const [monitorLiquidity, setMonitorLiquidity] = useState(false);
    const [notAnonymous, setNotAnonymous] = useState(false);
    const [trusted, setTrusted] = useState(false);
    const [title, setTitle] = useState("");
    const [payWindow, setPayWindow] = useState<number | null>(30);

    const [locationError, setLocationError] = useState(true);
    const [priceError, setPriceError] = useState(false);
    const [amountError, setAmountError] = useState(false);


    const [send, setSend] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const [mathjs, setMathjs] = useState<ReturnType<typeof initMathjs> | null>(null);
    const [error, setError] = useState("");
    const [init, setInit] = useState(false);
    const [autoPriceEnabled, setAutoPriceEnabled] = useState(false);
    const [autoPriceModalOpen, setAutoPriceModalOpen] = useState(false);
    const [autoPriceSeconds, setAutoPriceSeconds] = useState(30);
    const [lnEnabled, setLnEnabled] = useState(false);
    const [lnDisableBalance, setLnDisableBalance] = useState(false);

    const [getAdvertisementsByIdRunning, setgetAdvertisementsByIdRunning] = useState(false);

    const getId = useCallback(() => {
        const matchSelector = createMatchSelector("/createAdvertisement/:id?");
        const match = matchSelector({router});
        if (match === null)
            return null;
        const id = (match.params as { id?: number }).id;
        if (id !== undefined)
            return id;
        return null;
    }, [router]);
    const id = getId();


    useEffect(() => {
        if (authState === AuthState.NotAuthed || id === null || init || mathjs === null || getAdvertisementsByIdRunning) {
            return;
        }
        setgetAdvertisementsByIdRunning(true);


        async function f() {

            let req = new GetAdvertisementsByIdRequest();
            req.setId(id as number);

            try {
                let ad = await TradeGrpcRunAsync<Advertisement.AsObject>(tradeApiClient.getMyAdvertisementsById, req, getToken());
                setType(ad.isbuy);
                setCountryShort(ad.country);
                setCurrency(ad.fiatcurrency);
                setPaymentType(ad.paymenttype);
                setExpression(ad.equation);
                Calc(ad.equation, mathjs);
                setMinTransactionLimit(MyDecimal.FromPb(ad.minamount));
                setMaxTransactionLimit(MyDecimal.FromPb(ad.maxamountrequested));
                setTerms(ad.message);
                setMonitorLiquidity(ad.monitorliquidity);
                setNotAnonymous(ad.notanonymous);
                setTrusted(ad.trusted);
                setPayWindow(ad.window);
                setTitle(ad.title);
                setLocationError(false);
                setLnEnabled(ad.lnenabled);
                setLnDisableBalance(ad.lndisablebalance);
                if (!ad.autopricedelayisnull) {
                    setAutoPriceEnabled(true);
                    setAutoPriceSeconds(ad.autopricedelay);
                }

                if (minTransactionLimit != null && maxTransactionLimit !== null &&
                    minTransactionLimit.greaterThan(maxTransactionLimit)) {
                    setAmountError(true);
                } else {
                    setAmountError(false);
                }

                for (let item of ad.timetableList) {
                    switch (item.day) {
                        case "san":
                            setSan({start: item.start, end: item.end, isValid: true});
                            break;
                        case "mon":
                            setMon({start: item.start, end: item.end, isValid: true});
                            break;
                        case "tue":
                            setTue({start: item.start, end: item.end, isValid: true});
                            break;
                        case "wed":
                            setWed({start: item.start, end: item.end, isValid: true});
                            break;
                        case "thu":
                            setThu({start: item.start, end: item.end, isValid: true});
                            break;
                        case "fri":
                            setFri({start: item.start, end: item.end, isValid: true});
                            break;
                        case "sat":
                            setSat({start: item.start, end: item.end, isValid: true});
                            break;
                    }
                }
                setInit(true);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setgetAdvertisementsByIdRunning(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, mathjs, init, getAdvertisementsByIdRunning, maxTransactionLimit, minTransactionLimit, id]);

    function isError() {
        if (countryShort === "")
            return true;
        if (paymentType === "")
            return true;
        if (terms.length > 1000 || terms === "")
            return true;
        if (priceError)
            return true;
        if (!san.isValid || !mon.isValid || !tue.isValid || !wed.isValid || !thu.isValid || !fri.isValid || !sat.isValid) {
            console.log("time error.");
            return true;
        }
        if (!payWindow)
            return true;
        if (expression === "")
            return true;
        if (!minTransactionLimit)
            return true;
        if (type && maxTransactionLimit === null)
            return true;
        if (type && maxTransactionLimit !== null && minTransactionLimit.greaterThan(maxTransactionLimit))
            return true;
        if (amountError)
            return true;
        return minTransError || maxTransError;

    }

    function SetPeriod(day: string, start: number, end: number, isValid: boolean) {
        if (day === "san") {
            console.log("sun error." + isValid.valueOf());
            setSan({start, end, isValid});
        }
        if (day === "mon") {
            setMon({start, end, isValid});
        }
        if (day === "tue") {
            setTue({start, end, isValid});
        }
        if (day === "wed") {
            setWed({start, end, isValid});
        }
        if (day === "thu") {
            setThu({start, end, isValid});
        }
        if (day === "fri") {
            setFri({start, end, isValid});
        }
        if (day === "sat") {
            setSat({start, end, isValid});
        }
    }

    function GetMinimalAmount(price: Decimal | null): Decimal | null {
        if (price === null) {
            return null;
        }
        let minFiat = price.mul(minimalAmountBtc).toDecimalPlaces(2, 2);
        if (minFiat.lessThan(0.01)) {
            minFiat = new Decimal(0.01);
        }
        return minFiat;
    }

    function Calc(expression: string, mathjs: ReturnType<typeof initMathjs> | null): Decimal | null {
        if (mathjs !== null && mathjs.evaluate !== undefined) {
            expression = expression.replace(",", "");
            let res = mathjs.evaluate(expression);
            res = res.toFixed(2);
            let resDecimal = new Decimal(res);
            if (res.toString().match(/^[+-]?([0-9]*[.])?[0-9]+$/g)) {
                return resDecimal;
            } else
                throw new Error();
        }
        return null;
    }

    useEffect(() => {
        try {
            let newPrice = Calc(expression, mathjs);
            if (newPrice !== null) {
                setPriceError(false);
                setPrice(newPrice);
                setMinTransactionLimit(GetMinimalAmount(newPrice));
            }
        } catch (e) {
            setPriceError(true);
            setPrice(null);
            setMinTransactionLimit(null);
        }
    }, [currency, expression, mathjs]);
    useEffect(() => {
        let expr = null;
        if (profit === null)
            return;
        if (currency !== "USD")
            expr = `${defaultRateVar}*${profit.dividedBy(100).plus(1)}*${currency}`;
        else
            expr = `${defaultRateVar}*${profit.dividedBy(100).plus(1)}`;

        setExpression(expr);
    }, [profit, currency, expression]);

    useMathjs((math, error) => {
        if (math !== null) {
            setMathjs(math);
        } else
            setError(error);
    }, mathjs === null);

    useEffect(() => {
        if (authState === AuthState.NotAuthed || !send)
            return;
        setSend(false);
        setLocationError(false);

        async function f() {
            let reqData = new AdvertisementData();

            reqData.setIsenabled(true);

            reqData.setEquation(expression);
            reqData.setMinamount(new MyDecimal(minTransactionLimit!).ToPb());
            reqData.setMaxamount(new MyDecimal(maxTransactionLimit!).ToPb());
            reqData.setMessage(terms);
            reqData.setCountry(countryShort);
            reqData.setPaymenttype(paymentType);
            reqData.setFiatcurrency(currency);
            reqData.setIsbuy(type);
            reqData.setTimetableList(new Array<TimeTableItem>());
            reqData.setTitle(title);
            reqData.setWindow(payWindow!);
            reqData.setLnfunding(lnEnabled);
            reqData.setLndisablebalance(lnDisableBalance);
            if (autoPriceEnabled) {
                reqData.setAutopricedelay(autoPriceSeconds);
            } else {
                reqData.setAutopricedelayisnull(true);
            }

            function getTimeTableItem(day: string, data: typeof san) {
                if (data.start !== -1 && data.end !== -1) {
                    let item = new TimeTableItem();
                    item.setDay(day);
                    item.setStart(data.start);
                    item.setEnd(data.end);
                    reqData.getTimetableList().push(item);
                }
            }

            getTimeTableItem("sun", san);
            getTimeTableItem("mon", mon);
            getTimeTableItem("tue", tue);
            getTimeTableItem("wed", wed);
            getTimeTableItem("thu", thu);
            getTimeTableItem("fri", fri);
            getTimeTableItem("sat", sat);

            reqData.setMonitorliquidity(monitorLiquidity);
            reqData.setNotanonymous(notAnonymous);
            reqData.setTrusted(trusted);


            try {
                if (id === null) {
                    await TradeGrpcRunAsync<Advertisement.AsObject>(tradeApiClient.createAdvertisement, reqData, getToken());
                } else {
                    let req = new ModifyAdvertisementRequest();
                    req.setAdvertisementid(id);
                    req.setData(reqData);
                    await TradeGrpcRunAsync<Advertisement.AsObject>(tradeApiClient.modifyAdvertisement, req, getToken());
                }
                setRedirect(true);
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            }

        }

        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [
        lnEnabled,
        lnDisableBalance,
        wed,
        type,
        tue,
        trusted,
        title,
        thu,
        terms,
        san,
        sat,
        paymentType,
        payWindow,
        notAnonymous,
        send,
        authState,
        id,
        autoPriceEnabled,
        autoPriceSeconds,
        countryShort,
        currency,
        expression,
        maxTransactionLimit,
        minTransactionLimit,
        fri,
        mon,
        monitorLiquidity]);

    const sanMemo =
        <SimplePeriodPicker day="san"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={san}
        />;
    const monMemo =
        <SimplePeriodPicker day="mon"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={mon}
        />;
    const tueMemo =
        <SimplePeriodPicker day="tue"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={tue}
        />;
    const wedMemo =
        <SimplePeriodPicker day="wed"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={wed}
        />;
    const thuMemo =
        <SimplePeriodPicker day="thu"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={thu}
        />;
    const friMemo =
        <SimplePeriodPicker day="fri"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={fri}
        />;
    const satMemo =
        <SimplePeriodPicker day="sat"
                            onChange={(day, start, end, isValid) => SetPeriod(day, start, end, isValid)}
                            value={sat}
        />;

    useEffect(() => {
        if (!price) {
            return;
        }
        const min = GetMinimalAmount(price);
        if (!min) {
            return;
        }
        if (type || lnEnabled) { //buy
            if (minTransactionLimit?.lessThan(min)) {
                setAmountError(true);
                return;
            }
            if (minTransactionLimit == null || maxTransactionLimit == null) {
                setAmountError(true);
                return;
            }

            if (minTransactionLimit.greaterThan(maxTransactionLimit)) {
                setAmountError(true);
                return;
            }
        } else { //sell
            if (minTransactionLimit == null) {
                setAmountError(true);
                return;
            }
            if (minTransactionLimit.lessThan(min)) {
                setAmountError(true);
                return;
            }
            if (maxTransactionLimit !== null && minTransactionLimit.greaterThan(maxTransactionLimit)) {
                setAmountError(true);
                return;
            }
        }
        setAmountError(false);
    }, [type, minTransactionLimit, maxTransactionLimit, price, lnEnabled])

    if (authState !== AuthState.Authed
        || mathjs === null
        || (id !== null && !init)
        || vars === null) {
        return <Loading/>;
    }

    if (redirect) {
        return (
            <Redirect push to="/dashboard/MyAdvirtisments"/>
        );
    }

    return (
        <Container>
            <AutoPriceModal isOpen={autoPriceModalOpen} onClose={() => setAutoPriceModalOpen(false)}/>
            <Row>
                <Col>
                    <h1 className="p-3">{id === null ? strings.createAdTitle : strings.editAdTitle}</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ul>
                        <li>
                            {strings.info1}
                        </li>
                        <li>
                            {strings.info3}
                        </li>
                        <li>
                            {strings.info8}
                        </li>
                        <li>
                            {strings.info9}
                        </li>
                    </ul>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Card>
                        <CardHeader>
                            <h5>{strings.dealType}</h5>
                        </CardHeader>
                        <CardBody>
                            <MyRow
                                content1={strings.title}
                                content2={<Input value={title}
                                                 onChange={event => setTitle(event.currentTarget.value)}
                                                 invalid={title.length > 200 || title === ""}/>}
                                content3={strings.titleDesc}
                            />
                            <MyRow
                                content1={strings.dealCont1}
                                content2={
                                    <React.Fragment>
                                        <FormGroup check>
                                            <Label>
                                                <Input type="radio" name="typeRadios" checked={!type}
                                                       onClick={() => {
                                                           setType(false);
                                                           setAmountError(false);
                                                       }}
                                                />
                                                {strings.dealCont21}</Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <label>
                                                <Input type="radio" name="typeRadios" checked={type}
                                                       onClick={() => {
                                                           setType(true);
                                                       }}
                                                />
                                                {strings.dealCont22}</label>
                                        </FormGroup>
                                    </React.Fragment>
                                }
                                content3={strings.dealCont3}
                            />
                            <MyRow
                                content1={strings.location}
                                content2={
                                    <>
                                        <CountrySelect onChange={countryCode => {
                                            let curr: string | undefined;
                                            setCountryShort(countryCode);
                                            setLocationError(false);
                                            curr = CurrenciesCatalog.get(countryCode);
                                            if (curr !== undefined) {
                                                setCurrency(curr);
                                                let pt = PaymentTypesCatalog.get(countryCode);
                                                if (pt !== undefined) {
                                                    setPaymentType(pt[0]);
                                                }
                                            }
                                        }}
                                                       value={countryShort}
                                                       validation={locationError ? false : undefined}
                                                       defaultError={true}
                                        />
                                    </>
                                }
                                content3={strings.locationDesc}
                            />
                            <Collapse isOpen={!type}>
                                <Card className="border-primary mt-3">
                                    <CardBody>
                                        <MyRow content1={strings.lnEnable}
                                               content2={<input type="checkbox" onClick={() => {
                                                   setLnEnabled(!lnEnabled);
                                               }}
                                                                checked={lnEnabled}/>
                                               }
                                               content3={strings.lnEnableDesc}
                                        />
                                        <Collapse isOpen={lnEnabled}>
                                            <MyRow content1={strings.lnDisableBalance}
                                                   content2={<input type="checkbox"
                                                                    onClick={() => setLnDisableBalance(!lnDisableBalance)}
                                                                    checked={lnDisableBalance}/>
                                                   }
                                                   content3={strings.lnDisableBalanceDesc}
                                            />
                                        </Collapse>
                                    </CardBody>
                                </Card>
                            </Collapse>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Card>
                        <CardHeader>
                            <h5>{strings.additionalInfo}</h5>
                        </CardHeader>
                        <CardBody>
                            <MyRow
                                content1={strings.currency}
                                content2={
                                    <CurrencySelect onChange={value => setCurrency(value)} value={currency}/>
                                }
                            />
                            <MyRow
                                content1={strings.paymentType}
                                content2={
                                    <PaymentTypeSelect onChange={value => setPaymentType(value)} value={paymentType}
                                                       country={countryShort}/>
                                }
                                content3={strings.paymentTypeDesc}
                            />
                            <MyRow
                                content1={strings.window}
                                content2={
                                    <DecimalInput onInput={value => {
                                        if (value === null) {
                                            setPayWindow(null);
                                            return;
                                        }
                                        setPayWindow(value.toNumber());
                                    }}
                                                  minimalValue={15}
                                                  maximumValue={90}
                                                  defaultValue={payWindow}
                                                  defaultsErrors={false}
                                                  value={payWindow}
                                    />}
                                content3={strings.windowDesc}
                            />
                            <Card className="border-primary mt-3">
                                <CardBody>
                                    <MyRow content1={strings.autoPrice1} content2={
                                        <input type="checkbox" checked={autoPriceEnabled}
                                               onClick={() => setAutoPriceEnabled(!autoPriceEnabled)}/>
                                    }
                                           content3={
                                               <>
                                                   {strings.autoPrice}
                                                   <br/>
                                                   <span className="text-primary" style={{cursor: "pointer"}}
                                                         onClick={() => setAutoPriceModalOpen(true)}>
                                                       {strings.autoPriceMore}
                                                   </span>
                                               </>
                                           }
                                    />

                                    <Collapse isOpen={autoPriceEnabled}>
                                        <Row className="mt-3">
                                            <Col>
                                                <AutoPriceInfo seconds={autoPriceSeconds}
                                                               onSecondsChanged={sec => setAutoPriceSeconds(sec)}/>
                                            </Col>
                                        </Row>
                                    </Collapse>
                                </CardBody>
                            </Card>
                            <MyRow
                                content1={strings.profit}
                                content2={
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>%</InputGroupText>
                                        </InputGroupAddon>
                                        <DecimalInput onInput={value => {
                                            setProfit(value);
                                        }}
                                                      value={profit}
                                        />
                                        <InputGroupAddon addonType="append">
                                            <Button color="secondary" outline
                                                    onClick={() => {
                                                        let newProfit: Decimal;
                                                        if (profit === null) {
                                                            newProfit = new Decimal(0);
                                                            setProfit(newProfit);
                                                        } else {
                                                            newProfit = profit;
                                                            newProfit = newProfit.minus(0.1);
                                                            setProfit(newProfit);
                                                        }
                                                    }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={minusIconDefinition}/>
                                            </Button>
                                            <Button color="secondary" outline
                                                    onClick={() => {
                                                        let newProfit: Decimal;
                                                        if (profit === null) {
                                                            newProfit = new Decimal(0);
                                                            setProfit(newProfit);
                                                        } else {
                                                            newProfit = profit;
                                                            newProfit = newProfit.plus(0.1);
                                                            setProfit(newProfit);
                                                        }
                                                    }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={plusIconDefinition}/>
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                }
                                content3={strings.profitDesc}
                            />
                            <MyRow
                                content1={strings.expression}
                                content2={
                                    <React.Fragment>
                                        <Input type="text" onInput={event => {
                                            setProfit(null);
                                            setExpression(event.currentTarget.value);
                                        }}
                                               value={expression}
                                        />
                                        <p>
                                            {priceError ?
                                                <span className="text-danger">{strings.expressionError}</span> :
                                                strings.expressionInfo + ` ${price} ${currency}/BTC`
                                            }
                                        </p>
                                    </React.Fragment>
                                }
                                content3={
                                    <>
                                        {strings.expressionDesc}
                                        <br/>
                                        <VarsModalLink/>
                                    </>
                                }
                            />
                            <MyRow
                                content1={strings.minLimit}
                                content2={
                                    <InputGroup className="mb-3">
                                        <DecimalInput onInput={value => {
                                            setMinTransactionLimit(value);
                                        }}
                                                      onErrorChanged={v => setMinTransError(v)}
                                                      value={minTransactionLimit}
                                                      minimalValue={GetMinimalAmount(price) ?? 0}
                                                      defaultsErrors={true}
                                                      forceError={amountError}
                                        />
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText>{currency}</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                }
                                content3={(strings.minLimitDesc1 + GetMinimalAmount(price)?.toString() ?? "0") + " " + currency}
                            />
                            <MyRow
                                content1={strings.maxLimit}
                                content2={
                                    <InputGroup className="mb-3">
                                        <DecimalInput minimalValue={0} onInput={value => {
                                            setMaxTransactionLimit(value);
                                        }}
                                                      onErrorChanged={v => setMaxTransError(v)}
                                                      defaultValue={maxTransactionLimit}
                                                      defaultsErrors={type}
                                                      forceError={amountError}
                                        />
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText>{currency}</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                }
                                content3={strings.maxLimitDesc}
                            />
                            <MyRow
                                content1={strings.workTime}
                                content2={
                                    <React.Fragment>
                                        {sanMemo}
                                        {monMemo}
                                        {tueMemo}
                                        {wedMemo}
                                        {thuMemo}
                                        {friMemo}
                                        {satMemo}
                                    </React.Fragment>

                                }
                                content3={strings.workTimeDesc}
                            />
                            <MyRow
                                content1={strings.terms}
                                content2={
                                    <textarea rows={10} cols={40}
                                              className={terms === "" || terms.length > 2000 ? "textarea form-control is-invalid" : "textarea form-control"}
                                              onChange={event => setTerms(event.currentTarget.value)}
                                              value={terms}

                                    />
                                }
                                content3={strings.termsDesc}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Card>
                        <CardHeader>
                            <h5>{strings.liquidParams}</h5>
                        </CardHeader>
                        <CardBody>
                            <MyRow
                                content1={strings.monitorLiquid}
                                content2={
                                    <input type="checkbox" onClick={() => setMonitorLiquidity(!monitorLiquidity)}
                                           checked={monitorLiquidity}/>
                                }
                                content3={strings.monitorLiquidDesc}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Card>
                        <CardHeader>
                            <h5>{strings.securityParams}</h5>
                        </CardHeader>
                        <CardBody>
                            <MyRow
                                content1={strings.notAnonymous}
                                content2={
                                    <input type="checkbox" onClick={() => setNotAnonymous(!notAnonymous)}
                                           checked={notAnonymous}/>
                                }
                                content3={strings.notAnoymousDesc}
                            />

                            <MyRow
                                content1={strings.trusted}
                                content2={
                                    <input type="checkbox" onClick={() => setTrusted(!trusted)} checked={trusted}/>
                                }
                                content3={strings.trustedDesc}
                            />

                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
                </Col>
            </Row>
            <Row className="pt-3 justify-content-end">
                <Button color="primary" outline className="mr-3"
                        onClick={() => setSend(true)}
                        disabled={isError()}
                >
                    {strings.publish}
                </Button>
            </Row>
        </Container>
    );
};

export default CreateAdvertisement;