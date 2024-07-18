import * as React from "react";
import {Alert, Button, Card, CardBody, Col, Row} from "reactstrap";
import {data, IStrings} from "../../localization/Invoices/InvoiceControl";
import {BlockUserRequest, Invoice} from "../../Protos/api_pb";
import {Redirect} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {AuthState, IStore} from "../../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {LoadingBtn} from "../../LoadingBtn";
import {useDeleteInvoice, useStrings} from "../../Hooks";
import {getToken, GrpcError, tradeApiClient, TradeGrpcRunAsync} from "../../helpers";
import {errors} from "../../localization/Errors";
import {Empty} from "google-protobuf/google/protobuf/empty_pb";

export interface ControlProps {
    invoice: Invoice.AsObject;
}

export function Control(props: ControlProps) {
    const strings: IStrings=useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            userId: store.profile.UserId,
            authState: store.auth.state,
        }), []
    );
    const {userId, authState} = useMappedState(mapState);
    const [redirect, setRedirect] = useState("");
    const [del, setDel] = useState<Invoice.AsObject | null>(null);
    const [delRunning, setDelRunning] = useState(false);
    const [block, setBlock] = useState(false);
    const [blockRunning, setBlockRunning] = useState(false);
    const [error, setError] = useState("");


    useDeleteInvoice(del, () => {
            setDelRunning(true);
            setError("");
        },
        () => {
            setDelRunning(false)
            if (error === "" && del !== null) {
                if (!del.isprivate) {
                    setRedirect("/invoices/public");
                } else if (del.owner!.id === userId) {
                    setRedirect("/invoices/from-me")
                } else {
                    setRedirect("/invoices/to-me")
                }
            }
            setDel(null);
        },
        (e) => setError(e));

    useEffect(() => {
        async function f() {
            if (!block ||
                blockRunning ||
                !props.invoice.isprivate ||
                props.invoice.owner!.id === "" ||
                authState===AuthState.NotAuthed
            ) {
                return;
            }
            setBlockRunning(true);
            setBlock(false);

            let req = new BlockUserRequest();
            req.setUserid(props.invoice.owner!.id);

            try {
                await TradeGrpcRunAsync<Empty.AsObject>(tradeApiClient.blockUser, req, getToken());
                setError("");
            } catch (e) {
                if (e instanceof GrpcError) {
                    setError(errors(e.message));
                }
                console.log(e.message);
            } finally {
                setBlockRunning(false);
            }
        }
        // noinspection JSIgnoredPromiseFromCall
        f();

    }, [authState, block, blockRunning, props.invoice.isprivate, props.invoice.owner])

    if (redirect !== "") {
        return <Redirect push to={redirect}/>;
    }

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col>
                        <Alert color="danger" isOpen={error !== ""} toggle={() => setError("")}>{errors(error)}</Alert>
                    </Col>
                </Row>
                {!props.invoice.isprivate && props.invoice.owner!.id === userId ?
                    <Row className="mt-3">
                        <Col>
                            <Button color="warning" outline className="btn-block"
                                    onClick={() => setRedirect("/invoices/create/" + props.invoice.id)}
                            >{strings.edit}</Button>
                        </Col>
                    </Row>
                    : null
                }
                {props.invoice.owner?.id === userId || props.invoice.isprivate ?
                    <Row className="pt-3">
                        <Col>
                            <LoadingBtn loading={delRunning} outline color="secondary" className="btn-block"
                                        onClick={() => setDel(props.invoice)}
                            >
                                {strings.delete}
                            </LoadingBtn>
                        </Col>
                    </Row>
                    : null
                }
                {userId !== props.invoice.owner!.id && props.invoice.owner!.id !== "" && authState === AuthState.Authed ?
                    <Row className="pt-3">
                        <Col>
                            <LoadingBtn loading={blockRunning} outline color="danger" className="btn-block"
                                        onClick={() => setBlock(true)}
                            >
                                {strings.block}
                            </LoadingBtn>
                        </Col>
                    </Row>
                    : null
                }
            </CardBody>
        </Card>
    )
}