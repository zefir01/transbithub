import {IAd, PrettyPrice} from "../../helpers";
import {
    Button,
    Card,
    CardContent, Grid, Hidden, makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import React from "react";
import {AggregatorSources, CryptoCurrencies, Currencies} from "../AggregatorCatalog";
import Link from "next/link";
import {AdMetadata} from "../metadata";

export interface SuitableProps {
    ads?: IAd[];
    ad: IAd;
}

export function Suitable(props: SuitableProps) {
    if (!props.ads || !props.ad) {
        return null;
    }
    const meta = new AdMetadata(props.ad);

    const buttonCb = makeStyles(() => (
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
                    <Link href={"/app"} passHref>
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
                                <Link href={"/app"} passHref>
                                    <Button href="" variant="contained" color="primary" size="small" className={buttonStyle.root}>
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

    return (
        <Card className={"w-100"}>
            <CardContent>
                <Typography variant={"h5"} component={"h2"}>
                    {meta.h2}:
                </Typography>
            </CardContent>
            <Hidden xsDown implementation={"css"}>
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
                                        {props.ads[0].is_buy ?
                                            "Продавец"
                                            :
                                            "Покупатель"
                                        }
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
                                props.ads.map(p => ItemBig(p))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Hidden>
            <Hidden smUp implementation={"css"}>
                {props.ads.map(p=>ItemSmall(p))}
            </Hidden>
            <Button href="/aggregator/find" variant="outlined" color="primary" size="small" className={"w-100"}>
                Больше объявлений
            </Button>
        </Card>
    )
}