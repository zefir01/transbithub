import * as React from "react";
import {Alert, Card, CardBody, Collapse, Form, FormGroup, Row} from "reactstrap";
import {data, IStrings} from "../localization/Profile/Login";
import TwoFaPinConnected from "./TwoFaPin";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "redux-react-hook";
import {NewToken, ProfileActionTypes} from "../redux/actions";
import {NavLink} from "react-router-dom";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";
import {GetRefreshToken} from "../helpers";
import {useEventListener, useStrings} from "../Hooks";


const Login = () => {
    const strings: IStrings = useStrings(data);
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [Pin, setPin] = useState("");
    const [PinOk, setPinOk] = useState(true);
    const [Error, setError] = useState("");
    const [sendRequest, setSendRequest] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const onScroll = (event: Event) => {
        let evt = event as KeyboardEvent;
        if (evt) {
            if (evt.key === "Enter") {
                setSendRequest(true);
            }
        }
    }
    useEventListener('keydown', onScroll);
    const passRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function f() {
            if (!sendRequest)
                return;
            setSendRequest(false);
            setLoading(true);
            setError("");

            try {
                let json = await GetRefreshToken(Username, Password, Pin);
                dispatch({type: ProfileActionTypes.LOGOUT});
                dispatch(NewToken(json.access_token, json.refresh_token, json.expires_in));
            } catch (e) {
                if (e.response.data.error_description) {
                    if (e.response.data.error_description === "Need two_fa pin.") {
                        dispatch({type: ProfileActionTypes.NEED_TWOFA_PIN});
                    } else {
                        setError(e.response.data.error_description);
                    }
                } else {
                    setError("Internal error.");
                }
            }
            finally {
                setLoading(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, Password, Username, Pin, dispatch]);


    return (
        <Card className="border-top-0 rounded-0"
        >
            <CardBody>
                <Form autoComplete="login">
                    <Collapse isOpen={Error.length > 0}>
                        <Alert color="danger">
                            {errors(Error)}
                        </Alert>
                    </Collapse>
                    <FormGroup>
                        <input type="text" className="form-control" placeholder={strings.login} autoComplete="username"
                               onInput={(event => setUsername(event.currentTarget.value))}
                               autoFocus
                               onKeyDown={event => {
                                   if (event.key === "Enter") {
                                       event.preventDefault();
                                       event.stopPropagation();
                                       passRef.current?.focus();
                                   }
                               }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <input ref={passRef} type="password" className="form-control" placeholder={strings.password}
                               autoComplete="current-password"
                               onInput={(event => setPassword(event.currentTarget.value))}/>
                    </FormGroup>
                    <TwoFaPinConnected onChanged={(status, value) => {
                        setPin(value);
                        setPinOk(status);
                    }}/>
                </Form>
            </CardBody>
            <FormGroup className="card-footer mb-0">
                <Row className="justify-content-end">
                    <LoadingBtn loading={loading} outline color="primary" className="mr-3"
                                disabled={Username === "" || Password === "" || !PinOk}
                                onClick={() => setSendRequest(true)}>{strings.loginBtn}</LoadingBtn>
                    <NavLink to="/profile/resetpassword">{strings.forgetPassord}</NavLink>
                </Row>
            </FormGroup>
        </Card>
    );
};

export default Login;