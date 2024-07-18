import {IMeta} from "./Interfaces";
import {Box, Card, CardContent, CardMedia, Grid, makeStyles, Theme, Typography} from "@material-ui/core";
import React from "react";
import Link from "next/link";

export interface BlogPreviewProps {
    meta: IMeta;
}

export function BlogPreview(props: BlogPreviewProps) {

    const imgStyleCb = makeStyles((theme: Theme) =>
        (
            {
                root: {
                    maxWidth: "200px",
                    maxHeight: "200px",
                }
            }
        )
    );
    const imgStyle = imgStyleCb();

    return (
        <Box my={3} boxShadow={1} className="w-100">
            <Link href={props.meta.slug}>
                <Card style={{cursor: "pointer"}}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Box boxShadow={3} m={3}>
                                <CardMedia className={imgStyle.root} component="img" image={"/img/blog/" + props.meta.image}
                                           title={props.meta.title}/>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                            <CardContent>
                                <Typography component={"h5"} variant={"h5"}>
                                    {props.meta.title}
                                </Typography>
                                <Typography variant="body2">
                                    {props.meta.preview}
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Link>
        </Box>
    )
}