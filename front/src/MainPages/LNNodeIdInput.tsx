import * as React from "react";
import FormGroup from "reactstrap/lib/FormGroup";
import {Input} from "reactstrap";
import {useEffect, useState} from "react";

export interface LNNode {
    publicKey: string;
}

export interface LNNodeIdInputProps {
    onChange: (node: string | null) => void;
    value?: string;
    disabled?: boolean;
}

export function LNNodeIdInput(props: LNNodeIdInputProps) {
    const [node, setNode] = useState("");
    const [decoded, setDecoded] = useState<LNNode | null>(null);

    useEffect(() => {
        if (node === "" && props.value) {
            setNode(props.value);
        }
    }, [props.value, node])

    function parse(value: string): LNNode | null {
        const regex1 = /^([a-zA-Z0-9]{66})$/;
        let match = regex1.exec(value);
        if (!match || match.length !== 2) {
            return null;
        }
        let key = match[1];
        return {
            publicKey: key
        }
    }

    return (
        <FormGroup>
            <Input className="my-3" placeholder={"Введите Node ID"}
                   valid={node !== "" && decoded !== null}
                   invalid={node !== "" && decoded === null}
                   disabled={props.disabled}
                   onChange={event => {
                       setNode(event.currentTarget.value);
                       let d = parse(event.currentTarget.value);
                       if (!d) {
                           props.onChange(null);
                       } else {
                           props.onChange(event.currentTarget.value);
                       }
                       setDecoded(d);
                   }}
            />
        </FormGroup>
    )
}