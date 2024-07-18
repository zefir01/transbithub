import * as React from "react";
import {Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table} from "reactstrap";
import {MyDecimal} from "../MyDecimal";
import {useCallback, useState} from "react";
import {IStore} from "../redux/store/Interfaces";
import {useMappedState} from "redux-react-hook";
import {Loading} from "../Loading";
import {data, IStrings} from "../localization/VarsList";
import {useStrings} from "../Hooks";

export interface VarsModalLinkProps {
    onClick?: () => void;
}

export function VarsModalLink(props: VarsModalLinkProps) {
    const strings: IStrings = useStrings(data);
    const [varsModalOpen, setVarsModalOpen]=useState(false);
    return (
        <>
            <VarsModal isOpen={varsModalOpen} onClose={() => setVarsModalOpen(false)}/>
            <span className="text-primary" style={{cursor: "pointer"}} onClick={() => {
                if(props.onClick) {
                    props.onClick();
                }
                setVarsModalOpen(true);
            }}>{strings.title}</span>
        </>
    )
}

export interface VarsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VarsModal(props: VarsModalProps) {
    const strings: IStrings = useStrings(data);
    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                <h4>{strings.title}</h4>
                {strings.info}
            </ModalHeader>
            <ModalBody>
                <VarsComponent/>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
            </ModalFooter>
        </Modal>
    );
}

export function VarsComponent() {
    const strings: IStrings = useStrings(data);
    const mapState = useCallback(
        (store: IStore) => ({
            vars: store.catalog.variables,
        }), []
    );
    const {vars} = useMappedState(mapState);

    function MyRow(id: number, name: string, value: MyDecimal) {
        return (
            <tr>
                <th scope="row">{id}</th>
                <td>{name}</td>
                <td>{value.toString()}</td>
            </tr>
        )
    }

    if (vars === null || vars.size === 0) {
        return (
            <Container>
                <Loading/>
            </Container>
        )
    }

    return (
        <Table>
            <thead>
            <tr>
                <th>#</th>
                <th>{strings.name}</th>
                <th>{strings.value}</th>
            </tr>
            </thead>
            <tbody>
            {Array.from(vars.keys()).sort((a, b) => a.localeCompare(b)).map((p, i) => MyRow(i, p, vars?.get(p)!))}
            </tbody>
        </Table>
    )
}

export function VarsList() {
    const strings: IStrings = useStrings(data);
    return (
        <Container>
            <Row>
                <Col>
                    <h1>{strings.title}</h1>
                    {strings.info}
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <VarsComponent/>
                </Col>
            </Row>
        </Container>
    )
}