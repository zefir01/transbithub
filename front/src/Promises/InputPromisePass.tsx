import * as React from "react";
import {Form, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {data, IStrings} from "../localization/Promises/CreatePromise";
import {useEffect, useState} from "react";
import {useStrings} from "../Hooks";

export interface IState {
    passEnabled: boolean,
    password: string | null
}

export interface IInputPromisePassProps {
    onState: (state: IState) => void;
    disabled?: boolean;
}


export function InputPromisePass(props: IInputPromisePassProps) {
    const strings: IStrings=useStrings(data);
    const [enablePass, setEnablePass] = useState(false);
    const [pass, setPass] = useState("");
    const [passError, setPassError] = useState("");
    const [confirm, setConfirm] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [prevState, setPrevState] = useState<IState>(defaultState());

    function defaultState(): IState {
        return {
            passEnabled: false,
            password: null
        }
    }

    useEffect(() => {
        let state = defaultState();
        state.passEnabled = enablePass;
        if (!enablePass) {
            state.password = "";
        } else if (passError || confirmError) {
            state.password = null;
        } else {
            state.password = pass;
        }
        if (prevState.password !== state.password || prevState.passEnabled !== state.passEnabled) {
            props.onState(state);
            setPrevState(state);
        }

    }, [enablePass, pass, passError, confirm, confirmError, prevState.passEnabled, prevState.password])

    return (
        <Form autoComplete="off">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <Input addon type="checkbox" checked={enablePass}
                               disabled={props.disabled}
                               onClick={() => {
                                   setEnablePass(!enablePass);
                                   setPass("");
                                   setConfirm("");
                                   setPassError("");
                                   setConfirmError("");
                               }}/>
                    </InputGroupText>
                </InputGroupAddon>

                <Input type="password" placeholder={strings.passPh} disabled={!enablePass || props.disabled}
                       invalid={passError !== "" && enablePass}
                       name="promisePass" autoComplete="promisePass" id="promisePass"
                       valid={pass !== "" && passError === "" && enablePass}
                       value={pass}
                       onInput={event => {
                           let val = event.currentTarget.value;
                           setPass(val);
                           if (val.length > 100) {
                               setPassError(strings.passError)
                           } else {
                               setPassError("");
                           }
                           if (val !== confirm) {
                               setConfirmError(strings.confirmError);
                           } else {
                               setConfirmError("");
                           }
                       }}
                />
                <FormFeedback>{passError}</FormFeedback>
            </InputGroup>
            {enablePass ?
                <>
                    <Input type="password" className="mt-1" placeholder={strings.confirm}
                           name="promisePassConfirm" autoComplete="promisePassConfirm" id="promisePassConfirm"
                           invalid={confirmError !== ""}
                           valid={!confirmError && confirm !== ""}
                           value={confirm}
                           onInput={event => {
                               let val = event.currentTarget.value;
                               setConfirm(val);
                               if (val !== pass) {
                                   setConfirmError(strings.confirmError);
                               } else {
                                   setConfirmError("");
                               }
                           }
                           }
                    />
                    <FormFeedback>{confirmError}</FormFeedback>
                </>
                : null
            }
        </Form>
    );
}