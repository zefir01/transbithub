using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;
using Shared;

// ReSharper disable InconsistentNaming

#pragma warning disable 1998

namespace CoreLib.Entitys.UserDataParts
{
    [Index(nameof(UserId))]
    [Index(nameof(UserName))]
    public partial class UserData : Entity
    {
        public virtual IReadOnlyList<YmIdsConnection> YmIdsConnections
        {
            get => _YmIdsConnections;
            private set => _YmIdsConnections = value.ToList();
        }
        private List<YmIdsConnection> _YmIdsConnections = new List<YmIdsConnection>();
        private List<Advertisement> _Advertisements = new List<Advertisement>();

        public virtual IReadOnlyList<Advertisement> Advertisements
        {
            get => _Advertisements;
            private set => _Advertisements = value.ToList();
        }

        public virtual List<InAddress> InAddresses { get; private set; } = new List<InAddress>();

        public virtual List<OutTransactionRequest> OutTransactions { get; private set; } =
            new List<OutTransactionRequest>();

        public virtual List<LnPaymentRequest> LNPaymentRequests { get; private set; }
        public virtual List<LNInvoice> LNInvoices { get; private set; }
        public virtual List<Deal> DealsInitiator { get; private set; } = new List<Deal>();
        public virtual List<Deal> DealsAdOwner { get; private set; } = new List<Deal>();
        public virtual List<DealFeedBack> DealsFeedbacksToMe { get; private set; }
        public virtual List<InvoicePaymentFeedback> PaymentsFeedbacksToMe { get; private set; }
        public virtual List<Image> Images { get; private set; } = new List<Image>();
        public virtual UserDataBtc BtcData { get; private set; }
        public virtual UserDataLn LnData { get; private set; }
        public virtual UserDataImages ImagesData { get; private set; }
        public virtual UserDataInvoices InvoicesData { get; private set; }
        public virtual UserDataDeals DealsData { get; private set; }
        public virtual UserDataAds AdsData { get; private set; }
        public string UserId { get; private set; }
        public string UserName { get; private set; }
        public uint TrustedCount { get; private set; }
        public uint BlockedCount { get; private set; }
        public string TimeZone { get; private set; } = "UTC";
        public string Introduction { get; private set; }
        public string Site { get; private set; }
        public bool SalesDisabled { get; private set; }
        public bool BuysDisabled { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public bool IsDeleted { get; private set; }
        public Catalog.Currencies DefaultCurrency { get; private set; }
        public virtual BoughtOptions Options { get; private set; }
        public virtual UserLastOnline LastOnline { get; private set; }
        public virtual List<UserEvent> Events { get; private set; } = new List<UserEvent>();

        public virtual UserBalance Balance { get; private set; }

        public bool IsAnonymous { get; private set; }

        private List<TrustedUser> _TrustedUsers = new List<TrustedUser>();
        private List<BlockedUser> _BlockedUsers = new List<BlockedUser>();
        private List<UserBalance> _Balances = new List<UserBalance>();
        private List<Invoice> myInvoices = new List<Invoice>();
        private List<Invoice> toMeInvoices = new List<Invoice>();
        private List<InvoicePayment> myPayments = new List<InvoicePayment>();

        public virtual IReadOnlyList<TrustedUser> TrustedUsers
        {
            get => _TrustedUsers;
            private set => _TrustedUsers = value.ToList();
        }

        public virtual IReadOnlyList<BlockedUser> BlockedUsers
        {
            get => _BlockedUsers;
            private set => _BlockedUsers = value.ToList();
        }

        public virtual IReadOnlyList<Invoice> MyInvoices
        {
            get => myInvoices;
            set => myInvoices = value.ToList();
        }

        public virtual IReadOnlyList<Invoice> ToMeInvoices
        {
            get => toMeInvoices;
            set => toMeInvoices = value.ToList();
        }

        public virtual IReadOnlyList<InvoicePayment> MyPayments
        {
            get => myPayments;
            set => myPayments = value.ToList();
        }

        public virtual LastAdSearchSellClass LastAdSearchSell { get; set; }
        public virtual LastAdSearchBuyClass LastAdSearchBuy { get; set; }
        public bool IsSupport { get; set; } = false;


        public UserData(DataDBContext db) : base(db)
        {
        }

        public UserData(Guid userId, string userName, bool isAnonymous, Catalog.Currencies defaultCurrency,
            DataDBContext db) : base(db)
        {
            LastOnline = new UserLastOnline(this, db);
            BtcData = new UserDataBtc(this, db);
            LnData = new UserDataLn(this, db);
            AdsData = new UserDataAds(this, db);
            ImagesData = new UserDataImages(this, db);
            Options = new BoughtOptions(this);
            InvoicesData = new UserDataInvoices(this, db);
            DealsData = new UserDataDeals(this, db);
            Balance = new UserBalance(this, db);
            UserId = Guid.Empty == userId ? "" : userId.ToString();
            UserName = userName;
            CreatedAt = DateTime.Now;
            _Balances = new List<UserBalance>();
            IsAnonymous = isAnonymous;
            DefaultCurrency = defaultCurrency;
            SetRequester(this);

            _TrustedUsers = new List<TrustedUser> {new TrustedUser(this, this)};
        }


        public async Task Update(string timezone, string introduction, string site, bool salesDisabled,
            bool buysDisabled)
        {
            TimeZone = timezone;
            Introduction = introduction;
            Site = site;
            if (SalesDisabled != salesDisabled || BuysDisabled != buysDisabled)
                await AdsData.ChangeAllAdStatus(salesDisabled, buysDisabled);
        }


        public void RemoveTrusted([NotNull] UserData user)
        {
            var trust = TrustedUsers.FirstOrDefault(p => p.User.UserId == user.UserId);
            if (trust == null)
                throw new UserException("User with id=" + user.UserId + " not trusted.");
            _TrustedUsers.Remove(trust);
            user.TrustedCount--;
        }

        public void AddTrusted([NotNull] UserData user)
        {
            if (user == this)
                throw new UserException("You can't add to trusted yourself.");
            if (TrustedUsers.Any(p => p.User == user))
                throw new UserException("User with id=" + user.UserId + " already trusted.");
            var trust = new TrustedUser(this, user);
            _TrustedUsers.Add(trust);
            user.TrustedCount++;
        }

        public void AddBlocked([NotNull] UserData user)
        {
            if (user == this)
                throw new UserException("You can't add to blocked yourself.");
            if (BlockedUsers.Any(p => p.User == user))
                throw new UserException("User with id=" + user.UserId + " already blocked.");
            var block = new BlockedUser(user, db);
            _BlockedUsers.Add(block);
            user.BlockedCount++;
        }

        public void RemoveBlocked([NotNull] UserData user)
        {
            var block = BlockedUsers.FirstOrDefault(p => p.User.UserId == user.UserId);
            if (block == null)
                throw new UserException("User with id=" + user.UserId + " not blocked.");
            _BlockedUsers.Remove(block);
            user.BlockedCount--;
        }

        public async Task BalanceChanged()
        {
            foreach (var ad in Advertisements.Where(p=> !p.IsDeleted))
                await ad.Metadata.Update(false);
            var evt = new UserEvent
            {
                Creater = Balance.Owner,
                Balance = Balance,
                CreatedAt = DateTime.Now,
                Receiver = Balance.Owner,
                Type = UserEventTypes.BalanceChanged
            };
            db.Retranslator.Send(evt);
        }


        //TODO сделать расчеты разных криптовалют в пересчете на биткоины


        public async Task Delete(CancellationToken cancellationToken)
        {
            if (IsDeleted)
                throw new UserException("User already deleted.");
            foreach (var ad in Advertisements.Where(p=>!p.IsDeleted))
                AdsData.RemoveAd(ad);
            foreach (var invoice in db.Invoices.Where(p => p.Owner.UserId == UserId).ToList())
                await invoice.Delete(cancellationToken);
            Events.Clear();
            IsDeleted = true;
        }

        public void SetLastSearch(Catalog.Countries country, Catalog.Currencies currency,
            Catalog.PaymentTypes paymentType, decimal amount, bool isBuy)
        {
            ILastAdSearch lastSearch;
            if (isBuy)
            {
                if (LastAdSearchBuy == null)
                    LastAdSearchBuy = new LastAdSearchBuyClass();
                lastSearch = LastAdSearchBuy;
            }
            else
            {
                if (LastAdSearchSell == null)
                    LastAdSearchSell = new LastAdSearchSellClass();
                lastSearch = LastAdSearchSell;
            }

            lastSearch.Country = country;
            lastSearch.Currency = currency;
            lastSearch.PaymentType = paymentType;
            lastSearch.Amount = amount;
        }
    }
}