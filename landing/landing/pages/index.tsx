import React from "react";
import {Footer} from "../components/footer";
import {Header} from "../components/header";
import {NextSeo} from "next-seo";
import Link from "next/link";
import MuiLink from '@material-ui/core/Link';
import {useRouter} from "next/router";
import Image from 'next/image'
import Carusel from "../components/landing/carusel";
import {
    Container,
    Grid
} from "@material-ui/core";
import {Selector} from "../components/landing/selector";

export default function Home() {
    const router = useRouter()

    if (!router) {
        return null;
    }


    return (
        <>
            <NextSeo
                title="TransBitHub"
                description="P2P биржа, биллинговая система, Кошелек с Lightning Network"
                openGraph={{
                    locale: "ru_RU",
                    url: router.basePath,
                    title: 'TransBitHub',
                    description: 'P2P биржа, биллинговая система, Кошелек с Lightning Network',
                    site_name: 'TransBitHub',
                    type: "website",
                    images: [
                        {
                            url: '/img/bitcoin.svg',
                            alt: 'P2P биржа, биллинговая система, Кошелек с Lightning Network',
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
            <Header/>
            <Container maxWidth="xl">
                <Grid container direction="row" justify="center">
                    <Carusel/>
                </Grid>
                <Selector/>
            </Container>
            <div className="feautures">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="feauture-h2">Главные особенности платформы</h2>
                        </div>

                        <div className="col-12 col-lg-4 mb-68">
                            <Link href="#anchor-1" passHref>
                                <a className="feature-block d-flex flex-column align-items-start">
                                    <img className="mw-100"
                                         src="/img/feature-1.svg"
                                         alt="P2P обмен биткоинов и фиатной валюты" loading="lazy"/>
                                    <p>P2P обмен биткоинов и фиатной валюты</p>
                                    <span className="d-none d-lg-flex align-items-center">Подробнее</span>
                                </a>
                            </Link>
                        </div>

                        <div className="col-12 col-lg-4 mb-68">
                            <Link href="#anchor-3" passHref>
                                <a className="feature-block d-flex flex-column align-items-start">
                                    <img className="mw-100"
                                         src="/img/feature-2.svg"
                                         alt="Телеграм бот для обмена биткоинов и покупки товаров и услуг"
                                         loading="lazy"/>
                                    <p>Телеграм бот для обмена биткоинов и покупки товаров и услуг</p>
                                    <span className="d-none d-lg-flex align-items-center">Подробнее</span>
                                </a>
                            </Link>
                        </div>

                        <div className="col-12 col-lg-4 mb-68">
                            <Link href="#anchor-2" passHref>
                                <a className="feature-block d-flex flex-column align-items-start">
                                    <img className="mw-100"
                                         src="/img/feature-3.svg"
                                         alt="Поддержка Lightning Network" loading="lazy"/>
                                    <p>Поддержка Lightning Network</p>
                                    <span className="d-none d-lg-flex align-items-center">Подробнее</span>
                                </a>
                            </Link>
                        </div>
                        <div className="col-12 col-lg-4 mb-68 d-none d-lg-block">
                            <div className="feature-block-orange"/>
                        </div>
                        <div className="col-12 col-lg-4 mb-68">
                            <Link href="#anchor-4" passHref>
                                <a className="feature-block d-flex flex-column align-items-start">
                                    <img className="mw-100"
                                         src="/img/feature-4.svg"
                                         alt="Анонимная торговля любыми товарами и услугами за фиатную валюту и биткоины"
                                         loading="lazy"/>
                                    <p>Анонимная торговля любыми товарами и услугами за фиатную валюту и биткоины</p>
                                    <span className="d-none d-lg-flex align-items-center">Подробнее</span>
                                </a>
                            </Link>
                        </div>

                        <div className="col-12 col-lg-4 mb-68">
                            <Link href="#anchor-5" passHref>
                                <a className="feature-block d-flex flex-column align-items-start">
                                    <img className="mw-100"
                                         src="/img/feature-5.svg"
                                         alt="Grpc (Grpc-Web) Api для разработчиков" loading="lazy"/>
                                    <p>Grpc (Grpc-Web) Api для разработчиков</p>
                                    <span className="d-none d-lg-flex align-items-center">Подробнее</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="uniqeue">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="uniqeue-h2">Уникальная система позиционирования объявлений<br
                                    className="d-none d-lg-block"/> о покупке/продаже биткоинов</h2>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div
                                    className="uniqeue-block d-flex flex-lg-column align-items-start justify-content-end">
                                    <div className="uniqeue-image">
                                        <img className="mw-100"
                                             src="/img/uniqeue-1.svg"
                                             alt="Хотите" loading="lazy"/>
                                    </div>
                                    <div>
                                        <h4>Хотите</h4>
                                        <p>чтобы ваше объявление было всегда в топе и с минимальным опережением
                                            конкурентов
                                            (на 0.01) и не
                                            хотите тратить время на написание робота?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div
                                    className="uniqeue-block d-flex flex-lg-column align-items-start justify-content-end">
                                    <div className="uniqeue-image">
                                        <img className="mw-100"
                                             src="/img/uniqeue-2.svg"
                                             alt="Есть решение" loading="lazy"/>
                                    </div>
                                    <div>
                                        <h4>Есть решение</h4>
                                        <p>Авторасчеты цены. С указанной вами периодичностью и граничными условиями,
                                            система
                                            будет
                                            выставлять цену объявления так, чтобы вы торговали с максимальной
                                            эффективностью. Минимальный
                                            период перерасчета цены 10 секунд.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 mt-125 text-center">
                                <Link href="/docs-static/trading/autoPrice/" passHref>
                                    <a className="btn btn-primary btn-new btn-weight">
                                        Подробнее
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="dob-block-1" id="anchor-1">
                    <div className="container bg-md-1">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="dob-item-1 d-flex flex-column align-items-start">
                                    <h3>Выставление оплаты счетов для покупки/продажи физических и цифровых товаров за
                                        биткоины и фиатные
                                        деньги</h3>
                                    <p>Вы можете продавать любой товар за биткоины, а покупатели могут платить любым
                                        удобным
                                        им способом,
                                        например через qiwi или Сбербанк.</p>
                                </div>
                            </div>
                            <div className="col-lg-6 text-end dots-end d-none d-lg-block">
                                <img className="mw-100" src="/img/dob-1.svg"
                                     alt="Выставление оплаты счетов для покупки/продажи физических и цифровых товаров за биткоины и фиатные деньги"
                                     loading="lazy"/>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="dob-block-2" id="anchor-2">
                    <div className="container bg-md-2">
                        <div className="row">
                            <div className="col-lg-6 dots-start d-none d-lg-block">
                                <img className="mw-100" src="/img/dob-2.svg"
                                     alt="Онлайн кошелёк, с возможностью конвертации между BTC и Lightning Network"
                                     loading="lazy"/>
                            </div>
                            <div className="col-lg-6 d-flex justify-content-end">
                                <div className="dob-item-2 d-flex flex-column align-items-end">
                                    <h3 className="text-end">Онлайн кошелёк, с возможностью конвертации между BTC и
                                        Lightning Network</h3>
                                    <p className="text-end">Lightning Network позволяет вводить и выводить средства
                                        моментально и почти
                                        без комиссий. Совсем без комиссий, если вы откроете канал с нашим сервисом</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="dop-block-3" id="anchor-3">
                    <div className="container bg-md-3">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="dop-3-h">Многофункциональная система оплаты с использованием
                                    Промисов</h2>
                            </div>
                            <div className="col-lg-6 dots-start-2 d-none d-lg-block">
                                <img className="mw-100" src="/img/dob-3.svg"
                                     alt="Многофункциональная система оплаты с использованием Промисов" loading="lazy"/>
                            </div>
                            <div className="col-lg-6">
                                <div className="dob-item-3 d-flex flex-column align-items-start">
                                    <h3 className="blue-block">Промисы</h3>
                                    <p className="dop-3-sub-head">это как долговые расписки, которые можно обналичить.
                                        Простой и быстрый
                                        способ передать средства через любые каналы связи, например, Telegram.</p>
                                    <p>Для работы с Промисами не требутся ни кошельков ни специальных знаний. Достаточно
                                        любого текстового
                                        редактора. В теории, вы можете пересылать биткоины даже бумажными письмами. Или
                                        хранить их в ящике
                                        стола на бумажном носителе.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="dop-block-3" id="anchor-4">
                    <div className="container bg-md-4">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <h2 className="dop-3-h text-end">Все операции можно выполнять анонимно</h2>
                            </div>
                            <div className="col-lg-6">
                                <div
                                    className="dob-item-3 d-flex flex-column align-items-start ml-22 all-text-md-right">
                                    <h3 className="blue-block">Конфиденциальность</h3>
                                    <p className="dop-3-sub-head">Все операции покупателя можно выполнять через Telegram
                                        бота.<br/>Все,
                                        что нужно покупателю, есть в нашем телеграм боте @transbithub_bot</p>
                                    <p>Мы заботимся об анонимности пользователей и конфиденциальности данных. Мы широко
                                        используем системы
                                        шифрования и Tor, для обеспечения максимальной защиты, в том числе и от хищения
                                        оборудования.</p>
                                </div>
                            </div>
                            <div className="col-lg-6 dots-start-3 d-none d-lg-block">
                                <img className="mw-100" src="/img/dob-4.svg"
                                     alt="Все операции можно выполнять анонимно" loading="lazy"/>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container blue-snippet-margin">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-12">
                            <h2 className="h2 text-center">Приложение имеет Помощника, <br
                                className="d-none d-lg-block"/>упрощающего
                                операции покупателя</h2>
                            <div className="blue-snippet">
                                <h4 className="text-center">Не хотите заморачиваться?</h4>
                                <p>На сайте есть помощник, позволяющий совершать основные операции покупателя даже самым
                                    неопытным. И
                                    наша служба поддержки всегда готова помочь.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dop-block-3" id="anchor-5">
                    <div className="container bg-md-5">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="dop-3-h">Приложение имеет Grpc (Grpc-Web) API</h2>
                            </div>
                            <div className="col-lg-6 d-none d-lg-block">
                                <img className="mw-100" src="/img/dob-5.svg"
                                     alt="Приложение имеет Grpc (Grpc-Web) API" loading="lazy"/>
                            </div>
                            <div className="col-lg-6">
                                <div className="dob-item-3 d-flex flex-column align-items-start mw-md-450">
                                    <p className="dop-3-h-mini blue-block">Оно позволяет выполнять все операции и быстро
                                        создавать
                                        торговых роботов практически на любом языке.</p>
                                    <p className="dop-3-sub-head">Мы заботимся о разработчиках. Мы постарались
                                        максимально
                                        упростить
                                        разработку ботов и интеграцию. GRPC позволяет генерировать клиента
                                        автоматически.
                                        Вам остается
                                        только написать логику. Для тестирования развернут тестовый инстанс.</p>
                                    <p>Интеграция со сторонними ресурсами через ифрэймы и веб-хуки.<br/>Вы можете
                                        размещать
                                        ваши
                                        объявления и счета на своем сайте. Есть механизмы для интеграции.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container blue-snippet-margin">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-12">
                            <h2 className="h2 text-center">Автоматическая корректировка цен объявлений по
                                покупке/продаже
                                биткоинов и
                                счетов</h2>
                            <div className="blue-snippet">
                                <h4 className="text-center">Вы можете не беспокоиться о том что курс изменится.</h4>
                                <p>Система каждые 5 минут корректирует цены объявлений и счетов, по условиям, заданными
                                    вами.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container smi-container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-12">
                            <h2 className="h2 text-center">СМИ о нас</h2>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-6 col-md-5 text-center mt-46">
                                    <Link href="https://bitfin.info/12720-transbithub-samaya-sovremennaya-p2p-birzha/"
                                          passHref>
                                        <a target="_blank">
                                            <img src="/img/smi-1.png" loading="lazy"
                                                 className="mw-100"
                                                 alt="BitFin"/>
                                        </a>
                                    </Link>
                                </div>
                                <div className="col-6 col-md-5 text-center mt-46">
                                    <Link
                                        href="https://bits.media/pr/transbithub-p2p-birzha-bitkoina-s-lightning-network-api-i-botami/"
                                        passHref>
                                        <a target="_blank">
                                            <img src="/img/smi-2.png" loading="lazy"
                                                 className="mw-100"
                                                 alt="bit.media"/>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <Footer/>
        </>

    )
}
