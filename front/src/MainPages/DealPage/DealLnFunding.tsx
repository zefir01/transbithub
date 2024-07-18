import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Deal} from "../../Protos/api_pb";
import {Alert, Card, CardBody, CardTitle} from "reactstrap";
import {QRCode} from "react-qr-svg";
import {MyDecimal} from "../../MyDecimal";
import {toDate} from "../../helpers";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {adLnTimeoutSec, satoshi} from "../../global";
import lightningPayReq from "bolt11";
import {data, IStrings} from "../../localization/DealPage/DealLnFunding";
import {useStrings} from "../../Hooks";


interface IQRProps {
    uri: string;
}

const QR = React.memo((props: IQRProps) => {
    return (
        <QRCode
            className="d-block mx-auto"
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            style={{width: 256}}
            value={props.uri}
        />
    );
});

export interface DealLnFundingProps {
    deal: Deal.AsObject;
}

export function DealLnFunding(props: DealLnFundingProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
        }), []
    );
    const {userId} = useMappedState(mapState);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [counter, setCounter] = useState(0);
    const [time, setTime] = useState("");
    const [endTime, setEndTime] = useState(false);
    const strings: IStrings=useStrings(data);

    const amountCb = useCallback(() => {
        if (props.deal.lnwithdrawal === "") {
            return new MyDecimal(0);
        }
        let value = props.deal.lnwithdrawal.replace("lightning:", "").replace("LIGHTNING:", "");
        let decoded = lightningPayReq.decode(value);
        return new MyDecimal(parseInt(decoded.millisatoshis!) / 1000 * satoshi).toDecimalPlaces(8);
    }, [props.deal.lnwithdrawal]);
    const amount = amountCb();

    useEffect(() => {
        if (timer) {
            return;
        }
        const t = setTimeout(async function refreshCallback() {
            setCounter(val => {
                return val - 1;
            });
            if (!endTime) {
                setTimeout(refreshCallback, 1000);
            }
        }, 1000);
        setTimer(t);
    }, [timer, endTime]);

    useEffect(() => {
        const created = toDate(props.deal.createdat).getTime();
        const now = Date.now();
        let t = adLnTimeoutSec * 1000 - (now - created);
        if (t < 0) {
            t = 0;
            setEndTime(true);
        }
        let m = Math.floor(t / 1000 / 60);
        let s = Math.floor(t / 1000 - (m * 60));
        setTime(`${m.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })}:${s.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}`);
    }, [props.deal.createdat, counter]);


    function GetUri() {
        return `lightning:${props.deal.lnwithdrawal}`;
    }

    if (props.deal.lnwithdrawal !== "" &&
        ((props.deal.advertisement!.isbuy && userId === props.deal.initiator?.id) ||
            (!props.deal.advertisement!.isbuy && userId === props.deal.adownerinfo?.id))
    ) {
        return (
            <Card>
                <CardBody>
                    <CardTitle>
                        <h4>{strings.title}</h4>
                        <Alert color="warning">
                            {strings.info}{amount.toString()} BTC {strings.info1}<span
                            className="font-weight-bold">{time}</span>
                        </Alert>
                        <h5>{strings.copy}</h5>
                        <Card className="mb-2">
                            <CardBody>
                                <span className="small">{props.deal.lnwithdrawal}</span>
                            </CardBody>
                        </Card>
                        <h5>{strings.qr}</h5>
                    </CardTitle>
                    <QR uri={GetUri()}/>
                </CardBody>
            </Card>
        )
    } else {
        return (
            <Alert color="warning">
                {strings.info2}
                <span className="font-weight-bold">{time}</span>
                {strings.info3}
            </Alert>
        )
    }
}