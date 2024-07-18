import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import {data, IStrings} from "../localization/Profile/PasswordForm";
import {useState} from "react";
import {FormFeedback, Input} from "reactstrap";
import {useStrings} from "../Hooks";

export enum Status {
    OK,
    ERROR,
    EMPTY
}

interface Props {
    onStatusChanged?: (status: Status, value: string) => void;
    placeHolder?: string;
}

const PasswordForm = (props: Props) => {
    const strings: IStrings=useStrings(data);
    const [status, setStatus] = useState(Status.EMPTY);
    const [errors, setErrors] = useState(new Array<string>());


    function OnInput(event: React.FormEvent<HTMLInputElement>): void {
        let value = event.currentTarget.value;
        let errors: string[] = [];
        if (value === undefined || value === "") {
            setErrors([]);
            setStatus(Status.EMPTY);
            if (props.onStatusChanged !== undefined && status !== Status.EMPTY)
                props.onStatusChanged(Status.EMPTY, value);
            return;
        }

        if (value.length < 8)
            errors.push(strings.passLength);
        if (value.match(/\d+/g) === null)
            errors.push(strings.passDigits);
        if (value.match(/\W+/g) === null)
            errors.push(strings.passSimbols);
        if (value.toUpperCase() === value)
            errors.push(strings.passLowLetters);
        if (value.toLowerCase() === value)
            errors.push(strings.passUpLetters);

        if (errors.length > 0) {
            setErrors(errors);
            setStatus(Status.ERROR);
            if (props.onStatusChanged !== undefined)
                props.onStatusChanged(Status.ERROR, value);
            return;
        }
        setErrors(errors);
        setStatus(Status.OK);
        if (props.onStatusChanged !== undefined)
            props.onStatusChanged(Status.OK, value);
    }


    return (
        <FormGroup>
            <Input type="password"
                   autoComplete="new-password"
                   invalid={status === Status.ERROR}
                   valid={status === Status.OK}
                   placeholder={
                       props.placeHolder === undefined ?
                           strings.password.toString()
                           : props.placeHolder
                   }
                   onInput={OnInput}/>
            <FormFeedback invalid>
                {errors.map((p: string) => {
                    return <p key={p}>{p}</p>;
                })}
            </FormFeedback>
        </FormGroup>
    );
};

export default PasswordForm;