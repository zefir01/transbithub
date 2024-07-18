using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using CoreLib.Services.Exceptions;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys.Invoices
{
    public enum InvoiceStatus
    {
        Active,
        PendingPay,
        NoPieces,
        Payed,
        Deleted,
    }

    public enum ServiceType
    {
        None,
        AutoPrice
    }

    public enum OddTypes
    {
        NoOdd,
        ToBalance,
        ToPromise,
    }

    [Index(nameof(IsPrivate))]
    [Index(nameof(TtlMinutes))]
    [Index(nameof(Status))]
    [Index(nameof(ExpireTime))]
    public class Invoice : Entity
    {
        public ServiceType IsService { get; private set; }
        public virtual InvoicePayment Refund { get; private set; }
        public bool IsPrivate { get; private set; }
        public bool IsBaseCrypto { get; private set; }
        public decimal Price { get; private set; }
        public decimal CurrentCryptoPrice { get; private set; }
        public Catalog.Currencies FiatCurrency { get; private set; }
        public string PriceVariable { get; private set; }
        public int TtlMinutes { get; private set; }
        public string Comment { get; private set; } = "";
        public int PiecesMin { get; private set; }
        public int PiecesMax { get; private set; }
        public virtual List<InvoicePayment> Payments { get; private set; } = new List<InvoicePayment>();

        public virtual UserData TargetUser { get; private set; }
        [ForeignKey("owner_fk")] public virtual UserData Owner { get; private set; }
        public InvoiceStatus Status { get; private set; }
        public decimal TotalPayedCrypto { get; private set; }
        public int PaymentsCount { get; private set; }
        public DateTime? ExpireTime { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? DeletedAt { get; private set; }
        public decimal Fee { get; private set; }
        public bool TargetDeleted { get; private set; }
        public bool LimitLiquidity { get; private set; }
        private List<Image> _Images = new List<Image>();
        public virtual InvoiceIntegration Integration { get; private set; }

        public virtual IReadOnlyList<Image> Images
        {
            get => _Images.OrderBy(p => p.Order).ToList();
            set
            {
                for (int i = 0; i < value.Count; i++)
                    value[i].Order = i;
                _Images = value.ToList();
            }
        }

        private List<InvoiceSecret> _Secrets = new List<InvoiceSecret>();

        public virtual IReadOnlyList<InvoiceSecret> Secrets
        {
            get => _Secrets.OrderBy(p => p.Order).ToList();
            set
            {
                for (int i = 0; i < value.Count; i++)
                    value[i].Order = i;
                _Secrets = value.ToList();
            }
        }

        private List<Conversation> _conversations = new List<Conversation>();

        public virtual IReadOnlyList<Conversation> Conversations
        {
            get => _conversations;
            private set => _conversations = value.ToList();
        }

        public async Task UpdatePrices()
        {
            if (!IsBaseCrypto)
            {
                if (PriceVariable != "Average")
                {
                    var usdPrice = await db.CryptoExchangeVariables.FirstAsync(p =>
                        p.Key == Enum.Parse<Catalog.CryptoExchangeVariables>(PriceVariable));

                    if (FiatCurrency == Catalog.Currencies.USD)
                        CurrentCryptoPrice = Math.Round(Price / usdPrice.Value, 8);
                    else
                    {
                        var fiatPrice = await db.FiatExchangeVariables
                            .FirstAsync(p => p.Key == FiatCurrency);
                        CurrentCryptoPrice = Math.Round(Price / fiatPrice.Value / usdPrice.Value, 8);
                    }
                }
                else
                {
                    var price = await db.AvgPrices.FirstAsync(p => p.FiatCurrency == FiatCurrency);
                    CurrentCryptoPrice = Math.Round(Price / price.Value, 8);
                }
            }
            else
            {
                CurrentCryptoPrice = Price;
            }
        }

        public Invoice(DataDBContext db) : base(db)
        {
        }

        public static Invoice CreateRefund(InvoicePayment payment, int pieces, DataDBContext db)
        {
            var invoice = new Invoice(db)
            {
                IsPrivate = true,
                Refund = payment,
                CreatedAt = DateTime.Now,
                Status = InvoiceStatus.Active,
                Owner = payment.Owner,
                TargetUser = payment.Invoice.Owner,
                TtlMinutes = payment.InvoiceSnapshot.TtlMinutes,
                Price = payment.InvoiceSnapshot.Price * pieces,
                IsBaseCrypto = payment.InvoiceSnapshot.IsBaseCrypto,
                PiecesMin = pieces,
                PiecesMax = pieces,
                PriceVariable = payment.InvoiceSnapshot.PriceVariable,
                FiatCurrency = payment.InvoiceSnapshot.FiatCurrency
            };
            invoice.ExpireTime = invoice.CreatedAt.AddMinutes(payment.InvoiceSnapshot.TtlMinutes);
            invoice.UpdatePrices().ConfigureAwait(false).GetAwaiter().GetResult();

            if (invoice.IsBaseCrypto)
                invoice.Fee = Math.Round(invoice.Price / 100 * Config.InvoiceFee, 8);
            else
                invoice.Fee = Math.Round(invoice.CurrentCryptoPrice / 100 * Config.InvoiceFee, 8);

            invoice.TargetUser.Balance.CreateInvoice(invoice).ConfigureAwait(false).GetAwaiter().GetResult();

            return invoice;
        }

        public Invoice(decimal price,
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
            DataDBContext db) : base(db)
        {
            IsService = ServiceType.None;
            Price = price;
            PriceVariable = priceVariable;
            IsBaseCrypto = isBaseCrypto;
            IsPrivate = isPrivate;
            TtlMinutes = ttlMinutes;
            FiatCurrency = fiatCurrency;
            Comment = comment;
            PiecesMin = piecesMin;
            PiecesMax = piecesMax;

            CreatedAt = DateTime.Now;
            Status = InvoiceStatus.Active;
            Owner = db.User;
            LimitLiquidity = limitLiquidity;

            if (IsPrivate && requester.UserName == targetUser)
                throw new UserException("You cannot invoice yourself.");

            if (IsPrivate)
            {
                TargetUser = db.UserDatas.First(p => p.UserName == targetUser);
                if (TargetUser.UserId == requester.UserId)
                    throw new UserException("You cannot invoice yourself.");
                ExpireTime = CreatedAt.AddMinutes(TtlMinutes);

                if (TargetUser.BlockedUsers.Select(p => p.User.UserId).Contains(Owner.UserId))
                    throw new UserException("You are blocked by a partner.");
            }

            if (Owner.IsAnonymous)
                throw new UserException("Anonymous users cannot create invoices.");
            if (IsPrivate && TargetUser.IsAnonymous)
                throw new UserException("You cannot invoice anonymous user.");

            UpdatePrices().ConfigureAwait(false).GetAwaiter().GetResult();

            if (IsPrivate)
            {
                if (IsBaseCrypto)
                    Fee = Math.Round(Price / 100 * Config.InvoiceFee, 8);
                else
                    Fee = Math.Round(CurrentCryptoPrice / 100 * Config.InvoiceFee, 8);
            }

            if (CurrentCryptoPrice < Config.MinimalAmountBtc)
            {
                if (IsBaseCrypto)
                {
                    throw new UserException(
                        "Minimal deal limit must be greater or equal 0.000001BTC.");
                }

                decimal minFiat = Math.Round(Config.MinimalAmountBtc * Price, 2);
                throw new UserException(
                    $"Minimal deal limit must be greater or equal 0.000001BTC or {minFiat}{FiatCurrency}.");
            }

            Owner.Balance.CreateInvoice(this).ConfigureAwait(false).GetAwaiter().GetResult();

            Images = requester.ImagesData.GetImagesInternal(images);

            Integration = !noIntegration
                ? new InvoiceIntegration(this, url, clientKey, clientCert, serverCert, webhookRequired, db)
                : null;
        }

        public Invoice(ServiceType serviceType, decimal amount, int pieces, UserData targetUser, UserData serviceUser,
            DataDBContext db) : base(db)
        {
            IsService = serviceType;
            Price = amount;
            PriceVariable = "AVG_USD";
            IsBaseCrypto = true;
            IsPrivate = true;
            TtlMinutes = 10080;
            FiatCurrency = Catalog.Currencies.USD;
            Comment = "";
            PiecesMin = 1;
            PiecesMax = 1;
            TargetUser = targetUser;
            PiecesMin = pieces;
            PiecesMax = pieces;

            CreatedAt = DateTime.Now;
            Status = InvoiceStatus.Active;
            Owner = serviceUser;
            LimitLiquidity = false;

            if (IsPrivate && requester.UserName == serviceUser.UserName)
                throw new UserException("You cannot invoice yourself.");

            ExpireTime = CreatedAt.AddMinutes(TtlMinutes);

            if (IsPrivate && TargetUser.IsAnonymous)
                throw new UserException("You cannot invoice anonymous user.");

            UpdatePrices().ConfigureAwait(false).GetAwaiter().GetResult();

            if (CurrentCryptoPrice < Config.MinimalAmountBtc)
            {
                if (IsBaseCrypto)
                {
                    throw new UserException(
                        "Minimal deal limit must be greater or equal 0.000001BTC.");
                }

                decimal minFiat = Math.Round(Config.MinimalAmountBtc * Price, 2);
                throw new UserException(
                    $"Minimal deal limit must be greater or equal 0.000001BTC or {minFiat}{FiatCurrency}.");
            }
        }

        private void MarkEvents()
        {
            var events = requester.Events.Where(p => p.Invoice != null && p.Invoice.Id == Id).ToList();
            if (!events.Any())
                return;
            foreach (var userEvent in events)
                requester.Events.Remove(userEvent);
        }

        private async Task CancelAllPayments()
        {
            foreach (var payment in Payments.Where(p => p.Status == InvoicePaymentStatus.Pending).ToList())
                await payment.Cancel();
        }

        public async Task Delete(CancellationToken cancellationToken)
        {
            if (!IsPrivate)
            {
                if (Owner.UserId != requester.UserId)
                    throw new UserException("You do not have permission to delete this invoice.");
                if (Refund != null && Owner.UserId == requester.UserId)
                    throw new UserException("You cant delete refund invoice.");
                Status = InvoiceStatus.Deleted;
                DeletedAt = DateTime.Now;
                MarkEvents();
                var not = new InvoiceDeleteNotification(Id, source);
                Retranslator.Notify(not, cancellationToken);
                return;
            }

            if (TargetUser.UserId == requester.UserId)
            {
                if (TargetDeleted)
                    throw new UserException("Invoice already deleted.");
                Refund?.OnRefundDeleted(this);
                TargetDeleted = true;
                await CancelAllPayments();
                MarkEvents();
                return;
            }

            if (Owner.UserId == requester.UserId)
            {
                if (Status == InvoiceStatus.Deleted)
                    throw new UserException("Invoice already deleted.");
                if (Refund != null)
                    throw new UserException("You cant delete refund invoice;");
                Status = InvoiceStatus.Deleted;
                DeletedAt = DateTime.Now;
                MarkEvents();

                var evt = new UserEvent
                {
                    Creater = requester,
                    Invoice = this,
                    Source = source,
                    Type = UserEventTypes.InvoiceDeleted,
                    Receiver = TargetUser
                };
                TargetUser.Events.Add(evt);
                Retranslator.Send(evt);

                return;
            }

            throw new UserException("You do not have permission to delete this invoice.");
        }

        public InvoicePayment CreatePayment(int pieces)
        {
            if (Status != InvoiceStatus.Active && Status != InvoiceStatus.PendingPay)
                throw new UserException("Invoice not active.");
            InvoicePayment payment = Payments.FirstOrDefault(p =>
                p.Status == InvoicePaymentStatus.Pending && p.Owner.UserId == requester.UserId);
            if (payment != null)
                throw new AlreadyCreatedException(payment);
            payment = new InvoicePayment(this, pieces, db);
            if (IsPrivate)
                Status = InvoiceStatus.PendingPay;

            if (!IsPrivate && LimitLiquidity)
            {
                PiecesMax -= pieces;
                if (PiecesMax < PiecesMin)
                    Status = InvoiceStatus.NoPieces;
            }

            Payments.Add(payment);

            return payment;
        }

        public void OnPay(InvoicePayment payment)
        {
            if (IsPrivate)
                Status = InvoiceStatus.Payed;
            else
            {
                if (LimitLiquidity && Status == InvoiceStatus.NoPieces &&
                    Payments.All(p => p.Status != InvoicePaymentStatus.Pending))
                    Status = InvoiceStatus.Payed;
            }

            PaymentsCount++;
            TotalPayedCrypto += payment.CryptoAmount;
            Refund?.OnRefundPayed(this);
        }

        public void OnCancelPayment(InvoicePayment payment)
        {
            if (IsPrivate)
                Status = InvoiceStatus.Active;
            if (!IsPrivate && LimitLiquidity)
            {
                PiecesMax += payment.Pieces;
                if (PiecesMax >= PiecesMin)
                    Status = InvoiceStatus.Active;
            }
        }

        public void UpdatePublicInvoice(decimal price, string priceVariable, bool isBaseCrypto,
            Catalog.Currencies fiatCurrency,
            string comment, int piecesMin, int piecesMax, bool limitLiquidity, List<Guid> imagesIds, bool noIntegration,
            string url, string clientKey, string clientCert, string serverCert,
            bool webhookRequired)
        {
            if (IsPrivate)
                throw new UserException("You can update only public invoices");
            if (Owner.UserId != db.User.UserId)
                throw new UserException("you do not have permission to update this invoice.");
            if (Status != InvoiceStatus.Active)
                throw new UserException("You can't update deleted invoice");

            Price = price;
            PriceVariable = priceVariable;
            IsBaseCrypto = isBaseCrypto;
            FiatCurrency = fiatCurrency;
            Comment = comment;
            PiecesMin = piecesMin;
            PiecesMax = piecesMax;
            LimitLiquidity = limitLiquidity;
            var images = requester.ImagesData.GetImagesInternal(imagesIds);
            List<Image> toRemove = new List<Image>();
            foreach (var image in Images)
            {
                if (images.All(p => p.Id != image.Id))
                    requester.Images.Remove(image);
            }

            Images = images;

            UpdatePrices().ConfigureAwait(false).GetAwaiter().GetResult();

            Status = InvoiceStatus.Active;

            Integration = !noIntegration
                    ? new InvoiceIntegration(this, url, clientKey, clientCert, serverCert, webhookRequired, db)
                    : null;

            var not = new InvoiceChangedNotification(this, db.SourceType);
            db.Notify(not);
        }

        public Conversation NewMessage(string toUserId, string message, List<Guid> imagesIds)
        {
            if (Refund != null)
                throw new UserException("You cant start conversation in refund invoice.");
            var conv = Conversations.FirstOrDefault(p =>
                p.Seller.UserId == requester.UserId && p.Buyer.UserId == toUserId ||
                p.Buyer.UserId == requester.UserId);
            if (conv == null)
            {
                conv = new Conversation(this, message, imagesIds, db);
                _conversations.Add(conv);
            }
            else
                conv.NewMessage(message, imagesIds);

            return conv;
        }

        public InvoiceSecret CreateSecret(string text, List<Guid> images, int order)
        {
            var secret = new InvoiceSecret(this, text, images, order, db);
            var secrets = Secrets.ToList();
            secrets.Insert(order, secret);
            Secrets = secrets;
            return secret;
        }

        private InvoiceSecret UpSecret(InvoiceSecret secret)
        {
            if (secret.Order == 0)
                throw new UserException("Secret already in first position.");
            var secrets = Secrets.ToList();
            secrets.Remove(secret);
            secrets.Insert(secret.Order - 1, secret);
            Secrets = secrets;
            return secret;
        }

        private InvoiceSecret DownSecret(InvoiceSecret secret)
        {
            if (secret.Order == Secrets.Max(p => p.Order))
                throw new UserException("Secret already in last position.");
            var secrets = Secrets.ToList();
            secrets.Remove(secret);
            secrets.Insert(secret.Order + 1, secret);
            Secrets = secrets;
            return secret;
        }

        private InvoiceSecret ToTop(InvoiceSecret secret)
        {
            var secrets = Secrets.ToList();
            secrets.Remove(secret);
            secrets.Insert(0, secret);
            Secrets = secrets;
            return secret;
        }

        private InvoiceSecret ToBottom(InvoiceSecret secret)
        {
            var secrets = Secrets.ToList();
            secrets.Remove(secret);
            secrets.Add(secret);
            Secrets = secrets;
            return secret;
        }

        public List<InvoiceSecret> ChangeSecret(SecretOperations operation, long secretId)
        {
            var secret = Secrets.FirstOrDefault(p => p.Id == secretId);
            if (secret == null)
                throw new UserException("Secret not found.");
            switch (operation)
            {
                case SecretOperations.ToUp:
                    UpSecret(secret);
                    break;
                case SecretOperations.ToDown:
                    DownSecret(secret);
                    break;
                case SecretOperations.ToTop:
                    ToTop(secret);
                    break;
                case SecretOperations.ToBottom:
                    ToBottom(secret);
                    break;
                case SecretOperations.Remove:
                    foreach (var image in secret.Images.ToList())
                        requester.Images.Remove(image);
                    var secrets = Secrets.ToList();
                    secrets.Remove(secret);
                    Secrets = secrets;
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return Secrets.ToList();
        }

        public void UpdateSecret(long secretId, int order, string text, List<Guid> images)
        {
            var secret = Secrets.FirstOrDefault(p => p.Id == secretId);
            if (secret == null)
                throw new UserException("Secret not found.");
            if (secret.Order != order)
            {
                var secrets = Secrets.ToList();
                secrets.Remove(secret);
                secrets.Insert(order, secret);
                Secrets = secrets;
            }

            secret.Update(text, images);
        }
    }
}