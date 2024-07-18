using System;
using CoreLib.Entitys;
using CoreLib.Entitys.Invoices;

namespace CoreLib.Services.Exceptions
{
    public class AlreadyCreatedException : Exception
    {
        public InvoicePayment InvoicePayment { get; }
        public Deal Deal { get; }
        public AlreadyCreatedException(InvoicePayment payment)
        {
            InvoicePayment = payment;
        }
        public AlreadyCreatedException(Deal deal)
        {
            Deal = deal;
        }
    }
}