import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Card, CardBody, CardTitle, Collapse, FormGroup, Input, Label} from "reactstrap";
import {Advertisement} from "../Protos/api_pb";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {LoginRegisterComponent} from "../Profile/LoginRegister";
import {PromiseTextArea} from "../Promises/PromiseTextArea";
import {data, IStrings} from "../localization/SellTypeSelector";
import {useStrings} from "../Hooks";

export enum sellTypeEnum {
    balance,
    promise,
    ln
}
export interface SellTypeSelectorData{
    type: sellTypeEnum;
    promise: string;
    pass: string;
    error: boolean;
}
export interface SellTypeSelectorProps {
    ad: Advertisement.AsObject;
    onChanged: (data: SellTypeSelectorData) => void;
}

export function SellTypeSelector(props: SellTypeSelectorProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state
        }), []
    );
    const {authState} = useMappedState(mapState);
    const [type, setType] = useState(sellTypeEnum.balance);
    const [needPass, setNeedPass] = useState(false);
    const [promise, setPromise] = useState("");
    const [pass, setPass] = useState("");
    const [promiseError, setPromiseError] = useState(true);



    useEffect(() => {
        let error = false;
        if (type === sellTypeEnum.balance && authState !== AuthState.Authed) {
            error = true;
        }
        if (type === sellTypeEnum.promise && (promiseError || (pass === "" && needPass))) {
            error = true;
        }
        props.onChanged({type, promise, pass, error});
    }, [type, promise, pass, promiseError, authState, needPass]);


    if (props.ad && !props.ad.isbuy) {
        return null;
    }

    return (
        <Card>
            <CardBody>
                <CardTitle>
                    <h5>{strings.title}</h5>
                </CardTitle>
                <FormGroup check>
                    <Label>
                        <Input type="radio" name="typeRadios" checked={type === sellTypeEnum.balance}
                               onClick={() => setType(sellTypeEnum.balance)}
                        />
                        {strings.balance}
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Label>
                        <Input type="radio" name="typeRadios" checked={type === sellTypeEnum.promise}
                               onClick={() => setType(sellTypeEnum.promise)}
                        />
                        {strings.promise}
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Label>
                        <Input type="radio" name="typeRadios" checked={type === sellTypeEnum.ln}
                               onClick={() => setType(sellTypeEnum.ln)}
                        />
                        {strings.ln}
                    </Label>
                </FormGroup>
                <Collapse isOpen={authState !== AuthState.Authed && type === sellTypeEnum.balance}>
                    <Alert className="mt-3" color="warning">
                        {strings.warn}
                    </Alert>
                    <LoginRegisterComponent/>
                </Collapse>
                <Collapse isOpen={type === sellTypeEnum.promise}>
                    <PromiseTextArea onChange={(value, isFormatError, needPass) => {
                        if (isFormatError) {
                            setPromise(value);
                            setNeedPass(false);
                            setPromiseError(true);
                            return;
                        }
                        setPromise(value);
                        setNeedPass(needPass);
                        setPromiseError(false);
                    }} minRows={10} value={promise}/>
                    <Collapse isOpen={needPass}>
                        <Input className="mt-2" value={pass} onChange={event => setPass(event.currentTarget.value)}
                               placeholder={strings.passPh} invalid={pass === ""}/>
                    </Collapse>
                </Collapse>
                <Collapse isOpen={authState !== AuthState.Authed && type === sellTypeEnum.ln}>
                    <Alert className="mt-3" color="warning">
                        {strings.warnLn}
                    </Alert>
                    <LoginRegisterComponent/>
                </Collapse>
            </CardBody>
        </Card>
    )

}