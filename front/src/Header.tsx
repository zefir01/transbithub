import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Badge,
    ButtonDropdown,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarToggler,
    NavItem,
    Row,
    UncontrolledDropdown,
} from "reactstrap";
import {bot, onionSite, site} from "./global";
import {NavLink, Redirect} from "react-router-dom";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Logout, RenewAnonAccessToken} from "./helpers";
import {ProfileActionTypes, SetLang} from "./redux/actions";
import {AuthState, EventTypes, IStore, Langs} from "./redux/store/Interfaces";
import {EventsViewer} from "./EventsViewer";
import {data, IStrings} from "./localization/Header";
import {useStrings} from "./Hooks";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(far);

const userLookup: IconLookup = {prefix: 'far', iconName: 'user'};
const userIconDefinition: IconDefinition = findIconDefinition(userLookup);

const Header = () => {
    const strings: IStrings = useStrings(data);
    const [collapsed, setCollapsed] = useState(true);
    const [logout, setLogout] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
            authState: store.auth.state,
            invoices: store.invoices,
            refreshToken: store.auth.refreshToken,
            anonRefreshToken: store.auth.anonRefreshToken,
            lang: store.lang.Lang,
            idbAvailable: store.idbStates.idbAvailable
        }), []
    );
    const {refreshToken, anonRefreshToken, authState, invoices, lang, profile, idbAvailable} = useMappedState(mapState);

    useEffect(() => {
        if (authState !== AuthState.Authed || !logout)
            return;
        setLogout(false);

        async function f() {
            try {
                await Logout(refreshToken);
                dispatch({type: ProfileActionTypes.LOGOUT});
                await RenewAnonAccessToken(dispatch, anonRefreshToken);
            } catch (e) {

            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();
    }, [logout, refreshToken, anonRefreshToken, authState, dispatch]);

    function getDocsUrl(): string {
        //TODO add english docs
        return "/docs-static/";
    }

    function getLang(): string {
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    }


    if (logout)
        return <Redirect push to="/"/>;

    // noinspection HttpUrlsUsage
    return (
        <div className="container-fluid">
            {idbAvailable === false && authState === AuthState.AnonAuthed ?
                <Row>
                    <Col className="text-center">
                        <Alert className="mb-0" color="danger">{strings.tor}</Alert>
                    </Col>
                </Row>
                : null
            }
            <Row>
                <Col className="col-auto">
                    {!window.location.hostname.endsWith("onion") ?
                        <>
                            <NavLink exact style={{color: 'black', textDecoration: 'none'}}
                                     activeStyle={{color: 'black', textDecoration: 'none'}}
                                     className="mb-0 pb-0 nav-link h2 d-block" to="/">
                                trans
                                <span style={{color: "#FFAB09"}}>bit</span>
                                hub
                            </NavLink>
                            <a className="pl-3 d-block" href={"http://" + onionSite}>{onionSite}</a>
                            <a className="pl-3 d-block" href={"https://t.me/" + bot}>Telegram: @{bot}</a>
                        </>
                        :
                        <>
                            <NavLink exact style={{color: 'black', textDecoration: 'none'}}
                                     activeStyle={{color: 'black', textDecoration: 'none'}}
                                     className="mb-0 pb-0 nav-link h2 d-block" to="/">{onionSite}</NavLink>
                            <a className="pl-3 d-block" href={"https://" + site.toLowerCase()}>
                                trans
                                <span style={{color: "#FFAB09"}}>bit</span>
                                hub
                            </a>
                            <a className="pl-3 d-block" href={"https://t.me/" + bot}>Telegram: @{bot}</a>
                        </>
                    }
                </Col>
                <Col className="col-auto my-3">
                    <ButtonDropdown size="sm" className="mx-3" direction="down" isOpen={langOpen}
                                    toggle={() => setLangOpen(!langOpen)}>
                        <DropdownToggle caret color="primary" outline size="sm">
                            {getLang()}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem color="primary" outline size="sm" onClick={() => dispatch(SetLang(Langs.en))}>En
                                - English</DropdownItem>
                            <DropdownItem color="primary" outline size="sm" onClick={() => dispatch(SetLang(Langs.ru))}>Ru
                                - Русский</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </Col>
                <Col>
                    <Navbar color="faded" light expand="md" className="pb-3">
                        <NavbarToggler className="mr-2" onClick={() => setCollapsed(!collapsed)}/>

                        <Collapse navbar isOpen={!collapsed}>
                            <Nav navbar className="ml-auto">
                                <NavItem>
                                    <NavLink exact className="nav-link" to="/helper">{strings.helper}</NavLink>
                                </NavItem>

                                {authState === AuthState.Authed ?
                                    <NavItem>
                                        <NavLink exact className="nav-link" to="/promises">{strings.promises}</NavLink>
                                    </NavItem>
                                    : null
                                }

                                <NavItem>
                                    <NavLink exact className="nav-link" to="/">{strings.buySell}</NavLink>
                                </NavItem>
                                {authState === AuthState.Authed ?
                                    <NavItem>
                                        <NavLink className="nav-link" to="/wallet">{strings.wallet}</NavLink>
                                    </NavItem>
                                    : null
                                }

                                <NavItem>
                                    <NavLink className="nav-link" to="/invoices">{strings.invoices}
                                        {invoices.newEvents.filter(p => p.type === EventTypes.InvoiceNew || p.type === EventTypes.InvoicePaymentNew).length > 0 ?
                                            <>
                                                &nbsp;
                                                <Badge color="danger">
                                                    {invoices.newEvents.filter(p => p.type === EventTypes.InvoiceNew || p.type === EventTypes.InvoicePaymentNew).length}
                                                </Badge>
                                            </>
                                            : null
                                        }
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink className="nav-link" to="/dashboard">{strings.dashboard}</NavLink>
                                </NavItem>

                                <EventsViewer/>

                                {authState === AuthState.Authed ?
                                    <UncontrolledDropdown nav inNavbar size="sm" className="mx-0">
                                        <DropdownToggle caret nav>
                                            <FontAwesomeIcon className="mr-1" icon={userIconDefinition}/>
                                            {profile.Username}
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem color="secondary" outline size="sm">
                                                <NavLink className="nav-link p-0" to="/profile">
                                                    {strings.profile}
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem color="secondary" outline size="sm">
                                                <NavItem>
                                                    <a className="nav-link p-0" href={getDocsUrl()}
                                                       rel="noopener noreferrer"
                                                       target="_blank">{strings.docs}</a>
                                                </NavItem>
                                            </DropdownItem>
                                            <DropdownItem color="secondary" outline size="sm">
                                                <NavItem>
                                                    <NavLink className="nav-link p-0" to="/exit"
                                                             onClick={() => setLogout(true)}>
                                                        {strings.logout}
                                                    </NavLink>
                                                </NavItem>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    :
                                    <NavItem>
                                        <NavLink className="nav-link" to="/login">{strings.signIn}</NavLink>
                                    </NavItem>
                                }

                                {authState !== AuthState.Authed ?
                                    <NavItem>
                                        <a className="nav-link" href={getDocsUrl()} rel="noopener noreferrer"
                                           target="_blank">{strings.docs}</a>
                                    </NavItem>
                                    : null
                                }
                            </Nav>
                        </Collapse>

                    </Navbar>
                </Col>
            </Row>
        </div>
    );
};
export default Header;