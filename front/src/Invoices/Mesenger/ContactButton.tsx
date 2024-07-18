import * as React from "react";
import {Invoice, InvoicePayment} from "../../Protos/api_pb";
import {Button} from "reactstrap";
import {Redirect} from "react-router-dom";
import {useCallback, useState} from "react";
import {data, IStrings} from "../../localization/Invoices/ContactButton";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {IContactLocationProps, isInvoice} from "./Messenger";
import {useStrings} from "../../Hooks";


export interface IContactButtonProps {
    target: Invoice.AsObject | InvoicePayment.AsObject,
    isSmall?: boolean;
}

export function ContactButton(props: IContactButtonProps) {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
        }), []
    );
    const {userId} = useMappedState(mapState);
    const [contact, setContact] = useState(false);

    if (contact) {
        return <Redirect push to={{
            pathname: "/invoices/messenger/",
            state: {
                target: props.target
            } as IContactLocationProps
        }}/>;
    }

    function getText() {
        if (isInvoice(props.target)) {
            return props.target.owner?.id === userId ? strings.messenger1 : strings.messenger2;
        }
        return props.target.owner?.id !== userId ? strings.messenger1 : strings.messenger2
    }

    return (
        <Button outline className={props.isSmall ? "btn-sm" : ""} color="info" onClick={() => setContact(true)}>
            {getText()}
        </Button>
    );
}