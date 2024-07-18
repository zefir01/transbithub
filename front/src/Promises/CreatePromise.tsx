import * as React from "react";
import {FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Row
} from "reactstrap";
import {DecimalInput} from "../DecimalInput";
import {CurrenciesCatalog} from "../Catalog";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {MyDecimal} from "../MyDecimal";
import {promiseFee, satoshi} from "../global";
import {LoadingBtn} from "../LoadingBtn";
import {CreatePromiseRequest, CreatePromiseResponse} from "../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../helpers";
import {errors} from "../localization/Errors";
import {data, IStrings} from "../localization/Promises/CreatePromise";
import {BalanceUpdated} from "../redux/actions";
import {InputPromisePass} from "./InputPromisePass";
import {MultilineContent} from "../MultilineContent";
import {useStrings} from "../Hooks";


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


export function CreatePromise() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            vars: store.catalog.variables,
            balance: store.balances.Balance,
            defaultCurrency: store.profile.GeneralSettings.DefaultCurrency
        }), []
    );
    const {authState, vars, balance, defaultCurrency} = useMappedState(mapState);
    const dispatch = useDispatch();

    const [currency, setCurrency] = useState("USD");
    const [priceVar, setPriceVar] = useState("Average");
    const [isFiat, setIsFiat] = useState(true);
    const [amount, setAmount] = useState<MyDecimal | null>(new MyDecimal(0));
    const [enablePass, setEnablePass] = useState(false);
    const [pass, setPass] = useState<string | null>(null);
    const [create, setCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [promise, setPromise] = useState<string | null>(null);
    const [amountError, setAmountError] = useState(true);

    const ref = useRef<HTMLDivElement>(null)

    const getVarPriceCb = useCallback(() => {
        let vprice;
        if (priceVar === "Average") {
            vprice = vars!.get(`AVG_${currency}`)!;
        } else {
            let fiatRate = vars!.get(currency)!;
            vprice = vars!.get(priceVar)!.mul(fiatRate);
        }
        return vprice;
    }, [priceVar, currency, vars])
    const getVarPrice = getVarPriceCb();


    const getAmountCryptoCb = useCallback(() => {
        if (amount === null || amount.eq(0)) {
            return new MyDecimal(0);
        }
        if (isFiat) {
            let crypto = amount.dividedBy(getVarPrice);
            return new MyDecimal(crypto.toDecimalPlaces(8));
        } else {
            return new MyDecimal(amount);
        }
    }, [amount, isFiat, getVarPrice])
    const getAmountCrypto = getAmountCryptoCb();

    const isErrorCb = useCallback(() => {
        if (amount === null || amount.eq(0)) {
            return true;
        }
        if (enablePass && pass === null) {
            return true;
        }
        if (getAmountCrypto.eq(0)) {
            return true;
        }
        return amountError;
    }, [amount, enablePass, pass, getAmountCrypto, amountError])
    const isError = isErrorCb();

    useEffect(() => {
        if (promise === "" || !ref.current) {
            return;
        }
        ref.current.scrollIntoView({block: "nearest", inline: "end"});
    }, [promise])

    useEffect(() => {
        if (defaultCurrency !== "") {
            setCurrency(defaultCurrency);
        }
    }, [defaultCurrency]);

    useEffect(() => {
        if (isError || creating || !create || authState === AuthState.NotAuthed || getAmountCrypto.eq(0)) {
            return;
        }
        setCreate(false);
        setCreating(true);
        setError("");

        async function f() {
            let req = new CreatePromiseRequest();
            req.setAmount(getAmountCrypto.ToPb());
            if (enablePass && pass !== null) {
                req.setPassword(pass);
            } else {
                req.setPassword("");
            }

            try {
                let resp = await TradeGrpcRunAsync<CreatePromiseResponse.AsObject>(tradeApiClient.createPromise, req, getToken());
                setPromise(resp.promise);
                dispatch(BalanceUpdated(resp.balance!));
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setCreating(false);
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        f();


    }, [create, isError, authState, creating, dispatch, enablePass, pass, getAmountCrypto]);


    function getBalance() {
        let fee = MyDecimal.FromPb(balance!.confirmed).mul(promiseFee).toDecimalPlaces(8);
        if (fee.lessThan(satoshi)) {
            fee = new MyDecimal(satoshi);
        }
        let crypto = MyDecimal.FromPb(balance!.confirmed).minus(fee);
        if (isFiat) {
            let res = getVarPrice.mul(crypto);
            if (res.lessThan(0)) {
                res = new MyDecimal(0);
            }
            return new MyDecimal(res.toDecimalPlaces(2));
        } else {
            return new MyDecimal(crypto).toDecimalPlaces(8);
        }
    }

    function getFeeCrypto() {
        if (amount === null || amount.eq(0)) {
            return new MyDecimal(0);
        }
        let fee: MyDecimal;
        if (isFiat) {
            let crypto = amount.dividedBy(getVarPrice);
            fee = crypto.mul(promiseFee);
        } else {
            fee = amount.mul(promiseFee);
        }
        if (fee.lessThan(satoshi)) {
            fee = new MyDecimal(satoshi);
        }
        return fee.toDecimalPlaces(8);
    }

    function getFeeFiat(): string {
        if (!isFiat || amount === null || amount.eq(0)) {
            return "0";
        }
        let fee = amount.mul(promiseFee);
        if (fee.lessThan(0.01)) {
            return "<0.01";
        }
        return fee.toDecimalPlaces(2).toString();
    }


    const currenciesMemo = useMemo(() =>
            Array.from(new Set(CurrenciesCatalog.values())).sort().map(p => {
                return (
                    <option key={p}
                            value={p}>{p}</option>
                )
            })

        , []
    );

    if (!vars || vars.size === 0 || !balance) {
        return <Loading className="mt-3"/>;
    }

    return (
        <Row>
            <Col>
                <Card className="border-top-0 rounded-0">
                    <CardBody>
                        <MyRow content1={strings.type}
                               content2={
                                   <>
                                       <FormGroup check>
                                           <Label>
                                               <Input type="radio" name="typeRadios" checked={isFiat}
                                                      onClick={() => {
                                                          setAmount(new MyDecimal(0));
                                                          setIsFiat(true);
                                                      }}/>
                                               {strings.inFiat}
                                           </Label>
                                       </FormGroup>
                                       <FormGroup check>
                                           <label>
                                               <Input type="radio" name="typeRadios" checked={!isFiat}
                                                      onClick={() => {
                                                          setAmount(new MyDecimal(0));
                                                          setIsFiat(false);
                                                      }}/>
                                               {strings.inCrypto}
                                           </label>
                                       </FormGroup>
                                   </>
                               }
                               content3={strings.typeInfo}
                        />

                        <MyRow content1={
                            <>
                                {strings.amount}
                            </>
                        }
                               content2={
                                   isFiat ?
                                       <>
                                           <InputGroup>
                                               <InputGroupAddon addonType="prepend">
                                                   <Button color="warning" onClick={() => setAmount(getBalance())}>
                                                       Max
                                                   </Button>
                                               </InputGroupAddon>
                                               <DecimalInput defaultsErrors={true}
                                                             minimalValue={0.01}
                                                             maxDecimals={2}
                                                             maximumValue={getBalance()}
                                                             value={amount}
                                                             onErrorChanged={value => setAmountError(value)}
                                                             onInput={(val) => {
                                                                 setAmount(val);
                                                             }}/>
                                               <InputGroupAddon addonType="append">
                                                   <Input addon type="select"
                                                          value={currency}
                                                          onInput={event => setCurrency(event.currentTarget.value)}
                                                   >
                                                       {currenciesMemo}
                                                   </Input>
                                               </InputGroupAddon>
                                           </InputGroup>
                                           <span
                                               className="d-block">{strings.available} {getBalance().toString()} {currency}</span>
                                       </>
                                       :
                                       <>
                                           <InputGroup>
                                               <InputGroupAddon addonType="prepend">
                                                   <Button color="warning" onClick={() => setAmount(getBalance())}>
                                                       Max
                                                   </Button>
                                               </InputGroupAddon>
                                               <DecimalInput defaultsErrors={true}
                                                             minimalValue={satoshi}
                                                             maxDecimals={8}
                                                             maximumValue={getBalance()}
                                                             value={amount}
                                                             onErrorChanged={value => setAmountError(value)}
                                                             onInput={(val) => {
                                                                 setAmount(val);
                                                             }}
                                               />
                                               <InputGroupAddon addonType="append">
                                                   <InputGroupText>BTC</InputGroupText>
                                               </InputGroupAddon>
                                           </InputGroup>
                                           <span
                                               className="d-block">{strings.available} {getBalance().toString()} BTC</span>
                                       </>
                               }
                               content3={isFiat ?
                                   <span>{strings.amountInfo}</span>
                                   :
                                   <span>{strings.amountInfo1}</span>
                               }
                        />


                        {isFiat ?
                            <MyRow content1={strings.rate}
                                   content2={
                                       <InputGroup>
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
                                       </InputGroup>
                                   }
                                   content3={strings.rateInfo}
                            />
                            : null
                        }

                        {isFiat ?
                            <MyRow content1={strings.amountFiat}
                                   content2={
                                       <>
                                                <span className="text-success">
                                                    {amount?.toString() ?? ""} {currency}
                                                </span>
                                           <span className="text-secondary small">
                                                   {strings.fee + getFeeFiat().toString()} {currency}
                                               </span>
                                       </>
                                   }
                                   content3={strings.amountFiatInfo}
                            />
                            : null
                        }
                        <MyRow content1={strings.cryptoAmount}
                               content2={
                                   <>
                                            <span className="text-success">
                                                {getAmountCrypto.toString()} BTC
                                            </span>
                                       <span className="text-secondary small">
                                                {strings.fee + getFeeCrypto().toString()} BTC
                                            </span>
                                   </>
                               }
                               content3={strings.cryptoAmountInfo}
                        />
                        <MyRow content1={strings.pass}
                               content2={
                                   <InputPromisePass onState={(state) => {
                                       setEnablePass(state.passEnabled);
                                       setPass(state.password);
                                   }}/>
                               }
                               content3={strings.passInfo}
                        />
                        <Row className="justify-content-center mt-3">
                            <Col className="col-auto">
                                <LoadingBtn disabled={isError} loading={creating} color="primary"
                                            onClick={() => setCreate(true)}
                                >
                                    {strings.create}
                                </LoadingBtn>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col className="col-auto">
                                <Alert className="mt-3" isOpen={error !== ""} color="danger">{errors(error)}</Alert>
                            </Col>
                        </Row>
                        <Row className="justify-content-center mt-3">
                            <Col className="col-auto">
                                {promise !== null ?
                                    <div ref={ref}>
                                        <Card className="mt-2">
                                            <CardHeader>
                                                {strings.warning}
                                            </CardHeader>
                                            <CardBody className="small">
                                                <MultilineContent text={promise} small={true} disableModify={true}/>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    : null
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}