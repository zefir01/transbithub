import {NextApiRequest, NextApiResponse} from "next";
import {
    CryptoCurrencies,
    Currencies,
} from "../../components/aggregator/AggregatorCatalog";
import {IAd} from "../../components/helpers";
import {getAds} from "../../components/aggregator/helpers";

export interface IResponse {
    status: string;
    ads: IAd[];
    pages: number;
}

export interface IRequest {
    isBuy: boolean;
    sources: string[];
    paymentTypes: string[];
    fiatCurrency: Currencies | null;
    cryptoCurrency: CryptoCurrencies | null;
    page: number;
    amount: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE) {
        res.status(200);
        return;
    }

    const body: IRequest = req.body;
    const ads = await getAds(body);

    let ret: IResponse = {
        status: 'ok',
        ads: ads.ads,
        pages: ads.pages
    }
    //return the data back or just do whatever you want with it
    res.status(200).json(ret);
}