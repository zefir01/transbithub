import {IAd, ITrader, PrettyPrice} from "../helpers";
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "./AggregatorCatalog";
import LocalizedStrings from "react-localization";
import {data} from "../localization/Aggregator/PaymentTypes";

export class AdMetadata {
    title: string;
    description: string;
    h1: string;
    h2: string;
    h1_1: string;
    h1_2: string;

    constructor(ad: IAd) {
        let d = new LocalizedStrings(data);
        if (ad.crypto_currency === CryptoCurrencies.BTC) {
            this.title = `${ad.is_buy ? "Купить биткоин у" : "Продать биткоин"} ${ad.trader.name} на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}. Способ оплаты: ${d.getString(PaymentTypes[ad.payment_type], "ru")}. №${ad.ad_id.toString()}`;
            this.description = `Объявления о ${ad.is_buy ? "покупке" : "продаже"} биткона от ${ad.trader.name} на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}. №${ad.ad_id.toString()}`;
            this.h1 = `${ad.is_buy ? "Купить биткоин у" : "Продать биткоин"} ${ad.trader.name} на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}`;
            this.h2 = `Объявление о ${!ad.is_buy ? "покупке" : "продаже"} Биткойна на ${AggregatorSources[ad.source_type]}`;
            this.h1_1=`${ad.is_buy ? "Купить биткоин у" : "Продать биткоин"} `;
            this.h1_2=` на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}`;
        } else {
            this.title = `${ad.is_buy ? "Купить " : "Продать "} ${CryptoCurrencies[ad.crypto_currency]} ${ad.is_buy ? "у " : ""} ${ad.trader.name} на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}. Способ оплаты: ${d.getString(PaymentTypes[ad.payment_type], "ru")}. №${ad.ad_id.toString()}`;
            this.description = `Объявления о ${ad.is_buy ? "покупке" : "продаже"} ${CryptoCurrencies[ad.crypto_currency]} от ${ad.trader.name} на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}. №${ad.ad_id.toString()}`;
            this.h1 = `${ad.is_buy ? "Купить " : "Продать "} ${CryptoCurrencies[ad.crypto_currency]} ${ad.is_buy ? "у " : ""} ${ad.trader.name} на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}`;
            this.h2 = `Объявление о ${!ad.is_buy ? "покупке" : "продаже"} ${CryptoCurrencies[ad.crypto_currency]} на ${AggregatorSources[ad.source_type]}`;
            this.h1_1 = `${ad.is_buy ? "Купить " : "Продать "} ${CryptoCurrencies[ad.crypto_currency]} ${ad.is_buy ? "у " : ""} `;
            this.h1_2 = ` на ${AggregatorSources[ad.source_type]} по цене ${PrettyPrice(ad.price)} ${Currencies[ad.fiat_currency] + "/" + CryptoCurrencies[ad.crypto_currency]}`;
        }
    }
}

export class TraderMetadata{
    title: string;
    description: string;
    h1: string;

    constructor(trader: ITrader) {
        this.title=`Профиль трейдера: ${trader.name} на TransBitHub.com`;
        this.description=`Профиль трейдера: ${trader.name}. Статистика, отзывы, объявления о продаже и покупке.`;
        this.h1=trader.name;
    }
}