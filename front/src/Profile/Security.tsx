import {Redirect} from "react-router-dom";
import * as React from "react";
import {Button, Card, CardBody, Col, Row} from "reactstrap";
import {data, IStrings} from "../localization/Profile/Security";
import {EnableDisableBadge} from "./EnableDisableBadge";
import {Loading} from "../Loading";
import {useMappedState} from "redux-react-hook";
import {useCallback, useState} from "react";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {useStrings} from "../Hooks";


const Security = () => {
    const strings: IStrings = useStrings(data);
    const [navigate, setNavigate] = useState("");

    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            profile: store.profile,
        }), []
    );
    const {authState, profile} = useMappedState(mapState);

    if (authState !== AuthState.Authed || profile.Username.length === 0)
        return (
            <Loading/>
        );
    if (navigate !== "") {
        return (
            <Redirect push to={navigate}/>
        );
    }

    return (
        <Card>
            <h6 className="card-header">{strings.title}</h6>
            <CardBody className="py-3 mx-1">
                <Row>
                    <Col xs={9} className=" mb-0 mb-sm-3">
                        <span>{strings.password}</span>
                        <p className="pb-1 my-0 ml-2">
                            <small>{strings.passwordHelp}</small>
                        </p>
                    </Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                        <Button color="primary" outline className="float-right"
                                onClick={() => setNavigate("/profile/changePassword")}
                        >
                            {strings.change}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={9} className="mb-0 mb-sm-3">
                        <span>{strings.email}</span>
                        <EnableDisableBadge isEnable={profile.EmailVerifed}
                                            enableText={strings.confirmed} disableText={strings.noConfirmed}/>
                        <p className="pb-1 my-0 ml-2"><small>{profile.Email}</small></p>
                    </Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                        <Button
                            onClick={() => setNavigate("/profile/changeEmail")}
                            color="primary" outline className="float-right">
                            {strings.change}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={9} className="mb-0 mb-sm-3">
                        <span>
                            {strings.twoFa}
                        </span>
                        <EnableDisableBadge isEnable={profile.EnabledTwoFA}/>
                        <p className="pb-1 my-0 ml-2">
                            <small>{strings.twoFaHelp}</small>
                        </p>
                    </Col>
                    {profile.EnabledTwoFA ?
                        (
                            <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                                <Button color="danger" outline className="float-right"
                                        onClick={() => setNavigate("/profile/totpdisable")}
                                >{strings.disable}</Button>
                            </Col>
                        ) :
                        (
                            <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                                <Button color="success" outline className="float-right"
                                        onClick={() => setNavigate("/profile/totpsetup")}
                                >{strings.enable}</Button>
                            </Col>
                        )
                    }
                </Row>
                {/*
                    <Row>
                        <Col xs={9} className="mb-0 mb-sm-3">
                            <span>{strings.telegram}</span>
                            <p className="pb-1 my-0 ml-2"><small>{strings.telegramHelp}</small></p>
                        </Col>
                        <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                            <Button color="primary" outline className="float-right"
                                    onClick={() => setNavigate("/profile/telegram")}
                            >
                                {strings.change}
                            </Button>
                        </Col>
                    </Row>
                    */
                }
                <Row>
                    <Col xs={9} className="mb-0 mb-sm-3">
                        <span>{strings.trdApp}</span>
                        <p className="pb-1 my-0 ml-2"><small>{strings.trdAppHelp}</small></p>
                    </Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                        <Button color="primary" outline className="float-right"
                                onClick={() => setNavigate("/profile/tokens")}
                        >
                            {strings.edit}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={9} className="mb-0 mb-sm-3">
                        <span>{strings.sessions}</span>
                        <p className="pb-1 my-0 ml-2"><small>{strings.sessionsHelp}</small></p>
                    </Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-end mb-sm-3">
                        <Button color="primary" outline className="float-right"
                                onClick={() => setNavigate("/profile/sessions")}
                        >
                            {strings.show}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={9} className="mb-0 mb-sm-3">
                        <span>{strings.delete}</span>
                        <p className="pb-1 my-0 ml-2"><small>{strings.deleteHelp}</small></p>
                    </Col>
                    <Col xs={3} className="col-sm-3 d-flex align-items-center justify-content-end mb-sm-3">
                        <Button color="danger" outline className="float-right"
                                onClick={() => setNavigate("/profile/removeaccount")}
                        >
                            {strings.deleteBtn}
                        </Button>
                    </Col>
                </Row>
            </CardBody>

        </Card>
    )
};

export default Security;