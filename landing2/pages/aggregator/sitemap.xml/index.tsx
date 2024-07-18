import {GetServerSideProps} from "next";
import {getServerSideSitemap} from "next-sitemap";
import {getDb} from "../../../stores/aggregator";

export const SitemapAdCount=3000;
export const SitemapTradersCount=3000;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if(process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return getServerSideSitemap(ctx, []);
    }

    let db = getDb();
    try {
        const adIds = await db.ad.findMany({
            select: {
                id: true,
            },
            orderBy: {
                id: 'asc',
            },
            take: SitemapAdCount
        });
        const traderIds = await db.trader.findMany({
            select: {
                id: true,
            },
            orderBy: {
                id: 'asc',
            },
            take: SitemapTradersCount
        });

        const adMap = adIds.map(p => ({
            loc: `https://${ctx.req.headers.host}/aggregator/ad/${p.id}`,
            lastmod: new Date().toISOString(),
            changefreq: "hourly",
            priority: "0.5"
        }));
        const traderMap = traderIds.map(p => ({
            loc: `https://${ctx.req.headers.host}/aggregator/trader/${p.id}`,
            lastmod: new Date().toISOString(),
            changefreq: "hourly",
            priority: "0.5"
        }));
        const all = adMap.concat(traderMap);

        return getServerSideSitemap(ctx, all)
    }
    finally {
        db?.$disconnect();
    }
}

// Default export to prevent next.js errors
export default () => {
}