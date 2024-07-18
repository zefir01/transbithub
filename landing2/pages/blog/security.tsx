import {Container} from "@material-ui/core";
import {Header} from "../../components/blog/header";
import {Block} from "../../components/blog/Block";
import {Nl} from "../../components/blog/nl";

export const SecurityMeta = {
    title: "Безопасность",
    description: "Безопасность",
    image: "security/title-1024x503.png",
    preview: `Статья о безопасном и анонимном использовании сервиса.`,
    slug: "/blog/security"
}

export default function Security(){
    return(
        <Container>
            <Header title={"Безопасность"} meta={SecurityMeta}/>
            <Block title={"Самое важное — глубоко в даркнете"}>
                То, что вы видите, заходя на transbithub.com — лишь публичное зеркало. Сам сервер находится в сети TOR и связан с
                публичной оболочкой через TOR-соединение. Таким образом, даже если наше зеркало захватят, то никаких данных из него
                получить не выйдет — они не хранятся там, а получаются от основного сервера при обращении пользователя.
                <Nl/>
                При этом блокировка или закрытие зеркала не поставит площадку под угрозу — мы в кратчайший срок создадим новое, вновь
                дав доступ пользователям к возможностям Transbithub.
                <Nl/>
                Само же ядро находится на секретном сервере, и узнать его местоположение невозможно из-за использования TOR для
                подключения к Сети. Ограничить доступ к сервису можно только полностью уничтожив TOR, что невозможно
                в силу его децентрализованности и огромного количества пользователей.
            </Block>
            <Block title={"А что вообще хранится на сервере?"}>
                Transbithub ставит на одно из первых мест анонимность пользователей. Мы не собираем лишней информации о вас и
                ваших устройствах — на сервере находится лишь данные, связанные с вашим аккаунтом, его балансом и операциями.
                <Nl/>
                Мы не передаем данные третьим лицам и храним их в зашифрованном виде — даже получив физический доступ к серверу,
                без ключа расшифровать данные не выйдет.
            </Block>
            <Block title={"Как обезопасить себя при работе с площадкой?"}>
                Если вы хотите добиться полной анонимности — рекомендуем использовать подключение через TOR. Оно сделает невидимым
                взаимодействие с площадкой для вашего провайдера и иных наблюдателей. Кроме того, вы можете запутывать свои транзакции
                и действия, выполняя их с нескольких аккаунтов и различных адресов — даже имея на руках все данные, составить
                осмысленную картину действий не выйдет.
                <Nl/>
                Для анонимного перевода средств вы также можете использовать наши Промисы. Площадка не оставляет никаких записей о
                создателе Промиса, а обналичить их можно на любом аккаунте или у наших партнеров. Такой способ оставит вас анонимным
                и позволит перевести средства в любом удобном направлении.
            </Block>
            <Block title={"Безопасные переводы через Lightning Network"}>
                Уже давно не секрет, что стандартные переводы через блокчейн можно отследить. Причина кроется в самой природе блокчейна,
                в структуре которого записывается каждая проводимая транзакция. Зная владельца определенного счета, можно полностью
                скомпрометировать его переводы.
                <Nl/>
                Кроме того, сервисы для отслеживания появляются и у властей — сравнительно недавно Росфинмониторинг совместно с
                Минцифры создали сервис «Прозрачный блокчейн», который позволяет властям отслеживать транзакции.
                <Nl/>
                Lightning Network является современной альтернативой обычным переводам BTC. Ее комиссии минимальны даже
                (около 0.01-0.1%, но не более 0.5%), а сами переводы моментальны. Кроме того, еще никому не удавалось отследить
                транзакции Lightning Network — это делает ввод и вывод средств с площадки полностью анонимным. Еще больше о самом
                современном способе перевода биткойна вы можете узнать из этой статьи.
                <Nl/>
                Заходите на Transbithub через TOR или с помощью Telegram бота и начинайте пользоваться функциями одного из
                самых защищенных сервисов прямо сейчас!
            </Block>
        </Container>
    )
}