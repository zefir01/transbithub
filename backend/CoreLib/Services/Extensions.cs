using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Entitys.Snapshots;
using CoreLib.Entitys.UserDataParts;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Protos.Adminka.V1;
using Protos.TradeApi.V1;
using Shared;
using Shared.Protos;
using Advertisement = Protos.TradeApi.V1.Advertisement;
using Conversation = Protos.TradeApi.V1.Conversation;
using ConversationMessage = Protos.TradeApi.V1.ConversationMessage;
using Deal = Protos.TradeApi.V1.Deal;
using DealMessage = Protos.TradeApi.V1.DealMessage;
using Enum = System.Enum;
using Image = Protos.TradeApi.V1.Image;
using Invoice = Protos.TradeApi.V1.Invoice;
using InvoicePayment = Protos.TradeApi.V1.InvoicePayment;
using InvoiceSecret = Protos.TradeApi.V1.InvoiceSecret;
using TimeTableItem = Protos.TradeApi.V1.TimeTableItem;
using DealStatus = Protos.TradeApi.V1.DealStatus;
using Dispute = CoreLib.Entitys.Dispute;
using LNInvoice = Protos.TradeApi.V1.LNInvoice;
using LNPayment = Protos.TradeApi.V1.LNPayment;
using Webhook = Protos.TradeApi.V1.Webhook;

namespace CoreLib.Services
{
    public static class Extensions
    {
        public static async Task WaitForExitAsync(this Process process, CancellationToken cancellationToken = default)
        {
            var tcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);

            void ProcessExited(object sender, EventArgs e)
            {
                tcs.TrySetResult(true);
            }

            process.EnableRaisingEvents = true;
            process.Exited += ProcessExited;

            try
            {
                if (process.HasExited)
                {
                    return;
                }

                await using (cancellationToken.Register(() => tcs.TrySetCanceled()))
                {
                    await tcs.Task.ConfigureAwait(false);
                }
            }
            finally
            {
                process.Exited -= ProcessExited;
            }
        }

        public static MyProfileResponse ToPb(this UserData data, Auth.Protos.Internal.UserInfo user)
        {
            var response = new MyProfileResponse
            {
                UserId = data.UserId,
                Username = data.UserName,
                Email = user.Email ?? "",
                EnabledTwoFA = user.EnabledTwoFA,
                EmailVerifed = user.EmailVerified,
                Timezone = data.TimeZone ?? "",
                Introduction = data.Introduction ?? "",
                Site = data.Site ?? "",
                SalesDisabled = data.SalesDisabled,
                BuysDisabled = data.BuysDisabled,
                DefaultCurrency = data.DefaultCurrency.ToString(),
                BoughtOptions = data.Options.ToPb(false),
                IsAnonymous = data.IsAnonymous
            };
            return response;
        }

        private static List<TimeTableItemData> GetTimeTableItems(AdvertisementData ad)
        {
            List<TimeTableItemData> items = new List<TimeTableItemData>();
            foreach (var item in ad.TimeTable)
            {
                if (item.Start >= item.End)
                    throw new UserException("Error in timetable.");

                Days day = item.Day switch
                {
                    "sun" => Days.San,
                    "mon" => Days.Mon,
                    "tue" => Days.Tue,
                    "wed" => Days.Wed,
                    "thu" => Days.Thu,
                    "fri" => Days.Fri,
                    "sat" => Days.Sat,
                    _ => throw new UserException("Incorrect day of week.")
                };
                var start = (byte) item.Start;
                var end = (byte) item.End;
                var i = new TimeTableItemData
                {
                    Day = day,
                    Start = start,
                    End = end
                };
                items.Add(i);
            }

            return items;
        }

        public static AdData ToData(this AdvertisementData request)
        {
            var data = new AdData
            {
                Equation = request.Equation,
                MinAmount = request.MinAmount.FromPb(),
                MaxAmount = request.MaxAmount.FromPb(),
                Message = request.Message,
                Country = Enum.Parse<Catalog.Countries>(request.Country),
                PaymentType = Enum.Parse<Catalog.PaymentTypes>(request.PaymentType),
                FiatCurrency = Enum.Parse<Catalog.Currencies>(request.FiatCurrency),
                IsBuy = request.IsBuy,
                IsEnabled = request.IsEnabled,
                TimeTable = GetTimeTableItems(request),
                MonitorLiquidity = request.MonitorLiquidity,
                NotAnonymous = request.NotAnonymous,
                Trusted = request.Trusted,
                Title = request.Title,
                Window = request.Window,
                LnEnabled = request.LnFunding,
                LnDisableBalance = request.LnDisableBalance
            };
            if (!request.AutoPriceDelayIsNull)
                data.AutoPriceDelay = (int) request.AutoPriceDelay;
            return data;
        }

        public static Advertisement ToPb(this Entitys.Advertisement ad, string userId)
        {
            var pbAd = new Advertisement
            {
                Id = (ulong) ad.Id,
                Equation = ad.Equation,
                MinAmount = ad.MinAmount.ToPb(),
                MaxAmountRequested = ad.Owner.UserId == userId ? ad.MaxAmount.ToPb() : 0m.ToPb(),
                MaxAmountCalculated = ad.Metadata.MaxAmount.ToPb(),
                Message = ad.Message,
                CreatedAt = Timestamp.FromDateTime(ad.CreatedAt.ToUniversalTime()),
                Country = ad.Country.ToString(),
                PaymentType = ad.PaymentType.ToString(),
                FiatCurrency = ad.FiatCurrency.ToString(),
                IsBuy = ad.IsBuy,
                IsEnabled = ad.IsEnabled,
                Owner = ad.Owner.ToPb(),
                MonitorLiquidity = ad.MonitorLiquidity,
                NotAnonymous = ad.NotAnonymous,
                Trusted = ad.Trusted,
                Title = ad.Title,
                Window = ad.Window,
                Price = ad.Metadata.Price.ToPb(),
                CurrentStatus = ad.Metadata.Status.ToPb(),
                LnEnabled = ad.LnFunding,
                LnDisableBalance = ad.LnDisableBalance
            };
            if (ad.Owner.UserId != userId)
                pbAd.Equation = ad.Metadata.Price.ToString(CultureInfo.InvariantCulture);
            foreach (var item in ad.TimeTable)
            {
                var i = new TimeTableItem
                {
                    Day = item.Day.ToString().ToLower(),
                    Start = item.Start,
                    End = item.End
                };
                pbAd.TimeTable.Add(i);
            }

            if (ad.AutoPriceDelay.HasValue)
                pbAd.AutoPriceDelay = (uint) ad.AutoPriceDelay.Value;
            else
                pbAd.AutoPriceDelayIsNull = true;

            return pbAd;
        }

        public static AdCurrentStatus ToPb(this Entitys.Advertisement.AdMetadata.AdStatus status)
        {
            var res = status switch
            {
                Entitys.Advertisement.AdMetadata.AdStatus.Enabled => AdCurrentStatus.Enabled,
                Entitys.Advertisement.AdMetadata.AdStatus.GlobalDisabled => AdCurrentStatus.GlobalDisabled,
                Entitys.Advertisement.AdMetadata.AdStatus.DisabledByOwner => AdCurrentStatus.DisabledByOwner,
                Entitys.Advertisement.AdMetadata.AdStatus.DisabledByTimetable => AdCurrentStatus.DisabledByTimetable,
                Entitys.Advertisement.AdMetadata.AdStatus.NotEnoughMoney => AdCurrentStatus.NotEnoughMoney,
                _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
            };
            return res;
        }

        public static OddTypes FromPb(this PayInvoiceByPromiseRequest.Types.OddTypes type)
        {
            return type switch
            {
                PayInvoiceByPromiseRequest.Types.OddTypes.NoOdd => OddTypes.NoOdd,
                PayInvoiceByPromiseRequest.Types.OddTypes.ToBalance => OddTypes.ToBalance,
                PayInvoiceByPromiseRequest.Types.OddTypes.ToPromise => OddTypes.ToPromise,
                _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
            };
        }

        public static BoughtOptions ToPb(this UserData.BoughtOptions options, bool hide)
        {
            return new BoughtOptions
            {
                AutoPriceRecalcs = hide ? 0 : (uint) options.AutoPrice
            };
        }

        public static UserInfo ToPb(this UserData userData)
        {
            DateTime firstTrade =
                userData.DealsData.DealDate?.ToUniversalTime() ?? new DateTime().ToUniversalTime();
            firstTrade = DateTime.SpecifyKind(firstTrade, DateTimeKind.Utc);
            var info = new UserInfo
            {
                Id = userData.UserId,
                Introduction = userData.Introduction ?? "",
                Site = userData.Site ?? "",
                Timezone = userData.TimeZone ?? "",
                Username = userData.UserName,
                TradesAvgAmount = userData.DealsData.AvgAmount.ToPb(),
                TradesCount = userData.DealsData.Count,
                CounterpartysCount = userData.DealsData.PartnersCount,
                ResponseRate = userData.DealsData.ResponseRate.ToPb(),
                FirstTradeDate = firstTrade.ToPb(),
                CreatedAt = userData.CreatedAt.ToPb(),
                LastOnline = userData.LastOnline.LastOnline.ToPb(),
                TrustedCount = userData.TrustedCount,
                BlockedCount = userData.BlockedCount,
                AvgDelaySeconds = userData.DealsData.AvgDelaySeconds,
                MedianDelaySeconds = userData.DealsData.MedianDelaySeconds,
                InvoicesCreatedCount = (uint) userData.InvoicesData.InvoiceCreatedCount,
                PaymentsPayedAvgAmount = userData.InvoicesData.PaymentsPayedAvgAmount.ToPb(),
                PaymentsPayedCount = (uint) userData.InvoicesData.PaymentsPayedCount,
                PaymentsReceivedAvgAmount = userData.InvoicesData.PaymentsReceivedAvgAmount.ToPb(),
                PaymentsReceivedCount = (uint) userData.InvoicesData.PaymentsReceivedCount,
                InvoiceResponseRate = userData.InvoicesData.ResponseRate.ToPb(),
                IsAnonymous = userData.IsAnonymous,
            };
            return info;
        }

        public static DealMessage ToPb(this Entitys.DealMessage msg, bool hideSupportId)
        {
            var m = new DealMessage
            {
                CreatedAt = msg.CreatedAt.ToPb(),
                Id = (ulong) msg.Id,
                OwnerId = msg.Owner.IsSupport && hideSupportId ? "" : msg.Owner.UserId,
                Text = msg.Text
            };
            if (msg.Images != null)
                m.ImageIds.AddRange(msg.Images.Select(p => p.Id.ToString()));
            return m;
        }

        public static Deal.Types.WithdrawalStatusMsg.Types.StatusEnum ToPb(this DealWithdrawalStatus status)
        {
            return status switch
            {
                DealWithdrawalStatus.None => Deal.Types.WithdrawalStatusMsg.Types.StatusEnum.None,
                DealWithdrawalStatus.Waiting => Deal.Types.WithdrawalStatusMsg.Types.StatusEnum.Waiting,
                DealWithdrawalStatus.Started => Deal.Types.WithdrawalStatusMsg.Types.StatusEnum.Started,
                DealWithdrawalStatus.Success => Deal.Types.WithdrawalStatusMsg.Types.StatusEnum.Success,
                DealWithdrawalStatus.Failed => Deal.Types.WithdrawalStatusMsg.Types.StatusEnum.Failed,
                _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
            };
        }

        public static Deal ToPb(this Entitys.Deal deal, string userId, bool hideSupportId)
        {
            Deal d = new Deal
            {
                Id = (ulong) deal.Id,
                AdOwnerInfo = deal.Ad.Owner?.ToPb(),
                Advertisement = deal.Ad.ToPb(userId),
                CreatedAt = deal.CreatedAt.ToPb(),
                CompletedAt = deal.CompletedAt.ToTimestampPb(),
                CanceledAt = deal.CanceledAt.ToTimestampPb(),
                DisputedAt = deal.Dispute == null
                    ? DateTime.MinValue.ToPb()
                    : deal.Dispute?.CreatedAt.ToPb(),
                FiatAmount = deal.FiatAmount.ToPb(),
                CryptoAmount = deal.CryptoAmount.ToPb(),
                Status = deal.Status.ToPb(),
                Initiator = deal.Initiator.ToPb(),
                IsFiatPayed = deal.IsFiatPayed,
                DisputeId = (ulong) (deal.Dispute?.Id ?? 0),
                Fee = deal.Fee.ToString(CultureInfo.InvariantCulture),
                FiatPayedAt = deal.FiatPayedAt.ToTimestampPb(),
            };

            if (userId == deal.Initiator.UserId)
                d.WithdrawalStatus = new Deal.Types.WithdrawalStatusMsg
                {
                    Status = deal.WithdrawalStatus.ToPb(),
                    Error = deal.WithdrawalError ?? ""
                };
            else
                d.WithdrawalStatus = new Deal.Types.WithdrawalStatusMsg
                {
                    Status = Deal.Types.WithdrawalStatusMsg.Types.StatusEnum.None,
                    Error = ""
                };


            if (deal.InvoicePayment != null && (deal.InvoicePayment.Owner.UserId == userId ||
                                                deal.InvoicePayment.Invoice.Owner.UserId == userId))
                d.Payment = deal.InvoicePayment.ToPb(userId, true);
            else
                d.PaymentIsNull = true;
            foreach (var message in deal.Messages)
            {
                d.Messages.Add(message.ToPb(hideSupportId));
            }

            if (deal.Promise != null && deal.Initiator.UserId == userId)
                d.PromiseWithdrawal = deal.Promise.GetText().ConfigureAwait(false).GetAwaiter().GetResult();
            else if (!deal.BtcWallet.IsNullOrEmpty() && deal.Initiator.UserId == userId)
                d.BitcoinWithdrawal = deal.BtcWallet;
            else
                d.NoWithdrawal = true;

            if (deal.AdOwnerFeedBack == null)
                d.AdOwnerFeedbackIsnull = true;
            else
                d.AdOwnerFeedback = deal.AdOwnerFeedBack.ToPb();
            if (deal.InitiatorFeedBack == null)
                d.InitiatorFeedbackIsNull = true;
            else
                d.InitiatorFeedback = deal.InitiatorFeedBack.ToPb();

            if (!deal.Ad.IsBuy && deal.AdOwner.UserId == userId && deal.FundingLnInvoice != null)
                d.LnWithdrawal = deal.FundingLnInvoice.Bolt11;
            if (deal.Ad.IsBuy && deal.FundingLnInvoice != null && deal.Initiator.UserId == userId)
                d.LnWithdrawal = deal.FundingLnInvoice.Bolt11;

            if (userId == deal.Initiator.UserId && !deal.Bolt11.IsNullOrEmpty())
                d.LnWithdrawal = deal.Bolt11;

            return d;
        }

        public static Balance ToPb(this UserBalance balance)
        {
            var b = new Balance
            {
                Confirmed = balance.Balance.ToPb(),
                UnConfirmed = balance.UnconfirmedBalance.ToPb(),
                Deposited = balance.Deposited.ToPb()
            };
            return b;
        }

        public static Event ToPb(this UserEvent evt)
        {
            var e = new Event
            {
                CreatedAt = evt.CreatedAt.ToPb(),
                Id = (ulong) evt.Id,
            };
            switch (evt.Type)
            {
                case UserEventTypes.NewDeal:
                    e.DealNew = evt.Deal.ToPb(evt.Receiver.UserId, !evt.Receiver.IsSupport);
                    break;
                case UserEventTypes.DealStatusChanged:
                    e.DealStatusChanged = evt.Deal.ToPb(evt.Receiver.UserId, !evt.Receiver.IsSupport);
                    break;
                case UserEventTypes.NewMessage:
                    e.DealNewMessage = evt.Deal.ToPb(evt.Receiver.UserId, !evt.Receiver.IsSupport);
                    break;
                case UserEventTypes.FiatPayed:
                    e.DealFiatPayed = evt.Deal.ToPb(evt.Receiver.UserId, !evt.Receiver.IsSupport);
                    break;
                case UserEventTypes.BalanceChanged:
                    e.Balance = evt.Balance.ToPb();
                    break;
                case UserEventTypes.NewInvoice:
                    e.InvoiceNew = evt.Invoice.ToPb(evt.Receiver.UserId);
                    break;
                case UserEventTypes.InvoicePayed:
                    e.InvoicePayed = evt.Invoice.ToPb(evt.Receiver.UserId);
                    break;
                case UserEventTypes.InvoiceDeleted:
                    e.InvoiceDeleted = evt.Invoice.ToPb(evt.Receiver.UserId);
                    break;
                case UserEventTypes.InvoicePaymentNew:
                    e.InvoicePaymentNew = evt.InvoicePayment.ToPb(evt.Receiver.UserId);
                    break;
                case UserEventTypes.ConversationNewMessage:
                    e.ConversationNewMessage = evt.Conversation.ToPb(evt.Receiver.UserId);
                    break;
                case UserEventTypes.InvoicePaymentUpdated:
                    e.InvoicePaymentUpdated = evt.InvoicePayment.ToPb(evt.Receiver.UserId);
                    break;
                default:
                    throw new UserException("Unknown event type.");
            }

            return e;
        }

        public static Entitys.DealStatus ToEntity(this DealStatus status)
        {
            return status switch
            {
                DealStatus.Opened => Entitys.DealStatus.Opened,
                DealStatus.Canceled => Entitys.DealStatus.Canceled,
                DealStatus.Completed => Entitys.DealStatus.Completed,
                DealStatus.Disputed => Entitys.DealStatus.Disputed,
                DealStatus.WaitDeposit => Entitys.DealStatus.WaitDeposit,
                _ => throw new UserException("Incorrect dial status")
            };
        }

        public static DealStatus ToPb(this Entitys.DealStatus status)
        {
            return status switch
            {
                Entitys.DealStatus.Opened => DealStatus.Opened,
                Entitys.DealStatus.Canceled => DealStatus.Canceled,
                Entitys.DealStatus.Completed => DealStatus.Completed,
                Entitys.DealStatus.Disputed => DealStatus.Disputed,
                Entitys.DealStatus.WaitDeposit => DealStatus.WaitDeposit,
                _ => throw new UserException("Incorrect dial status")
            };
        }

        public static Feedback ToPb(this DealFeedBack feedback)
        {
            if (feedback == null)
                return null;
            return new Feedback
            {
                IsPositive = feedback.IsPositive,
                Text = feedback.Text,
                CreatedAt = feedback.CreatedAt.ToPb()
            };
        }

        public static Variables ToPb(this IList<(string key, decimal value)> vars)
        {
            var v = new Variables();
            foreach (var vv in vars)
                v.Variables_.Add(vv.key, vv.value.ToPb());
            return v;
        }

        public static Transaction ToPb(this InTransaction transaction)
        {
            Transaction t = new Transaction
            {
                Id = (ulong) transaction.Id,
                TxId = transaction.TxId,
                Amount = transaction.Amount.ToPb(),
                Confirmations = (uint) transaction.Confirmations,
                To = transaction.Address.Address,
                Time = transaction.Time.ToPb()
            };
            return t;
        }

        public static Transaction ToPb(this OutTransaction transaction)
        {
            Transaction t = new Transaction
            {
                Id = (ulong) transaction.Id,
                TxId = transaction.TxId,
                Amount = transaction.Amount.ToPb(),
                Confirmations = (uint) transaction.Confirmations,
                To = transaction.Address,
                Time = transaction.Time.ToPb()
            };
            return t;
        }

        public static Invoice.Types.InvoiceStatus ToPb(this InvoiceStatus status)
        {
            return status switch
            {
                InvoiceStatus.Active => Invoice.Types.InvoiceStatus.Active,
                InvoiceStatus.Payed => Invoice.Types.InvoiceStatus.Payed,
                InvoiceStatus.PendingPay => Invoice.Types.InvoiceStatus.PendingPay,
                InvoiceStatus.Deleted => Invoice.Types.InvoiceStatus.Deleted,
                InvoiceStatus.NoPieces => Invoice.Types.InvoiceStatus.NoPieces,
                _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
            };
        }

        public static Invoice.Types.ServiceType ToPb(this ServiceType type)
        {
            return type switch
            {
                ServiceType.None => Invoice.Types.ServiceType.None,
                ServiceType.AutoPrice => Invoice.Types.ServiceType.AutoPrice,
                _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
            };
        }

        public static Invoice ToPb(this Entitys.Invoices.Invoice invoice, string userId)
        {
            var inv = new Invoice
            {
                Id = (ulong) invoice.Id,
                Price = invoice.Price.ToPb(),
                PriceVariable = invoice.PriceVariable,
                IsBaseCrypto = invoice.IsBaseCrypto,
                IsPrivate = invoice.IsPrivate,
                TtlMinutes = (uint) invoice.TtlMinutes,
                Owner = invoice.Owner.ToPb(),
                FiatCurrency = invoice.FiatCurrency.ToString(),
                Comment = invoice.Comment,
                PiecesMin = (uint) invoice.PiecesMin,
                PiecesMax = (uint) invoice.PiecesMax,
                TotalPayedCrypto = invoice.TotalPayedCrypto.ToPb(),
                PaymentsCount = (uint) invoice.PaymentsCount,
                CreatedAt = invoice.CreatedAt.ToPb(),
                ValidTo = invoice.ExpireTime.ToTimestampPb(),
                Fee = invoice.Fee.ToPb(),
                LimitLiquidity = invoice.LimitLiquidity,
                CurrentCryptoPrice = invoice.CurrentCryptoPrice.ToPb(),
                Service = invoice.IsService.ToPb(),
                SecretsCount = userId != invoice.Owner.UserId ? 0 : (uint) invoice.Secrets.Count(p => p.Payment == null)
            };
            inv.Images.AddRange(invoice.Images.Select(p => p.Id.ToString()));
            if (invoice.TargetUser == null)
                inv.TargetUserIsNull = true;
            else
                inv.TargetUser = invoice.TargetUser.ToPb();
            if (invoice.Refund != null)
                inv.RefundPaymentId = (ulong) invoice.Refund.Id;
            else
                inv.RefundIsNull = true;
            if (invoice.Owner.UserId == userId)
                inv.Status = invoice.Status.ToPb();
            else if (invoice.TargetDeleted)
                inv.Status = Invoice.Types.InvoiceStatus.Deleted;
            else
                inv.Status = invoice.Status.ToPb();

            if (invoice.Integration != null)
            {
                if (invoice.Integration.Type == InvoiceIntegration.IntegrationType.Redirect)
                {
                    inv.Redirect = invoice.Integration.Redirect;
                }
                else
                {
                    if (userId == invoice.Owner.UserId)
                        inv.Webhook = invoice.Integration.Webhook.ToPb();
                    else
                        inv.NoIntegration = true;
                }
            }
            else
                inv.NoIntegration = true;

            return inv;
        }

        public static Invoice ToPb(this InvoiceSnapshot invoice, string userId)
        {
            var inv = new Invoice
            {
                Id = (ulong) invoice.Id,
                Price = invoice.Price.ToPb(),
                PriceVariable = invoice.PriceVariable,
                IsBaseCrypto = invoice.IsBaseCrypto,
                IsPrivate = invoice.IsPrivate,
                TtlMinutes = (uint) invoice.TtlMinutes,
                Owner = invoice.Owner.ToPb(),
                FiatCurrency = invoice.FiatCurrency.ToString(),
                Comment = invoice.Comment,
                PiecesMin = (uint) invoice.PiecesMin,
                PiecesMax = (uint) invoice.PiecesMax,
                TotalPayedCrypto = invoice.TotalPayedCrypto.ToPb(),
                PaymentsCount = (uint) invoice.PaymentsCount,
                CreatedAt = invoice.CreatedAt.ToPb(),
                ValidTo = invoice.ExpireTime.ToTimestampPb(),
                Fee = invoice.Fee.ToPb(),
                LimitLiquidity = invoice.LimitLiquidity,
                CurrentCryptoPrice = invoice.CurrentCryptoPrice.ToPb()
            };
            if (invoice.TargetUser == null)
                inv.TargetUserIsNull = true;
            else
                inv.TargetUser = invoice.TargetUser.ToPb();
            inv.RefundIsNull = true;
            if (invoice.Owner.UserId == userId)
                inv.Status = invoice.Status.ToPb();
            else if (invoice.TargetDeleted)
                inv.Status = Invoice.Types.InvoiceStatus.Deleted;
            else
                inv.Status = invoice.Status.ToPb();

            return inv;
        }

        private static InvoicePayment.Types.InvoicePaymentStatus ToPb(this InvoicePaymentStatus status)
        {
            var res = status switch
            {
                InvoicePaymentStatus.Pending => InvoicePayment.Types.InvoicePaymentStatus.Pending,
                InvoicePaymentStatus.Paid => InvoicePayment.Types.InvoicePaymentStatus.Paid,
                InvoicePaymentStatus.Canceled => InvoicePayment.Types.InvoicePaymentStatus.Canceled,
                _ => throw new Exception("Incorrect enum value")
            };
            return res;
        }

        public static InvoicePayment ToPb(this Entitys.Invoices.InvoicePayment payment,
            string userId, bool skipDeal = false)
        {
            var p = new InvoicePayment
            {
                Status = payment.Status.ToPb(),
                CreatedAt = payment.CreatedAt.ToPb(),
                CryptoAmount = payment.CryptoAmount.ToPb(),
                Id = (ulong) payment.Id,
                Confirmation = payment.Confirmation,
                Owner = payment.Owner.ToPb(),
                OwnerFeedback = payment.OwnerFeedback.ToPb(),
                SellerFeedback = payment.SellerFeedback.ToPb(),
                Pieces = (uint) payment.Pieces,
                IsRefund = payment.IsRefund,
                Refunded = (uint) payment.Refunded,
                Refunding = (uint) payment.Refunding,
                OddPromise = payment.Owner.UserId == userId
                    ? payment.OddPromise?.GetText().ConfigureAwait(false).GetAwaiter().GetResult() ?? ""
                    : ""
            };

            p.Secrets.AddRange(payment.Secrets.Select(p => p.ToPb()));

            if (payment.OwnerFeedback == null)
                p.OwnerFeedbackIsNull = true;
            else
                p.OwnerFeedback = payment.OwnerFeedback.ToPb();

            if (payment.SellerFeedback == null)
                p.SellerFeedbackIsNull = true;
            else
                p.SellerFeedback = payment.SellerFeedback.ToPb();

            if (skipDeal || payment.Deal == null || userId != payment.Owner.UserId)
                p.DealIsNull = true;
            else
                p.Deal = payment.Deal.ToPb(userId, true);

            if (payment.Invoice.IsPrivate)
                p.Invoice = payment.Invoice.ToPb(userId);
            else
                p.Invoice = payment.InvoiceSnapshot.ToPb(userId);

            if (payment.Invoice.Owner.UserId == userId)
                foreach (var refund in payment.Refunds)
                    p.Refunds.Add(refund.ToPb(userId));

            if (userId == payment.Owner.UserId && payment.LNInvoice?.Bolt11 != null)
                p.LNInvoice = payment.LNInvoice.Bolt11;

            return p;
        }

        public static Stream ToStream(this string str)
        {
            return new MemoryStream(Encoding.UTF8.GetBytes(str));
        }

        public static LastAdSearchParams ToPb(this UserData.ILastAdSearch searchParams)
        {
            if (searchParams == null)
                return new LastAdSearchParams();
            return new LastAdSearchParams
            {
                Amount = searchParams.Amount.ToPb(),
                Country = searchParams.Country.ToString(),
                Currency = searchParams.Currency.ToString(),
                PaymentType = searchParams.PaymentType.ToString()
            };
        }

        public static Feedback ToPb(this Entitys.Invoices.InvoicePaymentFeedback feedback)
        {
            if (feedback != null)
                return new Feedback
                {
                    Id = (ulong) feedback.Id,
                    IsPositive = feedback.IsPositive,
                    Text = feedback.Message,
                    CreatedAt = feedback.CreatedAt.ToPb()
                };
            return new Feedback();
        }

        public static ConversationMessage ToPb(this Entitys.Invoices.ConversationMessage message)
        {
            var msg = new ConversationMessage
            {
                Id = (ulong) message.Id,
                OwnerId = message.Owner.UserId,
                Text = message.Text ?? "",
                CreatedAt = message.CreatedAt.ToPb()
            };
            msg.Images.AddRange(message.Images.Select(p => p.Id.ToString()));
            return msg;
        }

        public static Conversation ToPb(this Entitys.Invoices.Conversation conv, string userId)
        {
            var c = new Conversation
            {
                Id = (ulong) conv.Id,
                Buyer = conv.Buyer.ToPb(),
                Seller = conv.Seller.ToPb()
            };
            foreach (var message in conv.Messages)
                c.Messages.Add(message.ToPb());
            if (conv.Invoice != null)
                c.Invoice = conv.Invoice.ToPb(userId);
            else
                c.Payment = conv.Payment.ToPb(userId);
            return c;
        }

        public static Image ToPb(this Entitys.Image image, bool isPreview)
        {
            var img = new Image
            {
                CreatedAt = image.CreatedAt.ToPb(),
                Id = image.Id.ToString(),
                IsPreview = isPreview,
            };
            if (isPreview)
                img.Preview = ByteString.CopyFrom(image.Preview);
            else
                img.Original = ByteString.CopyFrom(image.Original);
            return img;
        }

        public static InvoiceSecret ToPb(this Entitys.Invoices.InvoiceSecret secret)
        {
            var s = new InvoiceSecret
            {
                Id = (ulong) secret.Id,
                Order = (uint) secret.Order,
                Text = secret.Text,
                Url = secret.Url ?? ""
            };
            if (secret.Payment != null)
                s.PaymentId = (ulong) secret.Payment.Id;
            else
                s.PaymentIdIsNull = true;

            s.Images.AddRange(secret.Images.Select(p => p.Id.ToString()));
            return s;
        }

        public static InvoiceSecretsList ToPb(this List<Entitys.Invoices.InvoiceSecret> secrets)
        {
            var list = new InvoiceSecretsList();
            list.Secrets.AddRange(secrets.Select(p => p.ToPb()));
            return list;
        }

        public static LNInvoice ToPb(this Entitys.LN.LNInvoice invoice)
        {
            var i = new LNInvoice
            {
                Id = invoice.Id.ToString(),
                Amount = invoice.Amount.ToPb(),
                Bolt11 = invoice.Bolt11,
                CreatedAt = invoice.CreatedAt.ToPb(),
                Description = invoice.Description,
                ExpiresIn = (uint) (invoice.ExpiresIn - invoice.CreatedAt).TotalSeconds,
                IsPaid = invoice.Status == Entitys.LN.LNInvoice.LNInvoiceStatus.Paid,
            };
            if (invoice.Payment == null)
                i.NoRelations = true;
            else
                i.PaymentId = (ulong) invoice.Payment.Id;
            return i;
        }

        public static LNPaymentStatus ToPb(this LnPaymentRequest.LnPaymentRequestStatus status)
        {
            return status switch
            {
                LnPaymentRequest.LnPaymentRequestStatus.Started => LNPaymentStatus.Started,
                LnPaymentRequest.LnPaymentRequestStatus.Pending => LNPaymentStatus.Pending,
                LnPaymentRequest.LnPaymentRequestStatus.Success => LNPaymentStatus.Success,
                LnPaymentRequest.LnPaymentRequestStatus.Failed => LNPaymentStatus.Failed,
                _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
            };
        } 
        public static LNPayment ToPb(this Entitys.LN.LnPaymentRequest payment)
        {
            var p = new LNPayment
            {
                Amount = payment.Amount.ToPb(),
                Bolt11 = payment.Bolt11,
                CreatedAt = payment.CreatedAt.ToPb(),
                Description = payment.Description,
                Id = payment.Id.ToString(),
                Status = payment.Status.ToPb(),
                Error = payment.Error
            };
            return p;
        }

        public static Webhook ToPb(this Entitys.Invoices.Webhook webhook)
        {
            return new Webhook
            {
                ClientCrt = webhook.ClientCert,
                ClientKey = webhook.ClientKey,
                ServerCrt = webhook.ServerCert,
                Required = webhook.Required,
                Url = webhook.Url
            };
        }

        public static Protos.Adminka.V1.Dispute ToPb(this Dispute dispute)
        {
            return new()
            {
                DealId = (ulong) dispute.Deal.Id,
                ArbitorId = dispute.Arbitor?.UserId ?? "",
                CreatedAt = dispute.CreatedAt.ToPb(),
                AdOwnerInfo = dispute.Deal.AdOwner.ToPb(),
                FiatAmount = dispute.Deal.FiatAmount.ToPb(),
                FiatCurrency = dispute.Deal.Ad.FiatCurrency.ToString(),
                Initiator = dispute.Deal.Initiator.ToPb(),
                IsBuy = dispute.Deal.Ad.IsBuy,
                PaymentType = dispute.Deal.Ad.PaymentType.ToString(),
                Completed = dispute.Deal.Status != Entitys.DealStatus.Disputed
            };
        }
    }
}