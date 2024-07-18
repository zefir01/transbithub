import * as React from "react";
import {Alert, Card, CardHeader, Col, ListGroup, ListGroupItem, Row} from "reactstrap";
import {InvoicePayment} from "../../Protos/api_pb";
import {MultilineContent} from "../../MultilineContent";
import {ImagePreviewCarousel} from "../../MainPages/ImagePrevireCarousel";
import {ContactButton} from "../Mesenger/ContactButton";
import {useCallback} from "react";
import {IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {data, IStrings} from "../../localization/Invoices/Secrets/PaymentSecretsList";
import {useStrings} from "../../Hooks";

export interface PaymentSecretsListProps {
    payment: InvoicePayment.AsObject;
}

export function PaymentSecretsList(props: PaymentSecretsListProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId
        }), []
    );
    const {userId} = useMappedState(mapState);
    return (
        <Card>
            <CardHeader>
                <h5>{strings.title}</h5>
            </CardHeader>
            {props.payment.pieces > props.payment.secretsList.length ?
                <Alert color="warning">
                    {props.payment.owner?.id === userId ?
                        strings.warn1
                        :
                        strings.warn2
                    }
                    &nbsp;
                    <ContactButton isSmall={true} target={props.payment}/>
                </Alert>
                : null
            }
            <ListGroup flush>
                {props.payment.secretsList.map((p, i) => {
                    return (
                        <ListGroupItem key={p.id}>
                            <Row>
                                <Col className="col-auto">
                                    <span className="font-weight-bold d-block">#{i}</span>
                                </Col>
                                <Col>
                                    {p.text !== "" ?
                                        <Row>
                                            <Col>
                                                <MultilineContent text={p.text} small={false}/>
                                            </Col>
                                        </Row>
                                        : null
                                    }
                                    {p.url !== "" ?
                                        <Row>
                                            <Col>
                                                {strings.link}
                                                <a target='_blank noopener noreferer' href={p.url}>
                                                    {p.url}
                                                </a>
                                            </Col>
                                        </Row>
                                        : null
                                    }
                                    <Row>
                                        <Col>
                                            <div className="d-none d-md-inline">
                                                <ImagePreviewCarousel ids={p.imagesList} pageSize={12}/>
                                            </div>
                                            <div className="d-md-none">
                                                <ImagePreviewCarousel ids={p.imagesList} pageSize={4}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    )
                })
                }
            </ListGroup>
        </Card>
    )
}