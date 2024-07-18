import React, {useState} from "react";
import {FormGroup, FormText, Input} from "reactstrap";
import validate from "bitcoin-address-validation";
import {BitcoinNetwork} from "../global";
import {data, IStrings} from "../localization/BtcAddressInput";
import {useStrings} from "../Hooks";

export interface BtcAddressInputProps {
    onChange: (addr: string | null) => void;
    disabled?: boolean;
    defaultError?: boolean;
}

export function BtcAddressInput(props: BtcAddressInputProps) {
    const [btcAddress, setBtcAddress] = useState("");
    const [btcAddressError, setBtcAddressError] = useState(false);
    const strings: IStrings = useStrings(data);

    function isValid(addr: string): boolean {
        let res = validate(addr);
        if (res === false) {
            return false;
        }
        return res.network === BitcoinNetwork;
    }

    return (
        <FormGroup>
            <Input placeholder={strings.ph}
                   disabled={props.disabled}
                   value={btcAddress}
                   invalid={(btcAddress !== "" && btcAddressError) || (props.defaultError && btcAddress === "")}
                   valid={btcAddress !== "" && !btcAddressError}
                   onChange={event => {
                       setBtcAddress(event.currentTarget.value);
                       let v = isValid(event.currentTarget.value);
                       setBtcAddressError(!v);
                       if (v) {
                           props.onChange(event.currentTarget.value);
                       } else {
                           props.onChange(null);
                       }
                   }}/>
            <FormText color="muted">
                {strings.info}
            </FormText>
        </FormGroup>
    );
}