import {IAd} from "../../helpers";
import {Box, Button, Card, CardContent, Grid, makeStyles, TextField, Theme, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Decimal} from "decimal.js";
import {CryptoCurrencies, Currencies} from "../AggregatorCatalog";
import Link from "next/link";

export interface CalcProps {
    ad: IAd;
}

export function Calc(props: CalcProps) {
    const [fiatStr, setFiatStr] = useState("");
    const [cryptoStr, setCryptoStr] = useState("");
    const [fiatError, setFiatError] = useState(false);
    const [cryptoError, setCryptoError] = useState(false);
    const [fiat, setFiat] = useState<Decimal | null>(null);
    const [crypto, setCrypto] = useState<Decimal | null>(null);
    const [amount, setAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    const buttonCb = makeStyles((theme: Theme) => (
        {
            root: {
                color: 'white',
                '&:hover': {
                    color: "white",
                }
            }
        }
    ));
    const buttonStyle = buttonCb();

    function calcFiat(value: string) {
        try {
            const d = new Decimal(value);
            if (d.decimalPlaces() > 2) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }
            setFiat(d);
            const price = new Decimal(props.ad.price);
            const cr = d.dividedBy(price).toDecimalPlaces(8);
            setCrypto(cr);
            setCryptoStr(cr.toString());
            setFiatError(false);
            setCryptoError(false);
        } catch {
            setCryptoStr("");
            setFiatError(true);
            setFiat(null);
            setCrypto(null);
        }
    }

    function calcCrypto(value: string) {
        try {
            const d = new Decimal(value);
            if (d.decimalPlaces() > 8) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }
            const price = new Decimal(props.ad.price);
            const f = price.mul(d).toDecimalPlaces(2);
            setFiat(f);
            setFiatStr(f.toString());
            setCrypto(d);
            setFiatError(false);
            setCryptoError(false);
        } catch {
            setFiatStr("");
            setCryptoError(true);
            setCrypto(null);
            setFiat(null);
        }
    }

    useEffect(() => {
        Decimal.set({toExpNeg: -10, toExpPos: 10});
        if (amountError || amount === "") {
            return;
        }
        setFiatStr(amount);
        calcFiat(amount);
    }, [])

    return (
        <Card className={"w-100"}>
            <CardContent>
                <Typography variant={"h5"}>
                    Сколько вы хотите купить?
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                        <TextField id="standard-basic" label={"Сумма в " + Currencies[props.ad.fiat_currency]}
                                   className={"w-100"}
                                   error={fiatError}
                                   value={fiatStr}
                                   placeholder={"Введите сумму"}
                                   onChange={event => {
                                       setFiatStr(event.currentTarget.value);
                                       calcFiat(event.currentTarget.value);
                                   }}
                        />
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                        <TextField id="standard-basic" label={"Сумма в " + CryptoCurrencies[props.ad.crypto_currency]}
                                   className={"w-100"}
                                   error={cryptoError}
                                   value={cryptoStr}
                                   placeholder={"Введите сумму"}
                                   onChange={event => {
                                       setCryptoStr(event.currentTarget.value);
                                       calcCrypto(event.currentTarget.value);
                                   }}
                        />
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <Grid container justify={"center"} color={"primary"}>
                        <Link href={"/app"} passHref>
                            <Button href="" variant="contained" color="primary" size="large"
                                    className={buttonStyle.root}>
                                {props.ad.is_buy ? "Купить" : "Продать"}
                            </Button>
                        </Link>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    )
}