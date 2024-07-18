using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CoreLib.Entitys.BtcCore;
using CoreLib.Entitys.UserDataParts;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace CoreLib.Entitys
{
    [Index(nameof(TxId))]
    [Index(nameof(Confirmations))]
    public class OutTransaction : Entity
    {
        public string TxId { get; private set; }
        public string Address { get; private set; }
        public decimal Amount { get; private set; }
        public int Confirmations { get; private set; }
        public DateTime Time { get; private set; }
        public decimal Fee { get; private set; }
        public virtual BtcCoreWallet Wallet { get; private set; }
        [ForeignKey("request_id")] public virtual OutTransactionRequest Request { get; private set; }

        public OutTransaction(BtcCoreWallet wallet, OutTransactionRequest request, TransactionData transaction,
            DataDBContext db) : base(db)
        {
            TxId = transaction.Id;
            Address = transaction.Address;
            Amount = -transaction.Amount;
            Confirmations = transaction.Confirmations;
            Time = transaction.Time;
            Fee = transaction.Fee * -1;
            Wallet = wallet;
            Request = request;

            request.Owner.Balance.OutTransactionCreated(this);
        }

        public OutTransaction(DataDBContext db) : base(db)
        {
        }

        public void Update(TransactionData transaction)
        {
            Confirmations = transaction.Confirmations;
        }
    }

    public class OutTransactionRequest : Entity
    {
        public decimal Amount { get; private set; }
        public decimal Fee { get; private set; }
        public string Address { get; private set; }
        public virtual OutTransaction Transaction { get; private set; }
        [Required] public virtual UserData Owner { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public bool IsStarted { get; private set; }
        public bool SubtractFeeFromAmount { get; private set; }
        [ForeignKey("deal_fk")]public virtual Deal Deal { get; set; }

        public OutTransactionRequest(decimal amount, decimal fee, string address,
            bool subtractFeeFromAmount, DataDBContext db) : base(db)
        {
            Amount = amount;
            Fee = fee;
            Address = address;
            Owner = requester;
            CreatedAt = DateTime.Now;
            SubtractFeeFromAmount = subtractFeeFromAmount;
        }

        public OutTransactionRequest(DataDBContext db) : base(db)
        {
        }

        public void Start()
        {
            if (IsStarted)
                throw new UserException("Something wrong. Out request start twice.");
            IsStarted = true;
        }

        public void End(OutTransaction transaction)
        {
            if (Transaction != null)
                throw new UserException("Critical error. Two out transactions per one out request.");
            Transaction = transaction;
            if (Deal == null) return;
            Deal.WithdrawalStatus = DealWithdrawalStatus.Success;
            Deal.WithdrawalError = "";
            Deal.DealChanged(true);
        }
    }
}