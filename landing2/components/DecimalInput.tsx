import {TextField} from "@material-ui/core";
import Decimal from "decimal.js";
import {useState} from "react";

export interface DecimalInputProps {
    defaultValue: string;
    onChange: (value: string, isError: boolean) => void;
}

export function DecimalInput(props: DecimalInputProps) {
    const [error, setError] = useState(false);

    function isError(value: string): boolean {
        if (value === "") {
            return false;
        }
        try {
            let d = new Decimal(value);
            if (d.decimalPlaces() > 2) {
                return true;
            }
        } catch {
            return true;
        }
        return false;
    }


    return (
        <TextField id="standard-basic" label="Сумма в фиатной валюте" className={"w-100"}
                   error={error}
                   placeholder={"Введите сумму"}
                   defaultValue={props.defaultValue}
                   onChange={event => {
                       const val = event.currentTarget.value;
                       const err = isError(val);
                       setError(err);
                       props.onChange(val, err);
                   }}
        />
    )
}