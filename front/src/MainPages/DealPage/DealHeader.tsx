import * as React from "react";
import {data as dataS, myMap} from "../../localization/PaymentTypes"
import {Advertisement, UserInfo} from "../../Protos/api_pb";
import {useMappedState} from "redux-react-hook";
import {useCallback} from "react";
import {IStore} from "../../redux/store/Interfaces";
import {data, IStrings} from "../../localization/DealPage/DealHeader"
import {useStrings} from "../../Hooks";

interface IDealHeaderProps {
    ad: Advertisement.AsObject;
    partner: UserInfo.AsObject;
}

export const DealHeader = (props: IDealHeaderProps) => {
    const strings: IStrings = useStrings(data);
    const paymentStrings = new myMap(dataS);
    const mapState = useCallback(
        (store: IStore) => ({
            profile: store.profile,
        }), []
    );
    const {profile} = useMappedState(mapState);

    function IsIBuy() {
        if (props.ad.owner!.id === profile.UserId) {
            return !props.ad!.isbuy;
        }
        return props.ad!.isbuy;
    }

    return (
        <React.Fragment>
            <h4>{`${IsIBuy() ? strings.sell : strings.buy} BTC${strings.using}${paymentStrings.get(props.ad!.paymenttype)}: ${props.ad!.title}${strings.currency}${props.ad!.fiatcurrency}`}</h4>
            <span>{`${strings.user}${props.partner.username}${strings.wants}${IsIBuy() ? strings.buyFrom : strings.selFrom} BTC.`}</span>
        </React.Fragment>
    )
};