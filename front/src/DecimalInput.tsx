import * as React from "react";
import {Input} from "reactstrap";
import {useEffect, useState} from "react";
import {Decimal} from 'decimal.js';

interface IDecimalInputProps {
    onInput: (value: Decimal | null) => void
    minimalValue?: Decimal | number;
    maximumValue?: Decimal | number;
    defaultValue?: Decimal | number | null;
    defaultsErrors?: boolean;
    placeHolder?: string;
    forceError?: boolean;
    onErrorChanged?: (value: boolean) => void;
    intOnly?: boolean;
    value?: Decimal | number | null;
    maxDecimals?: number;
}

export function DecimalInput(props: IDecimalInputProps) {
    const [error, setError] = useState(false);
    const [value, setValue] = useState("");


    useEffect(() => {
        if (props.value !== undefined && props.value !== null) {
            setValue(props.value.toString());
            check(props.value.toString(), props.value.toString());
            return;
        }
        if (props.defaultValue !== undefined && props.defaultValue !== null && value === "") {
            setValue(props.defaultValue.toString());
            check(props.defaultValue.toString(), props.defaultValue.toString());
            return;
        }

        check(value, value);
    }, [props.value, props.forceError, props.defaultsErrors, props.intOnly, props.maximumValue, props.minimalValue, props.defaultValue, value]);

    function getValue() {
        if (value !== "") {
            return value;
        }
        if (props.defaultValue !== undefined && props.defaultValue !== null) {
            return props.defaultValue.toString();
        }
        return "";
    }

    function check(val: string, prevValue: string) {
        let newVal: Decimal | null = null;
        let prevVal: Decimal | null = null;
        try {
            if (val !== "") {
                newVal = new Decimal(val);
            }
        } catch {
        }
        try {
            if (prevValue !== "") {
                prevVal = new Decimal(prevValue);
            }
        } catch {
        }

        if (prevVal !== null || newVal !== null) {
            if (newVal === null || prevVal === null) {
                props.onInput(newVal);
            } else if (!prevVal.eq(newVal)) {
                props.onInput(newVal);
            }
        }

        let err = false;
        if (val === "") {
            if (props.defaultsErrors) {
                err = true;
            } else {
                newVal = new Decimal(0);
            }
        }
        if (newVal === null) {
            err = true;
        } else {
            if (props.minimalValue !== undefined && (newVal.lessThan(props.minimalValue))) {
                err = true;
            }
            if (props.maximumValue !== undefined && newVal.greaterThan(props.maximumValue)) {
                err = true;
            }
            if (props.maxDecimals && newVal.decimalPlaces() > props.maxDecimals) {
                err = true;
            }
        }
        if (props.forceError) {
            err = true;
        }

        if (err !== error) {
            setError(err);
        }

        if (err !== error && props.onErrorChanged !== undefined) {
            props.onErrorChanged(err);
        }
    }

    return <Input type="text" value={getValue()}
                  placeholder={props.placeHolder}
                  invalid={error}
                  onInput={event => {
                      if (props.intOnly && (event.currentTarget.value.includes(".") || event.currentTarget.value.includes(","))) {
                          return;
                      }
                      setValue(event.currentTarget.value);
                      check(event.currentTarget.value, value);
                  }
                  }
    />
}