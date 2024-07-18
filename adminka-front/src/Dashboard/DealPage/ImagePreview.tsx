import * as React from "react";
import {useDispatch} from "redux-react-hook";
import {OpenOriginalImageView} from "../../redux/actions";
import {Card, CardImg, CardImgOverlay, CardText, Col, Row, Spinner} from "reactstrap";
import {useImage} from "../../IDBLoader";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {findIconDefinition, IconDefinition, IconLookup, library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(fas);
const trashLookup: IconLookup = {prefix: 'far', iconName: 'trash-alt'};
const trashIconDefinition: IconDefinition = findIconDefinition(trashLookup);

export interface ImagePreviewProps {
    id: string;
    createdAt?: Date;
    maxSizeRem?: number;
    deleteEnable?: boolean;
    onDelete?: (id: string) => void;
}


export function ImagePreview(props: ImagePreviewProps) {
    const dispatch = useDispatch();
    const image = useImage(props.id, true, props.createdAt);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isMaxHeight, setIsMaxHeight] = useState(false);

    const ref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (ref.current) {
            let h = ref.current.naturalHeight;
            let w = ref.current.naturalWidth;
            let val = h > w;
            if (isMaxHeight !== val) {
                setIsMaxHeight(val);
            }
        }
    }, [isMaxHeight])

    function getStyle() {
        let style: CSSProperties = {cursor: "pointer"};
        if (props.maxSizeRem) {
            if (isMaxHeight) {
                style.maxHeight = props.maxSizeRem + "rem";
            } else {
                style.maxWidth = props.maxSizeRem + "rem";
            }
        }
        if (isMouseOver && props.deleteEnable) {
            style.opacity = 0.5;
        }
        return style;
    }

    function removeIcon() {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <FontAwesomeIcon className="text-secondary m-1 text-danger"
                                     style={{cursor: "pointer"}}
                                     icon={trashIconDefinition} size="3x"
                    />
                </Col>
            </Row>
        );
    }

    if (!image?.url) {
        return (
            <Row className="justify-content-center">
                <Col className="col-auto"
                     onMouseOver={() => setIsMouseOver(true)}
                     onMouseLeave={() => setIsMouseOver(false)}
                >
                    {props.deleteEnable && props.onDelete && isMouseOver ?
                        <FontAwesomeIcon className="text-secondary m-1 text-danger"
                                         style={{cursor: "pointer"}}
                                         icon={trashIconDefinition} size="3x"
                                         onClick={() => {
                                             if (props.deleteEnable && props.onDelete) {
                                                 props.onDelete(props.id);
                                                 return;
                                             }
                                         }}
                        />
                        :
                        <Spinner color="primary"/>
                    }
                </Col>
            </Row>
        );
    }

    return (
        <Card className="h-100"
              onMouseOver={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}
              onClick={() => {
                  if (props.deleteEnable && props.onDelete) {
                      props.onDelete(props.id);
                      return;
                  }
                  dispatch(OpenOriginalImageView(props.id, props.createdAt));
              }}
        >
            <img style={getStyle()} className="card-img" src={image.url} ref={ref}/>
            {isMouseOver && props.deleteEnable ?
                <CardImgOverlay>
                    {removeIcon()}
                </CardImgOverlay>
                : null
            }
        </Card>
    )
}