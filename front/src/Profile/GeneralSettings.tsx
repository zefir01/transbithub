import * as React from "react";
import {data, IStrings} from "../localization/Profile/GeneralSettings";
import {
    Alert,
    Card,
    CardBody,
    Collapse,
    FormGroup,
    FormText,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText, Row, Col
} from "reactstrap";
import {
    GrpcError,
    getToken,
    TradeGrpcRunAsync,
    tradeApiClient
} from "../helpers";
import {Loading} from "../Loading";
import {useEffect, useState} from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {useCallback} from "react";
import {SaveProfileGeneralSettingsSuccess} from "../redux/actions";
import {LoadingBtn} from "../LoadingBtn";
import {AuthState, IProfileGeneralSettings, IStore} from "../redux/store/Interfaces";
import {CurrenciesCatalog, TimeZonesCatalog} from "../Catalog";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {UpdateMyProfileRequest} from "../Protos/api_pb";
import {useStrings} from "../Hooks";
import {errors} from "../localization/Errors";





export interface State {
    accordionOpen: boolean;
    settings: IProfileGeneralSettings;
}


const GeneralSettings = () => {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            profile: store.profile
        }), []
    );
    const {authState, profile} = useMappedState(mapState);

    const [settings, setSettings] = useState(profile.GeneralSettings);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [sendRequest, setSendRequest] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [siteError, setSiteError] = useState("")
    const [introError, setIntroError] = useState("");


    useEffect(() => {
        if (authState !== AuthState.Authed || !sendRequest)
            return;
        setSendRequest(false);
        setSendLoading(true);
        setSuccess(false);

        async function f() {
            let req = new UpdateMyProfileRequest();
            req.setTimezone(settings.timezone);
            req.setIntroduction(settings.introduction);
            req.setSite(settings.site);
            req.setSalesdisabled(settings.salesDisabled);
            req.setBuysdisabled(settings.buysDisabled);
            req.setDefaultcurrency(settings.DefaultCurrency);
            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.updateMyProfile, req, getToken());
                dispatch(SaveProfileGeneralSettingsSuccess(settings));
                setError("");
                setSuccess(true);
            } catch (e) {
                console.log(e);
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            }
            setSendLoading(false);
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [sendRequest, authState, dispatch, settings]);


    if (profile.UserId.length === 0 || authState !== AuthState.Authed)
        return (
            <Loading/>
        );
    return (
        <Card>
            <h6 className="card-header">{strings.generalSettings}</h6>
            <CardBody>

                <Collapse isOpen={error.length > 0}>
                    <Alert color="danger">{error}</Alert>
                </Collapse>

                <InputGroup>
                    <InputGroupAddon addonType={"prepend"}>
                        <InputGroupText>{strings.defaultCurrency}</InputGroupText>
                    </InputGroupAddon>
                    <select className="select form-control" defaultValue={profile.GeneralSettings.DefaultCurrency}
                            onChange={event => {
                                setSettings({
                                    ...settings,
                                    DefaultCurrency: event.currentTarget.value
                                })
                            }}>
                        {
                            Array.from(new Set(CurrenciesCatalog.values())).sort().map(val => {
                                return (
                                    <option key={val} value={val}>{val}</option>
                                )
                            })
                        }
                    </select>
                </InputGroup>

                <InputGroup className="pt-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>{strings.timeZone}</InputGroupText>
                    </InputGroupAddon>
                    <select className="select form-control" id="id_timezone" name="timezone"
                        //Value={settings.timezone.length == 0 ? "---------" : settings.timezone}
                            defaultValue={profile.GeneralSettings.timezone}
                            onChange={event =>
                                setSettings(
                                    {
                                        ...settings,
                                        timezone: event.currentTarget.value
                                    })}>
                        {TimeZonesCatalog.sort().map(p => {
                            return (<option key={p} value={p}>{p}</option>);
                        })}
                    </select>
                </InputGroup>
                <FormGroup>
                        <textarea placeholder={strings.aboutPlaceholder} id="id_introduction"
                                  className={introError ? "textarea form-control is-invalid" : "textarea form-control"}
                                  cols={40} rows={4}
                                  value={settings.introduction}
                                  onInput={event => {
                                      setSettings(
                                          {
                                              ...settings,
                                              introduction: event.currentTarget.value
                                          });
                                      if (event.currentTarget.value.length > 300) {
                                          setIntroError(strings.errorMax300)
                                      } else {
                                          setIntroError("");
                                      }
                                  }}
                        />
                    <div className="invalid-feedback show">{introError}</div>
                    <FormText className="text-muted">{strings.aboutHelp}</FormText>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>{strings.site}</InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="https://www.example.com" type="text" aria-label="Site"
                               invalid={siteError !== ""}
                               className="form-control"
                               value={settings.site}
                               onInput={event => {
                                   setSettings(
                                       {
                                           ...settings,
                                           site: event.currentTarget.value
                                       });
                                   if (event.currentTarget.value.length > 300) {
                                       setSiteError(strings.errorMax300)
                                   } else {
                                       setSiteError("");
                                   }
                               }
                               }/>
                        <div className="invalid-feedback">{siteError}</div>
                    </InputGroup>
                    <small className="form-text text-muted">{strings.siteHelp}</small>
                </FormGroup>
                <br/>

                {
                    /*
                    <Card className="mb-0">
                        <CardHeader className="card-header">
                            <h6 className="card-title float-left">{strings.preferences}</h6>
                            <button color="secondary" className="float-right"
                                    onClick={event => setAccordionOpen(!accordionOpen)}>
                                <FontAwesomeIcon
                                    icon={accordionOpen ? minusIconDefinition : plusIconDefinition}/>
                            </button>
                        </CardHeader>
                        <Collapse isOpen={accordionOpen}>
                            <CardBody>

                                <FormGroup>
                                    <Label for="salesCheck">
                                        <input type="checkbox" id="salesCheck"
                                               checked={settings.salesDisabled}
                                               onChange={event =>
                                                   setSettings(
                                                       {
                                                           ...settings,
                                                           salesDisabled: event.currentTarget.checked
                                                       })}/>
                                        {' '}{strings.salesDisabled}
                                        <FormText>{strings.salesDisabledHelp}</FormText>
                                    </Label>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="buysCheck">
                                        <input type="checkbox" id="buysCheck"
                                               checked={settings.buysDisabled}
                                               onChange={event =>
                                                   setSettings(
                                                       {
                                                           ...settings,
                                                           buysDisabled: event.currentTarget.checked
                                                       })}/>
                                        {' '}{strings.buysDisabled}
                                        <FormText>{strings.salesDisabledHelp}</FormText>
                                    </Label>
                                </FormGroup>

                            </CardBody>
                        </Collapse>
                    </Card>

                     */
                }

                <Row>
                    <Col>
                        <LoadingBtn loading={sendLoading} color="outline-primary" className="float-right mt-3"
                                    disabled={siteError !== "" || introError !== ""}
                                    onClick={() => setSendRequest(true)}>
                            {strings.saveChanges}
                        </LoadingBtn>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Alert isOpen={success} color="success" className="mt-3"
                               toggle={() => setSuccess(false)}>{strings.success}</Alert>
                    </Col>
                </Row>
            </CardBody>
        </Card>

    );
}

export default GeneralSettings;