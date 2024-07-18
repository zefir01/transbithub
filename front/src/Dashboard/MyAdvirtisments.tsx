import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    FormText,
    Label, ListGroup, ListGroupItem, Modal, ModalFooter, ModalHeader,
    Row,
    Spinner,
    Table
} from "reactstrap";
import {NavLink, Redirect} from "react-router-dom";

import {
    getToken,
    GrpcError, toDate,
    tradeApiClient,
    TradeGrpcRunAsync
} from "../helpers";
import {useDispatch, useMappedState} from "redux-react-hook";
import {initMathjs, useMathjs, useStrings} from "../Hooks";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/Dashboard/MyAdvirtisments";
import {data as dataS, myMap} from "../localization/PaymentTypes"
import {Price} from "../MainPages/Price";
import {AuthState, IStore} from "../redux/store/Interfaces";
import {
    AdCurrentStatus,
    Advertisement,
    AllAdvertisementsStatus,
    ChangeAdvertisementStatusRequest,
    ChangeAdvertisementStatusResponse,
    DeleteAdvertisementRequest,
    FindAdvertisementsResponse, MyProfileResponse,
} from "../Protos/api_pb";
import {CountriesCatalog} from "../Catalog";
import {ProfileSuccess} from "../redux/actions";
import {AutoPriceModal} from "./AutoPriceInfo";
import humanizeDuration from "humanize-duration";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MyDecimal} from "../MyDecimal";
import {LoadingBtn} from "../LoadingBtn";
import {Col4} from "../global";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {errors} from "../localization/Errors";

library.add(fas);
const updateLookup: IconLookup = {prefix: 'fas', iconName: 'sync-alt'};
const updateIconDefinition: IconDefinition = findIconDefinition(updateLookup);


export interface LinksModalProps {
    isOpen: boolean;
    onClose: () => void;
    ad: Advertisement.AsObject | null;
}

export function LinksModal(props: LinksModalProps) {
    const strings: IStrings = useStrings(data);
    if (!props.ad) {
        return null;
    }
    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h5>{strings.links}</h5>
                <span className="small text-secondary">
                    {strings.linksDesc}
                </span>
            </ModalHeader>
            <ListGroup>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.standard}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer' href={`/links/advertisement/${props.ad.id}`}>
                                {`${window.location.origin.toString()}/links/advertisement/${props.ad.id}/{${strings.amount}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.helper}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer' href={`/links/helper/advertisement/${props.ad.id}`}>
                                {`${window.location.origin.toString()}/links/helper/advertisement/${props.ad.id}/{${strings.amount}}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.iframe}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer' href={`/iframes/advertisement/${props.ad.id}`}>
                                {`${window.location.origin.toString()}/iframes/advertisement/${props.ad.id}/{${strings.amount}}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col {...Col4}>
                            {strings.iframeHelper}
                        </Col>
                        <Col>
                            <a target='_blank noopener noreferer' href={`/iframes/helper/advertisement/${props.ad.id}`}>
                                {`${window.location.origin.toString()}/iframes/helper/advertisement/${props.ad.id}/{${strings.amount}}`}
                            </a>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
            <ModalFooter>
                <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
            </ModalFooter>
        </Modal>
    );
}


const MyAdvirtisments = () => {
    const strings: IStrings = useStrings(data);
    const paymentStrings = new myMap(dataS);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            profile: store.profile.GeneralSettings,
            options: store.profile.BoughtOptions,
            lang: store.lang.Lang
        }), []
    );
    const {authState, profile, options, lang} = useMappedState(mapState);

    const [init, setInit] = useState(false);
    const [ads, setAds] = useState(new Array<Advertisement.AsObject>());
    const [mathjs, setMathjs] = useState<ReturnType<typeof initMathjs> | null>(null);
    const [error, setError] = useState("");
    const [edit, setEdit] = useState(0);
    const [remove, setRemove] = useState(0);
    const [status, setStatus] = useState(0);
    const [vacationRunning, setVacationRunning] = useState(false);
    const [salesDisable, setSalesDisable] = useState(false);
    const [buysDisable, setBuysDisable] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [autoPriceModalOpen, setAutoPriceModalOpen] = useState(false);
    const [update, setUpdate] = useState(true);
    const [updateRunning, setUpdateRunning] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [linksAd, setLinksAd] = useState<Advertisement.AsObject | null>(null);

    useMathjs((math, error) => {
        if (math !== null) {
            setMathjs(math);
            setError("");
        } else
            setError(error);
    }, mathjs === null);

    useEffect(() => {
        if (init || authState !== AuthState.Authed)
            return;
        setError("");

        async function f() {
            let req = new Empty();

            try {
                let resp = await TradeGrpcRunAsync<FindAdvertisementsResponse.AsObject>(tradeApiClient.getMyAdvertisements, req, getToken());
                setInit(true);
                setAds(resp.advertisementsList);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [init, authState]);

    useEffect(() => {
        if (authState !== AuthState.Authed || (!buysDisable && !salesDisable) || vacationRunning)
            return;
        setVacationRunning(true);

        async function f() {
            let req = new AllAdvertisementsStatus();
            if (buysDisable) {
                req.setBuysdisabled(!profile.buysDisabled);
            }
            else{
                req.setBuysdisabled(profile.buysDisabled);
            }
            if (salesDisable) {
                req.setSalesdisabled(!profile.salesDisabled);
            }
            else{
                req.setSalesdisabled(profile.salesDisabled);
            }

            try {
                let resp = await TradeGrpcRunAsync<MyProfileResponse.AsObject>(tradeApiClient.setAllAdvertisementsStatus, req, getToken());
                dispatch(ProfileSuccess(resp));
                setError("");
            } catch (e) {
                if (e instanceof GrpcError)
                    setError(errors(e.message));
            } finally {
                setSalesDisable(false);
                setBuysDisable(false);
                setVacationRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, buysDisable, vacationRunning, profile.buysDisabled, profile.salesDisabled, salesDisable, dispatch]);

    useEffect(() => {
        if (remove === 0 || authState !== AuthState.Authed || removing)
            return;
        setRemoving(true);

        async function f() {
            let req = new DeleteAdvertisementRequest();
            req.setId(remove);

            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.deleteAdvertisement, req, getToken());
                setAds(ads.filter(p => p.id !== remove));
                setRemove(0);
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            } finally {
                setRemoving(false)
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [remove, authState, ads, removing]);
    useEffect(() => {
        if (status === 0 || authState !== AuthState.Authed)
            return;
        setStatus(0);

        async function f() {
            let req = new ChangeAdvertisementStatusRequest();
            req.setAdvertisementid(status);
            let ad = ads.find(p => p.id === status);
            if (ad === undefined)
                return;
            req.setIsenabled(!ad.isenabled);

            try {
                let res = await TradeGrpcRunAsync<ChangeAdvertisementStatusResponse.AsObject>(tradeApiClient.changeAdvertisementStatus, req, getToken());
                ad.isenabled = !ad.isenabled;
                ad.currentstatus = res.currentstatus;
                setAds(ads.filter(p => p));
            } catch (e) {
                if (e instanceof GrpcError) {
                    console.log(e.message);
                    setError(errors(e.message));
                }
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [status, ads, authState]);
    useEffect(() => {
        if (authState === AuthState.NotAuthed || updateRunning || !update) {
            return;
        }

        setUpdateRunning(true);
        setUpdate(false);

        async function f() {
            let req = new Empty();
            let token = getToken();
            try {

                let resp = await TradeGrpcRunAsync<MyProfileResponse.AsObject>(tradeApiClient.getMyProfile, req, getToken());
                dispatch(ProfileSuccess(resp));
            } catch (e) {
                console.log("profile error. token=" + token + " state=" + authState);
            } finally {
                setUpdateRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [authState, update, dispatch, updateRunning]);


    function getBtnText(ad: Advertisement.AsObject) {
        switch (ad.currentstatus) {
            case AdCurrentStatus.ENABLED:
                return strings.active;
            case AdCurrentStatus.DISABLEDBYOWNER:
                return strings.DisabledByOwner;
            case AdCurrentStatus.DISABLEDBYTIMETABLE:
                return strings.DisabledByTimetable;
            case AdCurrentStatus.GLOBALDISABLED:
                return strings.DisabledByOwner;
            case AdCurrentStatus.NOTENOUGHMONEY:
                return strings.NotEnoughMoney;
        }
    }

    function createRow(ad: Advertisement.AsObject) {
        if (mathjs === null || mathjs.evaluate === undefined)
            return;

        let time = ad.createdat;
        return (
            <tr key={ad.id}>
                <th scope="row">{ad.id}</th>
                <td>
                    <Button className="btn-block btn-sm" color={ad.isenabled ? "success" : "secondary"} outline
                            onClick={() => setStatus(ad.id)}
                    >
                        {getBtnText(ad)}
                    </Button>
                </td>
                <td>{ad.isbuy ? strings.buy : strings.sell + ", "} <span
                    className="text-uppercase text-primary">{paymentStrings.get(ad.paymenttype)}</span> {", " + ad.title}
                </td>
                <td>{CountriesCatalog.get(ad.country)}</td>
                <td>
                    <Price price={MyDecimal.FromPb(ad.price)}
                           currency={ad.fiatcurrency.toUpperCase()}/>
                </td>
                <td>{ad.equation}</td>
                <td>
                    {ad.autopricedelayisnull ?
                        <span>{strings.no}</span>
                        :
                        <span
                            className={options!.autopricerecalcs > 0 ? "text-success" : "text-danger font-weight-bold"}>
                            {duration(ad.autopricedelay)}
                        </span>
                    }
                </td>
                <td>{time !== undefined ? toDate(time).toLocaleString() : ""}</td>
                <td>
                    <Button className="btn-block btn-sm" color="info" outline onClick={() => setEdit(ad.id)}>
                        {strings.edit}
                    </Button>
                    {/* eslint-disable-next-line eqeqeq */}
                    <LoadingBtn loading={removing && remove == ad.id} className="btn-block btn-sm" color="danger"
                                outline onClick={() => setRemove(ad.id)}>
                        {strings.delete}
                    </LoadingBtn>
                    <Button outline color="primary" className="btn-block btn-sm" onClick={() => setLinksAd(ad)}>
                        {strings.links}
                    </Button>
                </td>
            </tr>
        );
    }

    function duration(seconds: number): string {
        let d = seconds * 1000;
        return humanizeDuration(d,
            {
                language: lang,
                largest: 2,
                round: true,
                fallbacks: ['en']
            }
        )
    }

    function getAutoPriceCalc() {
        if (!options) {
            return null;
        }
        let active = ads.filter(p => !p.autopricedelayisnull && (p.currentstatus === AdCurrentStatus.ENABLED
            || p.currentstatus === AdCurrentStatus.NOTENOUGHMONEY));
        if (active.length === 0) {
            return <span className="h4">∞</span>;
        }
        const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
        let all = active.map(p => 1 / p.autopricedelay).reduce(reducer);
        let total = Math.round(options.autopricerecalcs / all);
        return (
            <span className={total >= 3600 ? "text-success" : "text-danger"}>{duration(total)}</span>
        );
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>
    }

    if (edit !== 0) {
        return (
            <Redirect push to={"/createAdvertisement/" + edit}/>
        );
    }
    if (authState !== AuthState.Authed || mathjs === null || !init)
        return <Loading/>;

    return (
        <Container>
            <LinksModal ad={linksAd} isOpen={linksAd !== null} onClose={() => setLinksAd(null)}/>
            <AutoPriceModal isOpen={autoPriceModalOpen} onClose={() => setAutoPriceModalOpen(false)}/>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <h2>{strings.title}</h2>
                            <p>{strings.info}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <NavLink to="/createAdvertisement" className="btn btn-outline-primary float-right">
                                {strings.create}
                            </NavLink>
                        </Col>
                    </Row>
                </Col>
                <Col className="col-auto">
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h5>{strings.vacation}</h5>
                            </CardTitle>
                            <Row>
                                <Col>
                                    <input type="checkbox" checked={profile.salesDisabled}
                                           onClick={() => setSalesDisable(true)}/>
                                    <Label className="ml-1 mb-0">
                                        {strings.salesDisabled}
                                    </Label>
                                    <FormText>{strings.salesDisabledHelp}</FormText>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <input type="checkbox" checked={profile.buysDisabled}
                                           onClick={() => setBuysDisable(true)}
                                    />
                                    <Label className="ml-1 mb-0">
                                        {strings.buysDisabled}
                                    </Label>
                                    <FormText>
                                        {strings.buysDisabledHelp}
                                    </FormText>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col className="col-auto">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <CardTitle>
                                        <h5>{strings.autoPrice}</h5>
                                    </CardTitle>
                                </Col>
                                <Col className="col-auto">
                                    {!updateRunning ?
                                        <FontAwesomeIcon icon={updateIconDefinition} style={{cursor: "pointer"}}
                                                         onClick={() => {
                                                             setUpdate(true);
                                                         }}
                                        />
                                        :
                                        <Spinner color="primary" size="sm"/>
                                    }
                                </Col>
                            </Row>
                            <span className="d-block">{strings.autoPriceBuyed} {options?.autopricerecalcs ?? 0}</span>
                            <span className="d-block">{strings.period} {getAutoPriceCalc()}</span>
                            <span className="text-primary d-block" style={{cursor: "pointer"}}
                                  onClick={() => setAutoPriceModalOpen(true)}>
{strings.autoPriceMore}
</span>
                            <Button className="mt-3" color="primary"
                                    onClick={() => setRedirect("/dashboard/buyAutoPrice/")}>
                                {strings.autoPriceBuy}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""}>{error}</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table className="mt-1">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{strings.status}</th>
                            <th scope="col">{strings.type}</th>
                            <th scope="col">{strings.country}</th>
                            <th scope="col">{strings.price}</th>
                            <th scope="col">{strings.expression}</th>
                            <th scope="col">{strings.autoPrice}</th>
                            <th scope="col">{strings.createdAt}</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            ads.map(p => createRow(p))
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};
export default MyAdvirtisments;