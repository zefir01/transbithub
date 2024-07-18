import React from "react";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import {AggregatorSources} from "../AggregatorCatalog";
import {TraderSnapshot} from "../../helpers";
import {BzVolumes} from "./bzVolumes";

export interface StatProps {
    snapshot: TraderSnapshot;
}

export function Stat(props: StatProps) {
    function noDataNum(value?: number): string {
        if (!value || value === 0) {
            return "Нет данных"
        }
        return value.toString();
    }

    function RowStr(props: { name: string, value: string }) {
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
                        {props.value}
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


    return (
        <Box boxShadow={3}>
            <Card>
                <CardContent>
                    <Grid container direction="column" spacing={3}>
                        <Grid item container justify={"center"}>
                            <h4>Статистика</h4>
                        </Grid>
                        <RowNum name={"Количество сделок:"} value={props.snapshot.trades_count}/>
                        <RowStr name="Рейтинг:" value={props.snapshot.rating}/>
                        <RowNum name={"Положительных отзывов:"} value={props.snapshot.positive_feedbacks}/>
                        <RowNum name={"Отрицательных отзывов:"} value={props.snapshot.negative_feedbacks}/>
                        <RowNum name={"Успешных сделок:"} value={props.snapshot.completed_deals}/>
                        <RowNum name={"Отмененных сделок:"} value={props.snapshot.canceled_deals}/>
                        <RowNum name={"Доверенный у партнеров:"} value={props.snapshot.trusted_count}/>
                        <RowNum name={"Заблокирован у партнеров:"} value={props.snapshot.blocked_count}/>
                        <RowStr name={"Сделок на сумму:"} value={props.snapshot.amount + " BTC"}/>
                        <RowNum name={"Диспутов проиграно:"} value={props.snapshot.dispute_loose}/>
                        <RowNum name={"Уникальных партнеров:"} value={props.snapshot.partners}/>
                        <BzVolumes volumes={props.snapshot.bz_trader_volumes}/>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}