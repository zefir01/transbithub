import {Container, Typography} from "@material-ui/core";
import {Header} from "../../components/blog/header";
import {Nl} from "../../components/blog/nl";
import {Block} from "../../components/blog/Block";
import {BlogImage} from "../../components/blog/BlogImage";

export const GeneralFeaturesMeta = {
    title: "Свободная P2P-биржа для торговли криптовалютами",
    description: "Transbithub — уникальный проект по BTC. Полная анонимность, безопасные сделки,  система промисов,пошаговые инструкции.",
    image: "tbh_ex-1024x503.png",
    preview: `Transbithub — уникальный проект, который создал синергию между основными операциями по BTC.  Его цель — упростить работу криптовалютных трейдеров, продавцов, торгующих через BTC и облегчить жизнь покупателям, которые раньше даже не слышали о блокчейне.
На Transbithub есть P2P-биржа с новейшими функциями для трейдеров, Lightning Network, делающий переводы в BTC почти бесплатными и моментальными, а также уникальная система Промисов — простейший способ отправить биткойны, который при правильном использовании дает полную анонимность.
Однако основная особенность проекта – трехсторонние сделки при продаже товаров за BTC, которые позволяют продавцам моментально получать деньги, а покупателям – не терять средства на комиссиях сторонних обменников и быстро платить с помощью Qiwi, WebMoney и других площадок. Благодаря ей в выигрыше оказываются и продавцы, и трейдеры, и покупатели. Как? Объясним в этой статье.`,
    slug: "/blog/general-features"
}

export default function GeneralFeatures() {
    return (
        <Container>
            <Header title={"Главные особенности платформы TransBitHub"} image={"/img/blog/tbh_ex-1024x503.png"}
                    meta={GeneralFeaturesMeta}>
                Transbithub — уникальный проект, который создал синергию между основными операциями по BTC.
                Его цель — упростить работу криптовалютных трейдеров, продавцов, торгующих через BTC и облегчить жизнь
                покупателям,
                которые раньше даже не слышали о блокчейне.
                <Nl/>
                На Transbithub есть P2P-биржа с новейшими функциями для трейдеров, Lightning Network, делающий переводы
                в BTC почти
                бесплатными и моментальными, а также уникальная система Промисов — простейший способ отправить биткойны,
                который при
                правильном использовании дает полную анонимность.
                <Nl/>
                Однако основная особенность проекта – трехсторонние сделки при продаже товаров за BTC, которые позволяют
                продавцам
                моментально получать деньги, а покупателям – не терять средства на комиссиях сторонних обменников и
                быстро платить с
                помощью Qiwi, WebMoney и других площадок. Благодаря ей в выигрыше оказываются и продавцы, и трейдеры, и
                покупатели.
                Как? Объясним в этой статье.
            </Header>
            <Block title={"Свободная P2P-биржа"}>
                Одна из особенностей площадки – полностью свободная P2P-биржа для торговли криптовалютами.
                Трейдеры могут без ограничений публиковать объявления о покупке и продаже биткойнов, самостоятельно
                устанавливать цену и выбирать способы оплаты.
                <Nl/>
                Для удобства торговли BTC мы реализовали удобные функции:
                <ul>
                    <li>Биржа автоматически обновляет курс с использованием средней стоимости BTC на крупных торговых
                        биржах
                        (Binance, Bitrex, Bitfinex и другие). Трейдер может выставить процент желаемой прибыли от
                        обмена,
                        а курс автоматически подкорректируется при изменении стоимости биткойна или фиатных валют.
                    </li>
                    <li>Автоцена – уникальная функция нашей биржи, которой нет больше ни на одной площадке.
                        В Transbithub встроен бот, который настраивает стоимость в зависимости от лучшего предложения на
                        площадке в границах,
                        заданных в настройках. Это дает возможность получить преимущество перед другими трейдерами –
                        вы получите максимум клиентов при минимальных вложениях.
                    </li>
                    <li>Сделки по обмену защищаются арбитрами. При возникновении спорных ситуаций они подключаются к
                        операции и помогают
                        разобраться с конфликтными моментами, которые возникли при обмене. Их задача – добиться истины и
                        восстановить нарушенные права.
                    </li>
                    <li>Вывести средства можно на внешний BTC-кошелек, через Lighting network или перевести в Промис, о
                        которых мы расскажем ниже.
                    </li>
                </ul>
            </Block>
            <Block title={"Сразу о Lightning Network"}>
                <Typography variant={"body1"}>
                    Transbithub поддерживает перевод BTC через Lightning Network. С его помощью вы можете моментально
                    переводить биткойны с
                    минимальной комиссией или даже без неё. Lightning Network работает как при оплате счетов, так и при
                    вводе/выводе средств
                    с площадки. Полная интеграция самого современного способа перевода BTC для продаж и обмена в одном
                    месте.
                </Typography>
            </Block>
            <Block title={"Торговля товарами через Transbithub"}>
                Transbithub меняет представление о торговле товарами за криптовалюту, позволяя покупателям платить за
                них фиатом,
                а продавцам – моментально получать BTC. Как это возможно?
                <Nl/>
                Представим, что вы торгуете через Telegram. Вам приходится создавать входящие адреса в BTC-кошельке,
                передавать их
                покупателям для оплаты, ждать переводов. Возникают сложности – кто-то не знает, как работать с
                биткойном, кто-то может
                перепутать сумму или отправить средства не туда и начать спорить, что деньги ушли по адресу. Кроме того,
                курс может
                измениться и вам придется вручную корректировать цены, а покупатели нередко экономят на комиссии,
                замедляя перевод до предела.
                <Nl/>
                Transbithub решил все эти проблемы. Все что нужно продавцу – создать на площадке счет для оплаты и
                передать его клиенту.
                Продавец может установить стоимость в валюте или BTC, указать описание (или вовсе не указывать его) и
                определить количество частей.
                По желанию, к счету может прикрепляться цифровая информация, которая становится доступна покупателю
                сразу после
                оплаты товара – ключи, картинки, кодовые фразы, ссылки и описания.
                <Nl/>
                Отдельно скажем о стоимости. Она может указываться в фиатной валюте – при изменении курса площадка
                автоматически
                корректирует сумму в BTC, которая соответствует установленной цене. Это полностью решает проблему с
                регулированием цены
                при скачках курса.
                <Nl/>
                Клиенты переходят к оплате по короткой ссылке или номеру. Её можно разместить на своем сайте, в
                Telegram-канале и в
                любом другом месте. Перейдя по ней покупатель сразу сможет приступить к оплате – ему не нужно
                регистрироваться на площадке.
                Система открыта, но при этом сохраняет анонимность – счет можно оставить без описания и случайный
                пользователь не узнает, зачем он нужен.
            </Block>
            <Block title={"Трехсторонние сделки"}>
                Сделки по товарам на Transbithub проходят с привлечением трех сторон – продавца, покупателя и криптовалютного трейдера.
                Такой подход позволяет:
                <ul>
                    <li>Продавцу – легко и быстро создавать счета на оплату, получая авторасчет стоимости в BTC и автоматизированную систему
                        продаж и возвратов, моментально получая средства на свой кошелек;</li>
                    <li>Покупателю – платить рублями через Qiwi, Webmoney, банковские карты и другие системы за товары, которые продаются
                        за криптовалюту, при этом не платя комиссию;</li>
                    <li>Трейдеру – зарабатывать на обмене криптовалюты, получая постоянный приток клиентов и пользуясь остальными функциями
                        площадки, которые значительно упрощают работу.</li>
                </ul>
                <BlogImage src={"/img/blog/info-1024x503.png"} alt={"Трехсторонние сделки"}/>
                Для покупателя оплата почти не отличается от обычной покупки в интернет-магазине. Продавец — моментально получает BTC , не ожидая подтверждения транзакций, и не тратит время на объяснение клиентам процесса работы с биткойном.
            </Block>
            <Block title={"Удобный Помощник"}>
                Для тех, кто раньше не сталкивался с криптовалютами, мы разработали Помощника. Он помогает покупателю проводить основные
                операции с биткойнами без вникания в подробности. Пользователю достаточно указать платежную систему и сумму обмена –
                площадка сама подберет брокера и поможет купить BTC.
            </Block>
            <Block title={"Telegram-бот"}>
                Основной функционал площадки доступен и в нашем Telegram-боте. В первую очередь он предназначен для клиентов – там они
                могут оплачивать счета и обменивать криптовалюту. Покупатель может не выходить за пределы Telegram, что делает процесс
                покупки товаров еще проще.
            </Block>
            <Block title={"Внешняя интеграция"}>
                Transbithub имеет обширное API с поддержкой gRPC, которое серьезно облегчает разработку различных сервисов.
                Функции площадки можно встраивать в ботов, сайты, форумы, мессенджеры и в другие площадки, получая дополнительный
                функционал без разработки системы с нуля.
                <Nl/>
                Все основные функции API описаны в документации – начать разработку собственных ботов и систем на основе специально
                созданной тестовой среды можно прямо сейчас.
                <Nl/>
                Также на площадке предусмотрен iFrame-интерфейс, который позволяет встраивать цены и счета прямо в сайты и форумы –
                клиенты могут получить информацию, не уходят со страницы и перейти к оплате, нажав всего одну кнопку.
            </Block>
            <Block title={"Система Промисов"}>
                Промисы – это самый простой и быстрый способ передачи BTC, обладающий набором специфических возможностей.
                Они представляют собой криптографически подписанные документы, которые содержат в себе определенную сумму BTC.
                Их можно сравнить с долговой распиской, а обналичить ее можно в Telegram-боте, на сайте или у наших партнеров.
                <Nl/>
                Промисы полностью анонимны. Система не оставляет об их создателях никакой информации – узнать, кто создал Промис невозможно.
                С их помощью можно анонимно перевести средства с одного аккаунта на другой, а сам код можно даже распечатать на бумаге
                и отправить почтой, таким образом передав биткойны.
                <Nl/>
                К примеру, вы можете создать Промис на определенную сумму. Для этого вам даже не нужно регистрироваться – покупка BTC
                возможна без аккаунта. Этот Промис вы можете передать другому человеку в Telegram или другом мессенджере, который
                обналичит его просто переслав боту или активировав на сайте.
                <Nl/>
                Промисы бывают двух типов – незащищенные и защищенные паролем. Незащищенные может использовать любой, кто может его
                прочитать. Для использования защищенных потребуется пароль, который задается при создании Промиса.
            </Block>
            <Block title={"Полная анонимность"}>
                При регистрации вам достаточно придумать никнейм и пароль, а при желании вы можете прикрепить почту или настроить
                двухфакторную аутентификацию через Google Autentificator и схожие приложения.
                <Nl/>
                Множество функций, таких как покупка криптовалюты и оплата счетов возможна и без регистрации. Доступ к Transbithub есть
                и через TOR, потому его никогда полностью не заблокируют.
                <Nl/>
                Заметим, что вы можете повысить свою анонимность, распределяя операции по разным учетным записям, используя Промисы и
                Lighting Network. В этом случае даже имея всю информацию площадки, восстановить осмысленную картину действий пользователя будет невозможно.
                <Nl/>
                Мы советуем использовать для входа TOR, который сохранит вашу анонимность, однако переходить на площадку можно и без него.
            </Block>
        </Container>
    )
}