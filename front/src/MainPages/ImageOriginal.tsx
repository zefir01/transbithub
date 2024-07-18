import * as React from "react";
import {useDispatch, useMappedState} from "redux-react-hook";
import {useCallback} from "react";
import {IStore} from "../redux/store/Interfaces";
import {ImagesActionTypes} from "../redux/actions";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner} from "reactstrap";
import {useImage} from "../IDBLoader";
import {data, IStrings} from "../localization/ImageOriginal";
import {useStrings} from "../Hooks";

export function OriginalModal() {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const mapState = useCallback(
        (store: IStore) => ({
            images: store.images
        }), []
    );
    const {images} = useMappedState(mapState);

    function onClose() {
        dispatch({type: ImagesActionTypes.CLOSE_ORIGINAL_VIEW})
    }

    return (
        <Modal isOpen={images.originalView.isOpen} toggle={() => onClose()} size="lg">
            <ModalHeader toggle={() => onClose()}>
                {strings.title}
            </ModalHeader>
            <ModalBody>
                <ImageOriginal id={images.originalView.id} createdAt={images.originalView.createdAt}/>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => onClose()}>{strings.close}</Button>
            </ModalFooter>
        </Modal>
    );
}

export interface ImageOriginalProps {
    id: string;
    createdAt?: Date;
}

export function ImageOriginal(props: ImageOriginalProps) {
    const image = useImage(props.id, false, props.createdAt);

    if (!image?.url) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Spinner color="primary"/>
                </Col>
            </Row>
        )
    }

    return (
        <Row className="justify-content-center">
            <Col className="col-auto">
                <img src={image.url} className="img-fluid" alt="original"/>
            </Col>
        </Row>
    )
}