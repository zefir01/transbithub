import {InvoicePayment} from "../Protos/api_pb";
import {data, IStrings} from "../localization/Invoices/PaymentsTable";
import * as React from "react";
import {useStrings} from "../Hooks";

export interface IPaymentStatusProps {
    payment: InvoicePayment.AsObject;
}

export function PaymentStatus(props: IPaymentStatusProps) {
    const strings: IStrings = useStrings(data);
    switch (props.payment.status) {
        case InvoicePayment.InvoicePaymentStatus.PENDING:
            return <span className="text-warning">{strings.statusPending}</span>
        case InvoicePayment.InvoicePaymentStatus.PAID:
            return <span className="text-success">{strings.statusPaid}</span>
        case InvoicePayment.InvoicePaymentStatus.CANCELED:
            return <span className="text-secondary">{strings.statusCanceled}</span>
        default:
            return null;
    }
}