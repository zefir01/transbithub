import {IAd} from "../../helpers";
import {makeStyles, Typography} from "@material-ui/core";
import React from "react";
import Link from "next/link";
import {AdMetadata} from "../metadata";

export interface HeaderProps {
    ad: IAd;
}

export function Header(props: HeaderProps) {
    const meta = new AdMetadata(props.ad);

    const infoLinkStyleCB = makeStyles(() =>
        (
            {
                root: {
                    textDecorationLine: "none",
                }
            }
        )
    );

    return (
        <>
            <Typography variant={"h4"} component={"h1"}>
                {meta.h1_1}
                <Link href={"/aggregator/trader/" + props.ad.trader.id} passHref>
                    <a className={infoLinkStyleCB().root}>{" " + props.ad.trader.name + " "}</a>
                </Link>
                {meta.h1_2}
            </Typography>
        </>
    )
}