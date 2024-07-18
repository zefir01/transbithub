import * as React from "react";
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {TextAreaAutoSimple} from "../Mesenger/TextAreaAuto";
import {Col4, MB10} from "../../global";
import {ImagePreview} from "../../MainPages/ImagePreview";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useRef, useState} from "react";
import {IImage} from "../../redux/store/Interfaces";
import {createImage} from "../../helpers";
import {UploadImages} from "../../redux/actions";
import {useDispatch} from "redux-react-hook";
import {InvoiceSecret} from "../../Protos/api_pb";
import {useImages} from "../../IDBLoader";
import {data, IStrings} from "../../localization/Invoices/Secrets/CreateSecretModal"
import {useStrings} from "../../Hooks";

export interface CreateSecretProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (text: string, images: string[], toStart: boolean) => void;
    edit?: InvoiceSecret.AsObject;
}

export function CreateSecretModal(props: CreateSecretProps) {
    const strings: IStrings=useStrings(data);
    const dispatch = useDispatch();
    const [imagesIds, setImagesIds] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [, setError] = useState("");
    const [text, setText] = useState("");

    let images = useImages(imagesIds, true);

    useEffect(() => {
        if (!props.edit) {
            return;
        }
        setImagesIds(props.edit?.imagesList)
        setError("");
        setText(props.edit.text);
    }, [props.edit, props.isOpen])

    async function onFile(data: DataTransfer) {
        let arr = new Array<IImage>();
        let ids = Array.from(imagesIds);
        for (let i of data.items) {
            if (ids.length === 10) {
                break;
            }
            let f = await createImage(i.getAsFile()!)
            arr.push(f);
            ids.push(f.id);
        }
        setImagesIds(ids);
        dispatch(UploadImages(arr));
    }

    function isError() {
        if (text === "" || text.length > 1000) {
            return true;
        }
        return imagesIds.length !== images.length;
    }

    useEffect(() => {
        if (props.edit) {
            return;
        }
        setImagesIds([]);
        setError("");
        setText("");
    }, [props.isOpen, props.edit]);

    return (
        <Modal isOpen={props.isOpen} toggle={() => props.onClose()} size="lg">
            <ModalHeader toggle={() => props.onClose()}>
                {!props.edit ?
                    <h5>{strings.title1}</h5>
                    :
                    <h5>{strings.title2}</h5>
                }
                <span className="text-secondary small">{strings.info}</span>
            </ModalHeader>
            <ModalBody>
                <Card>
                    <CardBody>
                        <Row>
                            <Col>
                                <TextAreaAutoSimple minRows={5} placeHolder={strings.textPh}
                                                    invalid={text === "" || text.length > 1000}
                                                    onInput={value => setText(value)}
                                                    value={text}
                                />
                            </Col>
                            <Col>
                                <span className="text-secondary">{strings.textInfo}</span>
                            </Col>
                        </Row>
                        <Row className="pt-3">
                            <Col>
                                <Row noGutters>
                                    {
                                        imagesIds.map(p => {
                                            return (
                                                <Col {...Col4} className="pb-3 px-1 justify-content-center" key={p}>
                                                    <ImagePreview id={p} deleteEnable={true}
                                                                  onDelete={id => {
                                                                      let arr = Array.from(imagesIds);
                                                                      arr = arr.filter(k => k !== id);
                                                                      setImagesIds(arr);
                                                                  }}
                                                    />
                                                </Col>
                                            )
                                        })
                                    }
                                    {imagesIds.length < 10 ?
                                        <Col {...Col4} className="text-center pb-3 px-1">
                                            <input type="file" id="file" ref={inputRef} style={{display: "none"}}
                                                   accept="image/x-png, image/gif, image/jpeg"
                                                   multiple={true}
                                                   onChange={event => {
                                                       event.stopPropagation();
                                                       event.preventDefault();
                                                       if (event.target.files && onFile) {
                                                           const dt = new DataTransfer()
                                                           let err = "";
                                                           if (event.target.files.length > 10) {
                                                               err = strings.max;
                                                               setError(err);
                                                               return;
                                                           }
                                                           for (let f of event.target.files) {
                                                               if (f.size > MB10) {
                                                                   err += `${f.name} has size over 10MB\n`;
                                                               } else {
                                                                   dt.items.add(f);
                                                               }
                                                           }
                                                           if (err !== "") {
                                                               setError(err);
                                                           }
                                                           if (dt.items.length > 0) {
                                                               // noinspection JSIgnoredPromiseFromCall
                                                               onFile(dt);
                                                           }
                                                       }
                                                       if (inputRef?.current?.value) {
                                                           inputRef.current.value = "";
                                                       }
                                                   }}
                                            />
                                            <FontAwesomeIcon className="text-secondary m-1"
                                                             style={{cursor: "pointer"}}
                                                             icon={["fas", "paperclip"]}
                                                             size="2x"
                                                             onClick={() => {
                                                                 inputRef.current?.click();
                                                             }}
                                            />
                                        </Col>
                                        : null
                                    }
                                </Row>
                            </Col>
                            <Col>
                                <span className="text-secondary">{strings.imageInfo}</span>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ModalBody>
            <ModalFooter>
                {!props.edit ?
                    <Row>
                        <Col className="col-auto">
                            <Button color="success" disabled={isError()}
                                    onClick={() => props.onCreate(text, imagesIds, true)}>
                                {strings.addToStart}
                            </Button>
                        </Col>
                        <Col className="col-auto">
                            <Button color="success" disabled={isError()}
                                    onClick={() => props.onCreate(text, imagesIds, false)}>
                                {strings.addToEnd}
                            </Button>
                        </Col>
                        <Col className="col-auto">
                            <Button color="secondary" onClick={() => props.onClose()}>{strings.close}</Button>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col className="col-auto">
                            <Button color="success" disabled={isError()}
                                    onClick={() => props.onCreate(text, imagesIds, true)}>
                                {strings.save}
                            </Button>
                        </Col>
                    </Row>
                }
            </ModalFooter>
        </Modal>
    )
}