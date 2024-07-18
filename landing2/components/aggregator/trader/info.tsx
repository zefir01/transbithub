import {ITrader} from "../../helpers";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import {AggregatorSources} from "../AggregatorCatalog";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LivejournalIcon,
    LivejournalShareButton, MailruIcon, MailruShareButton,
    OKIcon,
    OKShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton, ViberIcon, ViberShareButton,
    VKIcon,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import React from "react";

export interface InfoProps {
    trader: ITrader
}

export function Info(props: InfoProps) {
    function noDataDate(value?: number): string {
        if (!value || value === 0 || value === -62135596800000) {
            return "Нет данных"
        }
        return new Date(value).toLocaleDateString();
    }

    function noDataBool(value?: boolean): string {
        if (!value) {
            return "Нет данных"
        }
        return value ? "Да" : "Нет";
    }

    function Item(props: { name: string, value: string }) {
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

    const shareUrl="https://transbithub.com/aggregator/trader/" + props.trader.id;
    return (
        <Box boxShadow={3}>
            <Card>
                <CardContent>
                    <Grid container direction="column" spacing={3}>
                        <Grid item container justify={"center"}>
                            <h4>Профиль трейдера</h4>
                        </Grid>
                        <Item name={"Биржа:"} value={AggregatorSources[props.trader.source_type]}/>
                        <Item name={"Зарегистрирован:"} value={noDataDate(props.trader.registered_at)}/>
                        <Item name={"Последняя активность:"} value={noDataDate(props.trader.last_activity)}/>
                        <Item name={"Верифицирован:"} value={noDataBool(props.trader.verified)}/>
                        <Item name={"Последнее обновление:"} value={noDataDate(props.trader.updated_at)}/>
                        <Grid item>
                            <FacebookShareButton
                                url={shareUrl}
                                quote={props.trader.name}
                            >
                                <FacebookIcon size={32} round/>
                            </FacebookShareButton>
                            <TwitterShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <VKShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <VKIcon size={32} round/>
                            </VKShareButton>
                            <TelegramShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <TelegramIcon size={32} round />
                            </TelegramShareButton>
                            <WhatsappShareButton
                                url={shareUrl}
                                title={props.trader.name}
                                separator=":: "
                            >
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <OKShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <OKIcon size={32} round />
                            </OKShareButton>
                            <RedditShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <RedditIcon size={32} round />
                            </RedditShareButton>
                            <TumblrShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <TumblrIcon size={32} round />
                            </TumblrShareButton>
                            <LivejournalShareButton
                                url={shareUrl}
                                title={props.trader.name}
                                description={shareUrl}
                            >
                                <LivejournalIcon size={32} round />
                            </LivejournalShareButton>
                            <MailruShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <MailruIcon size={32} round />
                            </MailruShareButton>
                            <EmailShareButton
                                url={shareUrl}
                                title={props.trader.name}
                                body="body"
                            >
                                <EmailIcon size={32} round />
                            </EmailShareButton>
                            <ViberShareButton
                                url={shareUrl}
                                title={props.trader.name}
                            >
                                <ViberIcon size={32} round />
                            </ViberShareButton>

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}