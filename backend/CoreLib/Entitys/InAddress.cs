using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CoreLib.Entitys.BtcCore;
using CoreLib.Entitys.UserDataParts;

namespace CoreLib.Entitys
{
    public class InAddress:Entity
    {
        public string Address { get; private set; }
        public virtual BtcCoreWallet BtcCoreWallet { get; private set; }
        private List<InTransaction> _Transactions=new List<InTransaction>();
        public virtual IReadOnlyList<InTransaction> Transactions
        {
            get => _Transactions;
            set => _Transactions = value.ToList();
        }
        [Required]
        public virtual UserData Owner { get; private set; }
        public bool IsBech32 { get; private set; }

        public InAddress(string address, BtcCoreWallet wallet, bool isBech32, DataDBContext db):base(db)
        {
            Address = address;
            BtcCoreWallet = wallet;
            _Transactions = new List<InTransaction>();
            Owner = requester;
            IsBech32 = isBech32;
        }

        public InAddress(DataDBContext db):base(db)
        {
        }

        public async Task NewTransaction(TransactionData transaction)
        {
            bool isNewTransaction = false;
            var trans = Transactions.FirstOrDefault(p => p.TxId == transaction.Id);
            if (trans == null)
            {
                trans = new InTransaction(transaction);
                _Transactions.Add(trans);
                isNewTransaction = true;
            }
            
            if(Owner==null)
                return;
            
            var newConfirmation = trans.Confirmations < 3 && transaction.Confirmations >= 3;
            trans.Update(transaction);
            if (isNewTransaction)
                await Owner.Balance.UnConfirmedTransaction(trans);
            if (newConfirmation)
                await Owner.Balance.ConfirmedTransaction(trans);
        }
    }
}