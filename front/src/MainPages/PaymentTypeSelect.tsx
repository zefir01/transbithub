import React from 'react';
import {PaymentTypes} from "../Dashboard/PaymentTypes";
import Select from "react-select";
import {data as dataS} from "../localization/PaymentTypes";
import {data as dataSs, IStrings as IStringsSs} from "../localization/Selects";
import {useStrings} from "../Hooks";


export interface PaymentTypeSelectProps {
    onChange: (value: string) => void;
    country: string | null | undefined;
    value?: string;
    defaultValue?: string;
}

interface Option {
    value: string;
    label: string;
}

export function PaymentTypeSelect(props: PaymentTypeSelectProps) {
    const ss: IStringsSs = useStrings(dataSs);
    const paymentStrings= useStrings(dataS);
    function getTypes() {
        let t = new PaymentTypes();
        if (props.country !== null && props.country !== undefined) {
            return t.get(props.country);
        }
        return t.get("ALL");
    }

    function isS(pet: string): pet is keyof typeof dataS {
        return true;
    }

    function isO(pet: any): pet is Option {
        return true;
    }

    function getOption(value: string | undefined) {
        if (value === undefined || value === "") {
            return undefined;
        }
        if (!isS(value)) {
            return {
                value: "",
                label: ""
            };
        }
        return {
            value: value,
            label: paymentStrings[value]
        }
    }

    const options = () => {
        let types = getTypes();
        return types.map(p => getOption(p) as Option);
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
            label: paymentStrings[props.defaultValue]
        }
    }

    return (
        <Select
            placeholder={ss.phPaymentType}
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