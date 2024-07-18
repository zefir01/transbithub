import React, {useState, useEffect, useCallback} from 'react';
import TwoFaPin from "./TwoFaPin";
import {Alert, Card, CardBody, CardHeader, Col, Collapse, Container, Row} from "reactstrap";
import {data, IStrings} from "../localization/Profile/Tokens";
import {useMappedState} from "redux-react-hook";
import {errors} from "../localization/Errors";
import {Loading} from "../Loading";
import {
    CreateReferenceTokenRequest, CreateReferenceTokenResponse,
    GetMyReferenceTokenResponse,
    RemoveReferenceTokenRequest
} from "../Protos/profile_pb";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync, getToken} from "../helpers";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";


const Tokens = () => {
    const strings: IStrings = useStrings(data);
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [createToken, setCreateToken] = useState(false);
    const [removeToken, setRemovwToken] = useState(false);
    const [sendLoading, setSendLoading]=useState(false);
    const [initLoading, setInitLoading]=useState(true);

    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    useEffect(() => {
        if (authState !== AuthState.Authed || profile.Username === "" || token !== "" || !initLoading)
            return;

        async function f() {
            let req = new Empty();

            try {
                let resp = await ProfileGrpcRunAsync<GetMyReferenceTokenResponse.AsObject>(profileApiClient.getMyReferenceToken, req, getToken());
                setToken(resp.token);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setInitLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    });
    useEffect(() => {
        if (authState !== AuthState.Authed || profile.Username === "" || !createToken)
            return;
        setError("");
        setSuccess(false);
        setCreateToken(false);
        setSendLoading(true);

        async function f() {
            let req = new CreateReferenceTokenRequest();
            req.setTwofa(pin);

            try {
                let resp = await ProfileGrpcRunAsync<CreateReferenceTokenResponse.AsObject>(profileApiClient.createReferenceToken, req, getToken());
                setToken(resp.token);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [createToken, authState, pin, profile.Username]);
    useEffect(() => {
        if (authState !== AuthState.Authed || profile.Username === "" || !removeToken)
            return;
        setError("");
        setSuccess(false);
        setRemovwToken(false);
        setSendLoading(true);

        async function f() {
            let req = new RemoveReferenceTokenRequest();
            req.setTwofa(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.removeReferenceToken, req, getToken());
                setToken("");
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [removeToken, authState, pin, profile.Username]);


    if (authState !== AuthState.Authed || profile.Username === "")
        return <Loading/>;

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.Title}</h1>
                    <p>{strings.Info1}</p>
                    <p>{strings.Info2}</p>
                    <p>{strings.Info3_1}<strong>{strings.Info3_2}</strong>{strings.Info3_3}</p>
                    <p><strong>{strings.Info4}</strong></p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Card>
                        <CardHeader>
                            <h6>{strings.KeyCreate}</h6>
                        </CardHeader>
                        <CardBody>
                            <p className="mb-3"><strong>{token === "" ? strings.NoToken : token}</strong></p>

                            <LoadingBtn loading={sendLoading} color="primary" outline className="mb-3 mr-3"
                                    disabled={!pinOk}
                                    onClick={() => setCreateToken(true)}
                            >{strings.CreateKey}</LoadingBtn>
                            <LoadingBtn loading={sendLoading} color="danger" outline className="mb-3 mr-3"
                                    disabled={!pinOk}
                                    onClick={() => setRemovwToken(true)}
                            >{strings.RemoveToken}</LoadingBtn>

                            <TwoFaPin onChanged={(status, value) => {
                                setPin(value);
                                setPinOk(status);
                            }}/>

                            <Collapse isOpen={success}>
                                <Alert color="success">{strings.Success}</Alert>
                            </Collapse>
                            <Collapse isOpen={error !== ""}>
                                <Alert color="danger">{errors(error)}</Alert>
                            </Collapse>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Tokens;