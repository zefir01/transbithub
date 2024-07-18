import React from 'react';
import {data as dataS, myMap} from "../localization/PaymentTypes"
import {CurrenciesCatalog} from "../Catalog";
import Select from "react-select";
import {data as dataSs, IStrings as IStringsSs} from "../localization/Selects";
import {useStrings} from "../Hooks";

export interface CurrencySelectProps {
    onChange: (value: string) => void;
    value?: string;
    defaultValue?: string;
}

interface Option {
    value: string;
    label: string;
}


export function CurrencySelect(props: CurrencySelectProps) {
    const ss: IStringsSs = useStrings(dataSs);
    const paymentStrings = new myMap(dataS);

    function isS(pet: string): pet is keyof typeof dataSs {
        return true;
    }

    function isO(pet: any): pet is Option {
        return true;
    }

    function getOption(value: string | undefined) {
        if (value === undefined || value === "") {
            return undefined;
        }
        return {
            value: value,
            label: value
        }
    }

    const options = () => {
        return [...new Set(CurrenciesCatalog.values())].sort((a, b) => a > b ? 1 : -1)
            .map(p => getOption(p) as Option)
    }

    function getDefault(): Option | undefined {
        if (props.defaultValue === undefined) {
            return undefined;
        }
        if (!isS(props.defaultValue)) {
            return {
                value: "",
                label: ""
            };
        }
        return {
            value: props.defaultValue,
            label: paymentStrings.get(props.defaultValue)
        }
    }

    return (
        <Select
            placeholder={ss.phCurrency}
            defaultValue={getDefault()}
            value={getOption(props.value)}
            options={options()}
            onChange={value => {
                if (isO(value)) {
                    props.onChange(value.value);
                }
            }}
        />
    )
}