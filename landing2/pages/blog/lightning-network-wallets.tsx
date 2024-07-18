import {Box, Container} from "@material-ui/core";
import {Header} from "../../components/blog/header";
import {Nl} from "../../components/blog/nl";
import {Block, Block2} from "../../components/blog/Block";
import {BlogImage} from "../../components/blog/BlogImage";
import {BlogLink} from "../../components/blog/BlogLink";

export const LnWalletsMeta = {
    title: "Как начать работать с Lightning Network, создать кошелек, открыть канал, перевести средства ",
    description: "Lightning Network на Transbithub.com: быстрый, анонимный с минимальными комиссиями. Подробные пошаговые инструкции к трем популярным кошелькам.",
    image: "stub.svg",
    preview: `Хотите использовать Lightning Network для передачи BTC? Прочтите нашу инструкцию по трем основным кошелькам для моментального и почти бесплатного перевода биткойнов.`,
    slug: "/blog/lightning-network-wallets"
}

export default function LnWallets() {
    return (
        <Container>
            <Header title={"Lightning Network: инструкция по использованию"} meta={LnWalletsMeta}>
                Lightning Network – современный способ транзакций в сети биткойн, который избавляет от главных
                недостатков переводов
                через блокчейн. Он быстрый, анонимный и имеет копеечные комиссии. Но как им пользоваться?
                <Nl/>
                В этой инструкции Transbithub.com расскажет, как начать работать с Lightning Network, создать кошелек,
                открыть канал,
                перевести средства и создать входящую ликвидность для приема BTC на примере наиболее популярных
                кошельков – Electrum,
                Éclair и Zap. Отметим, что все они поддерживают и обычные переводы через блокчейн.
                <Nl/>
                Заметим, что подключиться вы можете и сразу к Transbithub.com. Это позволит обмениваться BTC с площадкой
                без задержек
                и полностью бесплатно. Для этого используйте наши ноды:
                <Nl/>
                28d646d2100ee49d83e6f2976e3313957e5efecdece0cfbf05f287cabd3693dd5@transbithub.com:9735
                028d646d2100ee49d83e6f2976e3313957e5efecdece0cfbf05f287cab0d3693dd5@7xxwqlikimq3paeu4vpq5zdh5q6kkp32pyetyfp2dcad6axllhwin2ad.onion:9735
                <Nl/>
                Как правильно подключиться к Transbithub.сom мы расскажем в инструкциях ниже.
            </Header>
            <Block title={"Electrum"}>
                Один из самый популярных кошельков для BTC, Electrum, поддерживает Lightning Network. Скачать его для
                любой удобной
                платформы можно с <BlogLink text={"этой страницы"} link={"https://electrum.org/#home"}/>. Для
                примера разберем использование
                Electrum с Lightning Network на версии для ПК.
                <Block2 title={"Создание кошелька и пополнение"}>
                    После установки создайте seed кошелька – вам потребуется записать 12 слов в определенном порядке.
                    <BlogImage src={"/img/blog/lnWallets/screen1.png"}/>
                    А после – ввести их вручную.
                    <BlogImage src={"/img/blog/lnWallets/screen2.png"}/>
                    После этого – придумайте и подтвердите пароль.
                    <BlogImage src={"/img/blog/lnWallets/screen3.png"}/>
                    Перед открытием канала необходимо пополнить кошелек через стандартную транзакцию в блокчейне. Найти
                    адрес для получения
                    средств вы можете на вкладке «Получение» – для этого нажмите кнопку «New Address».
                    <BlogImage src={"/img/blog/lnWallets/screen4.png"}/>
                    Переведите средства по указанному адресу – после подтверждения они окажутся в вашем кошельке.
                    <BlogImage src={"/img/blog/lnWallets/screen5.png"}/>
                </Block2>
                <Block2 title={"Настройки"}>
                    Чтобы повысить анонимность, перед началом работы Lightning Network отключите передачу маршрутизации
                    узлам («Trampouline»).
                    Обычно кошельки сами маршрутизирует путь, однако по умолчанию Electrum передает эту работу ноде,
                    из-за чего весь путь
                    передачи средств становится известен и платеж может быть скомпрометирован.
                    <Nl/>
                    При отключении функции маршрутизация выстраивается самим кошельком, благодаря чему повышается
                    анонимность – никто не
                    знает, куда и от кого ушли BTC.
                    <Nl/>
                    Зайдите в настройки.
                    <BlogImage src={"/img/blog/lnWallets/screen6.png"}/>
                    Перейдите на вкладку «Lightning»
                    <BlogImage src={"/img/blog/lnWallets/screen7.png"}/>
                    И уберите галочку «Use trampoline routing».
                    <BlogImage src={"/img/blog/lnWallets/screen8.png"}/>
                    После этого нажмите кнопку «Закрыть»
                </Block2>
                <Block2 title={"Создание канала"}>
                    Каналы создаются на вкладке «Каналы».
                    <BlogImage src={"/img/blog/lnWallets/screen9.png"}/>
                    Для открытия канала необходимо нажать кнопку «Открыть канал».
                    <BlogImage src={"/img/blog/lnWallets/screen10.png"}/>
                    После этого нажмите кнопку «Yes».
                    <BlogImage src={"/img/blog/lnWallets/screen11.png"}/>
                    Следующий экран позволяет настроить канал. Для подключения вам потребуется выбрать узел. Найти узлы
                    можно на сайте <BlogLink text={"ml1.com"} link={"https://ml1.com"}/>. Например, вы можете выбрать
                    узел из списка «Most Connected Nodes» или же
                    использовать узлы Transbithub.com.
                    <BlogImage src={"/img/blog/lnWallets/screen12.png"}/>
                    Скопируйте ID выбранного узла и вставьте его в строку «Remote Node ID».
                    <BlogImage src={"/img/blog/lnWallets/screen13.png"}/>
                    После чего нажмите кнопку «Suggest».
                    <BlogImage src={"/img/blog/lnWallets/screen14.png"}/>
                    В графе «Amount» укажите объем канала в BTC. Для удобства можете использовать кнопку «Максимум» –
                    она отправит
                    в канал все имеющиеся у вас BTC в кошельке.
                    <br/>
                    После этого вам будет необходимо подтвердить действие – для этого необходимо ввести пароль аккаунта.
                    <BlogImage src={"/img/blog/lnWallets/screen15.png"}/>
                    После этого дождитесь подтверждения в сети BTC. Средства на это время будут заблокированы.
                    <BlogImage src={"/img/blog/lnWallets/screen16.png"}/>
                </Block2>
                <Block2 title={"Отправка средств"}>
                    Чтобы перевести средства, вам достаточно скопировать адрес получателя и вставить его в
                    соответствующую строку на
                    вкладке «Отправка». Electrum автоматически определит адрес как канал в Lightning Network и укажет
                    сумму платежа.
                    <BlogImage src={"/img/blog/lnWallets/screen17.png"}/>
                    Нажмите «Оплатить…» и подтвердите транзакцию. Перевод займет не больше нескольких секунд.
                    <Box fontWeight="fontWeightBold">Комиссия для этой
                        транзакции составила 8 сатоши – примерно 30 копеек.</Box>
                </Block2>
                <Block2 title={"Получение средств"}>
                    После того как вы создали входящую ликвидность, отправив криптовалюту – вы можете принимать средства
                    на свой канал в
                    Lightning Network. Узнать объем входящей ликвидности канала вы можете в свойствах канала на
                    соответствующей вкладке.
                    <BlogImage src={"/img/blog/lnWallets/screen18.png"}/>
                    Объем входящей ликвидности указан в графе «Can receive». В пределах этой суммы вы можете получать
                    средства.
                    <BlogImage src={"/img/blog/lnWallets/screen19.png"}/>
                    Вернитесь на вкладку «Получение». Укажите запрашиваемую сумму в пределах входящей ликвидности и
                    нажмите кнопку «Lightning».
                    <BlogImage src={"/img/blog/lnWallets/screen20.png"}/>
                    Кошелек создаст для вас запрос – в виде адреса и QR-кода. Для получения транзакции достаточно
                    передать адрес или скрин QR-кода отправителю.
                    <BlogImage src={"/img/blog/lnWallets/screen21.png"}/>
                    <BlogImage src={"/img/blog/lnWallets/screen22.png"}/>
                    После того как отправитель подтвердит транзакцию, они почти моментально окажутся в вашем канале.
                    <BlogImage src={"/img/blog/lnWallets/screen23.png"}/>
                </Block2>
                <Block2 title={"Закрытие канала"}>
                    Если вы хотите вернуть средства в обычный биткойн-кошелек – закройте канал. Для этого достаточно кликнуть на нем правой
                    кнопкой мыши и выбрать пункт «Закрыть канал».
                    <BlogImage src={"/img/blog/lnWallets/screen24.png"}/>
                    После закрытия канала средства окажутся на обычном биткойн-счете. Обратите внимание – мы не рекомендуем вам закрывать
                    пустые каналы с большим объемом входящей ликвидности. Их всегда можно использовать для приема средств
                    через Lightning Network.
                </Block2>
            </Block>
            <Block title={"Eclair Wallet"}>
                Еще один популярный кошелек для транзакций через Ligthtning Network – Éclair Wallet. Программа поддерживает
                только Android, а скачать его можно прямо из <BlogLink text={"Google Play"} link={"https://play.google.com/store/apps/details?id=fr.acinq.eclair.wallet.mainnet2&hl=ru&gl=US"}/>.
                <Nl/>
                При запуске кошелек предложит создать вам семя кошелька. Процедура стандартна – вас попросят записать или запомнить
                12 слов, после чего выборочно проверят некоторые из них.
                <Nl/>
                Кошелек Eclair Wallet можно использовать как для транзакций через блокчейн, так и через Lightning. Работа с привычными
                переводами там стандартна – принять криптовалюту можно с помощью обычного адреса. Найти его можно на вкладке «Recieve».
                <BlogImage src={"/img/blog/lnWallets/screen25.png"}/>
                <Block2 title={"Открытие канала"}>
                    Открытие канала в Eclair Wallet осуществляется на вкладке Channels.
                    <BlogImage src={"/img/blog/lnWallets/screen26.png"}/>
                    Нажмите на знак «+» и выберите, через какой узел вы хотите присоединиться к сети.
                    <BlogImage src={"/img/blog/lnWallets/screen27.png"}/>
                    У вас есть несколько вариантов:
                    <ul>
                        <li>ACING node – стандартный узел разработчиков приложения, который работает постоянно.</li>
                        <li>Random node – подключает канал к случайно выбранному узлу. Позволяет до предела повысить анонимность,
                            особенно при периодическом пересоздании каналов.</li>
                        <li>Paste node URI/Scan node URI – позволяет подключиться к выбранному вами узлу. Позволяет работать с сервисами напрямую,
                            без маршрутизации, однако несколько снижает вашу безопасность. Узнать список активных узлов вы можете с помощью сервиса
                            <BlogLink text={"1ml.com"} link={"https://1ml.com"}/> или же использовать узлы Transbithub.com.</li>
                    </ul>
                    После выбора узла вы перейдете к открытию канала.
                    <BlogImage src={"/img/blog/lnWallets/screen28.png"}/>
                    Здесь вы можете указать его объем и задать комиссию для перевода средств в канал. Можно использовать стандартную –
                    BTC окажутся в канале примерно через 20 минут.
                </Block2>
                <Block2 title={"Отправка средств"}>
                    Для отправки средств через Eclair Wallet необходимо перейти на вкладку «Payments» и нажать на знак самолетика в нижнем
                    правом углу.
                    <BlogImage src={"/img/blog/lnWallets/screen29.png"}/>
                    У вас есть два варианта введения адреса отправки – скопировать его из буфера обмена или отсканировать QR-код.
                    <BlogImage src={"/img/blog/lnWallets/screen30.png"}/>
                    После этого нажмите кнопку «Pay». Средства окажутся в канале-получателе через несколько секунд. <Box fontWeight="fontWeightBold">Комиссия за перевод
                    составила всего 4 сатоши – порядка 16 копеек в рублевом эквиваленте.</Box>
                    <BlogImage src={"![](/img/blog/lnWallets/screen31.png)"}/>
                </Block2>
                <Block2 title={"Получение средств"}>
                    После того как у вас появилась входящая ликвидность – вы можете принимать средства. Создать запрос можно на странице «Recive».
                    <BlogImage src={"/img/blog/lnWallets/screen32.png"}/>
                    По указанным реквизитам вы сможете получить не больше средств, чем у вас есть входящей ликвидности. Чтобы запросить
                    точную сумму выберите «Edit Request». Там вы сможете задать описание и сумму.
                    <BlogImage src={"/img/blog/lnWallets/screen33.png"}/>
                    Полученный запрос достаточно переслать отправителю. После того как он подтвердит транзакцию BTC почти сразу окажутся
                    в вашем кошельке.
                </Block2>
                <Block2 title={"Закрытие канала"}>
                    Чтобы закрыть канал перейдите на вкладку «Channels». Выберите нужный канал. Там вы найдете кнопку «Close Channel».
                    <BlogImage src={"/img/blog/lnWallets/screen34.png"}/>
                    И подтвердите действие.
                    <BlogImage src={"/img/blog/lnWallets/screen35.png"}/>
                    Через некоторое время канал закроется и средства вернутся на ваш счет в обычном блокчейне.
                </Block2>
            </Block>
            <Block title={"ZAP Wallet"}>
                Еще один популярный кошелек для Lightning Network – это Zap Wallet. Как и другие кошельки, он может работать и с
                Lightning Network, и с обычным блокчейном, хоть и заточен в первую очередь на использование с Lightning.
                Он доступен для устройств на Android, iOS, Windows, Mac и Linux. Скачать кошелек можно с <BlogLink text={"https://zaphq.io/"} link={"официального сайта"}/>.
                <Nl/>
                Для примера разберем работу с кошельком на платформе Windows.
                <Block2 title={"Создание кошелька и пополнение"}>
                    При первом запуске программа предложит создать вам кошелек.
                    <BlogImage src={"/img/blog/lnWallets/screen36.png"}/>
                    Процедура стандартна – запишите 24 ключевых слова, после чего программа попросит выборочно ввести некоторые из них.
                    <BlogImage src={"/img/blog/lnWallets/screen37.png"}/>
                    После этого введите пароль и дайте кошельку имя.
                    <Nl/>
                    После этого Zap предложит настроить сохранение бэкапов ваших каналов. Можете указать папку на компьютере
                    (пункт «Local»), подключить Google Drive или Dropbox. Чтобы пропустить этот этап нажмите кнопку «Skip».
                    <BlogImage src={"/img/blog/lnWallets/screen38.png"}/>
                    После настройки бэкапов дождитесь синхронизации кошелька с блокчейном BTC.  Она занимает 5-10 минут.
                    Чтобы пополнить баланс обычным переводом, нажмите на кнопку QR-кода в правом верхнем углу.
                    <BlogImage src={"/img/blog/lnWallets/screen39.png"}/>
                    Используйте QR-код или обычный адрес, отображенный ниже.
                    <BlogImage src={"/img/blog/lnWallets/screen40.png"}/>
                </Block2>
                <Block2 title={"Открытие канала"}>
                    Чтобы открыть канал нажмите на пункт «Каналы» в правом верхнем углу.
                    <BlogImage src={"/img/blog/lnWallets/screen41.png"}/>
                    В выпадающем меню выберите пункт «Создать».
                    <BlogImage src={"/img/blog/lnWallets/screen42.png"}/>
                    При открытии канала вы можете выбрать узел, к которому подключаетесь. Zap сразу предложит несколько популярных нод,
                    однако вы можете найти подходящую с помощью строки поиска или использовать узлы Transbithub.com.
                    <BlogImage src={"/img/blog/lnWallets/screen43.png"}/>
                    После этого введите сумму, которую хотите передать в канал и укажите комиссию.
                    <BlogImage src={"/img/blog/lnWallets/screen44.png"}/>
                    От объема комиссии зависит время открытия канала. Примерное время указано под размером комиссии.
                </Block2>
                <Block2 title={"Оплата"}>
                    Оплата производится с помощью кнопки «Оплатить».
                    <BlogImage src={"/img/blog/lnWallets/screen45.png"}/>
                    При вставке адреса кошелек сам определит использование Lightning.
                    <BlogImage src={"/img/blog/lnWallets/screen46.png"}/>
                    После этого выберите канал, с которого будете переводить средства и подтвердите перевод.
                </Block2>
                <Block2 title={"Получение средств"}>
                    Получить средства с помощью кнопки «Запрос».
                    <BlogImage src={"/img/blog/lnWallets/screen47.png"}/>
                    При создании «Запроса» Zap автоматически делает реквест в Lightning Network. При запросе необходимо указать сумму,
                    не превышающий ваш объем входящей ликвидности.
                    <BlogImage src={"/img/blog/lnWallets/screen48.png"}/>
                    После этого нажмите кнопку «Запрос платежа» внизу страницы и передайте полученный QR-код или адрес отправителю.
                </Block2>
                <Block2 title={"Закрытие канала"}>
                    Для закрытия канала перейдите во вкладку «Manage».
                    <BlogImage src={"/img/blog/lnWallets/screen49.png"}/>
                    Там выберите нужный канал, зайдите в настройки и выберите пункт «Close Channel». Учтите, что если у вас на канале
                    имеется большое количество входящей ликвидности – лучше не закрывать его, чтобы использовать для приема средств
                    в удобный момент.
                </Block2>
            </Block>
            <Block title={"А какие еще есть кошельки?"}>
                Поскольку Lightning Network набирает все большую популярность, количество кошельков тоже увеличивается.
                Кроме Electrum, Eclair и Zap существуют:
                <ul>
                    <li><BlogLink text={"Wallet of Satoshi"} link={"https://www.walletofsatoshi.com/"}/></li>
                    <li><BlogLink text={"Breez"} link={"https://breez.technology/"}/></li>
                    <li><BlogLink text={"Bitcoin Lightning Wallet"} link={"https://lightning-wallet.com/"}/></li>
                    <li><BlogLink text={"Peach Wallet"} link={"https://lightningpeach.com/peach-wallet"}/></li>
                    <li>и другие</li>
                </ul>
                У них схож функционал, а потому выбор кошелька по большей части является делом вкуса – каждый из них даст вам
                подключение к самому современному способу передачи BTC.
                <Nl/>
                Подключайтесь к Transbithub.com через ваши Lightning-кошельки и заходите на площадку – используйте все возможности
                нашего сервиса уже прямо сейчас!
            </Block>
        </Container>
    )
}