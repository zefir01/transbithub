import * as React from "react";
import {Button, Card, CardBody, Col, Row} from "reactstrap";
import {ReactNode, useCallback, useState} from "react";
import {Price} from "../Price";
import {data as dataS, myMap} from "../../localization/PaymentTypes"
import {UserLink} from "../UserLink";
import {Advertisement, UserInfo} from "../../Protos/api_pb";
import humanizeDuration from "humanize-duration";
import {data, IStrings} from "../../localization/DealPage/DealInfo"
import {MyDecimal} from "../../MyDecimal";
import {CountriesCatalog} from "../../Catalog";
import {DealLimitsComponent} from "../DealLimitsComponent";
import {PromiseModal} from "../../Promises/Promises";
import {useStrings} from "../../Hooks";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";


interface IMyRowProps {
    description: string;
    data: ReactNode;
    isHrDisabled?: boolean;
}

const MyRow = (props: IMyRowProps) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <span className="font-weight-bold">{props.description}</span>
                </Col>
                <Col>
                    {props.data}
                </Col>
            </Row>
            {props.isHrDisabled !== undefined && props.isHrDisabled ? null : <hr/>}
        </React.Fragment>
    );
};

interface IDealInfoProps {
    ad: Advertisement.AsObject;
    partner: UserInfo.AsObject;
    promise?: string;
}

export const DealInfo = (props: IDealInfoProps) => {
    const strings: IStrings=useStrings(data);
    const paymentStrings = new myMap(dataS);

    const mapState = useCallback(
        (store: IStore) => ({
            lang: store.lang.Lang
        }), []
    );
    const {lang} = useMappedState(mapState);

    const [modalOpen, setModalOpen] = useState(false);


    function duration(mins: number): string {
        let d = mins * 60 * 1000;
        return humanizeDuration(d,
            {
                language: lang,
                largest: 2,
                round: true,
                fallbacks: ['en']
            }
        )
    }


    return (
        <Card className="my-3">
            {props.promise ?
                <PromiseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} promise={props.promise}/>
                : null
            }
            <CardBody>
                <MyRow description={strings.price} data={
                    <Price price={MyDecimal.FromPb(props.ad!.price)}
                           currency={props.ad.fiatcurrency + " / BTC"}/>}
                       isHrDisabled={true}/>
                <MyRow description={strings.paymentMethod}
                       data={`${paymentStrings.get(props.ad!.paymenttype)}: ${props.ad!.title}`}
                       isHrDisabled={true}/>
                <MyRow description={strings.user} data={
                    <div className="py-2 my-2">
                        <UserLink info={props.partner} isAdRate={true} style={{lineHeight: 0}}/>
                    </div>
                } isHrDisabled={true}/>
                <MyRow description={strings.limitations}
                       data={DealLimitsComponent(props.ad)}
                       isHrDisabled={true}/>
                <MyRow description={strings.location} data={CountriesCatalog.get(props.ad!.country)}
                       isHrDisabled={true}/>
                <MyRow description={strings.paymentWindow} data={duration(props.ad!.window)}
                       isHrDisabled={!props.promise}/>
                {props.promise ?
                    <MyRow description={strings.promise} data={
                        <Button outline color="primary" className="btn-sm" onClick={() => setModalOpen(true)}>
                            {strings.show}
                        </Button>
                    } isHrDisabled={true}/>
                    : null
                }
            </CardBody>
        </Card>
    )

};