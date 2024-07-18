import * as React from "react";
import {useEffect, useState} from "react";
import {data, IStrings} from "../localization/Profile/Register";
import {Alert, Card, CardBody, Collapse, Form, FormFeedback, FormGroup, Input, Row} from "reactstrap";
import PasswordForm, {Status} from "./PasswordForm";
import {useDispatch} from "redux-react-hook";
import * as profile from "../Protos/profile_pb";
import {profileApiClient, GetRefreshToken, GrpcError, ProfileGrpcRunAsync} from "../helpers";
import {LoadingBtn} from "../LoadingBtn";
import {NewToken, ProfileActionTypes} from "../redux/actions";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";


const Register = () => {
    const strings: IStrings = useStrings(data);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [userError, setUserError] = useState(false);

    const dispatch = useDispatch();



    function isUsernameError(user: string): boolean {
        if (user.length === 0) {
            return false;
        }
        return user.match(/[^a-zA-Z0-9-._@+]/g) !== null;

    }

    useEffect(() => {
        if (!sendRequest)
            return;
        setSendRequest(false);
        setSendLoading(true);

        async function f() {
            let lang=navigator.language.toUpperCase().substr(0,2);
            let req = new profile.RegisterRequest();
            req.setLang(lang);
            req.setUsername(username);
            req.setPassword(password);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.registerUser, req);
                setSuccess(true);
                let json = await GetRefreshToken(username, password, "");
                dispatch({type: ProfileActionTypes.LOGOUT});
                dispatch(NewToken(json.access_token, json.refresh_token, json.expires_in));
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            finally {
                setSendLoading(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, dispatch, password, username]);


    return (
        <Card className="border-top-0 rounded-0">
            <CardBody>
                <Form autoComplete="login">
                    <Collapse isOpen={error.length > 0}>
                        <Alert color="danger" isOpen={error.length > 0}>
                            {error === "This user already registered" ? strings.userRegistered : error}
                        </Alert>
                    </Collapse>
                    <Collapse isOpen={success}>
                        <Alert color="success">{strings.success}</Alert>
                    </Collapse>

                    <FormGroup>
                        <Input type="text" invalid={userError}
                               autoComplete="username"
                               placeholder={strings.login}
                               onInput={event => {
                                   setUsername(event.currentTarget.value);
                                   setUserError(isUsernameError(event.currentTarget.value));
                               }}/>
                        <FormFeedback invalid="true">{strings.user}</FormFeedback>
                    </FormGroup>

                    <PasswordForm onStatusChanged={(status, value) => {
                        setPassword(value);
                        setIsPasswordValid(status !== Status.ERROR);
                    }}/>

                    <FormGroup>
                        <Input type="password" invalid={confirmation.length > 0 && confirmation !== password}
                               autoComplete="off"
                               valid={confirmation.length > 0 && confirmation === password}
                               placeholder={strings.passConfirm}
                               onInput={(event => setConfirmation(event.currentTarget.value))}/>
                        <FormFeedback invalid="true">{strings.passNotMatch}</FormFeedback>
                    </FormGroup>
                </Form>
            </CardBody>
            <FormGroup className="card-footer mb-0">
                <Row className="justify-content-end">
                    <LoadingBtn loading={sendLoading} outline color="primary"
                                disabled={password === "" || confirmation === "" || password !== confirmation || !isPasswordValid || userError}
                                onClick={() => setSendRequest(true)}>{strings.regiterBtn}</LoadingBtn>
                </Row>
            </FormGroup>
        </Card>
    );

}
export default Register;