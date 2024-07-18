using System;
using System.ComponentModel.DataAnnotations;

namespace Aggregator.Entitys
{
    public class TraderSnapshot
    {
        [Key] public long Id { get; private set; }
        public int TradesCount { get; protected set; }
        public decimal Rating { get; protected set; }
        public int PositiveFeedbacks { get; protected set; }
        public int NegativeFeedbacks { get; protected set; }
        public int CompletedDeals { get; protected set; }
        public int CanceledDeals { get; protected set; }
        public int TrustedCount { get; protected set; }
        public int BlockedCount { get; protected set; }
        public decimal? Amount { get; protected set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;
        public virtual Trader Owner { get; protected set; }
    }
}