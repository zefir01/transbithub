import {IAd} from "../../helpers";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import React from "react";
import {BzVolumes} from "../trader/bzVolumes";

export interface TraderProps {
    ad: IAd;
}

export function Trader(props: TraderProps) {
    function RowStr(props: { name: string, value: string, suffix?: string }) {
        if (props.value === "0" || props.value === "") {
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
                        {props.value} {props.suffix}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function RowNum(props: { name: string, value: number }) {
        if (props.value === 0) {
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
                        {props.value}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    const trader = props.ad.trader;
    const snapshot = trader.trader_snapshot.sort((a, b) => a.created_at - b.created_at)[0];

    return (
        <Card className={"w-100"}>
            <CardContent>
                <Box mb={3}>
                    <Typography variant={"h5"}>
                        Статистика трейдера:
                    </Typography>
                </Box>
                <Grid container direction="column" spacing={1}>
                    <RowNum name={"Количество сделок:"} value={snapshot.trades_count}/>
                    <RowStr name="Рейтинг:" value={snapshot.rating}/>
                    <RowNum name={"Положительных отзывов:"} value={snapshot.positive_feedbacks}/>
                    <RowNum name={"Отрицательных отзывов:"} value={snapshot.negative_feedbacks}/>
                    <RowNum name={"Успешных сделок:"} value={snapshot.completed_deals}/>
                    <RowNum name={"Отмененных сделок:"} value={snapshot.canceled_deals}/>
                    <RowNum name={"Доверенный у партнеров:"} value={snapshot.trusted_count}/>
                    <RowNum name={"Заблокирован у партнеров:"} value={snapshot.blocked_count}/>
                    <RowStr name={"Сделок на сумму:"} value={snapshot.amount} suffix={"BTC"}/>
                    <RowNum name={"Диспутов проиграно:"} value={snapshot.dispute_loose}/>
                    <RowNum name={"Уникальных партнеров:"} value={snapshot.partners}/>
                    <BzVolumes volumes={snapshot.bz_trader_volumes}/>
                </Grid>
            </CardContent>
        </Card>
    )
}