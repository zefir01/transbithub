using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared;

namespace CoreLib.Entitys
{
    public class UserBalance : Entity
    {
        [ForeignKey("owner_fk")] public virtual UserData Owner { get; private set; }
        public decimal Balance { get; private set; }
        public decimal UnconfirmedBalance { get; private set; }
        public decimal Deposited { get; private set; }

        public UserBalance(UserData owner, DataDBContext db) : base(db)
        {
            Owner = owner;
            //TODO very dangerous
            if (db.Config != null && db.Config.DebugBalances)
                Balance = 1;
        }

        public UserBalance(DataDBContext db) : base(db)
        {
        }

        public async Task UnConfirmedTransaction(InTransaction transaction)
        {
            UnconfirmedBalance += transaction.Amount;
            await Owner.BalanceChanged();
        }

        public async Task ConfirmedTransaction(InTransaction transaction)
        {
            UnconfirmedBalance -= transaction.Amount;
            Balance += transaction.Amount;
            await Owner.BalanceChanged();
            await UpdateAds();
        }

        public async Task<OutTransactionRequest> CreateOutRequest(decimal? amount, string address, bool substractFee)
        {
            OutTransactionRequest req;
            var wallet = await db.BtcCoreWallets.OrderBy(p => p.Balance).FirstOrDefaultAsync();
            if (wallet == null)
                throw new UserException("No wallets found for this crypto currency.");
            if (amount.HasValue)
            {
                if (!substractFee)
                {
                    if (Balance < amount + wallet.Fee)
                        throw new UserException("Not enough money.");
                    Balance -= amount.Value + wallet.Fee;
                }
                else
                {
                    if (Balance < amount)
                        throw new UserException("Not enough money.");
                    Balance -= amount.Value;
                }

                req = wallet.NewOutRequest(amount.Value, address, substractFee);
            }
            else
            {
                if (!amount.HasValue && Balance <= wallet.Fee)
                    throw new UserException(
                        "Your balance is less than the fee. Bitcoin withdrawal is not possible. Try using Lightning Network or Promises.");
                req = wallet.NewOutRequest(Balance, address, true);
                Balance = 0;
            }

            await UpdateAds();

            await Owner.BalanceChanged();
            CheckBalance();
            return req;
        }

        public async Task<LnPaymentRequest> LNWithdrawal(string invoice, decimal? amount = null)
        {
            var request = new LnPaymentRequest(db, Owner, invoice, amount);
            Balance -= request.FeeFromBalance;
            Balance -= request.Amount;
            await Owner.BalanceChanged();

            CheckBalance();
            return request;
        }

        private async Task UpdateAds()
        {
            foreach (var ad in Owner.Advertisements.Where(p => p.IsDeleted))
                await ad.Metadata.Update(false);
        }

        enum OwnerType
        {
            Initiator,
            AdOwner
        }

        enum FundingType
        {
            AdOwner,
            Initiator,
            None
        }

        public async Task DealChanged(Deal deal)
        {
            OwnerType ownerType = Owner.UserId == deal.Initiator.UserId ? OwnerType.Initiator : OwnerType.AdOwner;
            FundingType fundingType;
            if (deal.FundingLnInvoice != null)
                fundingType = deal.Ad.LnFunding ? FundingType.AdOwner : FundingType.Initiator;
            else
                fundingType = FundingType.None;
            bool isBuy = deal.Ad.IsBuy;
            bool isPromise = deal.Promise != null;
            string user = db.User?.UserId == Owner.UserId ? "Your" : "Partner";

            switch (deal.Status)
            {
                case DealStatus.WaitDeposit:
                    if (ownerType == OwnerType.AdOwner && fundingType == FundingType.AdOwner)
                    {
                        var needFromBalance = deal.CryptoAmount - deal.FundingLnInvoice.Amount + deal.Fee;
                        if (needFromBalance > 0)
                        {
                            if (Balance < needFromBalance)
                                throw new UserException($"{user} account has insufficient funds to create a deal.");
                            Balance -= needFromBalance;
                            Deposited += needFromBalance;
                            await Owner.BalanceChanged();
                        }
                    }

                    break;
                case DealStatus.Opened:
                    if (ownerType == OwnerType.AdOwner && fundingType == FundingType.AdOwner)
                    {
                        if (Balance < deal.FundingLnInvoice.Amount)
                            throw new UserException($"{user} account has insufficient funds to create a deal.");
                        Balance -= deal.FundingLnInvoice.Amount;
                        Deposited += deal.FundingLnInvoice.Amount;
                    }
                    else if (ownerType == OwnerType.AdOwner && fundingType == FundingType.Initiator)
                    {
                    }
                    else if (isBuy && ownerType == OwnerType.Initiator)
                    {
                        if (!isPromise)
                        {
                            if (Balance < deal.CryptoAmount)
                                throw new UserException($"{user} account has insufficient funds to create a deal.");
                            Balance -= deal.CryptoAmount;
                            Deposited += deal.CryptoAmount;
                            await Owner.BalanceChanged();
                        }
                    }
                    else if (!isBuy && ownerType == OwnerType.AdOwner)
                    {
                        if (Balance < deal.CryptoAmount + deal.Fee)
                            throw new UserException($"{user} account has insufficient funds to create a deal.");
                        Balance -= deal.CryptoAmount + deal.Fee;
                        Deposited += deal.CryptoAmount + deal.Fee;
                        await Owner.BalanceChanged();
                    }

                    break;
                case DealStatus.Canceled:
                    if (ownerType == OwnerType.AdOwner && fundingType == FundingType.AdOwner)
                    {
                        if (deal.FundingLnInvoice.Status == LNInvoice.LNInvoiceStatus.Unpaid)
                        {
                            var needFromBalance = deal.CryptoAmount - deal.FundingLnInvoice.Amount + deal.Fee;
                            if (needFromBalance > 0)
                            {
                                Balance += needFromBalance;
                                Deposited -= needFromBalance;
                                await Owner.BalanceChanged();
                            }
                        }
                        else
                        {
                            Balance += deal.CryptoAmount + deal.Fee;
                            Deposited -= deal.CryptoAmount + deal.Fee;
                        }
                    }
                    else if (ownerType == OwnerType.Initiator && fundingType == FundingType.Initiator)
                    {
                        if (deal.FundingLnInvoice.Status == LNInvoice.LNInvoiceStatus.Paid)
                        {
                            Balance += deal.CryptoAmount;
                            Deposited -= deal.CryptoAmount;
                        }
                    }
                    else if (isBuy && ownerType == OwnerType.Initiator)
                    {
                        if (!isPromise)
                        {
                            Balance += deal.CryptoAmount;
                            Deposited -= deal.CryptoAmount;
                        }
                    }
                    else if (!isBuy && ownerType == OwnerType.AdOwner)
                    {
                        Balance += deal.CryptoAmount + deal.Fee;
                        Deposited -= deal.CryptoAmount + deal.Fee;
                    }

                    await Owner.BalanceChanged();
                    break;
                case DealStatus.Completed:
                    if (isBuy)
                    {
                        if (ownerType == OwnerType.Initiator)
                        {
                            if (!isPromise)
                            {
                                Deposited -= deal.CryptoAmount;
                                await Owner.BalanceChanged();
                            }
                        }
                        else
                        {
                            Balance += deal.CryptoAmount;
                            Balance -= deal.Fee;
                            await Owner.BalanceChanged();
                        }
                    }
                    else
                    {
                        if (ownerType == OwnerType.Initiator)
                        {
                            if (!isPromise)
                            {
                                Balance += deal.CryptoAmount;
                                await Owner.BalanceChanged();
                            }
                        }
                        else
                        {
                            Deposited -= deal.CryptoAmount + deal.Fee;
                            await Owner.BalanceChanged();
                        }
                    }

                    if (ownerType == OwnerType.Initiator)
                        GetServiceUserBalance().Balance += deal.Fee;

                    if (ownerType == OwnerType.Initiator && !deal.BtcWallet.IsNullOrEmpty() && !isPromise &&
                        !deal.Ad.IsBuy)
                    {
                        var req = await deal.Initiator.Balance.CreateOutRequest(deal.CryptoAmount, deal.BtcWallet,
                            true);
                        deal.WithdrawalStatus = DealWithdrawalStatus.Waiting;
                        deal.WithdrawalError = "";
                        deal.WithdrawalBtcRequest = req;
                        req.Deal = deal;
                    }
                    else if (ownerType == OwnerType.Initiator && !deal.Bolt11.IsNullOrEmpty() && !deal.Ad.IsBuy)
                    {
                        try
                        {
                            var request = await LNWithdrawal(deal.Bolt11, deal.CryptoAmount);
                            deal.WithdrawalStatus = DealWithdrawalStatus.Started;
                            deal.WithdrawalLNPaymentRequest = request;
                            request.Deal = deal;
                        }
                        catch (Exception e)
                        {
                            db.Logger.LogError(e, "Deal LN withdrawal failed.");
                            deal.WithdrawalStatus = DealWithdrawalStatus.Failed;
                            deal.WithdrawalError = e.Message;
                        }
                    }

                    break;
            }

            CheckBalance();
        }

        private void CheckBalance()
        {
            if (Balance < 0 || Deposited < 0 || UnconfirmedBalance < 0)
            {
                throw new Exception("Incorrect balance.");
            }

            if (Balance % Config.Satoshi != 0m || Deposited % Config.Satoshi != 0m ||
                UnconfirmedBalance % Config.Satoshi != 0m)
            {
                throw new Exception("Incorrect balance digits.");
            }
        }

        private UserBalance GetServiceUserBalance()
        {
            return db.UserDatas.First(p => p.UserId == "").Balance;
        }

        public async Task CreateInvoice(Invoice invoice)
        {
            if (!invoice.IsPrivate || invoice.Refund != null)
                return;

            if (Balance < invoice.Fee)
                throw new UserException("Insufficient balance to pay fee");
            Balance -= invoice.Fee;
            GetServiceUserBalance().Balance += invoice.Fee;
            await Owner.BalanceChanged();
        }

        public async Task PayInvoicePayment(InvoicePayment payment)
        {
            if (payment.Owner.UserId != Owner.UserId)
                throw new Exception("Error in payments algorithm.");
            if (Balance < payment.CryptoAmount)
                throw new UserException("Insufficient funds to pay the invoice.");
            Balance -= payment.CryptoAmount;
            var b = payment.Invoice.Owner.Balance;
            b.Balance += payment.CryptoAmount;
            if (!payment.Invoice.IsPrivate)
            {
                b.Balance -= payment.Fee;
                GetServiceUserBalance().Balance += payment.Fee;
            }

            await Owner.BalanceChanged();
            await payment.Invoice.Owner.BalanceChanged();
        }

        public async Task OnCreatePromise(Promise promise)
        {
            var fee = Math.Round(Config.PromiseFee * promise.Amount, 8);
            if (fee < Config.Satoshi)
                fee = Config.Satoshi;
            Balance -= promise.Amount;
            Balance -= fee;
            if (Balance < 0)
                throw new UserException("Insufficient funds to create promise.");
            GetServiceUserBalance().Balance += fee;
            await Owner.BalanceChanged();
        }

        public async Task OnToBalancePromise(Promise promise)
        {
            Balance += promise.Amount;
            await Owner.BalanceChanged();
        }

        public async Task PayPaymentByPromise(InvoicePayment payment, Promise promise, OddTypes oddType)
        {
            if (payment.CryptoAmount > promise.Amount)
                throw new UserException("Insufficient funds in promise.");
            decimal odd = promise.Amount - payment.CryptoAmount;
            Balance += promise.Amount;
            await payment.PayFromBalance(this);
            if (odd > 0)
            {
                switch (oddType)
                {
                    case OddTypes.NoOdd:
                        Balance -= odd;
                        var serviceBalance = GetServiceUserBalance();
                        serviceBalance.Balance += odd;
                        break;
                    case OddTypes.ToBalance:
                        break;
                    case OddTypes.ToPromise:
                        if (Balance > Config.Satoshi * 2)
                        {
                            var oddPromise = new Promise(db, odd, promise.Password, Owner);
                            await db.Promises.AddAsync(oddPromise);
                            await OnCreatePromise(oddPromise);
                            payment.OddPromise = oddPromise;
                        }
                        else if (Owner.IsAnonymous)
                        {
                            var serviceBalance1 = GetServiceUserBalance();
                            serviceBalance1.Balance += odd;
                            Balance -= odd;
                        }

                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            await Owner.BalanceChanged();
        }

        public async Task LNInvoicePaid(LNInvoice invoice)
        {
            Balance += invoice.Amount;
            await Owner.BalanceChanged();
        }

        public void OutTransactionCreated(OutTransaction transaction)
        {
            var feeError = transaction.Request.Fee - transaction.Fee;
            GetServiceUserBalance().Balance += feeError;
        }

        public async Task LnPaymentFailed(LnPaymentRequest request)
        {
            Balance += request.Amount;
            Balance += request.FeeFromBalance;
            await Owner.BalanceChanged();
        }
    }
}