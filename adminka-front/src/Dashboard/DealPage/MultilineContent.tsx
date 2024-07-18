import * as React from "react";
import {CSSProperties} from "react";

export interface IMultilineContentProps {
    text: string;
    small: boolean;
    disableModify?: boolean;
}

export function MultilineContent(props: IMultilineContentProps) {
    if (props.text === "") {
        return null;
    }
    let cl = "m-0";
    if (props.small) {
        cl += " small";
    }
    let style: CSSProperties = {
        //display: "block",
        overflowWrap: "anywhere"
    };
    if (props.disableModify) {
        style = {
            //display: "block",
            whiteSpace: "pre"
        };
    }
    return <>
        {props.text.split("\n").map((t, i) => {
            if (t === "") {
                return (
                    <br key={i}/>
                );
            }
            return (
                <>
                    <span style={style} className={cl} key={i}>{t}</span>
                    <br key={"br" + i}/>
                </>
            );
        })}
    </>

}