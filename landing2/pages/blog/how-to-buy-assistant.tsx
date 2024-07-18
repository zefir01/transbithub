import {Header} from "../../components/blog/header";
import {Block} from "../../components/blog/Block";
import {Container} from "@material-ui/core";
import {BlogImage} from "../../components/blog/BlogImage";

export const HowToBuyAssistantMeta = {
    title: "Купить биткоин, использовать промис или оплатить счет - легко на Transbithub.com",
    description: "На Transbithub.com легко купить биткоин или оплатить счет, благодаря Помощнику. Не тратьте время на подробности, совершайте операции без лишних движений. ",
    image: "HowToBuyAssistant/buyAssistant-1024x503.png",
    preview: `Если вы не имеете опыта покупки биткоинов на P2P биржах, то вам стоит прочитать эту статью.`,
    slug: "/blog/how-to-buy-assistant"
}

export default function HowToBuyAssistant() {
    return (
        <Container>
            <Header title={"Простейший способ купить Биткоин через Помощник"}
                    image={"/img/blog/HowToBuyAssistant/buyAssistant-1024x503.png"} meta={HowToBuyAssistantMeta}/>
            <Block title={"Начало покупки"}>
                Чтобы начать работу с Помощником, вам достаточно выбрать соответствующую строку в меню TransBitHub.
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen1.png"}/>
            </Block>
            <Block title={"Шаг 1. Выберите пункт «Купить биткоины»."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen2.png"}/>
            </Block>
            <Block title={"Шаг 2. Выберите страну, валюту и способ перевода. Если вы живете в России – оставьте все по умолчанию. Мы советуем пользоваться QIwi как наиболее быстрой и простой системой оплаты, но вы можете выбрать подходящую из выпадающего списка."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen3.png"}/>
            </Block>
            <Block title={"После нажмите «Все верно»."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen4.png"}/>
            </Block>
            <Block title={"Укажите, сколько рублей вы хотите обменять или сколько BTC вы хотите приобрести."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen5.png"}/>
            </Block>
            <Block title={"Шаг 3. На следующем экране выберите направление зачисления BTC. Для простоты оставьте криптовалюту на площадке –\n" +
            "оттуда вы сможете вывести ее куда угодно."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen6.png"}/>
            </Block>
            <Block title={"Шаг 4. Площадка автоматически подберет для вас продавца."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen7.png"}/>
            </Block>
            <Block title={"Если вас все устраивает, выберите пункт «Мне подходят эти условия»."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen8.png"}/>
            </Block>
            <Block title={"Шаг 5. В чате продавец сообщит вам счет для перевода средств."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen9.png"}/>
            </Block>
            <Block title={"Переведите деньги на указанный счет и нажмите кнопку «Я оплатил RUB»."}>
                <BlogImage src={"/img/blog/HowToBuyAssistant/screen10.png"}/>
            </Block>
            <Block title={"После этого продавец подтвердит оплату и переведет вам биткойны на счет. Полученные BTC вы можете отложить, перевести другому пользователю площадки или вывести на внешний биткойн-кошелек."}/>
        </Container>
    )
}