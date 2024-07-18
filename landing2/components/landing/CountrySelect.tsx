import React, {useState} from 'react';
import {CountriesCatalog} from "../Catalog";
import {data, IStrings} from "../localization/Counties";
import {data as dataSs, IStrings as IStringsSs} from "../localization/Selects";
import {StylesConfig} from "react-select/src/styles";
import {useStrings} from "../Hooks";
import {TextField, Typography} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

export interface CountrySelectProps {
    onChange: (countryCode: string) => void;
    value?: string;
    defaultValue?: string;
    validation?: boolean;
    defaultError?: boolean;
    className?: string;
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

    function countryToFlag(isoCode: string): string {
        if (isoCode === undefined) {
            return undefined;
        }
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode
                .toUpperCase()
                .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
            : isoCode;
    }

    function getValue() {
        if (!props.value) {
            return undefined;
        }
        return options.find(p => p.value === props.value);
    }

    return (
        <Autocomplete autoComplete={false}
                      value={getValue()}
                      defaultValue={getDefault()}
                      options={options}
                      getOptionLabel={(option) => `${countryToFlag(option.value)} ${option.label}`}
                      renderOption={(option) => (
                          <Typography className={props.className}>
                              {countryToFlag(option.value)} {option.label}
                          </Typography>
                      )}
                      renderInput={(params) => <TextField
                          {...params}
                          inputProps={{...params.inputProps, className: props.className}}
                          label={ss.phCountry}/>}
                      onChange={(event, values) => {
                          if(!values){
                              props.onChange("");
                              return;
                          }
                          if (isO(values)) {
                              props.onChange(values.value);
                          }
                      }}
        />
    );
}