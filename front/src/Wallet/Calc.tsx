import * as React from "react";
import {Calculator} from "../MainPages/DealPage/Calculator";
import {MyDecimal} from "../MyDecimal";
import {Card, Input, InputGroup} from "reactstrap";
import {CurrenciesCatalog} from "../Catalog";
import {useMappedState} from "redux-react-hook";
import {useCallback, useEffect} from "react";
import {IStore} from "../redux/store/Interfaces";
import {useState} from "react";
import {Decimal} from "decimal.js";
import {Loading} from "../Loading";
import {PrettyPrice} from "../helpers";
import {data, IStrings} from "../localization/Invoices/CreateInvoice";
import {useStrings} from "../Hooks";

interface ICalcProps {
    newAmount: (amount: Decimal) => void
}

export function Calc(props: ICalcProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            vars: store.catalog.variables,
            defaultCurrency: store.profile.GeneralSettings.DefaultCurrency,
            userId: store.profile.UserId
        }), []
    );
    const {vars, defaultCurrency, userId} = useMappedState(mapState);
    const strings: IStrings=useStrings(data);

    const [currency, setCurrency] = useState("USD");
    const [variable, setVariable] = useState("Average");
    const [fiat, setFiat] = useState(new Decimal(0));
    const [price, setPrice] = useState(new MyDecimal(0));

    useEffect(() => {
        setCurrency(defaultCurrency);
    }, [defaultCurrency])

    function calcVarPrice(priceVar: string, currency: string, vars: Map<string, MyDecimal> | null) {
        let vprice;
        let vpriceString;
        if (priceVar === "Average") {
            vprice = vars!.get(`AVG_${currency}`)!;
        } else {
            let fiatRate = vars!.get(currency)!;
            vprice = vars!.get(priceVar!)!.mul(fiatRate);
        }
        vpriceString = PrettyPrice(new MyDecimal(vprice));
        return {
            vprice,
            vpriceString
        };
    }

    function GetCrypto(variable: string, currency: string) {
        let vprice = calcVarPrice(variable, currency, vars);
        return fiat.dividedBy(vprice.vprice).toDecimalPlaces(8);
    }

    useEffect(() => {
        try {
            setPrice(calcVarPrice(variable, currency, vars).vprice);
        } catch (e) {

        }
    }, [vars, variable, currency, fiat]);

    if (!vars || vars.size === 0 || defaultCurrency === "") {
        return <Loading/>;
    }

    return (
        <Card className="my-0">
            <Calculator userId={userId} params={{
                fiatCurrency: currency,
                title: strings.calc,
                isbuy: false,
                price,
            }}
                        valueChanged={(fiat, crypto) => {
                            if (crypto !== null && fiat !== null) {
                                props.newAmount(crypto);
                                setFiat(fiat);
                            }
                        }}
            />
            <InputGroup>
                <Input type="select"
                       value={currency}
                       onChange={event => {
                           setCurrency(event.currentTarget.value);
                           props.newAmount(GetCrypto(variable, event.currentTarget.value));
                       }}>
                    {
                        Array.from(new Set(CurrenciesCatalog.values())).map(val => {
                            return (
                                <option key={val} value={val}>{val}</option>
                            )
                        })
                    }
                </Input>
                <Input type="select" value={variable}
                       onChange={event => {
                           setVariable(event.currentTarget.value);
                           props.newAmount(GetCrypto(event.currentTarget.value, currency));
                       }}>
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
        </Card>
    );
}