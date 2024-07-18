import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Invoice} from "../../Protos/api_pb";
import {
    Alert,
    Button,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {IInvoiceCalculatedValues} from "../InvoiceCalc";
import {PrettyPrice} from "../../helpers";
import {errors} from "../../localization/Errors";
import {data, IStrings} from "../../localization/Invoices/InvoiceControl"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {Control} from "./Control";
import {Pay} from "./Pay";
import {useStrings} from "../../Hooks";

library.add(fas);
const plusLookup: IconLookup = {prefix: 'fas', iconName: 'plus'};
const plusIconDefinition: IconDefinition = findIconDefinition(plusLookup);
const minusLookup: IconLookup = {prefix: 'fas', iconName: 'minus'};
const minusIconDefinition: IconDefinition = findIconDefinition(minusLookup);

export interface PiecesProps {
    invoice: Invoice.AsObject;
    onChange: (pieces: number | null) => void;
    currency: string;
    values: IInvoiceCalculatedValues | null;
    defaultValue?: number;
}

export function Pieces(props: PiecesProps) {
    const strings: IStrings = useStrings(data);
    const [piecesStr, setPiecesStr] = useState(props.invoice.piecesmin.toString());
    const [piecesErr, setPiecesErr] = useState(false);
    const [pieces, setPieces] = useState(props.invoice.piecesmin);

    useEffect(() => {
        if (props.defaultValue) {
            setPieces(props.defaultValue);
            setPiecesStr(props.defaultValue.toString());
            setPiecesErr(false);
        }
    }, [props.defaultValue])

    function PiecesValues() {
        if (props.values === null || !pieces) {
            return null;
        }
        return (
            <Row className="pb-3">
                <Col>
                    {strings.cryptoAmount + PrettyPrice(props.values.piecePriceCrypto!.mul(pieces), 8)} BTC
                    <br/>
                    {!props.invoice.isbasecrypto ?
                        strings.fiatAmount + PrettyPrice(props.values.piecePriceFiat!.mul(pieces), 2) + " " + props.currency
                        : null
                    }
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>{strings.pieces}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" value={piecesStr}
                               invalid={piecesErr}
                               onInput={event => {
                                   setPiecesStr(event.currentTarget.value);
                                   let val = parseInt(event.currentTarget.value);
                                   if (isNaN(val)) {
                                       setPiecesErr(true);
                                       props.onChange(null);
                                       return;
                                   }
                                   if (val > props.invoice.piecesmax) {
                                       setPiecesErr(true);
                                       props.onChange(null);
                                       return;
                                   }
                                   if (val < props.invoice.piecesmin) {
                                       setPiecesErr(true);
                                       props.onChange(null);
                                       return;
                                   }
                                   setPiecesErr(false);
                                   setPieces(val);
                                   props.onChange(val);
                               }}/>
                        <InputGroupAddon addonType="append">
                            <Button color="secondary" outline
                                    onClick={() => {
                                        setPiecesStr(pieces.toString());
                                        setPiecesErr(false);
                                        if (pieces === props.invoice.piecesmin) {
                                            props.onChange(pieces);
                                            return;
                                        }
                                        setPieces(pieces - 1);
                                        setPiecesStr((pieces - 1).toString());
                                        props.onChange(pieces - 1);
                                    }}
                            >
                                <FontAwesomeIcon
                                    icon={minusIconDefinition}/>
                            </Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                            <Button color="secondary" outline
                                    onClick={() => {
                                        setPiecesStr(pieces.toString());
                                        setPiecesErr(false);
                                        if (pieces === props.invoice.piecesmax) {
                                            props.onChange(pieces);
                                            return;
                                        }
                                        setPieces(pieces + 1);
                                        setPiecesStr((pieces + 1).toString());
                                        props.onChange(pieces + 1);
                                    }}
                            >
                                <FontAwesomeIcon
                                    icon={plusIconDefinition}/>
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
            <PiecesValues/>
        </>
    )
}


export interface IInvoiceControlProps {
    invoice: Invoice.AsObject,
    hasPrice: (hasPrice: boolean) => void;
    redirect: (to: string) => void;
}

export function InvoiceControl(props: IInvoiceControlProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
            userId: store.profile.UserId
        }), []
    );
    const {authState, userId} = useMappedState(mapState);
    const [error, ] = useState("");


    return (
        <>
            {error !== "" ?
                <Row className="pt-3">
                    <Col>
                        <Alert color="danger">{errors(error)}</Alert>
                    </Col>
                </Row>
                : null
            }
            {authState === AuthState.Authed && userId === props.invoice.owner?.id ?
                <Control invoice={props.invoice}/>
                : null
            }
            {authState !== AuthState.NotAuthed && userId !== props.invoice.owner?.id && props.invoice.status === Invoice.InvoiceStatus.ACTIVE ?
                <Pay invoice={props.invoice} hasPrice={props.hasPrice} redirect={props.redirect}/>
                : null
            }
        </>
    )
}