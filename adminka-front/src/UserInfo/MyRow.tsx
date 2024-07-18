import * as React from "react";
import {Col, Row} from "reactstrap";
import {ReactNode} from "react";
import {Timestamp} from "google-protobuf/google/protobuf/timestamp_pb";
import {toDate} from "../helpers";
import humanizeDuration from "humanize-duration";
import {strings} from "../localization/UserInfo/UserInfo";

interface IMyRowProps {
    description: string;
    data: ReactNode;
    isHrDisabled?: boolean;
}

export const MyRow = (props: IMyRowProps) => {
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

export function myRound(value: number): string {
    let len = value.toString().length;
    let str = value.toString();
    if (len === 1)
        return str;
    let nuls = "0".repeat(len - 1);
    return str[0] + nuls + "+";
}

export function duration(date: Timestamp.AsObject, loadTime: Date, lang: string): string {
    let d = loadTime.getTime() - toDate(date).getTime();
    return humanizeDuration(d,
        {
            language: lang,
            largest: 2,
            round: true,
            fallbacks: ['en']
        }
    ) + " " + strings.ago;
}
export function durationSec(seconds: number, lang: string): string {
    return humanizeDuration(seconds * 1000,
        {
            language: lang,
            largest: 2,
            round: true,
            fallbacks: ['en']
        }
    );
}