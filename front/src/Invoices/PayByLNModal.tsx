import * as React from "react";
import {Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {InvoicePayment} from "../Protos/api_pb";
import {QRCode} from "react-qr-svg";
import {data, IStrings} from "../localization/Invoices/PayByLNModal";
import {useStrings} from "../Hooks";

export interface PayByLNModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: InvoicePayment.AsObject;
}

interface IQRProps {
    uri: string;
}

export function PayByLNModal(props: PayByLNModalProps){
    const strings: IStrings = useStrings(data);
    const QR = React.memo((props: IQRProps) => {
        return (
            <QRCode
                className="d-block mx-auto"
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{width: 256}}
                value={props.uri}
            />
        );
    });

    function GetUri() {
        return `lightning:${props.payment.lninvoice}`;
    }

    return(
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h5>{strings.header}</h5>
            </ModalHeader>
            <ModalBody>
                <Card>
                    <CardBody>
                        <Row>
                            <Col>
                                <QR uri={GetUri()}/>
                            </Col>
                        </Row>
                        <span className="font-weight-bold h5 d-block pt-3">
                                {strings.info}
                            </span>
                        <span>
                                {GetUri()}
                            </span>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    )
}