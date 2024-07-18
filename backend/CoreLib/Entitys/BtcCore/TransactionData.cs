using System;

namespace CoreLib.Entitys.BtcCore
{
    public class TransactionData
    {
        public string Id { get; set; }
        public string Address { get; set; }
        public decimal Amount { get; set; }
        public int Confirmations { get; set; }
        public DateTime Time { get; set; }
        public decimal Fee { get; set; }
        public bool IsInput { get; set; }
    }
}