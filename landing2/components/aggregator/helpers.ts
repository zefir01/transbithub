import {adToJson, IAd} from "../helpers";
import {IRequest} from "../../pages/api/find";
import {getDb} from "../../stores/aggregator";
import LocalizedStrings from "react-localization";
import {data} from "../localization/Aggregator/PaymentTypes";
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "./AggregatorCatalog";
import {GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export interface AdsSelect {
    ads: IAd[],
    pages: number,
    page: number
}

export async function getAds(req: IRequest): Promise<AdsSelect> {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        return {
            ads: [],
            pages: 0,
            page: 0
        };
    }

    const sourcesReq: number[] = req.sources.length === 0 ?
        undefined :
        req.sources.map(p => AggregatorSources[p]);
    const paymentTypesReq: number[] = req.paymentTypes.length === 0 ?
        undefined :
        req.paymentTypes.map(p => PaymentTypes[p]);

    const where = {
        disabled_at: null,
        source_type: {
            in: sourcesReq
        },
        fiat_currency: req.fiatCurrency !== null ? req.fiatCurrency : undefined,
        crypto_currency: req.cryptoCurrency !== null ? req.cryptoCurrency : undefined,
        is_buy: req.isBuy,
        payment_type: {
            in: paymentTypesReq
        },
        OR: req.amount === "" ? undefined : [
            {
                min_amount: {
                    lte: req.amount
                },
                max_amount: {
                    gte: req.amount
                }
            },
            {
                min_amount: 0,
                max_amount: 0
            }
        ]
    }

    let db = getDb();
    try {
        const adsQuery = await db.ad.findMany({
            where,
            include: {
                trader: true
            },
            orderBy: {
                price: req.isBuy ? "asc" : "desc",
            },
            skip: (req.page - 1) * 30,
            take: 30,
        });

        const count = await db.ad.count({
            where
        })

        return {
            ads: adsQuery.map(p => adToJson(p)),
            pages: Math.floor(count / 30),
            page: req.page
        };
    } finally {
        db?.$disconnect();
    }
}

export interface SelectorData {
    paymentTypes: { value: string, label: string }[],
    currencies: string[],
    cryptoCurrencies: string[],
    sources: string[]
}


export async function getSelectorData(context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<SelectorData> {
    let db = getDb();
    try {
        let paymentTypesQuery = await db.ad.findMany({
            where: {"disabled_at": null},
            distinct: ['payment_type'],
            select: {
                payment_type: true,
            },
            orderBy: {
                payment_type: 'asc',
            },
        });
        let currenciesQuery = await db.ad.findMany({
            where: {"disabled_at": null},
            distinct: ['fiat_currency'],
            select: {
                fiat_currency: true,
            },
            orderBy: {
                fiat_currency: 'asc',
            },
        });
        let cryptoCurrenciesQuery = await db.ad.findMany({
            where: {"disabled_at": null},
            distinct: ['crypto_currency'],
            select: {
                crypto_currency: true,
            },
            orderBy: {
                crypto_currency: 'asc',
            },
        });
        let sourceTypesQuery = await db.ad.findMany({
            where: {"disabled_at": null},
            distinct: ['source_type'],
            select: {
                source_type: true,
            },
            orderBy: {
                source_type: 'asc',
            },
        });


        let d = new LocalizedStrings(data);
        let paymentTypes = paymentTypesQuery.map(p => p.payment_type).map(p => {
            let f = PaymentTypes[p];
            let str = d.getString(f, "ru");
            return {
                value: f,
                label: str
            };
        }).sort((a, b) => a.label.localeCompare(b.label));
        let currencies = currenciesQuery.map(p => Currencies[p.fiat_currency]).sort();
        let cryptoCurrencies = cryptoCurrenciesQuery.map(p => CryptoCurrencies[p.crypto_currency]).sort();
        let sources = sourceTypesQuery.map(p => AggregatorSources[p.source_type]).sort();

        return {
            paymentTypes,
            currencies,
            cryptoCurrencies,
            sources,
        }
    } finally {
        db?.$disconnect();
    }
}

export function parseSelectorParams(url: string): IRequest {
    function getArray(param: URLSearchParams, name: string): string[] {
        const val = urlSearchParams.getAll(name);
        if (!val) {
            return [];
        }
        return val;
    }

    function getString(param: URLSearchParams, name: string): string {
        const val = urlSearchParams.get(name);
        if (!val) {
            return "";
        }
        return val;
    }

    const urlSearchParams = new URLSearchParams(url);
    const sources: string[] = getArray(urlSearchParams, 'sources');
    const paymentTypes: string[] = getArray(urlSearchParams, 'paymentTypes');
    const currency = getString(urlSearchParams, 'currency');
    const cryptoCurrency = getString(urlSearchParams, 'cryptoCurrency');
    const isBuy = getString(urlSearchParams, 'isBuy');
    const amount = getString(urlSearchParams, 'amount');
    const page = getString(urlSearchParams, 'page');

    return {
        isBuy: !isBuy || isBuy === "" || isBuy !== "false",
        sources: sources.map(p => AggregatorSources[p]),
        paymentTypes: paymentTypes.map(p => PaymentTypes[p]),
        fiatCurrency: currency === "" ? null : Currencies[currency],
        cryptoCurrency: cryptoCurrency === "" ? null : CryptoCurrencies[cryptoCurrency],
        page: page == "" ? 1 : parseInt(page),
        amount: amount
    }
}

export function getSelectorParamsFromRouter(query: ParsedUrlQuery): IRequest {
    const {sources, paymentTypes, currency, cryptoCurrency, isBuy, amount, page} = query;
    let s: string[] | undefined = undefined;
    let p: string[] | undefined = undefined;
    if (sources) {
        if (typeof sources === "string") {
            s = [sources];
        } else {
            s = sources;
        }
    }
    if (paymentTypes) {
        if (typeof paymentTypes === "string") {
            p = [paymentTypes];
        } else {
            p = paymentTypes;
        }
    }


    return {
        isBuy: !isBuy || isBuy === "" || isBuy !== "false",
        sources: !s ? [] : s,
        paymentTypes: !p ? [] : p,
        fiatCurrency: !currency ? null : Currencies[currency as string],
        cryptoCurrency: !cryptoCurrency ? null : CryptoCurrencies[cryptoCurrency as string],
        page: !page ? 1 : parseInt(page as string),
        amount: amount as string
    }
}

export function useSelectorParams() {
    const router = useRouter();
    const [params, setParams] = useState<IRequest | null>(null);
    useEffect(() => {
        if (!router) {
            return null;
        }
        setParams(getSelectorParamsFromRouter(router.query));
    }, [router.query]);
    return params;
}