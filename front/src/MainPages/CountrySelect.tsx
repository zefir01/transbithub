import React, {useState} from 'react';
import Select from "react-select";
import ReactCountryFlag from 'react-country-flag'
import {CountriesCatalog} from "../Catalog";
import {data, IStrings} from "../localization/Counties";
import {data as dataSs, IStrings as IStringsSs} from "../localization/Selects";
import {StylesConfig} from "react-select/src/styles";
import {useStrings} from "../Hooks";

export interface CountrySelectProps {
    onChange: (countryCode: string) => void;
    value?: string;
    defaultValue?: string;
    validation?: boolean;
    defaultError?: boolean;
}

interface Option {
    value: string;
    label: string;
}


export function CountrySelect(props: CountrySelectProps) {
    const strings: IStrings = useStrings(data);
    const ss: IStringsSs = useStrings(dataSs);
    const [val, setVal] = useState<string | null>(null);

    function getOption(value: string | undefined): Option | undefined {
        if (value === "" || value === undefined) {
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
            label: strings[value].toString()
        }
    }

    const options: Option[] = Array.from(CountriesCatalog.keys()).map(p => getOption(p)).filter(p => p !== undefined)
        .map(p => p as Option).sort((a, b) => a!.label > b!.label ? 1 : -1);

    const formatOptionLabel = (v: Option) => (
        <div style={{display: "flex"}}>
            <ReactCountryFlag countryCode={v.value} svg={true} style={{
                fontSize: '1.5rem',
                lineHeight: '1.5rem',
            }}/>
            &nbsp;
            <div>{v.label}</div>
        </div>
    );

    function isS(pet: string): pet is keyof typeof strings {
        return true;
    }

    function isO(pet: any): pet is Option {
        return true;
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
            label: strings[props.defaultValue].toString()
        }
    }

    const customStyles: StylesConfig = {
        option: (provided) => ({
            ...provided,
        }),
        control: (provided, state) => {
            if (state.menuIsOpen) {
                return {
                    ...provided,
                }
            }
            if (isError() === true) {
                return {
                    ...provided,
                    borderColor: "red"
                }
            } else if (isError() === false) {
                return {
                    ...provided,
                    borderColor: "green"
                }
            }
            return {
                ...provided,
            }
        },
    }


    function isError(): boolean | undefined {
        if (val === null && props.value === undefined && props.defaultValue === undefined && props.defaultError) {
            return true;
        }
        if (props.validation !== undefined && !props.validation) {
            return true;
        }
        if (props.validation !== undefined && props.validation) {
            return false;
        }
        return undefined;
    }

    return (
        <Select
            styles={customStyles}
            defaultValue={getDefault()}
            value={getOption(props.value)}
            formatOptionLabel={formatOptionLabel}
            placeholder={ss.phCountry}
            options={options}
            onChange={value => {
                if (isO(value)) {
                    setVal(value.value);
                    props.onChange(value.value);
                }
            }}
        />
    );
}