using System;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys.Invoices
{
    public class InvoicePaymentFeedback
    {
        public InvoicePaymentFeedback(string message, bool isPositive, UserData owner, UserData to)
        {
            Message = message ?? throw new ArgumentNullException(nameof(message));
            IsPositive = isPositive;
            Owner = owner ?? throw new ArgumentNullException(nameof(owner));
            To = to;
        }

        public InvoicePaymentFeedback()
        {
        }

        public long Id { get; private set; }
        public string Message { get; private set; }
        public bool IsPositive { get; private set; }
        public virtual UserData Owner { get; private set; }
        public virtual UserData To { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
    }
}