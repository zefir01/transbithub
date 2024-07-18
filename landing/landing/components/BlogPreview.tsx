import {IMeta} from "./Interfaces";
import {Box, Card, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import React from "react";
import Link from "next/link";

export interface BlogPreviewProps {
    meta: IMeta;
}

export function BlogPreview(props: BlogPreviewProps) {
    return (
        <Box my={3} boxShadow={1}>
            <Link href={props.meta.slug}>
                <Card style={{cursor: "pointer"}}>
                    <Grid container direction="row">
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Box boxShadow={3} m={3}>
                                <CardMedia component="img" image={"/img/blog/" + props.meta.image}
                                           title={props.meta.title}/>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
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