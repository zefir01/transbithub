using System.Collections.Generic;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Protos.TradeApi.V1;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult= System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class SendFeedback : BaseMenu
    {
        public class State : StateBase
        {
            public string Text { get; set; }
            public bool IsPositive { get; set; }
        }

        private string text = "";
        private bool isPositive;
        private ulong? dealId;
        private ulong? paymentId;
        private Localization.SendFeedback s;

        public SendFeedback(BaseMenu parent) : base(parent)
        {
            s = new Localization.SendFeedback(Menu);
        }

        public override bool HideNavigation => true;

        public override string Name => s.Get(Localization.SendFeedback.Keys.Title);
        //public override string Header => s.Get(Localization.SendFeedback.Keys.Header);

        protected override AsyncResult Content()
        {
            var arr = new List<InlineKeyboardButton>
            {
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.SendFeedback.Keys.Positive), "cmd pos"),
                InlineKeyboardButton.WithCallbackData(s.Get(Localization.SendFeedback.Keys.Negative), "cmd neg")
            };
            return Task.FromResult(new List<Result>
            {
                new Result(this, text.IsNullOrEmpty() ? s.Get(Localization.SendFeedback.Keys.Header) : text,
                    arr.ToKeyboard())
            });
        }

        public void SetDealId(ulong? dealId)
        {
            paymentId = null;
            this.dealId = dealId;
        }

        public void SetPaymentId(ulong? paymentId)
        {
            this.paymentId = paymentId;
            dealId = null;
        }

        protected override async AsyncResult OnCommand(string command)
        {
            List<Result> result;
            result = await IsBack(command);
            if (result!=null)
                return result;

            result = await IsHome(command);
            if (result!=null)
                return result;
            
            var arr = command.Split(" ");
            if (arr[0] != "cmd")
                return await PrintError();
            if (arr[1] == "pos")
            {
                isPositive = true;
                await Send();
                return await Parent.Print();
            }

            if (arr[1] == "neg")
            {
                isPositive = false;
                await Send();
                return await Parent.Print();
            }

            return await PrintError();
        }

        public override async AsyncResult NewMessage(Message message)
        {
            if (message.Type != MessageType.Text)
                return await PrintError();
            text = message.Text;
            return await Print();
        }

        private async Task Send()
        {
            if (dealId.HasValue)
            {
                await Clients.TradeClient.SendFeedbackAsync(new SendFeedbackRequest
                {
                    DealId = dealId.Value,
                    IsPositive = isPositive,
                    Text = text
                });
                dealId = null;
                text = "";
                return;
            }

            if (paymentId.HasValue)
            {
                await Clients.TradeClient.SendInvoicePaymentFeedbackAsync(new SendInvoicePaymentFeedbackRequest
                {
                    PaymentId = paymentId.Value,
                    Feedback = new Feedback
                    {
                        IsPositive = isPositive,
                        Text = text
                    }
                });
                paymentId = null;
                text = "";
            }
        }

        public override Task<StateBase> GetState()
        {
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                Text = text,
                IsPositive = isPositive
            });
        }

        public override Task SetState(StateBase state)
        {
            var st = (State) state;
            isPositive = st.IsPositive;
            text = st.Text;
            return Task.CompletedTask;
        }

        public override async AsyncResult OnStart()
        {
            text = "";
            return await Print();
        }
    }
}