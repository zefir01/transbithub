import {ad, bz_trader_volumes, trader, trader_snapshot} from "@prisma/client"
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "./aggregator/AggregatorCatalog";
import {Countries} from "./Catalog";
import {Thing, WithContext} from "schema-dts";

export interface BzTraderVolumes {
    id: string;
    crypto_currency: CryptoCurrencies;
    amount: string;
    deals_count: number;
    snapshot_id: string;
}

export interface TraderSnapshot {
    id: string;
    trades_count: number;
    rating: string;
    positive_feedbacks: number;
    negative_feedbacks: number;
    completed_deals: number;
    canceled_deals: number;
    trusted_count: number;
    blocked_count: number;
    amount: string | null;
    created_at: number;
    owner_id: string;
    source_type: AggregatorSources;
    dispute_loose: number | null;
    partners: number | null;
    bz_trader_volumes: BzTraderVolumes[] | null;
}

export interface ITrader {
    id: string;
    name: string;
    created_at: number;
    last_activity: number;
    updated_at: number;
    registered_at: number | null;
    source_type: AggregatorSources;
    verified: boolean | null;
    ads: IAd[] | null;
    trader_snapshot: TraderSnapshot[] | null;
}

export interface IAd {
    id: string;
    ad_id: string;
    country: Countries | null;
    is_buy: boolean;
    payment_type: PaymentTypes;
    fiat_currency: Currencies;
    min_amount: string;
    max_amount: string;
    created_at: number;
    owner_id: string;
    disabled_at: number | null;
    price: string;
    terms: string;
    city: string | null;
    updated_at: number;
    price_updated_at: number;
    window: number | null;
    crypto_currency: CryptoCurrencies;
    source_type: AggregatorSources;
    bank_name: string | null;
    require_feedback_score: string | null;
    require_trade_volume: string | null;
    px_ad_id: string | null;
    trader: ITrader | null;
}

export function BzTraderVolumesToJson(volume: bz_trader_volumes): BzTraderVolumes {
    return {
        id: volume.id.toString(),
        crypto_currency: volume.crypto_currency,
        amount: volume.amount.toString(),
        deals_count: parseInt(volume.deals_count.toString()),
        snapshot_id: volume.snapshot_id.toString()
    }
}

export function traderSnapshotToJson(snapshot: trader_snapshot & { bz_trader_volumes?: bz_trader_volumes[] }): TraderSnapshot {
    return {
        id: snapshot.id.toString(),
        trades_count: snapshot.trades_count,
        rating: snapshot.rating.toString(),
        positive_feedbacks: snapshot.positive_feedbacks,
        negative_feedbacks: snapshot.negative_feedbacks,
        completed_deals: snapshot.completed_deals,
        canceled_deals: snapshot.canceled_deals,
        trusted_count: snapshot.trades_count,
        amount: snapshot.amount?.toString() ?? "",
        created_at: snapshot.created_at.getTime(),
        owner_id: snapshot.owner_id.toString(),
        source_type: snapshot.source_type,
        dispute_loose: snapshot.dispute_loose ?? 0,
        partners: snapshot.partners ?? 0,
        blocked_count: snapshot.blocked_count,
        bz_trader_volumes: snapshot.bz_trader_volumes?.map(p => BzTraderVolumesToJson(p)) ?? null
    }
}

export function traderToJson(trader: trader & { ad?: ad[], trader_snapshot?: (trader_snapshot & { bz_trader_volumes?: bz_trader_volumes[] })[] }
): ITrader {
    return {
        id: trader.id.toString(),
        name: trader.name,
        created_at: trader.created_at.getTime(),
        last_activity: trader.last_activity?.getTime(),
        updated_at: trader.updated_at?.getTime(),
        registered_at: trader.registered_at?.getTime() ?? null,
        source_type: trader.source_type,
        verified: trader.verified,
        ads: trader?.ad?.map(p => adToJson(p)) ?? null,
        trader_snapshot: trader.trader_snapshot?.map(p => traderSnapshotToJson(p)) ?? null
    }
}

export function adToJson(ad: ad & { trader?: trader }): IAd {
    return {
        id: ad.id.toString(),
        ad_id: ad.ad_id.toString(),
        country: ad.country,
        is_buy: ad.is_buy,
        payment_type: ad.payment_type,
        fiat_currency: ad.fiat_currency,
        min_amount: ad.min_amount.toString(),
        max_amount: ad.max_amount.toString(),
        created_at: ad.created_at.getTime(),
        owner_id: ad.owner_id.toString(),
        disabled_at: ad.disabled_at?.getTime() ?? null,
        price: ad.price.toString(),
        terms: ad.terms,
        city: ad.city,
        updated_at: ad.updated_at.getTime(),
        price_updated_at: ad.price_updated_at.getTime(),
        window: ad.window,
        crypto_currency: ad.crypto_currency,
        source_type: ad.source_type,
        bank_name: ad.bank_name,
        require_feedback_score: ad.require_feedback_score?.toString() ?? null,
        require_trade_volume: ad.require_trade_volume?.toString() ?? null,
        px_ad_id: ad.px_ad_id,
        trader: ad.trader ? traderToJson(ad.trader) : null
    }
}

export function PrettyPrice(price: string, decimals: number = 2): string {
    let pp = Math.round(parseFloat(price) * 100) / 100;
    let p = pp.toString();
    if (decimals === 2) {
        p = p.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    if (p.includes(".")) {
        while (p.endsWith(".") || (p.includes(".") && p.endsWith("0"))) {
            p = p.slice(0, -1);
        }
    }
    return p;
}

function JsonLd<T extends Thing>(json: WithContext<T>): string {
    return `<script type="application/ld+json">
${JSON.stringify(json)}
</script>`;
}
