import {Decimal} from "decimal.js";
import {PrettyPrice} from "../helpers";
import {MyDecimal} from "../MyDecimal";
import {Invoice} from "../Protos/api_pb";


export interface IInvoiceCalculatedValues {
    variablePriceStr: string;
    piecePriceCryptoStr: string;
    amountCryptoMinStr: string;
    amountCryptoMaxStr: string;
    amountFiatMinStr: string;
    amountFiatMaxStr: string;
    variablePrice: Decimal | null;
    piecePriceCrypto: Decimal | null;
    amountCryptoMin: Decimal | null;
    amountCryptoMax: Decimal | null;
    amountFiatMin: Decimal | null;
    amountFiatMax: Decimal | null;
    amountFiat: Decimal | null;
    amountFiatStr: string;
    piecePriceFiat: Decimal | null;
    piecePriceFiatStr: string;
    totalPaidFiat: Decimal | null;
    totalPaidFiatStr: string;
}

export function calcValuesInvoice(invoice: Invoice.AsObject, vars: Map<string, MyDecimal> | null, currency: string | null = null): IInvoiceCalculatedValues | null {
    return calcValues(MyDecimal.FromPb(invoice.price),
        currency === null ? invoice.fiatcurrency : currency,
        invoice.pricevariable,
        new Decimal(invoice.piecesmin),
        new Decimal(invoice.piecesmax),
        invoice.isbasecrypto,
        invoice.isprivate,
        vars);
}

function calcVarPrice(priceVar: string, currency: string, vars: Map<string, MyDecimal> | null) {
    let vprice;
    let vpriceString;
    if (priceVar === "Average") {
        vprice = vars!.get(`AVG_${currency}`)!;
    } else {
        let fiatRate = vars!.get(currency)!;
        vprice = vars!.get(priceVar!)!.mul(fiatRate);
    }
    vpriceString = PrettyPrice(new MyDecimal(vprice));
    return {
        vprice,
        vpriceString
    };
}

function calcPiecePrice(price: Decimal | null, currency: string, vprice: Decimal, priceVar: string, vars: Map<string, MyDecimal> | null) {
    let result = {
        piecePriceString: "",
        piecePrice: new Decimal(0)
    }
    if (price == null) {
        result.piecePriceString = "";
        return result;
    }

    if (currency === "USD") {
        result.piecePrice = price!.dividedBy(vprice);
    } else {
        if (priceVar === "Average") {
            result.piecePrice = price!.dividedBy(vprice);
        } else {
            let fiatRate = vars!.get(currency)!;
            result.piecePrice = price!.dividedBy(fiatRate).dividedBy(vprice);
        }
    }
    result.piecePriceString = PrettyPrice(result.piecePrice, 8);
    return result;
}

export function calcValues(price: Decimal | null,
                           currency: string,
                           priceVar: string,
                           piecesMin: Decimal | null,
                           piecesMax: Decimal | null,
                           isBaseCrypto: boolean,
                           isPrivate: boolean,
                           vars: Map<string, MyDecimal> | null): IInvoiceCalculatedValues | null {
    if (vars === null || !price) {
        return null;
    }
    let result: IInvoiceCalculatedValues = {
        variablePriceStr: "",
        piecePriceCryptoStr: "",
        amountCryptoMinStr: "",
        amountCryptoMaxStr: "",
        amountFiatMinStr: "",
        amountFiatMaxStr: "",
        variablePrice: null,
        piecePriceCrypto: null,
        amountCryptoMin: null,
        amountCryptoMax: null,
        amountFiatMin: null,
        amountFiatMax: null,
        amountFiat: null,
        amountFiatStr: "",
        piecePriceFiat: null,
        piecePriceFiatStr: "",
        totalPaidFiat: null,
        totalPaidFiatStr: ""
    }

    if (isPrivate && !isBaseCrypto) {
        result.amountFiat = price;
        result.amountFiatStr = PrettyPrice(price, 2);
    }

    let vprice = calcVarPrice(priceVar, currency, vars);
    result.variablePrice = vprice.vprice;
    result.variablePriceStr = vprice.vpriceString;
    let piecePrice;
    if (!isBaseCrypto) {
        piecePrice = calcPiecePrice(price, currency, vprice.vprice, priceVar, vars);
    } else {
        piecePrice = {
            piecePriceString: PrettyPrice(price, 8),
            piecePrice: price
        }
    }
    result.piecePriceCryptoStr = piecePrice.piecePriceString;
    result.piecePriceCrypto = piecePrice.piecePrice;

    if (!isBaseCrypto) {
        result.piecePriceFiat = price;
        result.piecePriceFiatStr = PrettyPrice(price, 2);
    }
    else {
        if (currency === "USD") {
            result.piecePriceFiat = price.dividedBy(vprice.vprice);
        } else {
            if (priceVar === "Average") {
                result.piecePriceFiat = price.dividedBy(vprice.vprice);
            } else {
                let fiatRate = vars!.get(currency)!;
                result.piecePriceFiat = price!.dividedBy(fiatRate).dividedBy(vprice.vprice);
            }
        }
        result.piecePriceFiat=new MyDecimal(result.piecePriceFiat.toDecimalPlaces(2));
        result.piecePriceFiatStr = PrettyPrice(result.piecePriceFiat, 2);
    }

    if (piecePrice.piecePrice === null) {
        return result;
    }
    if (isPrivate) {
        return result;
    }

    let _amountCryptoMin: Decimal | null = null;
    let _amountCryptoMax: Decimal | null = null;
    let _amountFiatMin: Decimal | null = null;
    let _amountFiatMax: Decimal | null = null;
    if (piecesMin !== null) {
        _amountCryptoMin = piecePrice.piecePrice.mul(piecesMin);
        _amountFiatMin = price.mul(piecesMin);
    }
    if (piecesMax !== null) {
        _amountCryptoMax = piecePrice.piecePrice.mul(piecesMax);
        _amountFiatMax = price.mul(piecesMax);
    }

    function set(value: Decimal | null, decimals = 2): string {
        if (value !== null) {
            return PrettyPrice(value, decimals);
        }
        return "";
    }

    result.amountCryptoMinStr = (set(_amountCryptoMin, 8));
    result.amountCryptoMaxStr = (set(_amountCryptoMax, 8));
    result.amountFiatMinStr = (set(_amountFiatMin, 2));
    result.amountFiatMaxStr = (set(_amountFiatMax, 2));
    result.amountCryptoMin = _amountCryptoMin;
    result.amountCryptoMax = _amountCryptoMax;
    result.amountFiatMin = _amountFiatMin;
    result.amountFiatMax = _amountFiatMax;
    return result;
}


export function CalcValuesView(invoice: Invoice.AsObject, currency: string, vars: Map<string, MyDecimal> | null, price: Decimal | null = null) {
    function getVarPrice(invoice: Invoice.AsObject, vars: Map<string, MyDecimal> | null) {
        let vprice;
        let vpriceString;
        if (invoice.pricevariable === "Average") {
            vprice = vars!.get(`AVG_${invoice.fiatcurrency}`)!;
        } else {
            let fiatRate = vars!.get(invoice.fiatcurrency)!;
            vprice = vars!.get(invoice.pricevariable)!.mul(fiatRate);
        }
        vpriceString = PrettyPrice(new MyDecimal(vprice));
        return {
            vprice,
            vpriceString
        };
    }

    function calcPiecePriceCrypto(invoice: Invoice.AsObject, vprice: Decimal, vars: Map<string, MyDecimal> | null) {
        let result = {
            piecePriceString: "",
            piecePrice: new Decimal(0)
        }
        let price = MyDecimal.FromPb(invoice.price);


        if (invoice.fiatcurrency === "USD") {
            result.piecePrice = price.dividedBy(vprice);
        } else {
            if (invoice.pricevariable === "Average") {
                result.piecePrice = price!.dividedBy(vprice);
            } else {
                let fiatRate = vars!.get(invoice.fiatcurrency)!;
                result.piecePrice = price!.dividedBy(fiatRate).dividedBy(vprice);
            }
        }
        result.piecePriceString = PrettyPrice(result.piecePrice, 8);
        return result;
    }


    let result: IInvoiceCalculatedValues = {
        variablePriceStr: "",
        piecePriceCryptoStr: "",
        amountCryptoMinStr: "",
        amountCryptoMaxStr: "",
        amountFiatMinStr: "",
        amountFiatMaxStr: "",
        variablePrice: null,
        piecePriceCrypto: null,
        amountCryptoMin: null,
        amountCryptoMax: null,
        amountFiatMin: null,
        amountFiatMax: null,
        amountFiat: null,
        amountFiatStr: "",
        piecePriceFiat: null,
        piecePriceFiatStr: "",
        totalPaidFiat: null,
        totalPaidFiatStr: ""
    }
    if ((vars === null || vars === undefined) && !invoice.isbasecrypto) {
        return null;
    }

    let cryptoPrice;
    if (!invoice.isbasecrypto) {
        let varPrice = getVarPrice(invoice, vars);
        cryptoPrice = calcPiecePriceCrypto(invoice, varPrice.vprice, vars);
        result.variablePrice = varPrice.vprice;
        result.variablePriceStr = varPrice.vpriceString;
    } else {
        cryptoPrice = {
            piecePriceString: PrettyPrice(MyDecimal.FromPb(invoice.price), 8),
            piecePrice: MyDecimal.FromPb(invoice.price)
        }
    }
    result.piecePriceCrypto = cryptoPrice.piecePrice.toDecimalPlaces(8);
    result.piecePriceCryptoStr = cryptoPrice.piecePriceString;

    let varPrice;
    if (price === null) {
        varPrice = vars!.get("AVG_" + currency);
    } else {
        varPrice = price;
    }
    result.piecePriceFiat = result.piecePriceCrypto.mul(varPrice!).toDecimalPlaces(2);
    result.piecePriceFiatStr = PrettyPrice(result.piecePriceFiat, 2);

    if (!invoice.isprivate) {
        result.amountCryptoMin = result.piecePriceCrypto.mul(invoice.piecesmin).toDecimalPlaces(8);
        result.amountCryptoMinStr = PrettyPrice(result.amountCryptoMin, 8);
        result.amountCryptoMax = result.piecePriceCrypto.mul(invoice.piecesmax).toDecimalPlaces(8);
        result.amountCryptoMaxStr = PrettyPrice(result.amountCryptoMax, 8);
        result.amountFiatMin = result.piecePriceFiat.mul(invoice.piecesmin).toDecimalPlaces(2);
        result.amountFiatMinStr = PrettyPrice(result.amountFiatMin, 2);
        result.amountFiatMax = result.piecePriceFiat.mul(invoice.piecesmax).toDecimalPlaces(2);
        result.amountFiatMaxStr = PrettyPrice(result.amountFiatMax, 2);
    } else {
        result.amountFiat = result.piecePriceFiat.toDecimalPlaces(2);
        result.amountFiatStr = result.piecePriceFiatStr;
    }

    result.totalPaidFiat = MyDecimal.FromPb(invoice.totalpayedcrypto).mul(varPrice!).toDecimalPlaces(2);
    result.totalPaidFiatStr = PrettyPrice(result.totalPaidFiat, 2);

    return result;
}
