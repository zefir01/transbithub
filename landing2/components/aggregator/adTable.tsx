import React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Hidden, makeStyles,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, Theme, Typography
} from "@material-ui/core";
import {IAd, PrettyPrice} from "../helpers";
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "./AggregatorCatalog";
import LocalizedStrings from "react-localization";
import {data} from "../localization/Aggregator/PaymentTypes";
import Link from "next/link";
import {Alert} from "@material-ui/lab";
import {AdsSelect, useSelectorParams} from "./helpers";
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

export interface AdTableProps {
    ads: AdsSelect
}

export function AdTable(props: AdTableProps) {
    let d = new LocalizedStrings(data);
    const params = useSelectorParams();

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

    function ItemBig(ad: IAd) {
        return (
            <TableRow key={ad.id + "lg"}>
                <TableCell>
                    <Typography>
                        {AggregatorSources[ad.source_type]}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        <Link href={`/aggregator/trader/${ad.trader.id}`} passHref>
                            {ad.trader.name}
                        </Link>
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        {d.getString(PaymentTypes[ad.payment_type], "ru")}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography>
                        {ad.min_amount}-{ad.max_amount}
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
                    <Link href={`/aggregator/ad/${ad.id}`} passHref>
                        <Button href="" variant="contained" color="primary" size="small" className={buttonStyle.root}>
                            {ad.is_buy ? "Купить" : "Продать"}
                        </Button>
                    </Link>
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
                                    Биржа
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography>
                                    {AggregatorSources[ad.source_type]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography style={{fontWeight: "bold"}}>
                                    {ad.is_buy ? "Продавец" : "Покупатель"}
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography>
                                    <Link href={`/aggregator/trader/${ad.trader.id}`} passHref>
                                        {ad.trader.name}
                                    </Link>
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
                                    Лимиты
                                </Typography>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Typography>
                                    {ad.min_amount}-{ad.max_amount}
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
                                <Link href={`/aggregator/ad/${ad.id}`} passHref>
                                    <Button href="" variant="contained" color="primary" size="small"
                                            className={buttonStyle.root}>
                                        {ad.is_buy ? "Купить" : "Продать"}
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        )
    }

    function createPaginationLink(page: number) {
        const urlSearchParams = new URLSearchParams();
        for (let s in params.sources) {
            urlSearchParams.append("sources", s);
        }
        for (let p in params.paymentTypes) {
            urlSearchParams.append("paymentTypes", p);
        }
        urlSearchParams.append("currency", Currencies[params.fiatCurrency]);
        urlSearchParams.append("cryptoCurrency", CryptoCurrencies[params.cryptoCurrency]);
        urlSearchParams.append("isBuy", params.isBuy?.toString() ?? "true");
        if (params.amount && params.amount !== "") {
            urlSearchParams.append("amount", params.amount);
        }
        urlSearchParams.append("page", page?.toString() ?? "1");
        return `/aggregator/find?${urlSearchParams.toString()}`;
    }

    if (!params || !params.page || params.isBuy === null) {
        return null;
    }

    if (!props.ads || props.ads.ads.length === 0) {
        return (
            <Alert severity="info" className={"w-100"}>
                Нет объявлений
            </Alert>
        )
    }

    //return null;
    return (
        <Grid container direction={"column"}>
            <Grid item>
                <Hidden xsDown implementation="css">
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography style={{fontWeight: "bold"}}>
                                            Биржа
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography style={{fontWeight: "bold"}}>
                                            {props.ads.ads[0].is_buy ?
                                                "Продавец"
                                                :
                                                "Покупатель"
                                            }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography style={{fontWeight: "bold"}}>
                                            Платежная система
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography style={{fontWeight: "bold"}}>
                                            Лимиты
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
                                    props.ads.ads.map(p => ItemBig(p))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Hidden>
                <Hidden smUp implementation="css">
                    {
                        <Grid container item spacing={3} justify={"center"}>
                            {props.ads.ads.map(p => ItemSmall(p))}
                        </Grid>
                    }
                </Hidden>
            </Grid>
            <Grid item container justify={"center"}>
                <Box mt={3}>
                    <Pagination
                        count={props.ads.pages} boundaryCount={10}
                        page={props.ads.page}
                        variant="outlined"
                        shape="rounded"
                        renderItem={(item) => (
                            <PaginationItem component={"a"}  {...item} href={createPaginationLink(item.page)}/>
                        )}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}