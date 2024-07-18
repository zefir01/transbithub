import {adToJson, IAd} from "../../../components/helpers";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import Error from "next/error";
import {Box, Grid, Hidden} from "@material-ui/core";
import {Info} from "../../../components/aggregator/ad/Info";
import React from "react";
import {Terms} from "../../../components/aggregator/ad/terms";
import {Trader} from "../../../components/aggregator/ad/trader";
import {Header} from "../../../components/aggregator/ad/header";
import {Calc} from "../../../components/aggregator/ad/calc";
import {Suitable} from "../../../components/aggregator/ad/suitable";
import {getAds, getSelectorData, SelectorData} from "../../../components/aggregator/helpers";
import {Selector} from "../../../components/aggregator/ad/selector";
import {NextSeo} from "next-seo";
import {
    AggregatorSources,
    CryptoCurrencies,
    Currencies,
    PaymentTypes
} from "../../../components/aggregator/AggregatorCatalog";
import {Offer, Place, Product, WithContext} from 'schema-dts';
import LocalizedStrings from "react-localization";
import {data} from "../../../components/localization/Aggregator/PaymentTypes";
import {Countries} from "../../../components/Catalog";
import {JsonLd} from "../../../components/JsonLd";
import {getDb} from "../../../stores/aggregator";
import {AdMetadata} from "../../../components/aggregator/metadata";

interface SSProps {
    ad: IAd | null;
    suitable?: IAd[];
    data?: SelectorData;
}

export const getServerSideProps: GetServerSideProps<SSProps> = async (context) => {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return {
            props: {
                ad: null,
            },
        };
    }

    const {id} = context.query;

    if (isNaN(parseInt(id as string))) {
        return {
            props: {
                ad: null,
            },
        }
    }

    let db = getDb();
    try {
        const ad = await db.ad.findUnique({
            where: {
                id: parseInt(id as string)
            },
            include: {
                trader: {
                    include: {
                        trader_snapshot: {
                            include: {
                                bz_trader_volumes: true
                            }
                        }
                    }
                }
            },
        });

        const suitable = await getAds({
            isBuy: ad.is_buy,
            sources: [],
            paymentTypes: [PaymentTypes[ad.payment_type]],
            fiatCurrency: ad.fiat_currency,
            cryptoCurrency: ad.crypto_currency,
            page: 1,
            amount: ""
        });

        if (!ad) {
            return {
                props: {
                    ad: null,
                },
            }
        }

        return {
            props: {
                ad: adToJson(ad),
                suitable: suitable?.ads?.filter(p => p.id !== ad.id.toString()).filter((p, i) => i < 10) ?? [],
                data: await getSelectorData(context)
            },
        }
    }
    finally {
        db?.$disconnect();
    }
}

const d = new LocalizedStrings(data);
export default function ad(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return null;
    }

    if (!props.ad) {
        return <Error statusCode={404}/>
    }

    function getRating(): {
        "@type": "AggregateRating",
        ratingCount: number,
        reviewCount: number
    } {
        let snap = props.ad.trader.trader_snapshot.sort((a, b) => (b.created_at - a.created_at))[0];
        switch (props.ad.source_type) {
            case AggregatorSources.None:
                return {
                    "@type": "AggregateRating",
                    ratingCount: 0,
                    reviewCount: 0
                };
            case AggregatorSources.BitZlato:
                return {
                    "@type": "AggregateRating",
                    ratingCount: parseFloat(snap.rating),
                    reviewCount: snap.positive_feedbacks
                };
            case AggregatorSources.LocalBitcoins:
                return {
                    "@type": "AggregateRating",
                    ratingCount: parseFloat(snap.rating),
                    reviewCount: snap.trades_count
                }
            case AggregatorSources.Paxful:
                return {
                    "@type": "AggregateRating",
                    ratingCount: snap.positive_feedbacks,
                    reviewCount: snap.trades_count
                }

        }
    }

    const country: Place = {
        "@type": "Place",
        address: {
            "@type": "PostalAddress",
            addressCountry: Countries[props.ad.country] ?? "RU"
        }
    }

    const offer: Offer = {
        '@type': 'Offer',
        businessFunction: {
            "@id": `http://purl.org/goodrelations/v1#$${props.ad.is_buy ? "Buy" : "Sell"}`
        },
        acceptedPaymentMethod: {
            "@id": "http://purl.org/goodrelations/v1#PaymentMethod",
            name: d.getString(PaymentTypes[props.ad.payment_type], "ru")
        },
        aggregateRating: getRating(),
        areaServed: country,
        eligibleRegion: country,
        eligibleTransactionVolume: {
            "@type": "PriceSpecification",
            minPrice: parseFloat(props.ad.min_amount),
            maxPrice: parseFloat(props.ad.max_amount),
            priceCurrency: Currencies[props.ad.fiat_currency]
        },
        offeredBy: {
            "@type": "Person",
            address: {
                "@type": "PostalAddress",
                addressCountry: Countries[props.ad.country] ?? "RU"
            },
            givenName: props.ad.trader.name
        },
        price: parseFloat(props.ad.price),
        priceCurrency: Currencies[props.ad.fiat_currency],
        description: props.ad.terms
    }
    const product: WithContext<Product> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: CryptoCurrencies[props.ad.crypto_currency],
        category: "Криптовалюта",
        offers: [offer]
    };
    const meta=new AdMetadata(props.ad);

    return (
        <>
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
            <JsonLd data={product}/>
            <Box mb={3}>
                <Header ad={props.ad}/>
            </Box>
            <Hidden xsDown implementation={"css"}>
                <Grid container spacing={3}>
                    <Grid item container direction={"column"} xl={6} lg={6} md={6} sm={6} xs={6} spacing={3}>
                        <Grid item container>
                            <Info ad={props.ad}/>
                        </Grid>
                        <Grid item container>
                            <Trader ad={props.ad}/>
                        </Grid>
                    </Grid>
                    <Grid direction={"column"} container item xl={6} lg={6} md={6} sm={6} xs={6} spacing={3}>
                        <Grid item container>
                            <Terms ad={props.ad}/>
                        </Grid>
                        <Grid item container>
                            <Calc ad={props.ad}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden smUp implementation={"css"}>
                <Grid container direction={"column"} spacing={3}>
                    <Grid item container>
                        <Terms ad={props.ad}/>
                    </Grid>
                    <Grid item container>
                        <Calc ad={props.ad}/>
                    </Grid>
                    <Grid item container>
                        <Info ad={props.ad}/>
                    </Grid>
                    <Grid item container>
                        <Trader ad={props.ad}/>
                    </Grid>
                </Grid>
            </Hidden>
            <Box mt={3}>
                <Suitable ads={props.suitable} ad={props.ad}/>
            </Box>
            <Box mt={3}>
                <Selector data={props.data}/>
            </Box>
        </>
    )
}