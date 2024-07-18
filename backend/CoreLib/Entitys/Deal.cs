using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Entitys.UserDataParts;
using Microsoft.Extensions.Logging;
using Shared;

namespace CoreLib.Entitys
{
    public enum DealStatus
    {
        Opened,
        Completed,
        Canceled,
        Disputed,
        WaitDeposit
    }

    public enum DealWithdrawalStatus
    {
        None,
        Waiting,
        Started,
        Success,
        Failed,
    }

    public class DealMessage
    {
        [Key] public long Id { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public virtual UserData Owner { get; private set; }
        public string Text { get; private set; }
        private List<Image> _Images = new List<Image>();

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

        [ForeignKey("deal_fk")] public virtual Deal Deal { get; private set; }

        public DealMessage(UserData owner, string text, List<Image> images, Deal deal)
        {
            if (text?.Length > 1000)
                throw new UserException("Message maximum length is 1000.");
            Owner = owner;
            Text = text;
            CreatedAt = DateTime.Now;
            Images = images;
            Deal = deal;
        }

        public DealMessage()
        {
        }
    }

    public class Deal : Entity
    {
        public struct BuyPromiseParam
        {
            public string PromisePassword;
        }

        public decimal FiatAmount { get; private set; }
        public decimal CryptoAmount { get; private set; }
        public DateTime CreatedAt { get; private set; }
        private List<DealMessage> _Messages = new List<DealMessage>();
        public virtual IReadOnlyList<DealMessage> Messages => _Messages;
        public DealStatus Status { get; private set; }
        public DateTime? CompletedAt { get; private set; }
        public DateTime? CanceledAt { get; private set; }
        public bool IsFiatPayed { get; private set; }
        public DateTime? FiatPayedAt { get; private set; }
        public virtual DealFeedBack AdOwnerFeedBack { get; private set; }
        public virtual DealFeedBack InitiatorFeedBack { get; private set; }
        public virtual Dispute Dispute { get; private set; }
        public virtual Advertisement Ad { get; private set; }
        public virtual UserData Initiator { get; private set; }
        public virtual UserData AdOwner { get; private set; }
        public string BtcWallet { get; private set; }
        public decimal Fee { get; private set; }
        public DateTime AutoCancelTime { get; private set; }
        public virtual Promise Promise { get; private set; }
        public virtual LNInvoice FundingLnInvoice { get; private set; }
        [ForeignKey("invoice_payment_fk")] public virtual InvoicePayment InvoicePayment { get; private set; }
        public string Bolt11 { get; private set; }
        public DealWithdrawalStatus WithdrawalStatus { get; set; } = DealWithdrawalStatus.None;
        public string WithdrawalError { get; set; } = "";
        public virtual OutTransactionRequest WithdrawalBtcRequest { get; set; }
        public virtual LnPaymentRequest WithdrawalLNPaymentRequest { get; set; }

        public Deal(DataDBContext db) : base(db)
        {
        }

        /// <summary>
        /// Sell from LN
        /// </summary>
        /// <param name="ad">Advertisement</param>
        /// <param name="fiatAmount">Amount to sell</param>
        /// <param name="lnFunding">just for overload</param>
        /// <param name="db">DB Context</param>
        public Deal(Advertisement ad, decimal? fiatAmount, decimal? cryptoAmount, bool lnFunding, DataDBContext db) :
            this(ad, fiatAmount, cryptoAmount, null, db, null, lnFunding)
        {
        }

        public Deal(Advertisement ad, decimal? fiatAmount, decimal? cryptoAmount, string btcWallet,
            DataDBContext db, Promise promise = null, bool lnFunding = false, string bolt11 = null) : base(db)
        {
            if (promise != null)
            {
                Promise = promise;
                promise.Deal = this;
                Promise.Locked = true;
            }

            if (ad.Owner.UserId == db.User.UserId)
                throw new UserException("You cannot create deal with your advertisement.");

            decimal crAmount = cryptoAmount ?? 0;
            decimal fAmount = fiatAmount ?? 0;
            if (!bolt11.IsNullOrEmpty())
            {
                (fAmount, crAmount) = bolt11.GetAmounts(fiatAmount, cryptoAmount, ad, db.Config);
                Bolt11 = bolt11;
            }
            else if (fiatAmount.HasValue && !cryptoAmount.HasValue)
                crAmount = Math.Round(fiatAmount.Value / ad.Metadata.Price, 8);
            else if (!fiatAmount.HasValue && cryptoAmount.HasValue)
                fAmount = Math.Round(cryptoAmount.Value * ad.Metadata.Price, 2);
            else if (fiatAmount.HasValue && cryptoAmount.HasValue)
                crAmount = Math.Round(fiatAmount.Value / ad.Metadata.Price, 8);
            else
                throw new UserException("Amount required.");

            CreatedAt = DateTime.Now;
            Status = DealStatus.Opened;
            Ad = ad;
            Initiator = requester;
            AdOwner = ad.Owner;
            FiatAmount = fAmount;
            CryptoAmount = crAmount;
            _Messages = new List<DealMessage>();
            BtcWallet = btcWallet;
            Fee = Math.Round(CryptoAmount * Config.DealFee, 8);
            AutoCancelTime = CreatedAt.AddMinutes(ad.Window);

            if (ad.LnFunding)
            {
                decimal lnAmount;
                if (ad.LnDisableBalance)
                    lnAmount = CryptoAmount + Fee;
                else
                {
                    var need = AdOwner.Balance.Balance - CryptoAmount - Fee;
                    if (need >= 0)
                        lnAmount = 0;
                    else
                    {
                        lnAmount = -1 * need;
                    }
                }

                if (lnAmount == 0)
                    return;

                Status = DealStatus.WaitDeposit;
                var inv = db.LndClient.CreateInvoice($"Funding a deal by AD {ad.Title}", lnAmount,
                    Config.DealLnFundingTimeSec).ConfigureAwait(false).GetAwaiter().GetResult();
                FundingLnInvoice = new LNInvoice(ad.Owner, inv, this);
            }
            else if (lnFunding)
            {
                Status = DealStatus.WaitDeposit;
                var inv = db.LndClient.CreateInvoice($"Funding a deal by AD {ad.Title}", crAmount,
                    Config.DealLnFundingTimeSec).ConfigureAwait(false).GetAwaiter().GetResult();
                FundingLnInvoice = new LNInvoice(Initiator, inv, this);
            }
        }

        public Deal(InvoicePayment payment, Advertisement ad, in decimal? fiatAmount, in decimal? cryptoAmount,
            string wallet, DataDBContext db) :
            this(ad, fiatAmount, cryptoAmount, wallet, db)
        {
            InvoicePayment = payment;
        }

        public async Task LnFunded()
        {
            if (Status != DealStatus.WaitDeposit)
                return;
            Status = DealStatus.Opened;
            await FundingLnInvoice.Owner.Balance.DealChanged(this);
            await NotifyAd();
            DealChanged();
        }

        public Task<DealMessage> NewMessage(string text, List<Image> images)
        {
            if (Status == DealStatus.Canceled || Status == DealStatus.Completed || Status == DealStatus.WaitDeposit)
                throw new UserException($"Deal status is {Status}. Deal cannot accept messages.");
            var msg = new DealMessage(requester, text, images, this);
            _Messages.Add(msg);
            return Task.FromResult(msg);
        }

        public async Task Cancel()
        {
            if (Status == DealStatus.Canceled)
                return;
            if (requester != null && source != SourceType.Service)
            {
                if (requester.UserId != Ad.Owner.UserId && requester.UserId != Initiator.UserId)
                    throw new UserException("You dont have permissions for this deal.");
                if (Status != DealStatus.Opened && Status != DealStatus.WaitDeposit)
                    throw new UserException("Deal not opened.");
                if (IsFiatPayed && AutoCancelTime > DateTime.Now)
                    throw new UserException("Fiat money paid. Deal cannot be canceled.");
            }

            Status = DealStatus.Canceled;
            CanceledAt = DateTime.Now;
            await AdOwner.Balance.DealChanged(this);
            if (Promise == null)
                await Initiator.Balance.DealChanged(this);
            await NotifyAd();
            DealChanged();
            InvoicePayment?.OnDealCanceled();
            OnPromise();
        }

        private async Task NotifyAd()
        {
            await Ad.DealStatusChanged(this);
        }

        public async Task Payed()
        {
            if (Status != DealStatus.Opened && Status != DealStatus.Disputed)
                throw new UserException($"Deal not Opened or Disputed.");

            if (Ad.IsBuy && requester.UserId == Ad.Owner.UserId ||
                !Ad.IsBuy && requester.UserId == Initiator.UserId)
            {
                if (IsFiatPayed)
                    throw new UserException("Fiat money paid. You cannot pay a second time.");
                IsFiatPayed = true;
                FiatPayedAt = DateTime.Now;
            }
            else
            {
                Status = DealStatus.Completed;
                CompletedAt = DateTime.Now;
                var b1 = Initiator.Balance;
                var b2 = AdOwner.Balance;
                await b1.DealChanged(this);
                await b2.DealChanged(this);
                b1.Owner.DealsData.UpdateStats(this);
                b2.Owner.DealsData.UpdateStats(this);
                await NotifyAd();
                if (InvoicePayment != null)
                    await InvoicePayment?.OnDealCompeted();
                OnPromise();
            }

            DealChanged();
        }

        public async Task AdminChangeStatus(DealStatus newStatus)
        {
            if (newStatus != DealStatus.Canceled && newStatus != DealStatus.Completed)
                throw new UserException("Incorrect new status.");
            switch (newStatus)
            {
                case DealStatus.Completed:
                    CompletedAt = DateTime.Now;
                    break;
                case DealStatus.Canceled:
                    CanceledAt = DateTime.Now;
                    break;
            }

            Status = newStatus;
            await Initiator.Balance.DealChanged(this);
            await AdOwner.Balance.DealChanged(this);
            Initiator.Balance.Owner.DealsData.UpdateStats(this);
            AdOwner.Balance.Owner.DealsData.UpdateStats(this);
            if (Status == DealStatus.Completed && InvoicePayment != null)
                await InvoicePayment.OnDealCompeted();
            if (Status == DealStatus.Canceled)
                InvoicePayment?.OnDealCanceled();
            OnPromise();
            await NotifyAd();
            DealChanged();
        }

        private void OnPromise()
        {
            if (Promise == null)
                return;

            if (Ad.IsBuy)
            {
                switch (Status)
                {
                    case DealStatus.Canceled:
                        Promise.Locked = false;
                        Promise = null;
                        break;
                    case DealStatus.Completed:
                        db.Promises.Remove(Promise);
                        break;
                }
            }
            else
            {
                switch (Status)
                {
                    case DealStatus.Canceled:
                        db.Promises.Remove(Promise);
                        break;
                    case DealStatus.Completed:
                        Promise.Locked = false;
                        break;
                }
            }
        }

        public void NewFeedback(bool isPositive, string text)
        {
            if (AdOwner.UserId == requester.UserId)
            {
                if (AdOwnerFeedBack != null)
                    throw new UserException("You can't send feedback twice.");
                AdOwnerFeedBack = new DealFeedBack(requester, Initiator, isPositive, text);
                Initiator.DealsData.NewDealFeedback(AdOwnerFeedBack);
            }

            if (Initiator.UserId == requester.UserId)
            {
                if (InitiatorFeedBack != null)
                    throw new UserException("You can't send feedback twice.");
                InitiatorFeedBack = new DealFeedBack(requester, AdOwner, isPositive, text);
                AdOwner.DealsData.NewDealFeedback(InitiatorFeedBack);
            }

            DealChanged();
        }

        public void StartDispute()
        {
            if (Status != DealStatus.Opened)
                throw new UserException("You can't create dispute for not open deal.");
            if (CreatedAt.AddMinutes(Ad.Window) < DateTime.Now)
                throw new UserException("You cannot create a dispute after the end of the deal window.");
            Status = DealStatus.Disputed;
            Dispute = new Dispute(this, db);
            DealChanged();
        }

        public async Task<DealMessage> SendMessage(string text, List<Image> images)
        {
            if (images.Any())
            {
                var msg1 = await NewMessage(text, images);
                MessageCreated(msg1);
                return msg1;
            }

            var msg = await NewMessage(text, new List<Image>());
            MessageCreated(msg);
            return msg;
        }


        public void DealChanged(bool forceInitiator = false)
        {
            UserEventTypes GetDealStatus()
            {
                if (Status == DealStatus.Opened || Status == DealStatus.WaitDeposit)
                    return UserEventTypes.NewDeal;
                return UserEventTypes.DealStatusChanged;
            }

            if (forceInitiator)
            {
                var evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = this,
                    DealMessage = null,
                    Creater = null,
                    Receiver = Initiator,
                    Type = GetDealStatus(),
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);
                return;
            }

            UserData receiver;
            if (requester == null || requester.IsSupport)
            {
                var evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = this,
                    DealMessage = null,
                    Creater = null,
                    Receiver = Initiator,
                    Type = GetDealStatus(),
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);

                evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = this,
                    DealMessage = null,
                    Creater = null,
                    Receiver = AdOwner,
                    Type = GetDealStatus(),
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);
            }
            else if (AdOwner.UserId == requester.UserId)
            {
                receiver = Initiator;
                var evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = this,
                    DealMessage = null,
                    Creater = requester,
                    Receiver = receiver,
                    Type = GetDealStatus(),
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);
            }
            else if (Initiator.UserId == requester.UserId)
            {
                receiver = AdOwner;
                var evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = this,
                    DealMessage = null,
                    Creater = requester,
                    Receiver = receiver,
                    Type = GetDealStatus(),
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);
            }

            if (Dispute != null && Status != DealStatus.Disputed)
            {
                db.Retranslator.DisputeUpdated(Dispute);
            }
        }

        private void MessageCreated(DealMessage message)
        {
            if (message.Owner.IsSupport)
            {
                var evt1 = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = message.Deal,
                    DealMessage = message,
                    Creater = message.Owner,
                    Type = UserEventTypes.NewMessage,
                    Receiver = AdOwner,
                    Source = db.SourceType
                };
                var evt2 = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = message.Deal,
                    DealMessage = message,
                    Creater = message.Owner,
                    Type = UserEventTypes.NewMessage,
                    Receiver = Initiator,
                    Source = db.SourceType
                };
                evt1.Receiver.Events.Add(evt1);
                evt2.Receiver.Events.Add(evt2);
                db.Retranslator.Send(evt1);
                db.Retranslator.Send(evt2);
            }
            else if (message.Owner == Initiator)
            {
                var evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = message.Deal,
                    DealMessage = message,
                    Creater = message.Owner,
                    Type = UserEventTypes.NewMessage,
                    Receiver = AdOwner,
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);

                if (Status == DealStatus.Disputed && Dispute.Arbitor != null)
                {
                    var evt1 = new UserEvent
                    {
                        CreatedAt = DateTime.Now,
                        Deal = message.Deal,
                        DealMessage = message,
                        Creater = message.Owner,
                        Type = UserEventTypes.NewMessage,
                        Receiver = Dispute.Arbitor,
                        Source = db.SourceType
                    };
                    evt1.Receiver.Events.Add(evt1);
                    db.Retranslator.Send(evt1);
                }
            }

            else if (message.Owner == AdOwner)
            {
                var evt = new UserEvent
                {
                    CreatedAt = DateTime.Now,
                    Deal = message.Deal,
                    DealMessage = message,
                    Creater = message.Owner,
                    Type = UserEventTypes.NewMessage,
                    Receiver = Initiator,
                    Source = db.SourceType
                };
                evt.Receiver.Events.Add(evt);
                db.Retranslator.Send(evt);

                if (Status == DealStatus.Disputed && Dispute.Arbitor != null)
                {
                    var evt1 = new UserEvent
                    {
                        CreatedAt = DateTime.Now,
                        Deal = message.Deal,
                        DealMessage = message,
                        Creater = message.Owner,
                        Type = UserEventTypes.NewMessage,
                        Receiver = Dispute.Arbitor,
                        Source = db.SourceType
                    };
                    evt1.Receiver.Events.Add(evt1);
                    db.Retranslator.Send(evt1);
                }
            }
        }
    }
}