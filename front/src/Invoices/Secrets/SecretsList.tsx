import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {
    ChangeInvoiceSecretRequest,
    CreateInvoiceSecretRequest,
    GetInvoiceSecretsRequest,
    InvoiceSecret,
    InvoiceSecretsList
} from "../../Protos/api_pb";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {SecretItem} from "./SecretItem";
import {Alert, Card, CardHeader, Col, ListGroup, Row} from "reactstrap";
import {CreateSecretModal} from "./CreateSecretModal";
import {LoadingBtn} from "../../LoadingBtn";
import {errors} from "../../localization/Errors";
import {Loading} from "../../Loading";
import {data, IStrings} from "../../localization/Invoices/Secrets/SecretsList"
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {useStrings} from "../../Hooks";

interface SecretsListProps {
    invoiceId?: number;
    isPrivate: boolean;
    onUpdate?: (secrets: InvoiceSecret.AsObject[]) => void;
    isSold: boolean;
}

export function SecretsList(props: SecretsListProps) {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            authState: store.auth.state,
        }), []
    );
    const {authState} = useMappedState(mapState);

    const [secrets, setSecrets] = useState<InvoiceSecret.AsObject[] | null>(null);
    const [getSecretsRunning, setGetSecretsRunning] = useState(false);
    const [error, setError] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [createSecretReq, setCreateSecretReq] = useState<CreateInvoiceSecretRequest | null>(null);
    const [createRunning, setCreateRunning] = useState(false);

    useEffect(() => {
        if (!props.invoiceId && !secrets) {
            setSecrets([]);
        }
    }, [props.invoiceId, secrets])

    useEffect(() => {
        if (!secrets || !props.isPrivate || secrets.length <= 1) {
            return;
        }
        setSecrets([secrets[0]]);
    }, [secrets, props.isPrivate])

    useEffect(() => {
        if (secrets !== null || getSecretsRunning || !props.invoiceId || authState === AuthState.NotAuthed) {
            return;
        }
        setGetSecretsRunning(true);
        let req = new GetInvoiceSecretsRequest();
        req.setInvoiceid(props.invoiceId);
        req.setIssold(props.isSold);

        async function f() {
            try {
                let resp = await TradeGrpcRunAsync<InvoiceSecretsList.AsObject>(tradeApiClient.getInvoiceSecrets, req, getToken());
                setSecrets(resp.secretsList);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setGetSecretsRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [props.invoiceId, secrets, getSecretsRunning, authState, props.isSold]);

    useEffect(() => {
        if (createSecretReq === null || createRunning || !props.invoiceId || authState === AuthState.NotAuthed) {
            return;
        }
        setCreateRunning(true);

        async function f() {
            try {
                let resp = await TradeGrpcRunAsync<InvoiceSecretsList.AsObject>(tradeApiClient.createInvoiceSecret, createSecretReq, getToken());
                setSecrets(resp.secretsList);
            } catch (e) {
                console.log(e.message);
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
            } finally {
                setCreateSecretReq(null);
                setCreateRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [createSecretReq, createRunning, authState, props.invoiceId])


    if (!secrets) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Loading/>
                </Col>
            </Row>
        )
    }

    return (
        <Card>
            <CreateSecretModal isOpen={createOpen} onClose={() => setCreateOpen(false)}
                               onCreate={(text, images, toStart) => {
                                   if (props.invoiceId) {
                                       let req = new CreateInvoiceSecretRequest();
                                       req.setInvoiceid(props.invoiceId);
                                       req.setText(text);
                                       req.setImagesList(images);
                                       let order: number;
                                       if (toStart) {
                                           order = 0;
                                       } else {
                                           order = secrets?.length ?? 0;
                                       }
                                       req.setOrder(order);
                                       setCreateSecretReq(req);
                                   } else {
                                       let sec = new InvoiceSecret();
                                       sec.setText(text);
                                       sec.setImagesList(images);
                                       sec.setOrder(0);
                                       sec.setPaymentidisnull(true);
                                       let secret = sec.toObject();
                                       if (!secrets) {
                                           setSecrets([secret]);
                                           if (props.onUpdate) {
                                               props.onUpdate([secret]);
                                           }
                                       } else {
                                           let arr = Array.from(secrets);
                                           if (toStart) {
                                               arr.unshift(secret);
                                           } else {
                                               arr.push(secret)
                                           }
                                           setSecrets(arr);
                                           if (props.onUpdate) {
                                               props.onUpdate(arr);
                                           }
                                       }
                                   }
                                   setCreateOpen(false);
                               }}/>
            <CardHeader>
                <Row>
                    {!props.isSold ?
                        <Col>
                            <span className="font-weight-bold h5">{strings.title}</span>
                            <br/>
                            <span className="text-secondary">{strings.info}</span>
                        </Col>
                        :
                        <Col>
                            <span className="font-weight-bold h5">{strings.soldTitle}</span>
                            <br/>
                            <span className="text-secondary">{strings.soldInfo}</span>
                        </Col>
                    }
                    {(props.isPrivate && secrets.length >= 1) || props.isSold ? null :
                        <Col className="col-auto">
                            <LoadingBtn loading={createRunning} color="primary" onClick={() => setCreateOpen(true)}>
                                {strings.add}
                            </LoadingBtn>
                        </Col>
                    }
                </Row>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                    </Col>
                </Row>
            </CardHeader>
            <ListGroup flush>
                {!secrets ? null : secrets.map((p, i) => {
                    return (
                        <SecretItem key={p.id} secret={p} id={i} isLast={i === secrets.length - 1}
                                    newList={list => setSecrets(list.secretsList)}
                                    onUpdate={props.invoiceId ? undefined : ((newText, newImages) => {
                                        let arr = Array.from(secrets);
                                        p.text = newText;
                                        p.imagesList = newImages;
                                        setSecrets(arr);
                                    })}
                                    onChange={props.invoiceId ? undefined : operation => {
                                        let arr: InvoiceSecret.AsObject[] = secrets?.filter(k => k !== p);
                                        let idx = secrets?.indexOf(p);
                                        if (!arr) {
                                            arr = [];
                                        }
                                        switch (operation) {
                                            case ChangeInvoiceSecretRequest.SecretOperations.TOUP:
                                                if (idx === 0) {
                                                    return;
                                                }
                                                arr.splice(idx - 1, 0, p);
                                                break;
                                            case ChangeInvoiceSecretRequest.SecretOperations.TODOWN:
                                                if (idx === 0) {
                                                    return;
                                                }
                                                arr = arr.splice(idx + 1, 0, p);
                                                break;
                                            case ChangeInvoiceSecretRequest.SecretOperations.TOTOP:
                                                arr?.unshift(p);
                                                break;
                                            case ChangeInvoiceSecretRequest.SecretOperations.TOBOTTOM:
                                                arr?.push(p);
                                                setSecrets(arr);
                                                break;
                                            case ChangeInvoiceSecretRequest.SecretOperations.REMOVE:
                                                break;

                                        }
                                        setSecrets(arr);
                                    }}
                        />
                    )
                })}
            </ListGroup>
        </Card>
    );
}