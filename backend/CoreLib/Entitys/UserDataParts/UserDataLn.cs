using System;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using Grpc.Core;
using Grpc.Net.Client;
using LND;
using Microsoft.EntityFrameworkCore;
using Shared;
using Shared.Protos;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class UserDataLn
        {
            public virtual UserData User { get; private set; }
            private DataDBContext db;

            public UserDataLn(UserData user, DataDBContext db)
            {
                User = user;
                this.db = db;
            }

            public UserDataLn(DataDBContext db)
            {
                this.db = db;
            }

            public async Task<InvoicePayment> PayInvoiceFromLN(long invoiceId, int pieces,
                CancellationToken cancellationToken)
            {
                var invoice = db.User.InvoicesData.GetInvoice(invoiceId);
                var payment = invoice.CreatePayment(pieces);
                string desc = $"Invoice {invoice.Id} payment for {pieces} pieces.";
                var inv = await db.LndClient.CreateInvoice(desc, payment.CryptoAmount, 3600);
                var lnInvoice = new LNInvoice(db.User, inv, payment);
                await db.LNInvoices.AddAsync(lnInvoice, cancellationToken);
                await db.SaveChangesAsync(cancellationToken);
                return payment;
            }
        }
    }
}