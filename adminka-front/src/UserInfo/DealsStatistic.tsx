import * as React from "react";
import {Badge, Card, CardBody, CardHeader} from "reactstrap";
import {UserInfo} from "../Protos/api_pb";
import {data, IStrings} from "../localization/UserInfo/DealsStatistic";
import {MyDecimal} from "../MyDecimal";
import {duration, durationSec, myRound, MyRow} from "./MyRow";
import {useStrings} from "../Hooks";
import {useCallback} from "react";
import {IStore} from "../redux/interfaces";
import {useMappedState} from "redux-react-hook";
import {toDate} from "../helpers";

export interface IDealsStatisticProps{
    info: UserInfo.AsObject;
    loadTime: Date;
}

export function DealsStatistic(props: IDealsStatisticProps){
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            lang: store.lang.Lang
        }), []
    );
    const {lang} = useMappedState(mapState);

    return(
        <Card>
            <CardHeader>
                {strings.title}
            </CardHeader>
            <CardBody>
                <MyRow description={strings.tradesCount} data={props.info.tradescount}/>
                <MyRow description={strings.avgDealAmount} data={MyDecimal.FromPb(props.info.tradesavgamount).toString()+" BTC"}/>
                <MyRow description={strings.counterpartysCount}
                       data={myRound(props.info.counterpartyscount)}/>
                <MyRow description={strings.feadbacksRates} data={MyDecimal.FromPb(props.info.responserate).toString() + " %"}/>
                <MyRow description={strings.firstTrade}
                       data={toDate(props.info.firsttradedate!).getFullYear() < 1900 ?
                           <Badge color="warning">{strings.none}</Badge> :
                           duration(props.info.firsttradedate!, props.loadTime, lang)}/>
                <MyRow description={strings.median}
                       data={durationSec(props.info.mediandelayseconds, lang)}/>
                <MyRow description={strings.avg} data={durationSec(props.info.avgdelayseconds, lang)}
                       isHrDisabled={true}/>
            </CardBody>
        </Card>
    )
}