import {useStream} from "../Hooks";
import {Advertisement, GetAdvertisementsByIdRequest, SubscribeAdvertisementChangesResponse} from "../Protos/api_pb";
import {tradeApiClient} from "../helpers";
import {useCallback, useState} from "react";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";

export interface AdChangesListenerProps{
    ad: Advertisement.AsObject;
    adDeleted: ()=>void;
    adChanged: (ad: Advertisement.AsObject)=>void;
}
export function AdChangesListener(props: AdChangesListenerProps): null{
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId
        }), []
    );
    const {userId} = useMappedState(mapState);
    const [adDeleted, setAdDeleted]=useState(false);
    const [ad, setAd]=useState(props.ad);


    useStream<SubscribeAdvertisementChangesResponse, SubscribeAdvertisementChangesResponse.AsObject>("subscribeAdvertisementChanges",
        metadata => {
            let req = new GetAdvertisementsByIdRequest();
            req.setId(ad.id);
            return tradeApiClient.subscribeAdvertisementChanges(req, metadata);
        },
        data => {
            console.log(data);
            if (data.addeleted) {
                props.adDeleted();
                setAdDeleted(true);
                return;
            } else if (data.advertisement) {
                props.adChanged(data.advertisement);
                setAd(data.advertisement);
            }
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        !ad.id || ad.owner!.id === userId || adDeleted
    )
    return null;
}