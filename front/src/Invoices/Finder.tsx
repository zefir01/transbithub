import * as React from "react";
import {
    Button, DropdownItem, DropdownMenu,
    DropdownToggle,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown
} from "reactstrap";
import {useCallback, useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {data, IStrings} from "../localization/Invoices/Finder";
import {useStrings} from "../Hooks";


export function Finder() {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            router: store.router,
        }), []
    );
    const {router} = useMappedState(mapState);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isInvoice, setIsInvoice] = useState(true);
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const [id, setId] = useState<number | null>(null);
    const [idStr, setIdStr] = useState("");
    const [idErr, setIdErr] = useState(false);
    const [redirect, setRedirect] = useState("");
    const [start, setStart]=useState("");

    function filterInt(value: string) {
        return /^\d+$/.test(value);
    }

    useEffect(()=>{
        if(router.location!==start){
            setStart("");
            setRedirect("");
        }
    }, [router, start])

    if (redirect !== "") {
        return <Redirect push to={redirect}/>
    }

    return (
        <InputGroup>
            <InputGroupButtonDropdown addonType="prepend" isOpen={dropdownOpen} toggle={toggleDropDown}>
                <DropdownToggle outline color="secondary" caret>
                    {isInvoice ? strings.invoice : strings.payment}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => setIsInvoice(true)}>{strings.invoice}</DropdownItem>
                    <DropdownItem onClick={() => setIsInvoice(false)}>{strings.payment}</DropdownItem>
                </DropdownMenu>
            </InputGroupButtonDropdown>
            <Input type="text" placeholder={strings.placeHolder} value={idStr} invalid={idErr}
                   onInput={event => {
                       setIdStr(event.currentTarget.value);
                       let val = parseInt(event.currentTarget.value);
                       if (isNaN(val) || !filterInt(event.currentTarget.value)) {
                           setIdErr(true);
                           setId(null);
                           return;
                       }
                       setId(val);
                       setIdErr(false);
                   }}
            />
            <InputGroupAddon addonType="append">
                <Button color="warning" disabled={idErr || id === null}
                        onClick={() => {
                            setStart(router.location);
                            if (isInvoice) {
                                setRedirect("/invoices/invoice/" + id);
                                return;
                            }
                            setRedirect("/invoices/payment/" + id);
                        }}
                >
                    {strings.find}
                </Button>
            </InputGroupAddon>
        </InputGroup>
    );
}