using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{
    
    public enum UserEventTypes
    {
        NewDeal,
        DealStatusChanged,
        NewMessage,
        FiatPayed,
        BalanceChanged,
        NewInvoice,
        InvoicePayed,
        InvoiceDeleted,
        InvoicePaymentNew,
        ConversationNewMessage,
        InvoicePaymentUpdated,
        ImageStored,
    }
    public class UserEvent
    {
        [Key]
        public long Id { get; set; }

        public SourceType Source { get; set; }
        [ForeignKey("creater_id")]
        public virtual UserData Creater { get; set; }
        [ForeignKey("receiver_id")]
        public virtual UserData Receiver { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public UserEventTypes Type { get; set; }
        public virtual Deal Deal { get; set; }
        public virtual DealMessage DealMessage { get; set; }
        [NotMapped]
        public UserBalance Balance { get; set; }

        public virtual Invoice Invoice { get; set; }
        public virtual InvoicePayment InvoicePayment { get; set; }
        public virtual Conversation Conversation { get; set; }
        public Guid ImageId { get; set; }
    }
}