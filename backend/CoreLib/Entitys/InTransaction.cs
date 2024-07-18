using System;
using System.ComponentModel.DataAnnotations;
using CoreLib.Entitys.BtcCore;
using Microsoft.EntityFrameworkCore;

namespace CoreLib.Entitys
{
    [Index(nameof(TxId))]
    [Index(nameof(Confirmations))]
    public class InTransaction
    {
        [Key]
        public long Id { get; private set; }
        public string TxId { get; private set; }
        [Required]
        public virtual InAddress Address { get; private set; }
        public decimal Amount { get; private set; }
        public int Confirmations { get; private set; }
        public DateTime Time { get; private set; }

        public InTransaction(TransactionData transaction)
        {
            TxId = transaction.Id;
            Amount = transaction.Amount;
            //Confirmations = transaction.Confirmations;
            Confirmations = 0;
            Time = transaction.Time;
        }
        public InTransaction(){}
        public void Update(TransactionData transaction)
        {
            Confirmations = transaction.Confirmations;
        }
    }
}