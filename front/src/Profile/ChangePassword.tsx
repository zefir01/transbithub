import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Alert, Card, CardBody, CardFooter, CardHeader, Col, Collapse, FormGroup, Input, Row} from "reactstrap";
import PasswordForm, {Status} from "./PasswordForm";
import {data, IStrings} from "../localization/Profile/ChangePassword";
import TwoFaPinConnected from "./TwoFaPin";
import {Loading} from "../Loading";
import {useMappedState} from "redux-react-hook";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync, getToken} from "../helpers";
import {ChangePasswordRequest} from "../Protos/profile_pb";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {errors} from "../localization/Errors";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";


const ChangePassword = () => {
    const strings: IStrings=useStrings(data);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);

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
        setSuccess(false);
        setError("");
        setSendLoading(true);

        async function f() {
            let req = new ChangePasswordRequest();
            req.setNewpassword(newPassword);
            req.setOldpassword(oldPassword);
            req.setTwofa(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.changePassword, req, getToken());
                setSuccess(true);
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, authState, newPassword, oldPassword, pin]);


    if (profile.Username === "")
        return (
            <Loading/>
        );
    return (
        <Row className="justify-content-center">
            <Col sm={12} md={6} lg={4} xl={4}>
                <Card>
                    <CardHeader>
                        <h6>{strings.PasswordChange}</h6>
                    </CardHeader>
                    <CardBody>

                        <Collapse isOpen={success}>
                            <Alert color="success">{strings.PasswordChanged}</Alert>
                        </Collapse>

                        <FormGroup>
                            <Input type="password" placeholder={strings.OldPassword}
                                   onInput={event => setOldPassword(event.currentTarget.value)}
                                   invalid={error !== ""}
                            />
                            <div className="invalid-feedback">{errors(error)}</div>
                        </FormGroup>

                        <PasswordForm placeHolder={strings.NewPassword}
                                      onStatusChanged={(status: Status, value: string) => {
                                          setNewPassword(value);
                                      }}/>

                        <FormGroup>
                            <Input type="password" placeholder={strings.NewPasswordConfirm}
                                   onInput={event => setConfirmation(event.currentTarget.value)}
                                   valid={newPassword !== "" && confirmation !== "" && confirmation === newPassword}
                                   invalid={newPassword !== "" && confirmation !== "" && confirmation !== newPassword}
                            />
                            <div className="invalid-feedback">{strings.ConfirmEquals}</div>
                        </FormGroup>

                        <TwoFaPinConnected onChanged={(status, value) => {
                            setPin(value);
                            setPinOk(status);
                        }}/>


                    </CardBody>
                    <CardFooter>
                        <Row className="justify-content-center">
                            <LoadingBtn loading={sendLoading} outline color="primary"
                                    disabled={!(newPassword !== "" && confirmation !== "" && confirmation === newPassword && oldPassword !== "" && pinOk)}
                                    onClick={() => setSendRequest(true)}
                            >{strings.ChangePassword}</LoadingBtn>
                        </Row>
                    </CardFooter>
                </Card>
            </Col>
        </Row>
    );
}


export default ChangePassword;