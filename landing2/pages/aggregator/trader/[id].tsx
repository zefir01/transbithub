import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ITrader, traderToJson} from "../../../components/helpers";
import {Grid, Typography} from "@material-ui/core";
import {Info} from "../../../components/aggregator/trader/info";
import {Stat} from "../../../components/aggregator/trader/stat";
import {AdTable} from "../../../components/aggregator/trader/adTable";
import Error from 'next/error'
import {Person, WithContext} from "schema-dts";
import {JsonLd} from "../../../components/JsonLd";
import React from "react";
import {getDb} from "../../../stores/aggregator";
import {NextSeo} from "next-seo";
import {TraderMetadata} from "../../../components/aggregator/metadata";

interface SSProps {
    trader: ITrader | null;
}

export const getServerSideProps: GetServerSideProps<SSProps> = async (context) => {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return {
            props: {
                trader: null,
            },
        };
    }

    const {id} = context.query;

    if (isNaN(parseInt(id as string))) {
        return {
            props: {
                trader: null,
            },
        }
    }

    let db = getDb();
    try {
        let trader = await db.trader.findUnique({
            where: {
                id: parseInt(id as string)
            },
            include: {
                ad: true,
                trader_snapshot: {
                    include: {
                        bz_trader_volumes: true
                    }
                }
            },
        })

        if (!trader) {
            return {
                props: {
                    trader: null,
                },
            }
        }

        return {
            props: {
                trader: traderToJson(trader),
            },
        }
    } finally {
        db?.$disconnect();
    }
}

export default function trader(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return null;
    }
    if (!props.trader) {
        return <Error statusCode={404}/>
    }

    const meta = new TraderMetadata(props.trader);

    const snapshot = props.trader.trader_snapshot
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

    const person: WithContext<Person> = {
        '@context': 'https://schema.org',
        "@type": "Person",
        name: props.trader.name,
        givenName: props.trader.name,
    };

    return (
        <Grid container spacing={3}>
            <NextSeo
                title={meta.title}
                description={meta.description}
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
            <JsonLd data={person}/>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Typography variant={"h4"} component={"h1"} align="center">
                    {meta.h1}
                </Typography>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <Info trader={props.trader}/>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <Stat snapshot={snapshot}/>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <AdTable ads={props.trader.ads.filter(p => p.is_buy)}/>
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <AdTable ads={props.trader.ads.filter(p => !p.is_buy)}/>
            </Grid>
        </Grid>
    )
}