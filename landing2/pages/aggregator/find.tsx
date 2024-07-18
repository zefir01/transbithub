import React from "react";
import {NextSeo} from "next-seo";
import {useRouter} from "next/router";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Box, Grid, Typography} from "@material-ui/core";
import {Selector} from "../../components/aggregator/selector";
import {AdTable} from "../../components/aggregator/adTable";
import {
    getAds,
    getSelectorData,
    parseSelectorParams
} from "../../components/aggregator/helpers";
import {BlogPreview} from "../../components/BlogPreview";
import {buyCryptoMeta} from "../blog/seo/buy-crypto";

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return {
            props: {
                data: {
                    paymentTypes: [],
                    currencies: null,
                    cryptoCurrencies: null,
                    sources: []
                },
                ads: []
            },
        }
    }


    const r = context.req.url.split("?");
    const req = parseSelectorParams(r.length === 1 ? "" : r[1]);
    let t = await getAds(req);

    return {
        props: {
            data: await getSelectorData(context),
            ads: t
        },
    }
};

export default function Aggregator(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return null;
    }

    if (!router) {
        return null;
    }

    // @ts-ignore
    return (
        <>
            <NextSeo
                title="Покупка и продажа криптовалют онлайн и без комиссии"
                description="В нашем агрегаторе собраны лучшие предложения с бирж по продажам криптовалют. Покупайте криптовалюту у проверенных продавцов и без комиссии."
                openGraph={{
                    locale: "ru_RU",
                    url: router.basePath,
                    title: 'Покупка и продажа криптовалют онлайн и без комиссии',
                    description: 'В нашем агрегаторе собраны лучшие предложения с бирж по продажам криптовалют. Покупайте криптовалюту у проверенных продавцов и без комиссии.',
                    site_name: 'TransBitHub',
                    type: "website",
                    images: [
                        {
                            url: '/img/bitcoin.svg',
                            alt: 'P2P биржа, биллинговая система, Кошелек с Lightning Network',
                        },
                    ],
                }}
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
                            content: '2021-04-08T14:40:22+00:00'
                        }
                    ]
                }
            />

            <Box pb={6}>
                <Typography component={"h1"} variant={"h3"} align={"center"}>
                    Покупка и продажа криптовалют
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid container item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Grid direction="column" container item xl={3} lg={3} md={3} sm={12} xs={12}>
                        <Grid container item justify={"center"}>
                            <Selector {...props.data}/>
                        </Grid>
                    </Grid>
                    <Grid direction="column" container item xl={9} lg={9} md={9} sm={12} xs={12}>
                        <Grid container item justify={"center"}>
                            <AdTable ads={props.ads}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Typography variant={"h5"}>
                        Статьи:
                    </Typography>
                    <Grid container spacing={3}>
                        <BlogPreview meta={buyCryptoMeta}/>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}