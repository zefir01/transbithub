using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys.Snapshots;
using CoreLib.Entitys.UserDataParts;
using Shared;

namespace CoreLib.Entitys.Invoices
{
    public enum InvoicePaymentStatus
    {
        Pending,
        Paid,
        Canceled
    }

    public class InvoicePayment : Entity
    {
        public InvoicePaymentStatus Status { get; private set; }
        [ForeignKey("invoice_fk")] public virtual Invoice Invoice { get; private set; }
        public virtual InvoiceSnapshot InvoiceSnapshot { get; private set; }
        public int Pieces { get; private set; }
        public decimal CryptoAmount { get; private set; }
        public decimal Fee { get; private set; }
        public DateTime CreatedAt { get; private set; }
        [NotMapped] public string Confirmation => GetConfirmation();

        [ForeignKey("owner_fk")] public virtual UserData Owner { get; private set; }
        public virtual InvoicePaymentFeedback OwnerFeedback { get; private set; }
        public virtual InvoicePaymentFeedback SellerFeedback { get; private set; }
        public virtual Deal Deal { get; private set; }

        public virtual Conversation Conversation { get; private set; }
        public int Refunded { get; private set; }
        public int Refunding { get; private set; }
        public bool IsRefund { get; private set; }
        public virtual List<Invoice> Refunds { get; private set; } = new List<Invoice>();
        public virtual Promise OddPromise { get; set; }
        public virtual List<InvoiceSecret> Secrets { get; set; } = new List<InvoiceSecret>();
        public virtual LN.LNInvoice LNInvoice { get; private set; }

        public InvoicePayment(DataDBContext db) : base(db)
        {
        }

        public InvoicePayment(Invoice invoice, int pieces, DataDBContext db) : base(db)
        {
            if (invoice.Owner.UserId == requester.UserId)
                throw new UserException("You cannot pay your own invoice.");
            IsRefund = invoice.Refund != null;
            Status = InvoicePaymentStatus.Pending;
            if (invoice.IsPrivate && invoice.Refund == null)
                pieces = 1;
            else
            {
                if (invoice.PiecesMax < pieces)
                    throw new UserException("The invoice does not have enough pieces. Maximum is " +
                                             invoice.PiecesMax);
                if (invoice.PiecesMin > pieces)
                    throw new UserException("Minimum number of pieces " + invoice.PiecesMax);
            }

            Owner = requester;
            Invoice = invoice;
            InvoiceSnapshot = InvoiceSnapshot.Create(invoice);
            Pieces = pieces;

            if (invoice.IsPrivate && Owner.IsAnonymous)
                throw new UserException("Anonymous users cannot pay private invoices.");

            if (!invoice.IsPrivate)
            {
                if (invoice.IsBaseCrypto)
                    Fee = Math.Round(invoice.Price / 100 * Config.InvoiceFee, 8) * pieces;
                else
                    Fee = Math.Round(invoice.CurrentCryptoPrice / 100 * Config.InvoiceFee, 8) * pieces;
            }

            CreatedAt = DateTime.Now;
            CryptoAmount = invoice.CurrentCryptoPrice * pieces;
        }

        private string GetConfirmation()
        {
            if (Status != InvoicePaymentStatus.Paid)
                return "";
            string confirmation = "Type: INVOICE_PAYMENT\n";
            if (Invoice.IsPrivate)
            {
                confirmation += $"PaymentId: {Id}\n" +
                                $"InvoiceId: {Invoice.Id}\n" +
                                $"CryptoAmount: {CryptoAmount}\n";

                confirmation += $"CreatedAt: {CreatedAt}\n" +
                                $"Payer: {Owner.UserName}\n" +
                                $"InvoiceOwner: {Invoice.Owner.UserName}\n";
            }
            else
            {
                confirmation += $"PaymentId: {Id}\n" +
                                $"Pieces: {Pieces}\n" +
                                $"InvoiceId: {Invoice.Id}\n" +
                                $"CryptoAmount: {CryptoAmount}\n";

                confirmation += $"CreatedAt: {CreatedAt}\n" +
                                $"Payer: {Owner.UserName}\n" +
                                $"InvoiceOwner: {Invoice.Owner.UserName}";
            }

            return pgp.Sign(confirmation).ConfigureAwait(false).GetAwaiter().GetResult();
        }

        public async Task PayFromBalance(UserBalance balance = null)
        {
            if (Status != InvoicePaymentStatus.Pending)
                throw new UserException("Invoice payment must be in Pending status.");
            Status = InvoicePaymentStatus.Paid;
            var b = balance ?? Owner.Balance;
            await b.PayInvoicePayment(this);
            Invoice.OnPay(this);
            if (Invoice.Refund == null)
            {
                Invoice.Owner.InvoicesData.OnPaymentPaid(this);
                Owner.InvoicesData.OnPaymentPaid(this);
            }

            if (Invoice.Integration?.Webhook != null)
            {
                await Invoice.Integration.Webhook.Exec(this, db);
            }
            else if (Invoice.Integration?.Redirect != null && Invoice.Integration.Redirect.IsNullOrEmpty())
            {
                var secret = new InvoiceSecret(Invoice.Integration.Redirect, this, db);
            }
            else
            {
                var secrets = Invoice.Secrets.Where(p => p.Payment == null)
                    .OrderBy(p => p.Order).Take(Pieces).ToList();
                foreach (var secret in secrets)
                    secret.Sold(this);
                Secrets = secrets;
            }

            SendUpdate();
        }

        public void PayByDeal(Deal deal)
        {
            Deal = deal;
        }

        public async Task OnDealCompeted()
        {
            await PayFromBalance();
        }

        public void OnDealCanceled()
        {
            if (Status != InvoicePaymentStatus.Pending)
                throw new UserException("Invoice already paid.");
            Status = InvoicePaymentStatus.Canceled;
            Invoice.OnCancelPayment(this);
            SendUpdate();
        }


        public async Task Cancel()
        {
            if (Status != InvoicePaymentStatus.Pending)
                throw new UserException("Invoice already paid.");
            if (Deal != null)
                await Deal.Cancel();
            Status = InvoicePaymentStatus.Canceled;
            Invoice.OnCancelPayment(this);
            SendUpdate();
        }

        public InvoicePaymentFeedback CreateFeedback(bool isPositive, string message)
        {
            if (IsRefund)
                throw new UserException("You cant create feedback in refund payment.");
            if (Status != InvoicePaymentStatus.Paid)
                throw new UserException("Payment status must be Paid.");
            InvoicePaymentFeedback feedback;
            if (Owner.UserId == db.User.UserId)
            {
                if (OwnerFeedback != null)
                    throw new UserException("Feedback already created;");
                feedback = new InvoicePaymentFeedback(message, isPositive, db.User, Invoice.Owner);
                OwnerFeedback = feedback;
                
            }
            else if (Invoice.Owner.UserId == db.User.UserId)
            {
                if (SellerFeedback != null)
                    throw new UserException("Feedback already created;");
                feedback = new InvoicePaymentFeedback(message, isPositive, db.User, Owner);
                SellerFeedback = feedback;
            }
            else
                throw new UserException("You cant send feedback for this payment.");

            SendUpdate();

            return feedback;
        }

        public Conversation NewMessage(string text, List<Guid> imageIds)
        {
            if (IsRefund)
                throw new UserException("You cant start conversation in refund payment.");
            if (Conversation == null)
                Conversation = new Conversation(this, text, imageIds, db);
            else
                Conversation.NewMessage(text, imageIds);

            return Conversation;
        }

        private void SendUpdate()
        {
            var evt = new UserEvent
            {
                Source = source,
                Creater = requester,
                Receiver = Invoice.Owner,
                Type = UserEventTypes.InvoicePaymentUpdated,
                InvoicePayment = this,
            };
            db.Retranslator.Send(evt);

            var evt1 = new UserEvent
            {
                Source = source,
                Creater = requester,
                Receiver = Owner,
                Type = UserEventTypes.InvoicePaymentUpdated,
                InvoicePayment = this,
            };
            db.Retranslator.Send(evt1);
        }

        public Invoice CreateRefund(int pieces)
        {
            if (InvoiceSnapshot.Owner.IsAnonymous)
                throw new UserException("You cannot make a refund to an anonymous user. Use external means.");
            if (Refunded + Refunding + pieces > Pieces)
                throw new UserException("Not enough pieces to be returned.");
            var invoice = Invoice.CreateRefund(this, pieces, db);
            Refunds.Add(invoice);
            Refunding += pieces;
            SendUpdate();
            return invoice;
        }

        public void OnRefundPayed(Invoice invoice)
        {
            Refunding -= invoice.PiecesMin;
            Refunded += invoice.PiecesMin;
            SendUpdate();
        }

        public void OnRefundDeleted(Invoice invoice)
        {
            Refunding -= invoice.PiecesMin;
            SendUpdate();
        }
    }
}