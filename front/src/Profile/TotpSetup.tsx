import * as React from "react";
import {QRCode} from "react-qr-svg";
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
    Label,
    Row
} from "reactstrap";
import * as CSS from 'csstype';
import {data, IStrings} from "../localization/Profile/TotpSetup";
import {site, Col6_12} from "../global";
import {base32Encode} from '@ctrl/ts-base32';
import {Redirect} from "react-router-dom";
import {Loading} from "../Loading";
import {useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {useCallback} from "react";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync, getToken} from "../helpers";
import {ProfileActionTypes} from "../redux/actions";
import {GetTwoFACodeResponse} from "../Protos/profile_pb";
import {EnabledTwoFARequest} from "../Protos/profile_pb";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";

const style1: CSS.Properties = {
    width: "2rem",
    height: "2rem"
};

interface IQRProps {
    uri: string;
}

const QR = React.memo((props: IQRProps) => {
    return (
        <QRCode
            className="d-block mx-auto"
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            style={{width: 256}}
            value={props.uri}
        />
    );
});

const TotpSetup = () => {
    const strings: IStrings = useStrings(data);
    const [wrotChecked, setWrotChecked] = useState(false);
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    useEffect(() => {
        if (code !== "" || authState !== AuthState.Authed)
            return;

        async function f() {
            let req = new Empty();

            try {
                let resp = await ProfileGrpcRunAsync<GetTwoFACodeResponse.AsObject>(profileApiClient.getTwoFACode, req, getToken());
                setCode(resp.code);
                setError("");
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    });
    useEffect(() => {
        if (!sendRequest || authState !== AuthState.Authed)
            return;
        setSendRequest(false);
        setError("");
        setSuccess(false);

        async function f() {
            let req = new EnabledTwoFARequest();
            req.setPassword(password);
            req.setPin(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.enabledTwoFA, req, getToken());
                dispatch({type: ProfileActionTypes.TOTP_ENABLE_SUCCESS});
                setSuccess(true);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, authState, dispatch, password, pin]);


    function GetUri(): string {
        //return "otpauth://totp/" + site + ":" + this.props.profile.Username + "@" + site + "?secret=" + base32Encode(Buffer.from(this.props.code)) + "&issuer=" + site;
        let re =  /=/gi;
        return "otpauth://totp/" + profile.Username + "@" + site.toLowerCase() + "?secret=" + base32Encode(Buffer.from(code)).replaceAll(re, "");
    }


    if (profile.EnabledTwoFA)
        return (
            <Redirect push to="/profile"/>
        );
    if (authState !== AuthState.Authed || profile.Username === "" || code === "")
        return (
            <Loading/>
        );
    return (
        <Container>
            <Row>
                <Col>
                    <h2>{strings.title}</h2>
                    <p>
                        {strings.describe1}
                        <br/>
                        {strings.describe2}
                    </p>
                </Col>
            </Row>
            <Row>
                <Col {...Col6_12}>
                    <Card>
                        <CardHeader>
                            <h6>{strings.instruction}</h6>
                        </CardHeader>
                        <CardBody>
                            <ol>
                                <li>
                                    {strings.download1}
                                    <a target="_blank" rel="noopener noreferrer"
                                       href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">Android</a>,
                                    <a target="_blank" rel="noopener noreferrer"
                                       href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">iPhone,
                                        iPad {strings.and} iPod</a>
                                    {strings.or}
                                    <a href="https://www.windowsphone.com/en-us/store/app/authenticator/e7994dbc-2336-4950-91ba-ca22d653759b">Windows
                                        Phone</a>.
                                </li>
                                <li>
                                    {strings.backupCode} <strong className="auth-key">{code}</strong>
                                    <br/><strong>{strings.important}</strong> {strings.writeCode}
                                </li>
                                <li>
                                    {strings.run1} <i>{strings.scanCode}</i> {strings.scanCode1}
                                </li>
                                <li>
                                    {strings.enterCode}
                                </li>
                            </ol>
                        </CardBody>
                    </Card>
                </Col>
                <Col {...Col6_12}>
                    <Card>
                        <CardHeader>
                            <h6>{strings.title}</h6>
                        </CardHeader>
                        <CardBody>
                            {code === "" ? <Loading/> : <QR uri={GetUri()}/>}
                            <br/>
                            <FormGroup>
                                <Label for="password">{strings.currentPassword}</Label>
                                <input type="password" className="form-control" id="password"
                                       aria-describedby="passwordHelp"
                                       onInput={event => setPassword(event.currentTarget.value)}
                                />
                                <FormText id="passwordHelp">{strings.currentPasswordHelp}</FormText>
                            </FormGroup>

                            <FormGroup>
                                <Label for="pin">{strings.authCode}</Label>
                                <input type="tel" className="form-control" id="pin" aria-describedby="pinHelp"
                                       onInput={event => setPin(event.currentTarget.value)}
                                />
                                <FormText id="pinHelp">{strings.authCodeHelp}</FormText>
                            </FormGroup>

                            <p>
                                <input type="checkbox" style={style1}
                                       onChange={() => setWrotChecked(!wrotChecked)}
                                />
                                {strings.wrote}
                                <strong className="auth-key">
                                    {" " + code + " "}
                                </strong>
                                {strings.oOnPaper}
                            </p>
                        </CardBody>
                        <CardFooter>
                            <Row className="justify-content-center">
                                <LoadingBtn loading={sendLoading} type="button" color="primary"
                                            disabled={
                                                password === "" || pin === "" || !wrotChecked
                                            }
                                            onClick={() => setSendRequest(true)}
                                >{strings.enable}</LoadingBtn>
                            </Row>
                            <Row className="mt-3">
                                <Col size={12}>
                                    <Collapse isOpen={error.length > 0}>
                                        <Alert color="danger">{error}</Alert>
                                    </Collapse>
                                    <Collapse isOpen={success}>
                                        <Alert color="success">{strings.success}</Alert>
                                    </Collapse>
                                </Col>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};


export default TotpSetup;