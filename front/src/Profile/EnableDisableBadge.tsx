import * as React from 'react'
import {Badge} from "reactstrap";
import {data, IStrings} from "../localization/Profile/EnableDisableBadge";
import {useStrings} from "../Hooks";

export interface EnableDisableBadgeProps {
    isEnable: boolean,
    enableText?: string,
    disableText?: string,
    isSmall?: boolean
}

export function EnableDisableBadge({
                                       isEnable = false,
                                       enableText,
                                       disableText,
                                       isSmall = true
                                   }: EnableDisableBadgeProps) {
    const strings: IStrings=useStrings(data);
    if(enableText===undefined){
        enableText=strings.enableText;
    }
    if(disableText===undefined){
        disableText=strings.disableText;
    }
    if (isEnable)
        return (
            <Badge color="success" className="ml-1 d-inline-flex align-items-center justify-content-start">
                {isSmall?<small>{enableText}</small>:<span>{enableText}</span>}
            </Badge>
        );
    else
        return (
            <Badge color="danger" className="ml-1 d-inline-flex align-items-center justify-content-start">
                {isSmall?<small>{disableText}</small>:<span>{disableText}</span>}
            </Badge>
        )
}