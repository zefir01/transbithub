import {FunctionComponent, default as React} from "react";
import {Col, Row, Spinner} from "reactstrap";

interface Props {
    className?: string;
}

export const Loading: FunctionComponent<Props> = (props) => {
    return (
        <Row className={"justify-content-center h-100 " + props.className}>
            <Col xs={1} sm={1} md={1} lg={1} xl={1} className="align-self-center">
                <Spinner color="primary"/>
            </Col>
        </Row>
    );
}