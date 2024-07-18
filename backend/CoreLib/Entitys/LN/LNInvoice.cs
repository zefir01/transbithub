using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Threading.Tasks;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.UserDataParts;
using Microsoft.EntityFrameworkCore;

#nullable enable

namespace CoreLib.Entitys.LN
{
    [Index(nameof(Status))]
    [Index(nameof(LndAddIndex))]
    public class LNInvoice
    {
        public enum LNInvoiceStatus
        {
            Paid,
            Unpaid
        }

        [Key] public long Id { get; private set; }
        public byte[] RHash { get; private set; }

        public long LndAddIndex { get; private set; }
        public LNInvoiceStatus Status { get; private set; } = LNInvoiceStatus.Unpaid;
        public decimal Amount { get; private set; }
        public virtual UserData Owner { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime ExpiresIn { get; private set; }
        public string Description { get; private set; }
        public string Bolt11 { get; private set; }
        [ForeignKey("payment_fk")] public virtual InvoicePayment? Payment { get; private set; }
        [ForeignKey("deal_fk")] public virtual Deal? Deal { get; private set; }

#pragma warning disable 8618
        public LNInvoice()
#pragma warning restore 8618
        {
        }

        public LNInvoice(UserData owner, LND.Invoice invoice)
        {
            RHash = invoice.RHash.ToByteArray();
            Amount = invoice.Value * Config.Satoshi;
            Owner = owner;
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(invoice.CreationDate).ToLocalTime();
            CreatedAt = dtDateTime;
            ExpiresIn = CreatedAt + TimeSpan.FromSeconds(invoice.Expiry);
            Description = invoice.Memo;
            LndAddIndex = (long) invoice.AddIndex;
            Bolt11 = invoice.PaymentRequest;
        }

        public LNInvoice(UserData owner, LND.Invoice invoice, InvoicePayment payment)
            : this(owner, invoice)
        {
            Payment = payment;
        }

        public LNInvoice(UserData owner, LND.Invoice invoice, Deal deal)
            : this(owner, invoice)
        {
            Deal = deal;
        }

        public async Task Paid()
        {
            Status = LNInvoiceStatus.Paid;
            await Owner.Balance.LNInvoicePaid(this);
            if (Payment != null)
                await Payment.PayFromBalance(Owner.Balance);
            else if (Deal != null)
                await Deal.LnFunded();
        }

        public async Task Cancel()
        {
            if (Payment != null)
                await Payment.Cancel();
            else if (Deal != null)
                await Deal.Cancel();
        }
    }
}