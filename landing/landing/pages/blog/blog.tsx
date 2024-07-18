import React from "react";
// @ts-ignore
import {Meta as generalFeatures} from "./generalFeatures.mdx";
// @ts-ignore
import {Meta as howToBuyAssistant} from "./HowToBuyAssistant.mdx"
// @ts-ignore
import {Meta as howToBuy} from "./howToBuy.mdx"
// @ts-ignore
import {Meta as xxxDeals} from "./3xDeals.mdx"
// @ts-ignore
import {Meta as security} from "./security.mdx"
import {BlogPreview} from "../../components/BlogPreview";
import {Container, Grid} from "@material-ui/core";
import {Header} from "../../components/header";
import {Footer} from "../../components/footer";
import {IMeta} from "../../components/Interfaces";

interface GridItemProps {
    meta: IMeta;
}

function GridItem(props: GridItemProps) {
    return (
        <BlogPreview meta={props.meta}/>
    )
}

export default function Blog() {

    if (!generalFeatures) {
        return null;
    }

    return (
        <>
            <Header/>
            <Container>
                <h1>Блог</h1>
                <Grid container spacing={3}>
                    <GridItem meta={security}/>
                    <GridItem meta={xxxDeals}/>
                    <GridItem meta={howToBuy}/>
                    <GridItem meta={howToBuyAssistant}/>
                    <GridItem meta={generalFeatures}/>
                </Grid>
            </Container>
            <Footer/>
        </>
    )
}