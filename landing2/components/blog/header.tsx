import {IMeta} from "../Interfaces";
import {BlogSeo} from "../BlogSeo";
import {Box, Typography} from "@material-ui/core";
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
import {Article, WithContext} from "schema-dts";
import {JsonLd} from "../JsonLd";
import React from "react";

export interface HeaderProps {
    title: string;
    image?: string;
    meta: IMeta;
    children?: React.ReactNode;
}

export function Header(props: HeaderProps) {
    const article: WithContext<Article> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        image: "https://transbithub.com" + props.image,
        about: props.title,
        abstract: props.meta.preview,
        description: props.meta.preview,
    };
    const shareUrl="https://transbithub.com" + props.meta.slug;
    return (
        <>
            <BlogSeo meta={props.meta}/>
            <JsonLd data={article}/>
            <Typography variant={"h2"} component={"h1"}>
                {props.title}
            </Typography>
            {props.image ?
                <img alt={props.title} width={"100%"} src={props.image}/>
                : null
            }
            <FacebookShareButton
                url={shareUrl}
                quote={props.meta.title}
            >
                <FacebookIcon size={32} round/>
            </FacebookShareButton>
            <TwitterShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <VKShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <VKIcon size={32} round/>
            </VKShareButton>
            <TelegramShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <TelegramIcon size={32} round />
            </TelegramShareButton>
            <WhatsappShareButton
                url={shareUrl}
                title={props.meta.title}
                separator=":: "
            >
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <OKShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <OKIcon size={32} round />
            </OKShareButton>
            <RedditShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <RedditIcon size={32} round />
            </RedditShareButton>
            <TumblrShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <TumblrIcon size={32} round />
            </TumblrShareButton>
            <LivejournalShareButton
                url={shareUrl}
                title={props.meta.title}
                description={shareUrl}
            >
                <LivejournalIcon size={32} round />
            </LivejournalShareButton>
            <MailruShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <MailruIcon size={32} round />
            </MailruShareButton>
            <EmailShareButton
                url={shareUrl}
                subject={props.meta.title}
                body="body"
            >
                <EmailIcon size={32} round />
            </EmailShareButton>
            <ViberShareButton
                url={shareUrl}
                title={props.meta.title}
            >
                <ViberIcon size={32} round />
            </ViberShareButton>

            <Box paddingTop={5}>
                <Typography variant={"body1"}>
                    {props.children}
                </Typography>
            </Box>
        </>
    );
}