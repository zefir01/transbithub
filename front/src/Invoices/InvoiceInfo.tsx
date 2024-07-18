import * as React from "react";
import {Invoice} from "../Protos/api_pb";
import {PrivateInvoiceInfo} from "./PrivateInvoiceInfo";
import {PublicInvoiceInfo} from "./PublicInvoiceInfo";


export interface IInvoiceInfoProps {
    invoice: Invoice.AsObject;
    title?: string;
    hideContact?: boolean;
    hideHeader?: boolean;
    disableLinks?: boolean;
}


export function InvoiceInfo(props: IInvoiceInfoProps) {
    if(props.invoice.isprivate){
        return <PrivateInvoiceInfo {...props}/>
    }
    else {
        return <PublicInvoiceInfo {...props}/>
    }
}