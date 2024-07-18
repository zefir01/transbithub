import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {Alert, Card, CardBody, Col, Collapse, Container, Form, FormGroup, Row} from "reactstrap";
import {data, IStrings} from "../localization/Login/Login";
import {useDispatch, useMappedState} from "redux-react-hook";
import {NewToken, ProfileActionTypes} from "../redux/actions";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";
import {GetRefreshToken} from "../helpers";
import {useEventListener, useStrings} from "../Hooks";
import {Col6_12} from "../global";
import {Redirect} from "react-router-dom";
import {AuthState, IStore} from "../redux/interfaces";


export const Login = () => {
    const strings: IStrings = useStrings(data);
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [Error, setError] = useState("");
    const [sendRequest, setSendRequest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState("");

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

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
                let json = await GetRefreshToken(Username, Password, "");
                dispatch({type: ProfileActionTypes.LOGOUT});
                dispatch(NewToken(json.access_token, json.refresh_token, json.expires_in));
                setRedirect("/");
            } catch (e) {
                console.log(e);
                if (e.response.data?.error_description) {
                    setError(e.response.data.error_description);
                } else {
                    setError("Internal error.");
                }
            } finally {
                setLoading(false);
            }
        }

        f();
    }, [sendRequest, Password, Username, dispatch]);


    if (authState === AuthState.Authed) {
        return (
            <Redirect push to="/"/>
        );
    }

    if (redirect !== "") {
        return (
            <Redirect push to={redirect}/>
        );
    }

    return (
        <Container>
            <Row className="justify-content-center mt-3">
                <Col {...Col6_12}>
                    <Card>
                        <CardBody>
                            <Form autoComplete="login">
                                <Collapse isOpen={Error.length > 0}>
                                    <Alert color="danger">
                                        {errors(Error)}
                                    </Alert>
                                </Collapse>
                                <FormGroup>
                                    <input type="text" className="form-control" placeholder={strings.login}
                                           autoComplete="username"
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
                                    <input ref={passRef} type="password" className="form-control"
                                           placeholder={strings.password}
                                           autoComplete="current-password"
                                           onInput={(event => setPassword(event.currentTarget.value))}/>
                                </FormGroup>
                            </Form>
                        </CardBody>
                        <FormGroup className="card-footer mb-0">
                            <Row className="justify-content-end">
                                <LoadingBtn loading={loading} outline color="primary" className="mr-3"
                                            disabled={Username === "" || Password === ""}
                                            onClick={() => setSendRequest(true)}>{strings.loginBtn}</LoadingBtn>
                            </Row>
                        </FormGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};