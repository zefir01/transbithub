using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services.Exceptions;
using LND;
using Microsoft.Extensions.Logging;
using Shared;

#nullable enable

namespace CoreLib.Entitys.LN
{
    public class LnPaymentRequest : Entity
    {
        public enum LnPaymentRequestStatus
        {
            Started,
            Pending,
            Success,
            Failed
        }

        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        public LnPaymentRequestStatus Status
        {
            get => _Status;
            set
            {
                if (_Status == value)
                    throw new Exception();
                
                _Status = value;
                if (_Status == LnPaymentRequestStatus.Failed)
                    Owner.Balance.LnPaymentFailed(this).ConfigureAwait(false).GetAwaiter().GetResult();

                if (Deal == null) return;
                switch (_Status)
                {
                    case LnPaymentRequestStatus.Started:
                        Deal.WithdrawalStatus = DealWithdrawalStatus.Waiting;
                        Deal.WithdrawalError = "";
                        break;
                    case LnPaymentRequestStatus.Pending:
                        Deal.WithdrawalStatus = DealWithdrawalStatus.Started;
                        Deal.WithdrawalError = "";
                        break;
                    case LnPaymentRequestStatus.Success:
                        Deal.WithdrawalStatus = DealWithdrawalStatus.Success;
                        Deal.WithdrawalError = "";
                        break;
                    case LnPaymentRequestStatus.Failed:
                        Deal.WithdrawalStatus = DealWithdrawalStatus.Failed;
                        Deal.WithdrawalError = Error;
                        Owner.Balance.LnPaymentFailed(this).ConfigureAwait(false).GetAwaiter().GetResult();
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
                Deal.DealChanged();
            }
        }

        private LnPaymentRequestStatus _Status = LnPaymentRequestStatus.Started;
        public string Error { get; set; } = "";
        [ForeignKey("deal_fk")] public virtual Deal? Deal { get; set; }
        [ForeignKey("owner_fk")] public virtual UserData Owner { get; private set; }
        public decimal FeeFromBalance { get; private set; }
        public decimal Amount { get; private set; }
        public string Description { get; private set; } = "";
        public string Bolt11 { get; private set; } = "";
        public decimal Fee { get; private set; }
        public string PaymentHash { get; private set; } = "";

#pragma warning disable 8618
        public LnPaymentRequest(DataDBContext db) : base(db)
#pragma warning restore 8618
        {
        }

        private void HaveResult(Payment payment)
        {
            var fee = payment.FeeMsat / 1000 * Config.Satoshi;
            db.Logger.LogDebug($"fee: {fee}");
            if (fee < Config.Satoshi)
                fee = Config.Satoshi;
            if (Owner.Balance.Balance < fee)
                FeeFromBalance = Owner.Balance.Balance;
            else
                FeeFromBalance = fee;
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddMilliseconds(payment.CreationTimeNs / Math.Pow(10, 6)).ToLocalTime();
            CreatedAt = dtDateTime;
            Fee = fee;

            if(payment.Status==Payment.Types.PaymentStatus.Failed)
                Error = payment.FailureReason switch
                {
                    PaymentFailureReason.FailureReasonNone => "",
                    PaymentFailureReason.FailureReasonTimeout => "Timeout.",
                    PaymentFailureReason.FailureReasonNoRoute => "Not suitable route.",
                    PaymentFailureReason.FailureReasonError => "LND error.",
                    PaymentFailureReason.FailureReasonIncorrectPaymentDetails => "Incorrect payment details",
                    PaymentFailureReason.FailureReasonInsufficientBalance => "Insufficient balance",
                    _ => throw new ArgumentOutOfRangeException()
                };
            Status = payment.Status switch
            {
                Payment.Types.PaymentStatus.Unknown => LnPaymentRequestStatus.Pending,
                Payment.Types.PaymentStatus.InFlight => LnPaymentRequestStatus.Pending,
                Payment.Types.PaymentStatus.Succeeded => LnPaymentRequestStatus.Success,
                Payment.Types.PaymentStatus.Failed => LnPaymentRequestStatus.Failed,
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        public LnPaymentRequest(DataDBContext db, UserData owner, string invoice, decimal? amount = null) : base(db)
        {
            Owner = owner;
            Bolt11 = invoice;

            var decoded = db.LndClient.Decode(invoice).ConfigureAwait(false).GetAwaiter().GetResult();
            Description = decoded.Description;
            PaymentHash = decoded.PaymentHash;
            var found = Owner.LNPaymentRequests.FirstOrDefault(p => p.PaymentHash == decoded.PaymentHash);
            if (found != null)
                throw new UserException("This invoice has already been paid.");
            Owner.LNPaymentRequests.Add(this);

            decimal am = Math.Round(decoded.NumSatoshis * Config.Satoshi, 8);
            if (am == 0 && !amount.HasValue)
                throw new UserException("Invoice doesn't have amount. Specify amount as request field.");
            if (am == 0 && amount.HasValue)
                am = amount.Value;
            Amount = am;
            if (Owner.Balance.Balance < am)
                throw new UserException("Not enough money.");
            
        }

        public async Task Pay()
        {
            try
            {
                (PayReq decoded, Payment payment) result = await db.LndClient.Pay(Owner, Bolt11, Amount);
                HaveResult(result.payment);
            }
            catch (UserException e)
            {
                Error = e.Message;
                Status = LnPaymentRequestStatus.Failed;
                db.Logger.LogWarning($"Failed ln payment: bolt11={Bolt11} amount={Amount} error={e.Message}");
            }
            catch (Exception e)
            {
                db.Logger.LogError(e, e.Message);
                Status = LnPaymentRequestStatus.Failed;
                throw;
            }
        }
    }
}

