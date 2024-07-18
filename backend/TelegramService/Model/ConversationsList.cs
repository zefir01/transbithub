using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using IdentityServer4.Extensions;
using Protos.TradeApi.V1;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class ConversationsList : BaseMenu
    {
        private Protos.TradeApi.V1.Variables vars;
        private List<Protos.TradeApi.V1.Conversation> conversations;
        private readonly ConversationChat chat;
        private Localization.ConversationsList s;

        public ConversationsList(BaseMenu parent) : base(parent)
        {
            s = new Localization.ConversationsList(Menu);
            chat = new ConversationChat(this);
        }

        public override string Name
        {
            get
            {
                var n = Events.Count(p => p.ConversationNewMessage != null);
                if (n == 0)
                    return s.Get(Localization.ConversationsList.Keys.Messages);
                return s.Get(Localization.ConversationsList.Keys.MessagesNew, n.ToString());
            }
        }

        public override string Header => s.Get(Localization.ConversationsList.Keys.Header);

        private string GetUser(Protos.TradeApi.V1.UserInfo user)
        {
            return
                $"{user.Username} {s.Get(Localization.ConversationsList.Keys.Rate)} {user.ResponseRate.FromPb()}%";
        }

        private async Task GetVars()
        {
            vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
        }

        private async Task GetConversations()
        {
            var resp = await Clients.TradeClient.GetConversationsAsync(new Empty());
            conversations = resp.Conversations.ToList();
        }

        private string GetPrice(Protos.TradeApi.V1.Invoice invoice)
        {
            var info = new InvoiceInfo(invoice, Currency, vars);
            if (invoice.IsPrivate)
                return
                    s.Get(Localization.ConversationsList.Keys.Amount,
                        info.PiecePriceFiat.ToString(CultureInfo.InvariantCulture), Currency.ToString());
            return
                s.Get(Localization.ConversationsList.Keys.Amount,
                    info.PiecePriceFiat.ToString(CultureInfo.InvariantCulture), Currency.ToString());
        }

        private string GetPrice(Protos.TradeApi.V1.InvoicePayment payment)
        {
            if (payment.Deal != null)
                return
                    s.Get(Localization.ConversationsList.Keys.Amount,
                        payment.Deal.FiatAmount.FromPb().ToString(CultureInfo.InvariantCulture),
                        payment.Invoice.FiatCurrency.ToString());
            var v = vars.Variables_.First(p => p.Key == "AVG_" + Currency).Value.FromPb();
            return
                s.Get(Localization.ConversationsList.Keys.Amount,
                    Math.Round(payment.CryptoAmount.FromPb() * v, 2).ToString(CultureInfo.InvariantCulture),
                    Currency.ToString());
        }

        private string IsNew(ulong id)
        {
            var events = Events.Where(p => p.ConversationNewMessage!=null && p.ConversationNewMessage.Id == id)
                .ToList();
            if (events.Any())
                return s.Get(Localization.ConversationsList.Keys.NewMessage);
            return "";
        }

        private string GetInfo(Protos.TradeApi.V1.Conversation conversation)
        {
            var partner = conversation.Seller.Id == Menu.UserId ? conversation.Buyer : conversation.Seller;
            string res = IsNew(conversation.Id) +
                         s.Get(Localization.ConversationsList.Keys.Partner, GetUser(partner));
            if (conversation.Invoice != null)
            {
                res += s.Get(Localization.ConversationsList.Keys.Invoice, conversation.Invoice.Id.ToString(),
                    GetPrice(conversation.Invoice));
                if (!conversation.Invoice.Comment.IsNullOrEmpty())
                    res += s.Get(Localization.ConversationsList.Keys.Comment, conversation.Invoice.Comment);
                return res;
            }

            if (conversation.Payment != null)
            {
                res += s.Get(Localization.ConversationsList.Keys.Payment, conversation.Payment.Id.ToString(),
                    GetPrice(conversation.Payment));
                if (!conversation.Payment.Invoice.Comment.IsNullOrEmpty())
                    res += s.Get(Localization.ConversationsList.Keys.Comment, conversation.Payment.Invoice.Comment);
                return res;
            }

            return res;
        }

        protected override AsyncResult Content()
        {
            if (conversations == null || !conversations.Any())
                return Task.FromResult(new List<Result>
                {
                    new Result(this, s.Get(Localization.ConversationsList.Keys.NoMessages),
                        InlineKeyboardMarkup.Empty())
                });
            var ordered = conversations.Select(p => new {conv = p, lm = p.Messages.Select(m => m.Id).Max()})
                .OrderBy(p => p.lm)
                .Select(p => p.conv).ToList();
            var res = new List<Result>();
            for (int i = 0; i < ordered.Count; i++)
            {
                var info = GetInfo(ordered[i]);
                var arr = new List<InlineKeyboardButton>
                {
                    InlineKeyboardButton.WithCallbackData(s.Get(Localization.ConversationsList.Keys.Go),
                        "cmd conv " + ordered[i].Id),
                    InlineKeyboardButton.WithCallbackData(s.Get(Localization.ConversationsList.Keys.Delete),
                        "cmd delete " + ordered[i].Id)
                };
                var arr1 = new List<List<InlineKeyboardButton>>();
                arr1.Add(arr);
                if (i == ordered.Count - 1)
                    arr1.Add(BackBtn.BackHome(this));
                res.Add(new Result(this, info, arr1.ToKeyboard()));
            }

            return Task.FromResult(res);
        }

        public override async AsyncResult OnStart()
        {
            await GetVars();
            await GetConversations();
            return await Print();
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result != null)
                return result;

            result = await IsHome(command);
            if (result != null)
                return result;

            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await PrintError();

            var conv = conversations.First(p => p.Id == decimal.Parse(arr[2]));
            switch (arr[1])
            {
                case "conv":
                {
                    if (conv.Invoice != null)
                        chat.InvoiceId = conv.Invoice.Id;
                    else
                        chat.PaymentId = conv.Payment.Id;
                    return await chat.Print();
                }
                case "delete":
                {
                    await Clients.TradeClient.DeleteConversationAsync(new DeleteConversationRequest
                    {
                        ConversationId = conv.Id
                    });
                    conversations.Remove(conv);
                    return await Print();
                }
            }

            return await PrintError();
        }

        protected override async Task<bool> OnEvent(Event evt)
        {
            if (evt.ConversationNewMessage==null)
                return false;
            if (conversations == null)
            {
                await GetVars();
                await GetConversations();
            }

            var old = conversations.FirstOrDefault(p => p.Id == evt.ConversationNewMessage.Id);
            if (old != null)
                conversations.Remove(old);
            conversations.Add(evt.ConversationNewMessage);
            return true;
        }
    }
}