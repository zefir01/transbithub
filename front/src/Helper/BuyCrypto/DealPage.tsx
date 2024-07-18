import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/pro-regular-svg-icons";
import {useDispatch, useMappedState} from "redux-react-hook";
import {HelperOperation, IStore} from "../../redux/store/Interfaces";
import {DealControl} from "../../MainPages/DealPage/DealControl";
import {Redirect} from "react-router-dom";
import {SetCurrentPath} from "../../redux/actions";
import {Loading} from "../../Loading";
import {MyDecimal} from "../../MyDecimal";
import {Deal, DealStatus} from "../../Protos/api_pb";
import {data, IStrings} from "../../localization/Helper/BuyCrypto/DealPage";
import {useStrings} from "../../Hooks";

library.add(far);
const arrowLookup: IconLookup = {prefix: 'far', iconName: 'arrow-left'};
const arrowIconDefinition: IconDefinition = findIconDefinition(arrowLookup);

export function DealPage() {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            state: store.helperState,
            deals: store.deals.deals
        }), []
    );
    const {state, deals} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [deal, setDeal] = useState<Deal.AsObject | null>(null);


    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        let d = deals.find(p => p.id == state.dealId);
        if (d) {
            setDeal(d);
            switch (d.status) {
                case DealStatus.OPENED:
                    break;
                case DealStatus.COMPLETED:
                    switch (state.operation){
                        case HelperOperation.BuyBtc:
                            setRedirect("/helper/dealCompleted");
                            break;
                        case HelperOperation.PayInvoice:
                            setRedirect("/helper/paymentComplete");
                            break;
                        case HelperOperation.UsePromise:
                            setRedirect("/helper/dealCompleted");
                            break;
                    }
                    break;
                case DealStatus.CANCELED:
                    switch (state.operation){
                        case HelperOperation.BuyBtc:
                            setRedirect("/helper/dealCanceled");
                            break;
                        case HelperOperation.PayInvoice:
                            setRedirect("/helper/paymentCanceled");
                            break;
                        case HelperOperation.UsePromise:
                            setRedirect("/helper/dealCompleted");
                            break;
                    }
                    break;
                case DealStatus.DISPUTED:
                    setRedirect("/helper/dealDisputed");
                    break;

            }
        } else {
            setDeal(null);
        }
    }, [deals, state.dealId, state.operation]);

    useEffect(() => {
        if (!state.dealId) {
            setRedirect("/helper/selectOperation");
        }
    }, [state.dealId]);
    useEffect(() => {
        if (state.currentPath === "") {
            return;
        }
        dispatch(SetCurrentPath("/helper/deal"));
    }, [state.currentPath, dispatch]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    if (!deal) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        )
    }

    return (
        <>
            <Row>
                <Col>
                    <Button color="danger" outline onClick={() => setRedirect("/helper/selectAd")}>
                        <FontAwesomeIcon icon={arrowIconDefinition}/>
                        &nbsp;
                        {strings.back}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <h4>{strings.title}</h4>
                    <ul>
                        <li>
                            {strings.info1}
                            <span className="font-weight-bold">
                                {" " + MyDecimal.FromPb(deal.fiatamount).toString()}
                            </span> {deal.advertisement?.fiatcurrency}
                        </li>
                        <li>
                            {strings.info2}{deal.advertisement?.fiatcurrency}"
                        </li>
                        <li>
                            {strings.info3}
                        </li>
                        <li>
                            {strings.info4}
                        </li>
                    </ul>
                </Col>
            </Row>
            {state.dealId ?
                <Row>
                    <Col>
                        <DealControl dealId={state.dealId} hideFeedback={true}/>
                    </Col>
                </Row>
                : null
            }
        </>
    )
}