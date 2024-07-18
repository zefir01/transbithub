import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Card, CardBody, CardFooter, CardHeader, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";
import {Col6_12} from "../global";
import TwoFaPin from "./TwoFaPin";
import {LoadingBtn} from "../LoadingBtn";
import {errors} from "../localization/Errors";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {RemoveAccountRequest} from "../Protos/profile_pb";
import {getToken, GrpcError, profileApiClient, ProfileGrpcRunAsync} from "../helpers";
import {ProfileActionTypes} from "../redux/actions";
import {data, IStrings} from "../localization/Profile/RemoveAccount";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Redirect} from "react-router-dom";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";

const RemoveAccount = () => {
    const strings: IStrings = useStrings(data);
    const [loading, setLoading] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [error, setError] = useState("");
    const [, setSuccess] = useState(false);
    const [redirect, setRedirect] = useState("");

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    useEffect(() => {
        if (profile.UserId === "" || !sendRequest || authState !== AuthState.Authed)
            return;
        setSendRequest(false);
        setError("");
        setSuccess(false);
        setLoading(true);

        async function f() {
            let req = new RemoveAccountRequest();
            req.setPassword(password);
            req.setTwofa(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.removeAccount, req, getToken());
                //await Logout(auth.refreshToken, auth.accessToken);
                dispatch({type: ProfileActionTypes.LOGOUT});
                setRedirect("/");
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setLoading(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, authState, dispatch, password, pin, profile.UserId]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (authState!==AuthState.Authed)
        return <Loading/>;

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.title}</h1>
                    <p>{strings.info1}</p>
                    <p><strong>{strings.info2}</strong></p>
                    <p>{strings.info3}</p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col {...Col6_12}>
                    <Card>
                        <CardHeader>
                            <h6>{strings.title}</h6>
                        </CardHeader>
                        <CardBody>
                            <Alert color="danger" isOpen={error !== ""}>{errors(error)}</Alert>
                            <FormGroup>
                                <Label>{strings.password}</Label>
                                <Input type="password" onInput={event => setPassword(event.currentTarget.value)}/>
                            </FormGroup>
                            <TwoFaPin onChanged={(status, value) => {
                                setPin(value);
                                setPinOk(status);
                            }}/>
                        </CardBody>
                        <CardFooter>
                            <Row className="justify-content-end">
                                <LoadingBtn loading={loading} outline color="danger"
                                            disabled={password === "" || !pinOk}
                                            onClick={() => setSendRequest(true)}
                                >{strings.remove}</LoadingBtn>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RemoveAccount;