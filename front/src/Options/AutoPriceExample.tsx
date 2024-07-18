import * as React from "react";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {useCallback} from "react";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {findIconDefinition, IconDefinition, IconLookup} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {autoPriceFee} from "../global";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/Options/AutoPriceExample";
import {useScrollToTop, useStrings} from "../Hooks";
import {MyDecimal} from "../MyDecimal";

const arrowLookup: IconLookup = {prefix: 'fas', iconName: 'arrow-left'};
const arrowDefinition: IconDefinition = findIconDefinition(arrowLookup);

interface IDepthItem {
    price: number;
    isMy: boolean;
}

function Item(price: number, isMy: boolean): IDepthItem {
    return {
        price,
        isMy
    };
}

interface IDepthProps {
    depth: Array<IDepthItem>
}

function Depth(props: IDepthProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            currency: store.profile.GeneralSettings.DefaultCurrency,
        }), []
    );
    const {currency} = useMappedState(mapState);
    const strings: IStrings=useStrings(data);

    return (
        <Card>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{strings.price}</th>
                    <th scope="col"/>
                </tr>
                </thead>
                <tbody>
                {
                    props.depth.map((p, i) => {
                        return (
                            <tr key={i}>
                                <th scope="row">
                                    {i + 1}
                                </th>
                                <td>
                                    {p.price + " " + currency}
                                </td>
                                <td>
                                    {p.isMy ?
                                        <>
                                            <FontAwesomeIcon icon={arrowDefinition}/>
                                            <span className="align-middle">{strings.yourAd}</span>
                                        </>
                                        : null
                                    }
                                </td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </Card>
    )
}

export interface IAutoPriceExampleProps {
    disableCard?: boolean;
}

export function AutoPriceExample(props: IAutoPriceExampleProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            currency: store.profile.GeneralSettings.DefaultCurrency,
            vars: store.catalog.variables
        }), []
    );
    const {currency, vars} = useMappedState(mapState);
    const strings: IStrings=useStrings(data);

    function getAmount() {
        let vprice = vars!.get(`AVG_${currency}`)!;
        let amount = vprice.mul(autoPriceFee);
        return amount.toDecimalPlaces(6).toString();
    }

    useScrollToTop();
    
    function Content(){
        return(
            <>
                <Row>
                    <Col>
                        <h5 className="card-title">{strings.example}</h5>
                        <span className="font-weight-bold">{strings.info1}</span>
                        <br/>
                        {strings.info2} {currency}. {strings.info3} {currency} {strings.info4}
                        <br/>
                        {strings.info5}
                    </Col>
                </Row>
                <Row>
                    <Col className="col-auto">
                        <Depth depth={
                            [
                                Item(1300, false),
                                Item(1200, true),
                                Item(1100, false),
                                Item(1000, false),
                                Item(900, false),
                            ]
                        }/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {strings.info6} {currency}
                        <br/>
                        {strings.info7} {currency}, {strings.info8}
                        <br/>
                        {strings.info9} {currency}, {strings.info10}
                        <br/>
                        {strings.info11}
                    </Col>
                </Row>
                <Row>
                    <Col className="col-auto">
                        <Depth depth={
                            [
                                Item(1300, false),
                                Item(1100.01, true),
                                Item(1100, false),
                                Item(1000, false),
                                Item(900, false),
                            ]
                        }/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className="font-weight-bold d-block mt-3">{strings.info12}</span>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-auto">
                        <Depth depth={
                            [
                                Item(1300, false),
                                Item(1200, true),
                                Item(1100, false),
                                Item(1000, false),
                                Item(900, false),
                            ]
                        }/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {strings.info13} {currency}
                        <br/>
                        {strings.info14} {currency} {strings.info15}
                    </Col>
                </Row>
                <Row>
                    <Col className="col-auto">
                        <Depth depth={
                            [
                                Item(1300.01, true),
                                Item(1300, false),
                                Item(1100, false),
                                Item(1000, false),
                                Item(900, false),
                            ]
                        }/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {strings.info16}
                        <br/>
                        <br/>
                        {strings.info17}
                        <br/>
                        {strings.info18}
                        <br/>
                        {strings.info19}
                        <br/>
                        {strings.info20} {new MyDecimal(autoPriceFee).toString()} BTC (1 {strings.info21} / ~{getAmount()} {currency}).
                        <br/>
                        {strings.info22}
                        <br/>
                        {strings.info23}
                        <br/>
                        {strings.info24}
                    </Col>
                </Row>
                </>
        );
    }

    if (!vars || vars.size === 0) {
        return <Loading/>;
    }

    if(props.disableCard){
        return <Content/>;
    }

    return (
        <Card>
            <CardHeader>
                <h5>{strings.title}</h5>
            </CardHeader>
            <CardBody>
                <Content/>
            </CardBody>
        </Card>
    )

}