import * as React from "react";
import {FormFeedback, Input} from "reactstrap";
import {data, IStrings} from "../localization/Wallet/SendBitcoinsLN";
import FormGroup from "reactstrap/lib/FormGroup";
import {useEffect, useState} from "react";
import lightningPayReq from "bolt11";
import {MyDecimal} from "../MyDecimal";
import {satoshi} from "../global";
import {errors} from "../localization/Errors";
import {useStrings} from "../Hooks";

export interface LNDecodedInvoice {
    amount: MyDecimal | null;
    description: string;
    error: boolean;
    invoice: string;
}

export interface LNInvoiceInputProps {
    onChange: (decoded: LNDecodedInvoice) => void;
    isDisabled?: boolean;
    amount?: MyDecimal;
}

export function LNInvoiceInput(props: LNInvoiceInputProps) {
    const strings: IStrings=useStrings(data);
    const [invoice, setInvoice] = useState("");
    const [invoiceError, setInvoiceError] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (invoice) {
            decode(invoice);
        }
    }, [props.amount, invoice])

    function decode(value: string): LNDecodedInvoice {
        try {
            setError("");
            setInvoiceError(false);
            value = value.replace("lightning:", "").replace("LIGHTNING:", "");
            let decoded = lightningPayReq.decode(value);
            let amount: MyDecimal | null = null;
            if (!decoded.millisatoshis) {
                if (props.amount) {
                    setError("Сумма должна быть: " + props.amount.toString() + " BTC");
                }
            } else {
                amount = new MyDecimal(parseInt(decoded.millisatoshis) / 1000 * satoshi);
                if (props.amount) {
                    if (!amount.eq(props.amount)) {
                        setError("Сумма должна быть: " + props.amount.toString() + " BTC");
                    }
                }
            }
            let description = "";
            let descTag = decoded.tags.find(p => p.tagName === "description");
            if (descTag) {
                description = descTag.data.toString();
            }
            return {
                amount,
                description,
                error: false,
                invoice: value
            }
        } catch (e) {
            setInvoiceError(true);
            return {
                amount: null,
                description: "",
                error: true,
                invoice: value
            };
        }
    }

    return (
        <FormGroup>
            <Input className="my-3" placeholder={strings.invoicePh}
                   value={invoice}
                   invalid={(invoiceError && invoice !== "") || error !== ""}
                   valid={!invoiceError && invoice !== ""}
                   disabled={props.isDisabled}
                   onChange={event => {
                       setInvoice(event.currentTarget.value);
                       let val = decode(event.currentTarget.value);
                       props.onChange(val);
                   }}
            />
            <FormFeedback>{errors(error)}</FormFeedback>
        </FormGroup>
    )
}