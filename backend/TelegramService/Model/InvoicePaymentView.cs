using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Services;
using Google.Protobuf.WellKnownTypes;
using Protos.TradeApi.V1;
using QRCoder;
using Shared.Protos;
using Telegram.Bot.Types.ReplyMarkups;
using AsyncResult = System.Threading.Tasks.Task<System.Collections.Generic.List<TelegramService.Model.Result>>;

namespace TelegramService.Model
{
    public class InvoicePaymentView : BaseMenu
    {
        public class State : StateBase
        {
            public ulong PaymentId { get; set; }
        }

        private Localization.InvoicePaymentView s;
        private readonly SendFeedback feedback;
        private readonly ConversationChat conversationChat;
        private Variables vars;

        public InvoicePaymentView(BaseMenu parent) : base(parent)
        {
            s = new Localization.InvoicePaymentView(Menu);
            feedback = new SendFeedback(this);
            conversationChat = new ConversationChat(this);
        }

        public override string Name => s.Get(Localization.InvoicePaymentView.Keys.Name);
        public InvoicePayment Payment { get; set; }

        public override bool HideNavigation => true;

        private async Task GetPayment(ulong id)
        {
            var resp = await Clients.TradeClient.GetInvoicePaymentsAsync(new GetInvoicePaymentsRequest
            {
                Count = 1,
                IsToMe = false,
                IsToMeHasValue = false,
                LastId = default,
                PaymentId = id
            });
            Payment = resp.Payments[0];
        }

        public override async AsyncResult OnStart()
        {
            await GetPayment(Payment.Id);
            await GetVars();
            return await Print();
        }

        public override Task<StateBase> GetState()
        {
            if (Payment == null)
                return Task.FromResult<StateBase>(new State
                {
                    Id = Id,
                    PaymentId = 0
                });
            return Task.FromResult<StateBase>(new State
            {
                Id = Id,
                PaymentId = Payment.Id
            });
        }

        public override async Task SetState(StateBase state)
        {
            var st = (State) state;
            await GetVars();
            if (st.PaymentId != 0)
                try
                {
                    await GetPayment(st.PaymentId);
                }
                catch
                {
                    // ignored
                }
        }

        private async Task GetVars()
        {
            vars = await Clients.TradeClient.GetVariablesAsync(new Empty());
        }

        private static Task<decimal> GetVarPrice(Variables vars, Catalog.Currencies currency)
        {
            return Task.FromResult(vars.Variables_.First(p => p.Key == "AVG_" + currency).Value.FromPb());
        }


        public AsyncResult GetSecretInfo(InvoiceSecret secret, int num)
        {
            List<Result> results = new List<Result>();
            string msg = s.Get(Localization.InvoicePaymentView.Keys.Secret, num.ToString()) +
                         s.Get(Localization.InvoicePaymentView.Keys.SecretText, secret.Text);
            results.Add(new Result(this, msg, InlineKeyboardMarkup.Empty()));
            foreach (var image in secret.Images)
            {
                var res = new Result(this, "", InlineKeyboardMarkup.Empty(), new Photo(Guid.Parse(image)));
                results.Add(res);
            }

            return Task.FromResult(results);
        }

        public static async Task<string> GetPaymentInfo(InvoicePayment payment, Localization.InvoicePaymentView s,
            Variables vars, Catalog.Currencies currency)
        {
            string status = payment.Status switch
            {
                InvoicePayment.Types.InvoicePaymentStatus.Pending =>
                    s.Get(Localization.InvoicePaymentView.Keys.Pending),
                InvoicePayment.Types.InvoicePaymentStatus.Paid => s.Get(Localization.InvoicePaymentView.Keys.Paid),
                InvoicePayment.Types.InvoicePaymentStatus.Canceled => s.Get(Localization.InvoicePaymentView.Keys
                    .Canceled),
                _ => throw new InvalidEnumArgumentException()
            };
            string msg = s.Get(Localization.InvoicePaymentView.Keys.Id, payment.Id.ToString()) +
                         s.Get(Localization.InvoicePaymentView.Keys.InvoiceId, payment.Invoice.Id.ToString()) +
                         s.Get(Localization.InvoicePaymentView.Keys.Status, status);
            if (payment.IsRefund)
            {
                msg += s.Get(Localization.InvoicePaymentView.Keys.Refund, payment.Invoice.Id.ToString(),
                    payment.Invoice.PiecesMax.ToString());
            }

            if (!payment.Invoice.IsPrivate)
                msg += s.Get(Localization.InvoicePaymentView.Keys.Pieces, payment.Pieces.ToString());
            if (payment.Deal != null)
            {
                msg += s.Get(Localization.InvoicePaymentView.Keys.FiatAmount,
                    payment.Deal.FiatAmount.FromPb().ToString(CultureInfo.InvariantCulture),
                    payment.Invoice.FiatCurrency);
                msg += s.Get(Localization.InvoicePaymentView.Keys.BtcPrice,
                    payment.Deal.Advertisement.Price.FromPb().ToString(CultureInfo.InvariantCulture),
                    payment.Invoice.FiatCurrency);
            }
            else
            {
                var v = await GetVarPrice(vars, currency);
                msg += s.Get(Localization.InvoicePaymentView.Keys.FiatAmount,
                    Math.Round(payment.CryptoAmount.FromPb() * v, 2).ToString(CultureInfo.InvariantCulture),
                    currency.ToString());
            }

            msg += s.Get(Localization.InvoicePaymentView.Keys.CryptoAmount,
                payment.CryptoAmount.FromPb().ToString(CultureInfo.InvariantCulture));
            msg += s.Get(Localization.InvoicePaymentView.Keys.CreatedAt,
                payment.CreatedAt.ToDateTime().ToString(CultureInfo.InvariantCulture));
            msg += s.Get(Localization.InvoicePaymentView.Keys.Confirmation, payment.Confirmation);
            return msg;
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

            if (command == "cmd paymentFeedback")
            {
                feedback.SetPaymentId(Payment.Id);
                return await feedback.Print();
            }

            if (command == "cmd dealFeedback")
            {
                feedback.SetDealId(Payment.Deal.Id);
                return await feedback.Print();
            }

            if (command == "cmd contact")
            {
                conversationChat.PaymentId = Payment.Id;
                return await conversationChat.Print();
            }

            if (command == "cmd cancel")
            {
                Payment = await Clients.TradeClient.CancelInvoicePaymentAsync(new CancelInvoicePaymentRequest
                {
                    PaymentId = Payment.Id
                });
                return await Print();
            }

            return await PrintError();
        }

        protected override async AsyncResult Content()
        {
            if (Payment == null)
                return await PrintError(s.Get(Localization.InvoicePaymentView.Keys.NotFound));
            if (vars == null)
                await GetVars();
            var msg = await GetPaymentInfo(Payment, s, vars, Currency);
            List<List<InlineKeyboardButton>> arr = new List<List<InlineKeyboardButton>>();
            if (Payment.Status == InvoicePayment.Types.InvoicePaymentStatus.Pending)
            {
                var cancelBtn =
                    InlineKeyboardButton.WithCallbackData(s.Get(Localization.InvoicePaymentView.Keys.Cancel),
                        "cmd cancel");
                arr.Add(new List<InlineKeyboardButton> {cancelBtn});
            }

            if (Payment.Status == InvoicePayment.Types.InvoicePaymentStatus.Paid && !Payment.IsRefund)
            {
                if (Payment.Owner.Id == Menu.UserId)
                {
                    if (Payment.OwnerFeedback == null)
                        arr.Add(new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(
                                s.Get(Localization.InvoicePaymentView.Keys.PaymentFeedback),
                                "cmd paymentFeedback")
                        });
                }
                else
                {
                    if (Payment.SellerFeedback == null)
                        arr.Add(new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(
                                s.Get(Localization.InvoicePaymentView.Keys.PaymentFeedback),
                                "cmd paymentFeedback")
                        });
                }
            }

            if (Payment.Deal != null)
            {
                if (Payment.Deal.Advertisement.Owner.Id == Menu.UserId)
                {
                    if (Payment.Deal.AdOwnerFeedbackIsnull)
                        arr.Add(new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(
                                s.Get(Localization.InvoicePaymentView.Keys.DealFeedback),
                                "cmd dealFeedback")
                        });
                }
                else
                {
                    if (Payment.Deal.InitiatorFeedbackIsNull)
                        arr.Add(new List<InlineKeyboardButton>
                        {
                            InlineKeyboardButton.WithCallbackData(
                                s.Get(Localization.InvoicePaymentView.Keys.DealFeedback),
                                "cmd dealFeedback")
                        });
                }
            }

            if (!Payment.IsRefund)
                if (Payment.Owner.Id == Menu.UserId)
                {
                    arr.Add(new List<InlineKeyboardButton>
                    {
                        InlineKeyboardButton.WithCallbackData(
                            s.Get(Localization.InvoicePaymentView.Keys.ContactSeller),
                            "cmd contact")
                    });
                }
                else
                {
                    arr.Add(new List<InlineKeyboardButton>
                    {
                        InlineKeyboardButton.WithCallbackData(
                            s.Get(Localization.InvoicePaymentView.Keys.ContactBuyer),
                            "cmd contact")
                    });
                }

            arr.Add(BackBtn.BackHome(this));
            var keyboard = arr.ToKeyboard();
            List<Result> results = new List<Result>();
            results.Add(new Result(this, msg, InlineKeyboardMarkup.Empty()));
            if (Payment.Status == InvoicePayment.Types.InvoicePaymentStatus.Pending &&
                Payment.LNInvoice != null)
            {
                var qr = GetQrCode("lightning:" + Payment.LNInvoice);
                await using MemoryStream ms = new MemoryStream();
                qr.Save(ms, ImageFormat.Png);
                ms.Position = 0;
                var photo = new Photo(ms.ToArray());
                var res = new Result(this, "", InlineKeyboardMarkup.Empty(), photo);
                results.Add(res);
                res = new Result(this, "lightning:" + Payment.LNInvoice, InlineKeyboardMarkup.Empty());
                results.Add(res);
            }

            for (int i = 0; i < Payment.Secrets.Count; i++)
            {
                var res = await GetSecretInfo(Payment.Secrets[i], i);
                results.AddRange(res);
            }

            results.Last().Keyboard = keyboard;
            return results;
        }

        private Bitmap GetQrCode(string uri)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(uri, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);
            return qrCodeImage;
        }

        protected override Task<bool> OnEvent(Event evt)
        {
            if (evt.InvoicePaymentUpdated != null && Payment != null &&
                Payment.Id == evt.InvoicePaymentUpdated.Id)
            {
                Payment = evt.InvoicePaymentUpdated;
                return Task.FromResult(true);
            }

            return Task.FromResult(false);
        }

        protected override Task<bool> OnImageLoaded(Guid id)
        {
            return Task.FromResult(Payment.Secrets.SelectMany(p => p.Images).Contains(id.ToString()));
        }
    }
}