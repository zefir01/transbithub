using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys.Invoices;
using CoreLib.Services;
using CoreLib.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys.UserDataParts
{
    public partial class UserData
    {
        [Owned]
        public class UserDataInvoices
        {
            public int InvoiceCreatedCount { get; private set; }

            [NotMapped]
            public decimal PaymentsPayedAvgAmount
            {
                get
                {
                    if (PaymentsPayedCount == 0)
                        return 0;
                    return Math.Round(PaymentsPayedSumAmount / PaymentsPayedCount, 8);
                }
            }

            public decimal PaymentsPayedSumAmount { get; private set; }
            public int PaymentsPayedCount { get; private set; }
            public int PaymentsReceivedCount { get; private set; }
            public decimal PaymentsReceivedSumAmount { get; private set; }

            [NotMapped]
            public decimal PaymentsReceivedAvgAmount
            {
                get
                {
                    if (PaymentsReceivedCount == 0)
                        return 0;
                    return Math.Round(PaymentsReceivedSumAmount / PaymentsReceivedCount, 8);
                }
            }

            [NotMapped]
            public decimal ResponseRate
            {
                get
                {
                    if (PositiveFeedbacks + NegativeFeedbacks == 0)
                        return 0;
                    return PositiveFeedbacks / (PositiveFeedbacks + (decimal) NegativeFeedbacks) *
                           100;
                }
            }

            public int PositiveFeedbacks { get; private set; }
            public int NegativeFeedbacks { get; private set; }


            public virtual UserData User { get; private set; }
            private DataDBContext db;
            private SourceType source;

            public UserDataInvoices(DataDBContext db)
            {
                this.db = db;
                source = db.SourceType;
            }

            public UserDataInvoices(UserData user, DataDBContext db)
            {
                User = user;
                this.db = db;
                source = db.SourceType;
            }

            public InvoicePayment GetPayment(long id)
            {
                var payment = User.MyPayments.FirstOrDefault(p => p.Id == id);
                if (payment == null)
                    payment = User.MyInvoices.SelectMany(p => p.Payments).FirstOrDefault(p => p.Id == id);
                if (payment == null)
                    throw new UserException("Payment not found.");
                if (payment.Invoice.Owner.UserId != User.UserId && payment.Owner.UserId != User.UserId)
                    throw new UserException("Payment not found.");
                if (payment.Status == InvoicePaymentStatus.Canceled)
                    throw new UserException("Payment canceled.");
                return payment;
            }

            private InvoicePayment GetMyPayment(long id)
            {
                var payment = User.MyPayments.FirstOrDefault(p => p.Id == id);
                if (payment == null)
                    throw new UserException("Payment not found.");
                if (payment.Status == InvoicePaymentStatus.Canceled)
                    throw new UserException("Payment canceled.");
                return payment;
            }

            public List<Conversation> GetMyConversations()
            {
                var conversations = User.MyInvoices.SelectMany(p => p.Conversations)
                    .Concat(
                        User.MyPayments.Select(p => p.Conversation)
                    )
                    .Concat(
                        User.MyInvoices.SelectMany(p => p.Payments).Select(p => p.Conversation)
                    )
                    .Concat(
                        User.ToMeInvoices.SelectMany(p => p.Conversations)
                    )
                    .Where(p => p != null)
                    .Distinct()
                    .Where(p => p.Seller.UserId == User.UserId && !p.SellerDeleted
                                || p.Buyer.UserId == User.UserId && !p.BuyerDeleted
                    ).ToList();
                return conversations;
            }

            public Invoice GetInvoice(long id)
            {
                var invoice = User.MyInvoices.FirstOrDefault(p => p.Id == id) ??
                              User.ToMeInvoices.FirstOrDefault(p => p.Id == id) ??
                              db.Invoices.FirstOrDefault(p => !p.IsPrivate && p.Id == id);
                if (invoice == null)
                    throw new UserException("Invoice not found.");
                if (invoice.IsPrivate && invoice.TargetUser.UserId == User.UserId && invoice.TargetDeleted)
                    throw new UserException("Invoice not found.");
                if (invoice.Status == InvoiceStatus.Deleted)
                    throw new UserException("Invoice not found.");
                if (invoice.Refund != null && invoice.Owner.UserId == User.UserId)
                    throw new UserException("Invoice not found.");
                return invoice;
            }

            public async Task<InvoicePayment> DeleteInvoice(long invoiceId, CancellationToken cancellationToken)
            {
                var invoice = GetInvoice(invoiceId);
                await invoice.Delete(cancellationToken);
                return invoice.Refund;
            }

            public InvoicePayment CreateInvoicePaymentFeedback(long paymentId, string message,
                bool isPositive)
            {
                var payment = GetPayment(paymentId);
                var feedback = payment.CreateFeedback(isPositive, message);
                var usr = payment.Owner.UserId == User.UserId ? payment.Invoice.Owner : payment.Owner;
                if (feedback.IsPositive)
                    usr.InvoicesData.PositiveFeedbacks++;
                else
                    usr.InvoicesData.NegativeFeedbacks++;
                return payment;
            }

            public async Task<InvoicePayment> CancelInvoicePayment(long paymentId)
            {
                var payment = GetMyPayment(paymentId);
                await payment.Cancel();
                return payment;
            }

            public Invoice CreateInvoice(
                decimal price,
                string priceVariable,
                bool isBaseCrypto,
                bool isPrivate,
                int ttlMinutes,
                Catalog.Currencies fiatCurrency,
                string comment,
                int piecesMin,
                int piecesMax,
                bool limitLiquidity,
                string targetUser,
                List<Guid> images,
                bool noIntegration,
                string url,
                string clientKey,
                string clientCert,
                string serverCert,
                bool webhookRequired,
                List<(string text, List<Guid> images)> secrets,
                CancellationToken cancellationToken)
            {
                var invoice = new Invoice(
                    price,
                    priceVariable,
                    isBaseCrypto,
                    isPrivate,
                    ttlMinutes,
                    fiatCurrency,
                    comment,
                    piecesMin,
                    piecesMax,
                    limitLiquidity,
                    targetUser,
                    images,
                    noIntegration,
                    url,
                    clientKey,
                    clientCert,
                    serverCert,
                    webhookRequired,
                    db);
                InvoiceCreatedCount++;

                User.myInvoices.Add(invoice);

                for (int i = 0; i < secrets.Count; i++)
                {
                    var sec = secrets[i];
                    invoice.CreateSecret(sec.text, sec.images, i);
                }

                if (invoice.IsPrivate)
                {
                    var evt = new UserEvent
                    {
                        CreatedAt = DateTime.Now,
                        Creater = db.User,
                        Invoice = invoice,
                        Source = db.SourceType,
                        Type = UserEventTypes.NewInvoice,
                        Receiver = invoice.TargetUser
                    };
                    invoice.TargetUser.Events.Add(evt);
                    db.Retranslator.Send(evt);
                }

                return invoice;
            }

            public Invoice CreateInvoice(ServiceType serviceType, decimal amount, int pieces,
                UserData targetUser,
                CancellationToken cancellationToken)
            {
                var invoice = new Invoice(serviceType, amount, pieces, targetUser, User, db);
                User.myInvoices.Add(invoice);
                return invoice;
            }

            private Task<InvoicePayment> CreateInvoicePayment(Invoice invoice, int pieces)
            {
                var payment = invoice.CreatePayment(pieces);
                User.myPayments.Add(payment);
                return Task.FromResult(payment);
            }

            public async Task<InvoicePayment> PayInvoiceFromBalance(long invoiceId, int pieces)
            {
                var invoice = GetInvoice(invoiceId);
                var payment = await CreateInvoicePayment(invoice, pieces);
                await payment.PayFromBalance();

                var evt = new UserEvent
                {
                    Source = db.SourceType,
                    Creater = User,
                    Receiver = payment.Invoice.Owner,
                    CreatedAt = DateTime.Now,
                    Type = UserEventTypes.InvoicePaymentNew,
                    InvoicePayment = payment
                };
                payment.Invoice.Owner.Events.Add(evt);
                db.Retranslator.Send(evt);

                if (!payment.Invoice.IsPrivate && payment.Invoice.LimitLiquidity)
                {
                    if (payment.Invoice.Status == InvoiceStatus.Payed)
                    {
                        var not = new InvoiceDeleteNotification(payment.Invoice.Id, db.SourceType);
                        db.Notify(not);
                    }
                    else
                    {
                        var not = new InvoiceChangedNotification(payment.Invoice, db.SourceType);
                        db.Notify(not);
                    }
                }

                return payment;
            }

            public void OnPaymentPaid(InvoicePayment payment)
            {
                if (payment.Owner.UserId == User.UserId && !payment.IsRefund &&
                    payment.Invoice.IsService == ServiceType.None)
                {
                    PaymentsPayedCount++;
                    PaymentsPayedSumAmount += payment.CryptoAmount;
                }

                if (payment.Owner.UserId != User.UserId && !payment.IsRefund &&
                    payment.Invoice.IsService == ServiceType.None)
                {
                    PaymentsReceivedCount++;
                    PaymentsReceivedSumAmount += payment.CryptoAmount;
                }

                if (payment.Invoice.IsService == ServiceType.None)
                    return;

                switch (payment.Invoice.IsService)
                {
                    case ServiceType.AutoPrice:
                        User.Options.OnPayed(payment);
                        break;
                }
            }

            private static readonly Func<DataDBContext, UserData, decimal, Catalog.Countries, Catalog.Currencies,
                Catalog.PaymentTypes, IQueryable<Advertisement>> getAd =
                (db, user, amount, country, fiatCurrency, paymentType) => from ads in db.Advertisements
                        .Include(p => p.Owner)
                        .Include(p => p.Metadata)
                        .Include(p => p.TimeTable)
                    where ads.IsBuy == false
                          && ads.Country == country
                          && ads.FiatCurrency == fiatCurrency
                          && ads.PaymentType == paymentType
                          && ads.Metadata.Status == Advertisement.AdMetadata.AdStatus.Enabled
                          && (user == null || !user.IsAnonymous || !ads.NotAnonymous)
                          && ads.Metadata.MinCryptoAmount <= amount
                          && ads.Metadata.MaxCryptoAmount >= amount
                          && ads.Owner.UserId != user.UserId
                          && !ads.IsDeleted
                    select new
                    {
                        ad = ads,
                        blocked = from bl in ads.Owner.BlockedUsers where bl.User == user select 1,
                        trusted = from tl in ads.Owner.TrustedUsers where tl.User == user select 1,
                    }
                    into exp
                    where !exp.blocked.Any()
                          && (!exp.ad.Trusted || exp.ad.Trusted && exp.trusted.Any())
                    orderby exp.ad.Metadata.Price
                    select exp.ad;

            public async Task<InvoicePayment> PayInvoiceByBestDeal(long invoiceId, Catalog.Countries country,
                Catalog.Currencies currency, Catalog.PaymentTypes paymentType, int pieces)
            {
                var invoice = GetInvoice(invoiceId);
                var payment = await CreateInvoicePayment(invoice, pieces);
                var ads = getAd(db, User, payment.CryptoAmount, country, currency, paymentType);
                var opened = User.DealsInitiator
                    .Where(x => x.Status == DealStatus.Opened || x.Status == DealStatus.Disputed)
                    .Select(z => z.Ad.Id).ToList();
                ads = ads.Where(p => !opened.Contains(p.Id));
                var ad = await ads.FirstOrDefaultAsync();
                if (ad == null)
                    throw new UserException("No suitable advertisement found.");
                var fiatAmount = Math.Round(ad.Metadata.Price * payment.CryptoAmount, 2);
                try
                {
                    var deal = await ad.CreateDeal(fiatAmount, null, null, payment);
                    payment.PayByDeal(deal);
                    User.SetLastSearch(country, currency, paymentType, 0, false);
                    return payment;
                }
                catch (AlreadyCreatedException e) when (e.Deal != null)
                {
                    throw new UserException("No suitable advertisement found.");
                }
            }

            public List<Advertisement> GetSuitableAds(long invoiceId, int pieces, Catalog.Countries country,
                Catalog.Currencies currency,
                Catalog.PaymentTypes paymentType, int skip, int count)
            {
                var invoice = GetInvoice(invoiceId);
                decimal amount;
                if (invoice.IsBaseCrypto)
                    amount = invoice.Price;
                else
                    amount = invoice.CurrentCryptoPrice * pieces;
                var ads = getAd(db, User, amount, country, currency, paymentType)
                    .Where(p => p.Owner.UserId != db.User.UserId);
                var opened = User.DealsInitiator
                    .Where(x => x.Status == DealStatus.Opened || x.Status == DealStatus.Disputed)
                    .Select(z => z.Ad.Id).ToList();
                ads = ads.Where(p => !opened.Contains(p.Id));
                User.SetLastSearch(country, currency, paymentType, 0, false);
                return ads.Skip(skip).Take(count).ToList();
            }

            public async Task<InvoicePayment> PayInvoiceByDeal(long invoiceId, int pieces, long adId)
            {
                var invoice = GetInvoice(invoiceId);
                var payment = await CreateInvoicePayment(invoice, pieces);
                var ad = await User.AdsData.GetAdById(adId);
                if (ad == null)
                    throw new UserException("No suitable advertisement found.");
                var fiatAmount = Math.Round(ad.Metadata.Price * payment.CryptoAmount, 2);
                try
                {
                    var deal = await ad.CreateDeal(fiatAmount, null, null);
                    payment.PayByDeal(deal);
                    return payment;
                }
                catch (AlreadyCreatedException e) when (e.Deal != null)
                {
                    throw new UserException("No suitable advertisement found.");
                }
            }

            public Conversation NewMessage(long invoiceId, string toUserId, string message, List<Guid> imageIds)
            {
                var invoice = GetInvoice(invoiceId);
                if (!invoice.IsPrivate && invoice.Owner.UserId == User.UserId &&
                    invoice.Conversations.All(p => p.Buyer.UserId != toUserId))
                    throw new UserException("You can't send message to self.");
                if (invoice.Owner.UserId == User.UserId && toUserId.IsNullOrEmpty())
                    throw new UserException("You can't send message to self.");
                if (invoice.Owner.UserId != User.UserId && toUserId != "")
                    throw new UserException("You buyer, target user must be empty.");
                var conv = invoice.NewMessage(toUserId, message, imageIds);
                var evt = new UserEvent
                {
                    Source = db.SourceType,
                    Creater = User,
                    Receiver = conv.Buyer.UserId == User.UserId ? conv.Seller : conv.Buyer,
                    CreatedAt = DateTime.Now,
                    Type = UserEventTypes.ConversationNewMessage,
                    Conversation = conv,
                    Invoice = conv.Invoice
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);
                return conv;
            }

            public Conversation NewMessage(long paymentId, string message, List<Guid> imageIds)
            {
                var payment = GetPayment(paymentId);
                var conv = payment.NewMessage(message, imageIds);
                var evt = new UserEvent
                {
                    Source = db.SourceType,
                    Creater = User,
                    Receiver = conv.Buyer.UserId == User.UserId ? conv.Seller : conv.Buyer,
                    CreatedAt = DateTime.Now,
                    Type = UserEventTypes.ConversationNewMessage,
                    Conversation = conv,
                    InvoicePayment = conv.Payment
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);
                return conv;
            }

            public Conversation GetConversationById(long id)
            {
                var conv = User.MyInvoices.SelectMany(p => p.Conversations)
                    .Concat(User.ToMeInvoices.SelectMany(p => p.Conversations))
                    .FirstOrDefault(p => p.Id == id);
                if (conv == null)
                    conv = User.MyPayments.Select(p => p.Conversation).FirstOrDefault(p => p?.Id == id);
                if (conv == null)
                    throw new UserException("Conversation not found.");
                if (conv.Seller.UserId == User.UserId && conv.SellerDeleted)
                    throw new UserException("Conversation not found.");
                if (conv.Buyer.UserId == User.UserId && conv.BuyerDeleted)
                    throw new UserException("Conversation not found.");
                return conv;
            }

            public List<Conversation> GetConversationsByIds(List<long> ids)
            {
                var conv = User.MyInvoices.SelectMany(p => p.Conversations)
                    .Where(p => ids.Contains(p.Id))
                    .Concat(
                        User.MyPayments.Select(p => p.Conversation).Where(p => ids.Contains(p.Id))
                    )
                    .Where(p => p.Seller.UserId == User.UserId && !p.SellerDeleted ||
                                p.Buyer.UserId == User.UserId && !p.BuyerDeleted)
                    .ToList();
                return conv;
            }

            public Conversation DeleteConversation(long conversationId)
            {
                var conv = GetConversationById(conversationId);
                if (conv == null)
                    throw new UserException("Conversation not found");
                conv.Delete();
                return conv;
            }

            public (InvoicePayment payment, Invoice refund) CreateRefund(long paymentId, int pieces)
            {
                var payment = GetPayment(paymentId);
                if (payment.Owner.UserId == User.UserId)
                    throw new UserException("You cannot create a refund for yourself.");
                var invoice = payment.CreateRefund(pieces);
                return (payment, invoice);
            }

            private static readonly Func<DataDBContext, IQueryable<UserData>> getServiceUser =
                db => (from u in db.UserDatas
                    where u.UserId == ""
                    select u).Take(1);

            public async Task<Invoice> BuyRecalcs(int recalcs)
            {
                var service = await getServiceUser(db).FirstAsync();
                var invoice = service.InvoicesData.CreateInvoice(ServiceType.AutoPrice,
                    Config.AutoPriceFee * recalcs, recalcs, User, CancellationToken.None);
                return invoice;
            }

            public async Task<InvoicePayment> PayInvoiceByPromise(string promiseText, string password, long invoiceId,
                int pieces, OddTypes oddType)
            {
                var promise = await Promise.GetPromise(promiseText, password, db);
                var invoice = GetInvoice(invoiceId);
                var payment = await CreateInvoicePayment(invoice, pieces);
                await User.Balance.PayPaymentByPromise(payment, promise, oddType);

                return payment;
            }

            public InvoiceSecret GetMySecretById(long id)
            {
                var secret = User.MyInvoices.SelectMany(p => p.Secrets).FirstOrDefault(p => p.Id == id);
                return secret;
            }

            private static readonly
                Func<DataDBContext, UserData, bool?, InvoiceStatus[], bool?, long, string, long,
                    IEnumerable<Invoice>>
                findInvoices =
                    (db, user, isOwner, statuses, isPrivate, id, toUser, lastId) =>
                        from inv in db.Invoices
                        where inv.Status != InvoiceStatus.Deleted
                              && (!inv.IsPrivate || inv.Owner.UserId == user.UserId || !inv.TargetDeleted)
                              && (inv.Owner.UserId == user.UserId ||
                                  inv.TargetUser != null && inv.TargetUser.UserId == user.UserId || !inv.IsPrivate)
                              && (id == default || inv.Id == id)
                              && (!isOwner.HasValue ||
                                  (isOwner.Value && inv.Owner.UserId == user.UserId
                                   || !isOwner.Value && inv.Owner.UserId != user.UserId))
                              && (statuses.Length == 0 || statuses.Contains(inv.Status))
                              && (!isPrivate.HasValue || inv.IsPrivate == isPrivate.Value)
                              && (toUser.IsNullOrEmpty() || inv.TargetUser != null &&
                                  inv.TargetUser.UserName == toUser)
                              && inv.Id < lastId
                              && (inv.Refund == null || user.UserId != inv.Owner.UserId)
                        orderby inv.Id descending
                        select inv;

            public List<Invoice> GetInvoices(bool? isOwner, List<InvoiceStatus> statuses, bool? isPrivate, long id,
                string toUser, long lastId, int count)
            {
                if (lastId == 0)
                    lastId = Int64.MaxValue;
                var invoices = findInvoices(db, db.User, isOwner, statuses.ToArray(),
                    isPrivate, id, toUser, lastId);
                invoices = invoices.Take(count);
                var ret = invoices.ToList();
                return ret;
            }

            private static readonly
                Func<UserData, long?, bool?, long, IEnumerable<InvoicePayment>> getInvoicePayments =
                    (user, paymentId, isToMe, lastId) =>
                        from pay in user.MyPayments.Concat(user.MyInvoices.SelectMany(p => p.Payments))
                        where (!paymentId.HasValue || pay.Id == paymentId)
                              && pay.Id < lastId
                              && (!isToMe.HasValue || isToMe.Value && pay.Invoice.Owner.UserId == user.UserId ||
                                  !isToMe.Value && pay.Owner.UserId == user.UserId)
                        orderby pay.Id descending
                        select pay;

            public List<InvoicePayment> GetInvoicePayments(long? paymentId, bool? isToMe, long lastId, int count)
            {
                if (lastId == 0)
                    lastId = Int64.MaxValue;
                var t = getInvoicePayments(db.User, paymentId, isToMe, lastId).Take(count).ToList();
                return t;
            }
        }
    }
}