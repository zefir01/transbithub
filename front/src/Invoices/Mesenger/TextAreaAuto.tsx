import * as React from "react";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {Alert, Col, Row, Spinner} from "reactstrap";
import {data, IStrings} from "../../localization/Invoices/Messenger/TextAreaAuto";
import {errors} from "../../localization/Errors";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MB10} from "../../global";
import {LoadingBtn} from "../../LoadingBtn";
import {useStrings} from "../../Hooks";
import useResizeObserver from "use-resize-observer";

library.add(fas);
const attacheLookup: IconLookup = {prefix: 'fas', iconName: 'paperclip'};
const attacheIconDefinition: IconDefinition = findIconDefinition(attacheLookup);


export interface ITextAreaAutoProps {
    onSend: (message: string) => void;
    onFile: (data: DataTransfer) => void;
    sendingMessage: boolean;
    sendingFiles: boolean;
}

export function TextAreaAuto(props: ITextAreaAutoProps) {
    const strings: IStrings = useStrings(data);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const maxMessageSize = 1000;

    function isError() {
        return text.length > maxMessageSize;
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {width = 1, height = 1} = useResizeObserver({ref: textAreaRef});
    useEffect(() => {
        if (height === 1) {
            return;
        }
        if (textAreaRef.current === null) {
            return;
        }
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }, [text, height])

    return (
        <>
            <Row className="no-gutters">
                <Col>
                    <Row className="no-gutters">
                        <Col className="col-auto">
                            <input type="file" id="file" ref={inputRef} style={{display: "none"}}
                                   accept="image/x-png, image/gif, image/jpeg"
                                   multiple={true}
                                   onChange={event => {
                                       event.stopPropagation();
                                       event.preventDefault();
                                       if (event.target.files && props.onFile) {
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
                                               props.onFile(dt);
                                           }
                                       }
                                       if (inputRef?.current?.value) {
                                           inputRef.current.value = "";
                                       }
                                   }}
                            />
                            {!props.sendingFiles ?
                                <FontAwesomeIcon className="text-secondary m-1"
                                                 style={{cursor: "pointer"}}
                                                 icon={attacheIconDefinition} size="2x"
                                                 onClick={() => {
                                                     inputRef.current?.click();
                                                 }}
                                />
                                :
                                <Spinner className="m-1" color="primary" size="2x"/>
                            }
                        </Col>
                        <Col className="mt-1">
                        <textarea className="focus" value={text} ref={textAreaRef} rows={2}
                                  style={{resize: "none", minWidth: "100%", overflow: "hidden", outline: "none"}}
                                  maxLength={maxMessageSize}
                                  onInput={event => {
                                      setText(event.currentTarget.value);
                                  }}
                                  onKeyPressCapture={event => {
                                      if (event.key === 'Enter' && event.shiftKey) {
                                          event.preventDefault();
                                          setText(text + "\n");
                                          return;
                                      }
                                      if (event.key === 'Enter') {
                                          event.preventDefault();
                                          if (text === "") {
                                              return;
                                          }
                                          props.onSend(text);
                                          setText("");
                                      }
                                  }}
                        />
                        </Col>
                    </Row>
                    <Row className="no-gutters">
                        <Col>
                            <span className="small text-secondary mt-0">Shift+Enter to new line. Enter to send.</span>
                        </Col>
                    </Row>
                </Col>
                <Col className="col-auto">
                    <LoadingBtn loading={props.sendingMessage} color="info" className="m-1"
                                disabled={isError()}
                                onClick={() => {
                                    if (text === "") {
                                        return;
                                    }
                                    props.onSend(text);
                                    setText("");
                                }}
                    >
                        {strings.send}
                    </LoadingBtn>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert className="text-center" color="danger" isOpen={error !== ""}
                           toggle={() => setError("")}>{errors(error)}
                    </Alert>
                </Col>
            </Row>
        </>
    )
}

export interface ITextAreaAutoSimpleProps {
    onInput?: (value: string) => void;
    minRows?: number;
    placeHolder?: string;
    onChange?: (value: string) => void;
    invalid?: boolean;
    small?: boolean;
    scrollEnabled?: boolean;
    value?: string;
}

export function TextAreaAutoSimple(props: ITextAreaAutoSimpleProps) {
    const [rows, setRows] = useState(props.minRows ?? 1);
    const [text, setText] = useState("");

    useEffect(() => {
        let newRows = text.split("\n").length;
        if (props.minRows && newRows < props.minRows) {
            newRows = props.minRows;
        }
        setRows(newRows);
    }, [text, props.minRows]);

    useEffect(() => {
        if (props.value !== undefined) {
            setText(props.value);
        }
    }, [props.value])

    function getClass() {
        let str = "focus form-control";
        if (props.invalid) {
            str += " is-invalid";
        }
        return str;
    }

    function getStyle(): CSSProperties {
        let st: CSSProperties = {};
        if (!props.scrollEnabled) {
            st.resize = "none";
            st.minWidth = "100%";
            st.overflow = "hidden";
            st.outline = "none";
        }
        if (props.small) {
            st.fontSize = "80%";
            st.fontWeight = 400;
        }
        return st;
    }

    return (
        <textarea rows={rows} className={getClass()} value={text}
                  placeholder={props.placeHolder}
                  style={getStyle()}
                  onInput={event => {
                      if (props.value === undefined) {
                          setText(event.currentTarget.value);
                      }
                      if (props.onInput) {
                          props.onInput(event.currentTarget.value);
                      }
                  }}
                  onChange={event => {
                      if (props.value === undefined) {
                          setText(event.currentTarget.value);
                      }
                      if (props.onChange) {
                          props.onChange(event.currentTarget.value);
                      }
                  }}
        />
    )
}