using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Grpc.Core;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class ConversationChat : BaseMenu
    {
        public class State : StateBase
        {
            public ulong? InvoiceId { get; set; }
            public ulong? PaymentId { get; set; }
        }

        private ulong? _invoiceId;
        private ulong? _paymentId;

        public ulong? InvoiceId
        {
            get => _invoiceId;
            set
            {
                if (value.HasValue)
                {
                    _paymentId = null;
                }

                invoice = null;
                _invoiceId = value;
            }
        }

        private Invoice invoice;

        public ulong? PaymentId
        {
            get => _paymentId;
            set
            {
                if (value.HasValue)
                {
                    invoice = null;
                    _invoiceId = null;
                }

                _paymentId = value;
            }
        }

        private Conversation conversation;
        private Localization.ConversationChat s;

        public ConversationChat(BaseMenu parent, bool hide = true) :
            base(parent)
        {
            s = new Localization.ConversationChat(Menu);
            HideNavigation = hide;
        }

        public override string Name => s.Get(Localization.ConversationChat.Keys.Name);
        public override string Header => s.Get(Localization.ConversationChat.Keys.Header);
        public override bool HideNavigation { get; }

        private async Task GetConversation()
        {
            GetConversationsByIdRequest req = null;
            if (InvoiceId.HasValue)
            {
                var resp = await Clients.TradeClient.GetInvoiceByIdAsync(new GetInvoiceByIdRequest
                {
                    InvoiceId = InvoiceId.Value
                });
                invoice = resp.Invoices[0];
                req = new GetConversationsByIdRequest
                {
                    InvoiceId = InvoiceId.Value,
                };
            }
            else if (PaymentId.HasValue)
            {
                req = new GetConversationsByIdRequest
                {
                    PaymentId = PaymentId.Value
                };
            }

            if (req == null)
                return;
            try
            {
                var c = await Clients.TradeClient.GetConversationsByIdAsync(req);
                conversation = c.Conversations.FirstOrDefault(p => p.Buyer.Id == Menu.UserId);
            }
            catch (RpcException)
            {
            }
        }

        protected override AsyncResult Content()
        {
            if (conversation == null)
                return Task.FromResult(new List<Result>());
            var messages = conversation.Messages.OrderBy(p => p.Id).ToList();
            var res = new List<Result>
            {
                new Result(this,
                    $"<b>{s.Get(Localization.ConversationChat.Keys.Chat)}</b>\n",
                    InlineKeyboardMarkup.Empty())
            };
            foreach (var message in messages.OrderBy(p => p.Id))
            {
                var owner = conversation.Buyer.Id == message.OwnerId ? conversation.Buyer : conversation.Seller;
                string userName = message.OwnerId == Menu.UserId
                    ? s.Get(Localization.ConversationChat.Keys.You)
                    : owner.Username;

                if (message.Images.Any())
                {
                    foreach (var image in message.Images)
                    {
                        string text = $"<b>{userName}:</b>";
                        var photo = new Photo(Guid.Parse(image));
                        res.Add(new Result(this, text, InlineKeyboardMarkup.Empty(), photo));
                    }
                }
                else
                {
                    string msg = $"<b>{userName}:</b>\n" +
                                 $"{Regex.Replace(message.Text, "<.*?>", string.Empty) ?? ""}\n";
                    res.Add(new Result(this, msg, InlineKeyboardMarkup.Empty()));
                }
            }

            res.Last().Keyboard = BackBtn.BackHome(this).ToKeyboard();
            return Task.FromResult(res);
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text && message.Type != MessageType.Photo &&
                message.Type != MessageType.Document)
                return await PrintError();

            var imgId = await Menu.ImageLoader.PhotoIn(message);

            if (InvoiceId.HasValue)
            {
                var req = new SendInvoiceMessageRequest
                {
                    InvoiceId = InvoiceId.Value,
                    Text = message.Text ?? ""
                };
                if (imgId.HasValue)
                    req.ImageIds.Add(imgId.Value.ToString());
                conversation = await Clients.TradeClient.SendInvoiceMessageAsync(req);
                return await Print();
            }

            if (PaymentId.HasValue)
            {
                var req = new SendInvoicePaymentMessageRequest
                {
                    PaymentId = PaymentId.Value,
                    Text = message.Text ?? ""
                };
                if (imgId.HasValue)
                    req.ImageIds.Add(imgId.Value.ToString());
                conversation = await Clients.TradeClient.SendInvoicePaymentMessageAsync(req);
                return await Print();
            }

            return await PrintError();
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                InvoiceId = InvoiceId,
                PaymentId = PaymentId,
            });
        }

        public override async Task SetState(StateBase state)
        {
            var st = (State) state;
            InvoiceId = st.InvoiceId;
            PaymentId = st.PaymentId;
            await GetConversation();
        }

        public override async AsyncResult OnStart()
        {
            await GetConversation();
            if (conversation != null)
            {
                var events = Events.Where(p =>
                    p.ConversationNewMessage != null && p.ConversationNewMessage.Id == conversation.Id).ToList();
                await MarkEventAsRead(events);
            }

            return await Print();
        }

        protected override async Task<bool> OnEvent(Event evt)
        {
            if (conversation == null)
                return false;
            if (evt.ConversationNewMessage != null && evt.ConversationNewMessage.Id == conversation.Id)
                conversation = evt.ConversationNewMessage;
            if (CurrentItem == this)
                await MarkEventAsRead(evt);
            return true;
        }

        protected override Task<bool> OnImageLoaded(Guid id)
        {
            var images = conversation.Messages.SelectMany(p => p.Images);
            return Task.FromResult(images.Contains(id.ToString()));
        }
    }
}