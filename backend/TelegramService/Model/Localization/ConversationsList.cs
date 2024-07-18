using System.Collections.Generic;

namespace TelegramService.Model.Localization
{
    public class ConversationsList: TelegramService.Model.Localization.Base<ConversationsList.Keys>
    {
        public enum Keys
        {
            Messages,
            MessagesNew,
            Header,
            Rate,
            Amount,
            NewMessage,
            Partner,
            Invoice,
            Comment,
            Payment,
            NoMessages,
            Go,
            Delete,
            
        }
        protected override Dictionary<Langs, Dictionary<Keys, string>> Init()
        {
            var data = new Dictionary<Langs, Dictionary<Keys, string>>
            {
                [Langs.RU] = new Dictionary<Keys, string>
                {
                    [Keys.Messages] = "Сообщения",
                    [Keys.MessagesNew]="Сообщения Новых:{0}",
                    [Keys.Header]="Ваши переписки по счетам и платежам:",
                    [Keys.Rate]="Рейтинг:",
                    [Keys.Amount]="<b>Сумма:</b> {0} {1}\n",
                    [Keys.NewMessage]="<code>Новое сообщение</code>\n",
                    [Keys.Partner]="<b>Партнер:</b> {0}\n",
                    [Keys.Invoice]="<b>Счет:</b> {0} {1}\n",
                    [Keys.Comment]="<b>Комментарий:</b> {0}\n",
                    [Keys.Payment]="<b>Платеж:</b> {0} {1}\n",
                    [Keys.NoMessages]="Нет сообщений.",
                    [Keys.Go]="Перейти",
                    [Keys.Delete]="Удалить"
                },
                [Langs.EN] = new Dictionary<Keys, string>
                {
                    [Keys.Messages] = "Messages",
                    [Keys.MessagesNew]="Messages New:{0}",
                    [Keys.Header]="Your conversations on invoices and payments:",
                    [Keys.Rate]="Rate:",
                    [Keys.Amount]="<b>Amount:</b> {0} {1}\n",
                    [Keys.NewMessage]="<code>New message</code>\n",
                    [Keys.Partner]="<b>Partner:</b> {0}\n",
                    [Keys.Invoice]="<b>Invoice:</b> {0} {1}\n",
                    [Keys.Comment]="<b>Comment:</b> {0}\n",
                    [Keys.Payment]="<b>Payment:</b> {0} {1}\n",
                    [Keys.NoMessages]="No messages.",
                    [Keys.Go]="Go to",
                    [Keys.Delete]="Delete"
                }
            };
            return data;
        }

        public ConversationsList(IMenu menu) : base(menu)
        {
        }
    }
}