import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import {Input, Label} from "reactstrap";
import {data, IStrings} from "../localization/Profile/TwoFaPin";
import {useMappedState} from "redux-react-hook";
import {useCallback, useEffect, useState} from "react";
import {IStore} from "../redux/store/Interfaces";
import {useStrings} from "../Hooks";

interface IOwnProps {
    onChanged?: (isValid: boolean, pin: string) => void;
}

const TwoFaPin = (props: IOwnProps) => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile
        }), []
    );
    const {profile} = useMappedState(mapState);

    const [valid, setValid] = useState(!profile.EnabledTwoFA);
    const [pin, setPin] = useState("");
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (init)
            return;
        if (props.onChanged !== undefined)
            props.onChanged(valid, pin);
        setInit(true);
    }, [valid, pin, init]);


    if (profile.EnabledTwoFA)
        return (
            <FormGroup>
                <Label for="TwoFaPin">{strings.label}</Label>
                <Input type="text" invalid={!valid && pin !== ""}
                       autoComplete="off"
                       placeholder="000000"
                       onInput={(event => {
                           let temp: boolean;
                           setPin(event.currentTarget.value);
                           if (event.currentTarget.value.match(/^\d{6}$/)) {
                               temp = true;
                               setValid(true);
                           } else {
                               temp = false;
                               setValid(false);
                           }
                           if (props.onChanged !== undefined)
                               props.onChanged(temp, event.currentTarget.value);
                       })}/>
            </FormGroup>
        );
    else
        return null;

};

export default TwoFaPin;