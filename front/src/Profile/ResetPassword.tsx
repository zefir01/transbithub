import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import TwoFaPin from "./TwoFaPin";
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormFeedback,
    FormGroup,
    FormText,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Row
} from "reactstrap";
import {data, IStrings} from "../localization/Profile/ResetPassword";
import {useDispatch, useMappedState} from "redux-react-hook";
import PasswordForm, {Status} from "./PasswordForm";
import * as EmailValidator from 'email-validator';
import {errors} from "../localization/Errors";
import {
    PasswordRecoveryConfirmRequest,
    PasswordRecoveryRequest
} from "../Protos/profile_pb";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync} from "../helpers";
import {ProfileActionTypes} from "../redux/actions";
import {LoadingBtn} from "../LoadingBtn";
import {IStore} from "../redux/store/Interfaces";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";


const ResetPassword = () => {
    const strings: IStrings = useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
        }), []
    );
    const {profile} = useMappedState(mapState);

    const [contact, setContact] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordValid, setNewPasswordValid] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState("");
    const [confirmSuccess, setConfirmSuccess] = useState(false);
    const [confirmError, setConfirmError] = useState("");
    const [sendRequest, setSendRequest] = useState(false);
    const [confirmRequest, setConfirmRequest] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    function isValidContact(value: string): boolean {
        if (value.replace(/\D/g, '').length === 11)
            return true;
        return EmailValidator.validate(value);

    }

    useEffect(() => {
        if (!sendRequest)
            return;
        setSendRequest(false);
        setSendSuccess(false);
        setSendError("");
        setSendLoading(true);

        async function f() {
            let req = new PasswordRecoveryRequest();
            req.setEmail(contact);
            req.setTwofa(pin);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.passwordRecovery, req);
                setSendSuccess(true);
            } catch (e) {
                if (e instanceof GrpcError)
                    if(e.message==="Need twoFa.") {
                        dispatch({type: ProfileActionTypes.NEED_TWOFA_PIN});
                    }
                else {
                        setSendError(e.message);
                    }
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, contact, dispatch, pin]);

    useEffect(() => {
        if (!confirmRequest)
            return;
        setConfirmRequest(false);
        setConfirmError("");
        setConfirmSuccess(false);
        setConfirmLoading(true);

        async function f() {
            let req = new PasswordRecoveryConfirmRequest();
            req.setEmail(contact);
            req.setNewpassword(newPassword);
            req.setToken(code);

            try {
                await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.passwordRecoveryConfirm, req);
                setConfirmSuccess(true);
            } catch (e) {
                if (e instanceof GrpcError)
                    setConfirmError(e.message);
            }
            setConfirmLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [confirmRequest, code, contact, newPassword]);


    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.RecoveryPassword}</h1>
                    <p>{strings.Info1}</p>
                    <p><strong>{strings.Info2}</strong></p>
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={12} lg={6} xl={6}>
                    <Card>
                        <CardHeader>
                            <h4>{strings.Instruction}</h4>
                        </CardHeader>
                        <CardBody>
                            <ol>
                                <li>
                                    {strings.Inst1}
                                    <p><strong>{strings.Inst1_1}</strong></p>
                                </li>
                                <li>
                                    {strings.Inst2}
                                </li>
                                <li>
                                    {strings.Inst3}
                                </li>
                                <li>
                                    {strings.Inst4}
                                </li>
                                <li>
                                    {strings.Inst5}
                                </li>
                                <li>
                                    {strings.Inst6}
                                </li>
                                <li>
                                    {strings.Inst7}
                                </li>

                            </ol>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={6} xl={6}>
                    <Card>
                        <CardHeader>
                            <h4>{strings.ChangePass}</h4>
                        </CardHeader>
                        <CardBody>

                            <InputGroup>
                                <Input type="text" placeholder={strings.Email}
                                       onInput={event => setContact(event.currentTarget.value)}
                                />
                                <InputGroupAddon addonType="append">
                                    <LoadingBtn loading={sendLoading} color="primary" outline
                                            disabled={!isValidContact(contact) || !pinOk}
                                            onClick={() => setSendRequest(true)}
                                    >
                                        {strings.SendCode}
                                    </LoadingBtn>
                                </InputGroupAddon>
                            </InputGroup>

                            <Alert color="warning" className="mt-3"
                                   isOpen={profile.EnabledTwoFA}>{strings.Warn1}</Alert>
                            <TwoFaPin onChanged={(status, value) => {
                                setPin(value);
                                setPinOk(status)
                            }}/>

                            <Alert color="success" className="mt-3" isOpen={sendSuccess}>{strings.CodeSuccess}</Alert>
                            <Alert color="danger" className="mt-3"
                                   isOpen={sendError !== ""}>{errors(sendError)}</Alert>

                            <FormGroup className="pt-3">
                                <Label>{strings.RecoveryCode}</Label>
                                <Input type="text" onInput={event => setCode(event.currentTarget.value)}/>
                                <FormText>{strings.RecoveryCodeHelp}</FormText>
                            </FormGroup>
                            <PasswordForm placeHolder={strings.NewPassword} onStatusChanged={(status, value) => {
                                setNewPassword(value);
                                setNewPasswordValid(status !== Status.ERROR);
                            }}/>
                            <FormGroup>
                                <Input type="password" placeholder={strings.Confirmation}
                                       onInput={event => setConfirm(event.currentTarget.value)}
                                       invalid={confirm !== "" && confirm !== newPassword}
                                />
                                <FormFeedback invalid>
                                    {strings.ConfirmationInvalid}
                                </FormFeedback>
                            </FormGroup>
                            <Row className="justify-content-end px-3">
                                <LoadingBtn loading={confirmLoading} color="primary" outline
                                        disabled={!setNewPasswordValid || confirm !== newPassword || code === "" || !newPasswordValid}
                                        onClick={() => setConfirmRequest(true)}
                                >{strings.ChangePassword}</LoadingBtn>
                            </Row>
                            <Alert color="success" className="mt-3"
                                   isOpen={confirmSuccess}>{strings.PassSuccess}</Alert>
                            <Alert color="danger" className="mt-3"
                                   isOpen={confirmError !== ""}>{errors(confirmError)}</Alert>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
};

export default ResetPassword;