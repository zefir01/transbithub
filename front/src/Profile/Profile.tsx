import * as React from "react";
import {Alert, Col, Container, Row} from "reactstrap";
import Security from "./Security";
import GeneralSettings from "./GeneralSettings";
import {useMappedState} from "redux-react-hook";
import {useCallback, useState} from "react";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/Profile/Profile";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useStrings} from "../Hooks";
import {Redirect} from "react-router-dom";

const Profile = () => {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            profile: store.profile
        }), []
    );
    const {authState, profile} = useMappedState(mapState);

    const [twoFaOpen, setTwoFaOpen] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(true);

    if (authState === AuthState.NotAuthed) {
        return <Loading/>;
    }
    if (authState === AuthState.AnonAuthed) {
        return <Redirect to="/login"/>;
    }

    if (authState !== AuthState.Authed || profile.UserId==="")
        return <Loading/>;

    return (
        <Container>
            {twoFaOpen && !profile.EnabledTwoFA?
                <Row>
                    <Col>
                        <Alert color="warning"
                               toggle={() => setTwoFaOpen(false)}>{strings.TwoFA}</Alert>
                    </Col>
                </Row>
                :null
            }
            {confirmOpen && !profile.EmailVerifed?
                <Row>
                    <Col>
                        <Alert color="danger"
                               toggle={() => setConfirmOpen(false)}>{strings.Confirm}</Alert>
                    </Col>
                </Row>
                :null
            }
            <Row>
                <Col sm={12} md={12} lg={6} xl={6} size={12}>
                    <Security/>
                </Col>
                <Col sm={12} md={12} lg={6} xl={6} size={12}>
                    <GeneralSettings/>
                </Col>
            </Row>
        </Container>
    )
};


export default Profile;