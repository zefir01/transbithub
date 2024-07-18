import * as React from "react";
import {AdTable} from "./AdTable";
import {useLocation, Redirect} from "react-router-dom";
import {useCallback} from "react";
import {Col, Container, Row} from "reactstrap";
import {Advertisement, Invoice} from "../Protos/api_pb";

export interface IAdsList {
    adList: Array<Advertisement.AsObject>;
    invoice?: Invoice.AsObject;
    pieces?: number;
    invoiceId?: number;
    promise?: string;
    promiseAmount?: number;
    promisePassword?: string;
}

export function SelectAd() {
    function isAdlist(object: any): object is IAdsList {
        return 'adList' in object;
    }

    const location = useLocation();
    const adList = useCallback(() => {
        if (isAdlist(location.state)) {
            return {
                adList: location.state.adList,
                invoice: location.state.invoice,
                pieces: location.state.pieces,
                invoiceId: location.state.invoiceId,
                promise: location.state.promise,
                promiseAmount: location.state.promiseAmount,
                promisePassword: location.state.promisePassword
            };
        }
        return null;
    }, [location.state])

    function getIsBuy(){
        let l=adList();
        if(l==null){
            return false;
        }
        if(l.invoice!==undefined){
            return false;
        }
        return l.promise !== undefined;

    }

    if (adList() === null) {
        return <Redirect push to={"/"}/>
    }

    return (
        <Container>
            <Row>
                <Col>
                    <AdTable isBuy={getIsBuy()} adLIst={adList()!} disabled={true}/>
                </Col>
            </Row>
        </Container>
    )
}