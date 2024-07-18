import {IAd, PrettyPrice} from "../../helpers";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import {AggregatorSources, CryptoCurrencies, Currencies, PaymentTypes} from "../AggregatorCatalog";
import LocalizedStrings from "react-localization";
import {data} from "../../localization/Aggregator/PaymentTypes";
import {Countries} from "../../Catalog";
import {data as cData} from "../../localization/Counties";

export interface InfoProps {
    ad: IAd;
}

export function Info(props: InfoProps) {
    const d = new LocalizedStrings(data);
    const countriesLoc = new LocalizedStrings(cData);

    function ItemNum(props: { name: string, value: number | null, suffix?: string }) {
        if (!props.value) {
            return null;
        }
        return (
            <Grid item container>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography style={{fontWeight: "bold"}}>
                        {props.name}
                    </Typography>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography>
                        {props.value}{props.suffix}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function ItemStr(props: { name: string, value: string | null, suffix?: string }) {
        if (!props.value || props.value === "" || props.value === "0") {
            return null;
        }
        return (
            <Grid item container>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography style={{fontWeight: "bold"}}>
                        {props.name}
                    </Typography>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography>
                        {props.value}{props.suffix}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function Limits(props: { minLimit: string, maxLimit: string, currency: Currencies }) {
        if (props.minLimit === "" && props.maxLimit === "") {
            return null;
        }
        if (props.minLimit === "0" && props.maxLimit === "0") {
            return null;
        }

        return (
            <Grid item container>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography style={{fontWeight: "bold"}}>
                        Лимиты:
                    </Typography>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography>
                        {props.minLimit}-{props.maxLimit} {Currencies[props.currency]}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function Price(props: { ad: IAd }) {
        return (
            <Grid item container>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography style={{fontWeight: "bold"}}>
                        Цена:
                    </Typography>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <Typography style={{fontWeight: "bold", color: "#357a38", display: "inline"}}>
                        {PrettyPrice(props.ad.price)}
                    </Typography>
                    <Typography style={{display: "inline"}}>
                        {" " + Currencies[props.ad.fiat_currency]}/{CryptoCurrencies[props.ad.crypto_currency]}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function getCountry(value: Countries) {
        const str = Countries[props.ad.country];
        return countriesLoc.getString(str, "ru");
    }

    return (
        <Card className={"w-100"}>
            <CardContent>
                <Grid container direction="column" spacing={1}>
                    <Box mb={3}>
                        <Typography variant={"h5"}>
                            Объявление:
                        </Typography>
                    </Box>
                    <ItemStr name={"Биржа:"} value={AggregatorSources[props.ad.source_type]}/>
                    {props.ad.country !== null ?
                        <ItemStr name={"Страна:"} value={getCountry(props.ad.country)}/>
                        : null
                    }
                    <ItemStr name={"Платежная система:"}
                             value={d.getString(PaymentTypes[props.ad.payment_type], "ru")}/>
                    <Limits minLimit={props.ad.min_amount} maxLimit={props.ad.max_amount}
                            currency={props.ad.fiat_currency}/>
                    <Price ad={props.ad}/>
                    <ItemNum name={"Время на сделку:"} value={props.ad.window} suffix={" минут"}/>
                    <ItemStr name={"Банк:"} value={props.ad.bank_name}/>
                    <ItemStr name={"Требуемый рейтинг:"} value={props.ad.require_feedback_score}/>
                    <ItemStr name={"Требуемый объем сделок"} value={props.ad.require_trade_volume}/>
                    <Grid item container>
                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                            <Typography style={{fontWeight: "bold"}}>
                                Статус:
                            </Typography>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                            {props.ad.disabled_at === null ?
                                <Typography style={{color: "#357a38"}}>
                                    Активно
                                </Typography>
                                :
                                <Typography color={"error"}>
                                    Не активно
                                </Typography>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}