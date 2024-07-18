import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {strings} from "../localization/Dashboard/SimpleTimePicker";

interface IProps {
    onChange: (value: number) => void;
    invalid: boolean;
    valid: boolean;
    value?: number;
}

export const SimpleTimePicker = (props: IProps) => {

    function getValues(): string[] {
        let values: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 15) {
                let h = hour < 10 ? `0${hour}` : `${hour}`;
                let m = min < 10 ? `0${min}` : `${min}`;
                values.push(`${h}:${m}`);
            }
        }
        return values;
    }

    const values=useMemo(()=>{
        return getValues().map((p, i) =>
            <option key={p} value={i}>{p}</option>
        );
    }, [])

    return (
        <Input valid={props.valid} invalid={props.invalid} type="select"
               defaultValue={props.value === undefined ? "----" : props.value.toString()}
               onChange={event => {
                   if (event.currentTarget.value !== "----")
                       props.onChange(parseInt(event.currentTarget.value));
                   else
                       props.onChange(-1);
               }}
               value={props.value}
        >
            <option value="----">----</option>
            {values}
        </Input>
    );
};

export const SimplePeriodPicker = (props: {
    day: string;
    onChange: (day: string, start: number, end: number, valid: boolean) => void;
    value?: { start: number; end: number; }
}) => {
    const [start, setStart] = useState(props.value === undefined ? -1 : props.value.start);
    const [end, setEnd] = useState(props.value === undefined ? -1 : props.value.end);

    useEffect(() => {
        let s = props.value?.start ?? -1;
        let e = props.value?.end ?? -1;
        if (start === s && end === e) {
            return;
        }
        let isValid = (s === -1 && e === -1) || s < e;
        let isValidPrev = (start === -1 && end === -1) || start <= end;
        setStart(s);
        setEnd(e);
        if (isValid !== isValidPrev) {
            props.onChange(props.day, s, e, isValid);
        }
    }, [end, start, props])

    function onChangeStart(value: number) {
        setStart(value);
        let isValid = (value === -1 && end === -1) || value < end;
        if (end !== -1 || value !== -1) {
            props.onChange(props.day, value, end, isValid);
        } else {
            props.onChange(props.day, -1, -1, true);
        }
    }

    function onChangeEnd(value: number) {
        setEnd(value);
        let isValid = (start === -1 && value === -1) || start < value;
        if (start !== -1 || value !== -1) {
            props.onChange(props.day, start, value, isValid);
        } else {
            props.onChange(props.day, -1, -1, true);
        }
    }

    return (
        <React.Fragment>
            <style>{`
            .timeGroup > .input-group-prepend {
                flex: 0 0 5rem;
            }

            .timeGroup .input-group-text {
                width: 100%;
            }
            `}</style>
            <InputGroup className="timeGroup">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>{strings.get(props.day)}</InputGroupText>
                </InputGroupAddon>
                <SimpleTimePicker
                    valid={start !== -1 && end !== -1 && start <= end}
                    invalid={start !== -1 && end !== -1 && start >= end}
                    onChange={onChangeStart}
                    value={props.value === undefined ? undefined : props.value.start}
                />
                <SimpleTimePicker
                    valid={start !== -1 && end !== -1 && start <= end}
                    invalid={start !== -1 && end !== -1 && start >= end}
                    onChange={onChangeEnd}
                    value={props.value === undefined ? undefined : props.value.end}
                />
            </InputGroup>
        </React.Fragment>
    );
};