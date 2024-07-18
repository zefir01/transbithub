import * as React from "react";
import {UserInfo} from "../../Protos/api_pb";
import {Card, CardBody, CardHeader} from "reactstrap";
import {MyRow} from "./MyRow";
import {MyDecimal} from "../../MyDecimal";
import {data, IStrings} from "../../localization/UserInfo/InvoiceStatistic";
import {useStrings} from "../../Hooks";


export interface IIvoiceStatisticProps {
    info: UserInfo.AsObject;
}

export function InvoiceStatistic(props: IIvoiceStatisticProps) {
    const strings: IStrings = useStrings(data);
    return (
        <Card>
            <CardHeader>
                {strings.title}
            </CardHeader>
            <CardBody>
                <MyRow description={strings.invoicesCreated} data={props.info.invoicescreatedcount}/>
                <MyRow description={strings.paymentsPayedAvgAmount}
                       data={MyDecimal.FromPb(props.info.paymentspayedavgamount).toDecimalPlaces(8).toString() + " BTC"}/>
                <MyRow description={strings.paymentsPayedCount} data={props.info.paymentspayedcount}/>
                <MyRow description={strings.paymentsReceivedAvgAmount}
                       data={MyDecimal.FromPb(props.info.paymentsreceivedavgamount).toDecimalPlaces(8).toString() + " BTC"}/>
                <MyRow description={strings.paymentsReceivedCount} data={props.info.paymentsreceivedcount}/>
                <MyRow description={strings.positive}
                       data={MyDecimal.FromPb(props.info.invoiceresponserate).toDecimalPlaces(2).toString() + " %"}/>
            </CardBody>
        </Card>
    )
}