import React, {FunctionComponent} from "react";
import {Col, Container, Row} from "reactstrap";
import {bugsMail, site, supportMail} from "./global";
import {data, IStrings} from "./localization/Footer";
import {useStrings} from "./Hooks";



export const Footer: FunctionComponent = () => {
    const strings: IStrings=useStrings(data);
    return (
        <Container>
            <Row className="mt-3">
                <Col className="text-center">
                    <span className="text-secondary h6">{strings.info1}<a href={`mailto:${bugsMail}@${site.toLowerCase()}`}>{bugsMail}@{site.toLowerCase()}</a>{strings.info2}</span>
                </Col>
            </Row>
            <Row className="text-center">
                <Col>
                    <span className="text-secondary small">{strings.info3}</span>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="text-center">
                    <span className="text-secondary small">{strings.infoSupport1}<a href={`mailto:${supportMail}@${site.toLowerCase()}`}>{supportMail}@{site.toLowerCase()}</a></span>
                </Col>
            </Row>
        </Container>
    );
}