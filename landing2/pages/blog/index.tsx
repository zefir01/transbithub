import React from "react";
import {BlogPreview} from "../../components/BlogPreview";
import {Container, Grid} from "@material-ui/core";
import {IMeta} from "../../components/Interfaces";
import {NextSeo} from "next-seo";
import {xxxDealsMeta} from "./3x-deals";
import {GeneralFeaturesMeta} from "./general-features";
import {HowToBuyMeta} from "./how-to-buy";
import {HowToBuyAssistantMeta} from "./how-to-buy-assistant";
import {LnGeneralMeta} from "./lightning-network-general";
import {LnWalletsMeta} from "./lightning-network-wallets";
import {SecurityMeta} from "./security";

interface GridItemProps {
    meta: IMeta;
}

export function GridItem(props: GridItemProps) {
    return (
        <BlogPreview meta={props.meta}/>
    )
}

export default function Index() {

    return (
        <>
            <NextSeo
                title="Полезный блог о покупке и продаже биткоинов"
                description="Все, что вам нужно знать о криптовалюте в информативном блоге - Transbithub.com. Покупка и продажа биткоинов, безопасные сделки, пошаговые инструкции и многое другое."
                additionalLinkTags={
                    [
                        {
                            rel: 'icon',
                            href: '/img/cropped-fav12-32x32.png',
                            sizes: "32x32"
                        },
                        {
                            rel: 'icon',
                            href: '/img/cropped-fav12-192x192.png',
                            sizes: "192x192"
                        },
                        {
                            rel: 'apple-touch-icon',
                            href: '/img/cropped-fav12-180x180.png',
                        },
                        {
                            rel: 'shortcut icon',
                            href: '/favicon.ico',
                            type: "image/x-icon"
                        },
                    ]
                }
                additionalMetaTags={
                    [
                        {
                            property: 'msapplication-TileImage',
                            content: '/img/cropped-fav12-270x270.png'
                        },
                        {
                            property: 'article:modified_time',
                            content: '2021-06-26T14:40:22+00:00'
                        }
                    ]
                }
            />
            <Container>
                <h1>Блог</h1>
                <Grid container spacing={3}>
                    <GridItem meta={LnWalletsMeta}/>
                    <GridItem meta={LnGeneralMeta}/>
                    <GridItem meta={SecurityMeta}/>
                    <GridItem meta={xxxDealsMeta}/>
                    <GridItem meta={HowToBuyMeta}/>
                    <GridItem meta={HowToBuyAssistantMeta}/>
                    <GridItem meta={GeneralFeaturesMeta}/>
                </Grid>
            </Container>
        </>
    )
}