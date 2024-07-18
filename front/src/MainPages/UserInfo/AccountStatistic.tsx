import * as React from "react";
import {UserInfo} from "../../Protos/api_pb";
import {Card, CardBody, CardHeader} from "reactstrap";
import {data, IStrings} from "../../localization/UserInfo/AccountStatistic";
import {duration, myRound, MyRow} from "./MyRow";
import {Timestamp} from "google-protobuf/google/protobuf/timestamp_pb";
import {toDate} from "../../helpers";
import {useStrings} from "../../Hooks";
import {useCallback} from "react";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";

export interface IAccountStatisticProps {
    info: UserInfo.AsObject,
    loadTime: Date;
}

export function AccountStatistic(props: IAccountStatisticProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            lang: store.lang.Lang
        }), []
    );
    const {lang} = useMappedState(mapState);

    function getLastOnline(date: Timestamp.AsObject) {
        let d = props.loadTime.getTime() - toDate(date).getTime();
        if (d < 75000)
            return <strong className="text-success">Online</strong>;

        return duration(date, props.loadTime, lang);
    }

    const strings: IStrings=useStrings(data);

    return (
        <Card>
            <CardHeader>
                {strings.account}
            </CardHeader>
            <CardBody>
                {props.info.site !== "" ?
                    <MyRow description={strings.site} data={<a href={props.info.site}>{props.info.site}</a>}/>
                    : null
                }
                {props.info.introduction !== "" ?
                    <MyRow description={props.info.username + strings.self}
                           data={props.info.introduction.split("\n").map((t, i) => <p key={i}>{t}</p>)}/>
                    : null
                }
                <MyRow description={strings.createdAt}
                       data={duration(props.info.createdat!, props.loadTime, lang)}/>
                <MyRow description={strings.lastOnline}
                       data={getLastOnline(props.info.lastonline!)}/>
                <MyRow description={strings.verifiedByUsers} data={myRound(props.info.trustedcount)}/>
                <MyRow description={strings.blocked} data={myRound(props.info.blockedcount)}
                       isHrDisabled={true}/>
            </CardBody>
        </Card>
    )
}