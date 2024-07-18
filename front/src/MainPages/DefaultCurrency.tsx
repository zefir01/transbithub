import * as React from "react";
import {useCallback} from "react";
import {IStore} from "../redux/store/Interfaces";
import {useDispatch, useMappedState} from "redux-react-hook";
import {Col, InputGroup, InputGroupAddon, InputGroupText, Row} from "reactstrap";
import {data, IStrings} from "../localization/Invoices/Invoices";
import {SetDefaultCurrency} from "../redux/actions";
import {CurrenciesCatalog} from "../Catalog";
import {useStrings} from "../Hooks";

export function DefaultCurrency(){
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            currency: store.profile.GeneralSettings.DefaultCurrency
        }), []
    );
    const {currency} = useMappedState(mapState);
    const dispatch = useDispatch();

    if(currency === ""){
        return null;
    }
    return(
        <Row>
            <Col className="col-auto">
                <InputGroup className="mb-2">
                    <InputGroupAddon addonType={"prepend"}>
                        <InputGroupText>{strings.defaultCurrency}</InputGroupText>
                    </InputGroupAddon>
                    <select className="select form-control" value={currency}
                            onChange={event => {
                                dispatch(SetDefaultCurrency(event.currentTarget.value));
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
            </Col>
        </Row>
    );
}