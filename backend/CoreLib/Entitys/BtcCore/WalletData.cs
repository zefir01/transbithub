using System;
using System.Collections.Generic;

namespace CoreLib.Entitys.BtcCore
{
    public class WalletData
    {
        public int KeyHash { get; set; }
        public List<TransactionData> Transactions { get; set; }
        public decimal? Fee { get; set; }
        public DateTime LastBlock { get; set; }
        public decimal Balance { get; set; }
        public decimal UnconfirmedBalance { get; set; }
    }
}