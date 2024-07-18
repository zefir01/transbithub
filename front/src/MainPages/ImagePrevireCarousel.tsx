import * as React from "react";
import {
    Carousel,
    CarouselControl,
    CarouselItem, Col,
    Row,
} from "reactstrap";
import {useEffect, useState} from "react";
import {ImagePreview} from "./ImagePreview";

export interface ImagePreviewCarouselProps {
    ids: string[];
    maxSizeRem?: number;
    pageSize?: number;
}

export function ImagePreviewCarousel(props: ImagePreviewCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [items, setItems] = useState<JSX.Element[]>([]);
    const pageSize = props.pageSize ?? 4;

    useEffect(() => {
        function createPage(num: number) {
            let ids = props.ids.slice(num * pageSize, (num + 1) * pageSize);
            let colSize = Math.ceil(12 / pageSize);
            return (
                <Row noGutters>
                    {
                        ids.map(p => {
                            return (
                                <Col key={p} className={"col-" + colSize}>
                                    <ImagePreview id={p} maxSizeRem={props.maxSizeRem}/>
                                </Col>
                            )
                        })
                    }
                </Row>
            )
        }
        function createAllPages() {
            let pagesTotal = Math.ceil(props.ids.length / pageSize);
            let pagesIds = [...Array(pagesTotal).keys()]
            return pagesIds.map(p => {
                return (
                    <div>
                        {createPage(p)}
                    </div>
                )
            })
        }
        let arr2 = createAllPages().map((item, i) => {
            return (
                <CarouselItem
                    className="custom-tag"
                    tag="div"
                    key={i}
                >
                    {item}
                </CarouselItem>
            );
        });
        setItems(arr2);
    }, [props.ids, pageSize, props.maxSizeRem]);


    const next = () => {
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        const nextIndex = activeIndex === items.length ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <Carousel
            activeIndex={activeIndex}
            next={() => {
            }}
            previous={() => {
            }}
        >

            {items}
            {activeIndex > 0 ?
                <CarouselControl cssModule={{"width": "3%"}} className="px-0" direction="prev"
                                 directionText="Previous"
                                 onClickHandler={previous}/>
                : null
            }
            {activeIndex < items.length - 1 ?
                <CarouselControl cssModule={{"width": "3%"}} className="px-0" direction="next"
                                 directionText="Next"
                                 onClickHandler={next}/>
                : null
            }
        </Carousel>
    )
}