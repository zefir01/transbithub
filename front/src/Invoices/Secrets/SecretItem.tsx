import * as React from "react";
import {ListGroupItem, Col, Row, Alert} from "reactstrap";
import {
    ChangeInvoiceSecretRequest,
    InvoiceSecret,
    InvoiceSecretsList,
    UpdateInvoiceSecretRequest
} from "../../Protos/api_pb";
import {MultilineContent} from "../../MultilineContent";
import {ImagePreviewCarousel} from "../../MainPages/ImagePrevireCarousel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useCallback, useEffect, useState} from "react";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {errors} from "../../localization/Errors";
import {CreateSecretModal} from "./CreateSecretModal";
import {Loading} from "../../Loading";
import {data, IStrings} from "../../localization/Invoices/Secrets/SecretItem";
import {NavLink} from "react-router-dom";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {useStrings} from "../../Hooks";

export interface SecretItemProps {
    secret: InvoiceSecret.AsObject
    id: number;
    newList: (list: InvoiceSecretsList.AsObject) => void;
    isLast: boolean;
    onUpdate?: (newText: string, newImages: string[]) => void;
    onChange?: (operation: ChangeInvoiceSecretRequest.SecretOperations) => void;
}

export function SecretItem(props: SecretItemProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

    const [changeRunning, setChangeRunning] = useState(false);
    const [changeOperation, setChangeOperation] = useState<ChangeInvoiceSecretRequest.SecretOperations | null>(null);
    const [error, setError] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [newText, setNewText] = useState("");
    const [newImages, setNewImages] = useState<string[]>([]);
    const [save, setSave] = useState(false);
    const [saveRunning, setSaveRunning] = useState(false);

    useEffect(() => {
        if (props.onUpdate && save) {
            props.onUpdate(newText, newImages);
            setSave(false);
            return;
        }
        if (!save || saveRunning || authState === AuthState.NotAuthed) {
            return;
        }
        setSaveRunning(true);
        let req = new UpdateInvoiceSecretRequest();
        req.setImagesList(newImages);
        req.setText(newText);
        req.setOrder(props.secret.order);
        req.setSecretid(props.secret.id);

        async function f() {
            try {
                let resp = await TradeGrpcRunAsync<InvoiceSecretsList.AsObject>(tradeApiClient.updateInvoiceSecret, req, getToken());
                props.newList(resp);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setSave(false);
                setSaveRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [save, newText, newImages, saveRunning, authState])

    useEffect(() => {
        if (props.onChange && changeOperation !== null) {
            props.onChange(changeOperation);
            setChangeOperation(null);
            return;
        }
        if (changeOperation === null || changeRunning || authState === AuthState.NotAuthed) {
            return;
        }
        setChangeRunning(true);

        async function f() {
            let req = new ChangeInvoiceSecretRequest();
            req.setOperation(changeOperation!);
            req.setSecretid(props.secret.id);

            try {
                let resp = await TradeGrpcRunAsync<InvoiceSecretsList.AsObject>(tradeApiClient.changeInvoiceSecret, req, getToken());
                props.newList(resp);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setChangeOperation(null);
                setChangeRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();


    }, [changeOperation, changeRunning, props, authState])

    function getIconClass(color?: string) {
        if (changeRunning) {
            return "text-secondary";
        }
        if (color) {
            return "text-" + color;
        }
        return "text-primary"
    }

    return (
        <ListGroupItem>
            <CreateSecretModal isOpen={editOpen} edit={props.secret} onCreate={(text, images) => {
                setNewImages(images);
                setNewText(text);
                setSave(true);
                setEditOpen(false);
            }}
                               onClose={() => setEditOpen(false)}
            />
            {!saveRunning ?
                <Row>
                    <Col className="col-auto">
                        <span className="font-weight-bold d-block">#{props.id}</span>
                        {props.secret.paymentidisnull ?
                            <>
                                <FontAwesomeIcon className={getIconClass("warning") + " d-block mt-2"}
                                                 icon={["far", "edit"]}
                                                 size="2x"
                                                 style={{cursor: "pointer"}}
                                                 onClick={() => setEditOpen(true)}

                                />
                                <FontAwesomeIcon className={getIconClass("danger") + " d-block mt-2"}
                                                 icon={["far", "trash-alt"]}
                                                 size="2x"
                                                 style={{cursor: "pointer"}}
                                                 onClick={() => {
                                                     setChangeOperation(ChangeInvoiceSecretRequest.SecretOperations.REMOVE);
                                                 }}

                                />
                            </>
                            : null
                        }
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <MultilineContent text={props.secret.text} small={false}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="d-none d-md-inline">
                                    <ImagePreviewCarousel ids={props.secret.imagesList} pageSize={12}/>
                                </div>
                                <div className="d-md-none">
                                    <ImagePreviewCarousel ids={props.secret.imagesList} pageSize={4}/>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {props.secret.paymentidisnull ?
                        <Col className="col-auto">
                            <div className="d-flex flex-column h-100">
                                {props.id !== 0 ?
                                    <div className="mb-auto">
                                        <FontAwesomeIcon className={getIconClass()} icon={["far", "arrow-up"]} size="2x"
                                                         style={{cursor: "pointer"}}
                                                         onClick={() => {
                                                             setChangeOperation(ChangeInvoiceSecretRequest.SecretOperations.TOUP);
                                                         }}
                                        />
                                        <FontAwesomeIcon className={getIconClass()} icon={["far", "arrow-to-top"]}
                                                         size="2x"
                                                         style={{cursor: "pointer"}}
                                                         onClick={() => {
                                                             setChangeOperation(ChangeInvoiceSecretRequest.SecretOperations.TOTOP);
                                                         }}
                                        />
                                    </div>
                                    : null
                                }
                                {!props.isLast ?
                                    <div className="mt-auto">
                                        <FontAwesomeIcon className={getIconClass()} icon={["far", "arrow-down"]}
                                                         size="2x"
                                                         style={{cursor: "pointer"}}
                                                         onClick={() => {
                                                             setChangeOperation(ChangeInvoiceSecretRequest.SecretOperations.TODOWN);
                                                         }}
                                        />
                                        <FontAwesomeIcon className={getIconClass()} icon={["far", "arrow-to-bottom"]}
                                                         size="2x"
                                                         style={{cursor: "pointer"}}
                                                         onClick={() => {
                                                             setChangeOperation(ChangeInvoiceSecretRequest.SecretOperations.TOBOTTOM);
                                                         }}
                                        />
                                    </div>
                                    : null
                                }
                            </div>
                        </Col>
                        :
                        <Col className="col-auto">
                            <NavLink className="nav-link p-0"
                                     to={"/invoices/payment/" + props.secret.paymentid}>
                                {strings.payment + props.secret.paymentid}
                            </NavLink>
                        </Col>
                    }
                </Row>
                :
                <Row className="justify-content-center">
                    <Col className="col-auto">
                        <Loading/>
                    </Col>
                </Row>
            }
            <Row>
                <Col>
                    <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                </Col>
            </Row>
        </ListGroupItem>
    );
}