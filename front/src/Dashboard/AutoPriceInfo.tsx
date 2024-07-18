import * as React from "react";
import {Button, Card, CardBody, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useCallback, useState} from "react";
import humanizeDuration from "humanize-duration";
import {useMappedState} from "redux-react-hook";
import {IStore} from "../redux/store/Interfaces";
import {autoPriceFee} from "../global";
import {Redirect} from "react-router-dom";
import {data, IStrings} from "../localization/Dashboard/AutoPriceInfo";
import {AutoPriceExample} from "../Options/AutoPriceExample";
import {useStrings} from "../Hooks";

export interface IAutoPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AutoPriceModal(props: IAutoPriceModalProps) {
    const strings: IStrings=useStrings(data);

    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h5>{strings.more}</h5>
            </ModalHeader>
            <ModalBody>
                <AutoPriceExample disableCard={true}/>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
            </ModalFooter>
        </Modal>
    );
}

export interface IAytoPriceInfoProps{
    seconds: number;
    onSecondsChanged: (seconds: number)=>void;
}

export function AutoPriceInfo(props: IAytoPriceInfoProps) {
    const mapState = useCallback(
        (store: IStore) => ({
            vars: store.catalog.variables,
            options: store.profile.BoughtOptions,
            currency: store.profile.GeneralSettings.DefaultCurrency,
            lang: store.lang.Lang
        }), []
    );
    const {options, vars, currency, lang} = useMappedState(mapState);
    const strings: IStrings=useStrings(data);

    const [time, setTime] = useState(props.seconds);
    const [redirect, setRedirect] = useState("");

    function duration(seconds: number): string {
        let d = seconds * 1000;
        return humanizeDuration(d,
            {
                language: lang,
                largest: 2,
                round: true,
                fallbacks: ['en']
            }
        )
    }

    function getAmount() {
        let vprice = vars!.get(`AVG_${currency}`)!;
        let amount = vprice.mul(options!.autopricerecalcs * autoPriceFee);
        return amount.toDecimalPlaces(2).toString();
    }

    if (redirect !== "") {
        return <Redirect push to={redirect}/>
    }

    if (options?.autopricerecalcs === undefined || !vars || vars.size === 0) {
        return null;
    }

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col>

                        <label>{strings.period + duration(time)}</label>
                        <Input type="range" className="custom-range" min="10" max="3600" step="10"
                               value={time} onInput={event => {
                                   setTime(parseInt(event.currentTarget.value));
                                   props.onSecondsChanged(parseInt(event.currentTarget.value));
                        }}
                        />
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <span className="font-weight-bold">{strings.purchased}</span>
                                    </Col>
                                    <Col>
                                        {`${options.autopricerecalcs} ~${getAmount()} ${currency}`}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span className="font-weight-bold">{strings.time}</span>
                                    </Col>
                                    <Col>
                                        {duration(time * options.autopricerecalcs)}
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="col-auto">
                                <Button className="mt-3" color="primary" onClick={() => setRedirect("/dashboard/buyAutoPrice")}>
                                    {strings.buy}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}