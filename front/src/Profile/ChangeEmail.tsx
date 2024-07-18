import * as React from "react";
import {
    Alert,
    Card,
    CardBody, CardFooter,
    CardHeader,
    Col, Collapse,
    Container,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import {data, IStrings} from "../localization/Profile/ChangeEmail";
import TwoFaPinConnected from "./TwoFaPin";
import * as EmailValidator from 'email-validator';
import {Loading} from "../Loading";
import {useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {useCallback} from "react";
import {profileApiClient, GrpcError, ProfileGrpcRunAsync, getToken} from "../helpers";
import {ChangeEmailSuccess, ProfileActionTypes} from "../redux/actions";
import {ChangeEmailRequest, ConfirmEmailRequest} from "../Protos/profile_pb";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {useStrings} from "../Hooks";


const ChangeEmail = () => {
    const strings: IStrings=useStrings(data);
    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [pin, setPin] = useState("");
    const [pinOk, setPinOk] = useState(false);
    const [sendError, setSendError] = useState("");
    const [sendSuccess, setSendSuccess] = useState(false);
    const [confirmError, setConfirmError] = useState("");
    const [confirmSuccess, setConfirmSuccess] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [confirmRequest, setConfirmRequest] = useState(false);
    const [sendLoading, setSendLoading]=useState(false);
    const [confirmLoading, setConfirmLoading]=useState(false);

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state
        }), []
    );
    const {profile, authState} = useMappedState(mapState);

    useEffect(()=>{
       if(authState !== AuthState.Authed|| !sendRequest)
           return;
       setSendRequest(false);
       setSendError("");
       setSendSuccess(false);
       setSendLoading(true);
       async function f() {
           let req=new ChangeEmailRequest();
           req.setNewemail(email);
           req.setTwofa(pin);

           try {
               await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.changeEmail, req, getToken());
               dispatch(ChangeEmailSuccess(email));
               setSendSuccess(true);
           }
           catch (e) {
               if(e instanceof GrpcError)
                   setSendError(e.message);
           }
           setSendLoading(false);
       }
        // noinspection JSIgnoredPromiseFromCall
       f();
    },[sendRequest, authState, dispatch, email, pin]);
    useEffect(()=>{
       if(authState !== AuthState.Authed || !confirmRequest)
           return;
       setConfirmError("");
       setConfirmSuccess(false);
       setConfirmRequest(false);
       setConfirmLoading(true);
       async function f() {
           let req=new ConfirmEmailRequest();
           req.setToken(confirmationCode);

           try {
               await ProfileGrpcRunAsync<Empty.AsObject>(profileApiClient.confirmEmail, req, getToken());
               setConfirmSuccess(true);
               dispatch({type:ProfileActionTypes.CONFIRM_EMAIL_SUCCESS});
           }
           catch (e) {
               if(e instanceof GrpcError)
                   setConfirmError(e.message);
           }
           setConfirmLoading(false);
       }
        // noinspection JSIgnoredPromiseFromCall
       f();
    }, [confirmRequest, authState, confirmationCode, dispatch]);

    if (profile.Username.length === 0)
        return (
            <Loading/>
        );
    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.ChangeEmail}</h1>
                    <p>{strings.ActionTitle}</p>
                    <ul>
                        <li>{strings.Action1}</li>
                        <li>{strings.Action2}</li>
                        <li>{strings.Action3}</li>
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col sm={12} md={12} lg={6} xl={6}>
                    <Card>
                        <CardHeader>
                            <h6>{strings.ChangeEmail}</h6>
                        </CardHeader>
                        <CardBody>
                            <Collapse isOpen={sendSuccess}>
                                <Alert color="success">{strings.Success}</Alert>
                            </Collapse>
                            <Collapse isOpen={sendError!==""}>
                                <Alert color="danger">{strings.MailError}</Alert>
                            </Collapse>
                            <FormGroup>
                                <Label>{strings.NewEmail}</Label>
                                <Input type="email"
                                       placeholder="example@mail.com"
                                       value={email}
                                       invalid={email!=="" && !EmailValidator.validate(email)}
                                       valid={email!=="" && EmailValidator.validate(email)}
                                       onInput={event => setEmail(event.currentTarget.value)}
                                />
                                <FormFeedback invalid>{strings.InvalidEmail}</FormFeedback>
                            </FormGroup>
                            <TwoFaPinConnected onChanged={(status, value) => {
                                setPin(value);
                                setPinOk(status);
                            }}/>
                        </CardBody>
                        <CardFooter>
                            <Row className="justify-content-center">
                                <LoadingBtn loading={sendLoading} color="primary" outline
                                        disabled={!EmailValidator.validate(email) || !pinOk}
                                        onClick={() => setSendRequest(true)}
                                >{strings.ChangeEmail}</LoadingBtn>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
                <Col sm={12} md={12} lg={6} xl={6}>
                    <Card>
                        <CardHeader>
                            <h6>{strings.EmailConfirmation}</h6>
                        </CardHeader>
                        <CardBody>
                            <Collapse isOpen={confirmError!==""}>
                                <Alert color="danger">{strings.InvalidCode}</Alert>
                            </Collapse>
                            <Collapse isOpen={confirmSuccess}>
                                <Alert color="success">{strings.MailConfirmed}</Alert>
                            </Collapse>
                            <FormGroup>
                                <Label>{strings.ConfirmationCode}</Label>
                                <Input type="text"
                                       onInput={event=>setConfirmationCode(event.currentTarget.value)}
                                />
                            </FormGroup>
                        </CardBody>
                        <CardFooter>
                            <Row className="justify-content-center">
                                <LoadingBtn loading={confirmLoading} color="primary" outline
                                        disabled={confirmationCode===""}
                                        onClick={() => setConfirmRequest(true)}
                                >{strings.Confirm}</LoadingBtn>
                            </Row>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>

        </Container>
    );
};


export default ChangeEmail;