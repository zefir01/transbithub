import {Redirect} from "react-router-dom";
import * as React from "react";
import {
    Alert,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    Container,
    FormGroup,
    FormText,
    Input,
    Label,
    Row
} from "reactstrap";
import TwoFaPinConnected from "./TwoFaPin";
import {data, IStrings} from "../localization/Profile/TotpDisable";
import {Loading} from "../Loading";
import {useDispatch, useMappedState} from "redux-react-hook";
import {useCallback, useEffect, useState} from "react";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync, getToken} from "../helpers";
import {ProfileActionTypes} from "../redux/actions";
import {DisableTwoFaRequest} from "../Protos/profile_pb";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";


const TotpDisable = () => {
    const strings: IStrings = useStrings(data);
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [sendRequest, setSendRequest] = useState(false);
    const [sendLoading, setSendLoading]=useState(false);

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    useEffect(() => {
        if (authState !== AuthState.Authed || !sendRequest)
            return;
        setSendRequest(false);
        setError("");
        setSendLoading(true);

        async function f() {
            let req = new DisableTwoFaRequest();
            req.setPassword(password);
            req.setPin(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.disableTwoFa, req, getToken());
                dispatch({type:ProfileActionTypes.TOTP_DISABLE_SUCCESS});
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [sendRequest, authState, dispatch, password, pin]);


    if (authState !== AuthState.Authed || profile.Username === "")
        return (
            <Loading/>
        );
    if (!profile.EnabledTwoFA)
        return (
            <Redirect push to="/profile"/>
        );
    return (
        <Container>
            <Row>
                <Col size={12}>
                    <h2>{strings.title}</h2>
                    <p>
                        {strings.describe1}
                        <br/>
                        {strings.describe2}
                    </p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col sm={12} md={12} lg={6} xl={6} size={12}>
                    <Card>
                        <CardHeader>
                            <h4>{strings.disable2FA}</h4>
                        </CardHeader>
                        <CardBody>

                            <Collapse isOpen={error !== ""}>
                                <Alert color="danger">{error}</Alert>
                            </Collapse>

                            <FormGroup>
                                <Label for="password">{strings.currentPassword}</Label>
                                <Input type="password" className="form-control" id="password"
                                       aria-describedby="passwordHelp"
                                       value={password}
                                       onInput={event => setPassword(event.currentTarget.value)}
                                />
                                <FormText id="passwordHelp">{strings.currentPasswordHelp}</FormText>
                            </FormGroup>

                            <TwoFaPinConnected onChanged={(isValid: boolean, pin: string) => {
                                setPin(pin);
                                setPinOk(isValid);
                            }}/>

                        </CardBody>
                        <CardFooter>
                            <Row className="justify-content-center">
                                <LoadingBtn loading={sendLoading} color="danger"
                                        disabled={password === "" || !pinOk}
                                        onClick={() => setSendRequest(true)}
                                >
                                    {strings.btn}
                                </LoadingBtn>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export default TotpDisable;