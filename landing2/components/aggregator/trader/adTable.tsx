import React from "react";
import {
    Button,
    Card,
    CardContent,
    Grid,
    Hidden,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@material-ui/core";
import {IAd, PrettyPrice} from "../../helpers";
import {CryptoCurrencies, Currencies, PaymentTypes} from "../AggregatorCatalog";
import LocalizedStrings from "react-localization";
import {data} from "../../localization/Aggregator/PaymentTypes";

export interface AdTableProps {
    ads?: IAd[]
}

export function AdTable(props: AdTableProps) {
    let d = new LocalizedStrings(data);

    function ItemBig(ad: IAd) {
        return (
            <TableRow key={ad.id + "lg"}>
                <TableCell>
                    <Typography>
                        {Currencies[ad.fiat_currency]}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        {CryptoCurrencies[ad.crypto_currency]}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        {d.getString(PaymentTypes[ad.payment_type], "ru")}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography style={{fontWeight: "bold", color: "#357a38", display: "inline"}}>
                        {PrettyPrice(ad.price)}
                    </Typography>
                    <Typography style={{display: "inline"}}>
                        {" " + Currencies[ad.fiat_currency].toLowerCase()}/{CryptoCurrencies[ad.crypto_currency].toLowerCase()}
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Button variant="contained" color="primary" size="small">
                        {ad.is_buy ? "Купить" : "Продать"}
                    </Button>
                </TableCell>
            </TableRow>
        )
    }

    function ItemSmall(ad: IAd) {
        return (
            <Grid key={ad.id + "sm"} item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography style={{fontWeight: "bold"}}>
                                    Валюта
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography>
                                    {Currencies[ad.fiat_currency]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography style={{fontWeight: "bold"}}>
                                    Криптовалюта
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography>
                                    {CryptoCurrencies[ad.crypto_currency]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography style={{fontWeight: "bold"}}>
                                    Платежная система
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography>
                                    {PaymentTypes[ad.payment_type]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography style={{fontWeight: "bold"}}>
                                    Цена
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography style={{fontWeight: "bold", color: "#357a38", display: "inline"}}>
                                    {PrettyPrice(ad.price)}
                                </Typography>
                                <Typography style={{display: "inline"}}>
                                    {" " + Currencies[ad.fiat_currency].toLowerCase()}/{CryptoCurrencies[ad.crypto_currency].toLowerCase()}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} justify={"center"}>
                            <Grid item>
                                <Button variant="contained" color="primary" size="small">
                                    {ad.is_buy ? "Купить" : "Продать"}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        )
    }


    if (!props.ads || props.ads.length === 0) {
        return null;
    }

    const ad = props.ads[0];
    let ads: IAd[]
    if(ad.is_buy) {
        ads = props.ads.map(p => ({price: parseFloat(p.price), ad: p}))
            .sort((a, b) => a.price - b.price)
            .map(p => p.ad);
    }
    else{
        ads = props.ads.map(p => ({price: parseFloat(p.price), ad: p}))
            .sort((a, b) => b.price - a.price)
            .map(p => p.ad);
    }

    return (
        <Card>
            <CardContent>
                <Typography style={{fontWeight: "bold"}} variant={"h5"}>
                    {ad.is_buy ? "Объявления по продаже" : "Объявления по покупке"}
                </Typography>
            </CardContent>
            <Hidden xsDown implementation="css">
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography style={{fontWeight: "bold"}}>
                                        Валюта
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography style={{fontWeight: "bold"}}>
                                        Криптовалюта
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography style={{fontWeight: "bold"}}>
                                        Платежная система
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography style={{fontWeight: "bold"}}>
                                        Цена
                                    </Typography>
                                </TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ads.map(p => ItemBig(p))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Hidden>
            <Hidden smUp implementation="css">
                {
                    <Grid container item spacing={3} justify={"center"}>
                        {ads.map(p => ItemSmall(p))}
                    </Grid>
                }
            </Hidden>
        </Card>
    )
}