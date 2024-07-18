import {adToJson, IAd, ITrader, traderToJson} from "../../components/helpers";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {AdMetadata} from "../../components/aggregator/metadata";
import {getDb} from "../../stores/aggregator";
import {SitemapAdCount, SitemapTradersCount} from "./sitemap.xml";

interface SSProps {
    ads: IAd[];
    traders: ITrader[];
}

export const getServerSideProps: GetServerSideProps<SSProps> = async (context) => {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return {
            props: {
                ads: [],
                traders: []
            },
        }
    }

    let db = getDb();
    let adMap=[];
    let traderMap=[];
    try {
        const adIds = await db.ad.findMany({
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
            orderBy: {
                id: 'asc',
            },
            take: SitemapAdCount
        });
        const traderIds = await db.trader.findMany({
            orderBy: {
                id: 'asc',
            },
            take: SitemapTradersCount
        });

        adMap = adIds.map(p => adToJson(p));
        traderMap = traderIds.map(p => traderToJson(p));
    }
    finally {
        db?.$disconnect();
    }

    return {
        props: {
            ads: adMap,
            traders: traderMap
        },
    }
}

export default function test(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return null;
    }

    const ads = props.ads.map(p => ({
        url: `https://transbithub.com/ad/${p.id}`,
        meta: new AdMetadata(p)
    }));

    return (
        <>
            <span style={{display: "block"}}>url;title;desc;h1;h2</span>
            {
                ads.map(p => <span
                    style={{display: "block"}}>{`${p.url};${p.meta.title};${p.meta.description};${p.meta.h1};${p.meta.h2}`}</span>)
            }
        </>
    )
}