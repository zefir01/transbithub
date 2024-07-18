import {NextSeo} from "next-seo";
import {useRouter} from "next/router";
import {IMeta} from "./Interfaces";

export interface BlogSeoProps {
    meta: IMeta;
}

export function BlogSeo(props: BlogSeoProps) {
    const router = useRouter()

    if (!router) {
        return null;
    }

    return (
        <NextSeo
            title={props.meta.title}
            description={props.meta.description}
            openGraph={{
                locale: "ru_RU",
                url: router.basePath + router.pathname,
                title: props.meta.title,
                description: props.meta.description,
                site_name: 'TransBitHub',
                type: "article",
                images: [
                    {
                        url: `/img/blog/${props.meta.image}`,
                        alt: props.meta.description,
                    },
                ],
            }}
            additionalLinkTags={
                [
                    {
                        rel: 'icon',
                        href: '/img/cropped-fav12-32x32.png',
                        sizes: "32x32"
                    },
                    {
                        rel: 'icon',
                        href: '/img/cropped-fav12-192x192.png',
                        sizes: "192x192"
                    },
                    {
                        rel: 'apple-touch-icon',
                        href: '/img/cropped-fav12-180x180.png',
                    },
                    {
                        rel: 'shortcut icon',
                        href: '/favicon.ico',
                        type: "image/x-icon"
                    },
                ]
            }
            additionalMetaTags={
                [
                    {
                        property: 'msapplication-TileImage',
                        content: '/img/cropped-fav12-270x270.png'
                    },
                    {
                        property: 'article:modified_time',
                        content: '2021-04-08T14:40:22+00:00'
                    }
                ]
            }
        />
    )
}