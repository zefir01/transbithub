using System.Collections.Generic;

// ReSharper disable StringLiteralTypo

namespace TelegramService.Model.Localization
{
    public class Deal : Base<Deal.Keys>
    {
        public enum Keys
        {
            NameSell,
            NameBuy,
            Sell,
            Buy,
            Statement,
            Price,
            PaymentType,
            Seller,
            Buyer,
            Limits,
            Location,
            Window,
            Positive,
            Terms,
            Amount,
            Status,
            FiatSent,
            DealOpened,
            DealCompleted,
            DealCanceled,
            DealDisputed,
            DealWaitDeposit,
            Info,
            Chat,
            You,
            Yes,
            No,
            ErrorCompleted,
            ErrorCanceled,
            IPayed,
            SentCrypto,
            CancelDeal,
            DisputeDeal,
            Feedback,
            Loading,
            Name,
            Arbitor,
            Wait,
        }

        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.NameSell] = "Продажа",
                    [Keys.NameBuy] = "Покупка",
                    [Keys.Sell] = "Продать",
                    [Keys.Buy] = "Купить",
                    [Keys.Statement] = "{0} <b>BTC</b>, используя <b>{1}</b>: <b>{2}</b>, в валюте <b>{3}</b>\n",
                    [Keys.Price] = "Цена:",
                    [Keys.PaymentType] = "Способ оплаты:",
                    [Keys.Seller] = "Продавец:",
                    [Keys.Buyer] = "Покупатель:",
                    [Keys.Limits] = "Ограничения:",
                    [Keys.Location] = "Местоположение:",
                    [Keys.Window] = "Окно оплаты:",
                    [Keys.Positive] = "Положительных отзывов:",
                    [Keys.Terms] = "Условия сделки:",
                    [Keys.Amount] = "Сумма:",
                    [Keys.Status] = "Статус сделки:",
                    [Keys.FiatSent] = "Фиат отправлен:",
                    [Keys.DealOpened] = "Открыта",
                    [Keys.DealCompleted] = "Завершена",
                    [Keys.DealCanceled] = "Отменена",
                    [Keys.DealDisputed] = "Диспут",
                    [Keys.Info] = "Договоритесь с партнером о сделке. Ваши сообщения будут отправлены партнеру.",
                    [Keys.Chat] = "Чат:",
                    [Keys.You] = "Вы",
                    [Keys.Yes] = "Да",
                    [Keys.No] = "Нет",
                    [Keys.ErrorCompleted] = "Сделка завершена. Ваши сообщения не будут доставлены партнеру.",
                    [Keys.ErrorCanceled] = "Сделка отменена. Ваши сообщения не будут доставлены партнеру.",
                    [Keys.IPayed] = "Я заплатил",
                    [Keys.SentCrypto] = "Отправить криптовалюту",
                    [Keys.CancelDeal] = "Отменить сделку",
                    [Keys.DisputeDeal] = "Создать диспут",
                    [Keys.Feedback] = "Оставить отзыв",
                    [Keys.Loading] = "<b>{0}:</b>\n<code>Изображение загружается на сервер. Пожалуйста ждите.</code>",
                    [Keys.Name] = "Сделка: {0}",
                    [Keys.Arbitor] = "<code>Арбитр</code>",
                    [Keys.DealWaitDeposit] = "Ожидает внесения средств",
                    [Keys.Wait] =
                        "В течении {0} партнер внесет средства или сделка будет отменена автоматичесски. Ожидайте."
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.NameSell] = "Selling",
                    [Keys.NameBuy] = "Buying",
                    [Keys.Sell] = "Sell",
                    [Keys.Buy] = "Buy",
                    [Keys.Statement] = "{0} <b>BTC</b>, use <b>{1}</b>: <b>{2}</b>, in currency <b>{3}</b>\n",
                    [Keys.Price] = "Price:",
                    [Keys.PaymentType] = "Payment type:",
                    [Keys.Seller] = "Seller:",
                    [Keys.Buyer] = "Buyer:",
                    [Keys.Limits] = "Limits:",
                    [Keys.Location] = "Location:",
                    [Keys.Window] = "Payment window:",
                    [Keys.Positive] = "Positive feedback:",
                    [Keys.Terms] = "Terms of the deal:",
                    [Keys.Amount] = "Amount:",
                    [Keys.Status] = "Deal status:",
                    [Keys.FiatSent] = "Is fiat sent:",
                    [Keys.DealOpened] = "Opened",
                    [Keys.DealCompleted] = "Completed",
                    [Keys.DealCanceled] = "Canceled",
                    [Keys.DealDisputed] = "Disputed",
                    [Keys.Info] = "Arrange a deal with a partner. Your messages will be sent to the partner.",
                    [Keys.Chat] = "Chat:",
                    [Keys.You] = "You",
                    [Keys.Yes] = "Yes",
                    [Keys.No] = "No",
                    [Keys.ErrorCompleted] =
                        "The deal is completed. Your messages will not be delivered to the partner.",
                    [Keys.ErrorCanceled] = "The deal is canceled. Your messages will not be delivered to the partner.",
                    [Keys.IPayed] = "I have paid",
                    [Keys.SentCrypto] = "Send cryptocurrency",
                    [Keys.CancelDeal] = "Cancel deal",
                    [Keys.DisputeDeal] = "Create dipute",
                    [Keys.Feedback] = "Give feedback",
                    [Keys.Loading] = "<b>{0}:</b>\n<code>The image is uploaded to the server. Please, wait.</code>",
                    [Keys.Name] = "Deal: {0}",
                    [Keys.Arbitor] = "<code>Arbitor</code>",
                    [Keys.DealWaitDeposit] = "Wait deposit",
                    [Keys.Wait] =
                        "Within {0} the partner will deposit funds or the deal will be canceled automatically. Waite please."
                }
            };
            return data;
        }

        public Deal(IMenu menu) : base(menu)
        {
        }
    }
}