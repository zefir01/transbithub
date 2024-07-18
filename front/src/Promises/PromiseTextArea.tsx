import * as React from "react";
import {data, IStrings} from "../localization/Promises/ReceivePromise";
import {TextAreaAutoSimple} from "../Invoices/Mesenger/TextAreaAuto";
import {useEffect, useState} from "react";
import {useStrings} from "../Hooks";

export interface IPromiseTextAreaProps {
    onChange: (value: string, isFormatError: boolean, needPass: boolean) => void;
    minRows: number;
    value: string;
}

export function PromiseTextArea(props: IPromiseTextAreaProps) {
    const strings: IStrings = useStrings(data);
    const [formatError, setFormatError] = useState(false);

    useEffect(() => {
        check(props.value);
    }, [props.value])

    function check(value: string) {
        let fe = false;

        let isEncrypted = false;
        let isClearSigned = false;
        if(value!=="") {
            if (value.includes("-----BEGIN PGP SIGNED MESSAGE-----") && value.includes("-----END PGP SIGNATURE-----")) {
                isClearSigned = true;
            } else if (value.includes("-----BEGIN PGP MESSAGE-----") && value.includes("-----END PGP MESSAGE-----")) {
                isEncrypted = true;
            }

            if (isEncrypted === isClearSigned) {
                setFormatError(true);
                fe = true;
            } else {
                setFormatError(false);
            }
        }
        else {
            setFormatError(false);
        }
        props.onChange(value, fe, isEncrypted);
    }

    return (
        <TextAreaAutoSimple placeHolder={strings.promisePh}
                            value={props.value}
                            small={true}
                            scrollEnabled={true}
                            invalid={formatError}
                            onChange={value => {
                                check(value);
                            }}
                            minRows={props.minRows}/>
    )
}