import {BzTraderVolumes} from "../../helpers";
import {Grid, Typography} from "@material-ui/core";
import React from "react";
import {CryptoCurrencies} from "../AggregatorCatalog";

export interface BzVolumesProps {
    volumes: BzTraderVolumes[] | null;
}

export function BzVolumes(props: BzVolumesProps) {
    const volumes = props.volumes?.filter(p => p.crypto_currency !== CryptoCurrencies.BTC);

    function RowStr(props: { volume: BzTraderVolumes }) {
        return (
            <>
                <Grid key={props.volume.id + "a"} item container>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Typography style={{fontWeight: "bold"}}>
                            Количество сделок по {CryptoCurrencies[props.volume.crypto_currency]}:
                        </Typography>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Typography>
                            {props.volume.deals_count}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid key={props.volume.id + "b"} item container>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Typography style={{fontWeight: "bold"}}>
                            Сделок по {CryptoCurrencies[props.volume.crypto_currency]} на сумму:
                        </Typography>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                        <Typography>
                            {props.volume.amount} {CryptoCurrencies[props.volume.crypto_currency]}
                        </Typography>
                    </Grid>
                </Grid>
            </>
        )
    }

    if (!volumes || volumes.length === 0) {
        return null;
    }

    return (
        <>
            {volumes.map(p => <RowStr volume={p}/>)}
        </>
    )
}