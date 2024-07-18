using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using BtcService.Protos.Internal;
using CoreLib.Entitys.BtcCore;
using CoreLib.Entitys.UserDataParts;
using Grpc.Net.Client;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Internal = BtcService.Protos.Internal.Internal;

#pragma warning disable 1998

namespace CoreLib.Entitys
{
    [Index(nameof(InstanceUrl))]
    public class BtcCoreWallet : Entity
    {
        public string InstanceUrl { get; private set; }

        private List<InAddress> _InputAddresses = new List<InAddress>();
        public virtual IReadOnlyList<InAddress> InputAddresses => _InputAddresses;
        public decimal Fee { get; private set; }
        public DateTime LastBlock { get; private set; }
        public decimal Balance { get; private set; }
        public decimal UnconfirmedBalance { get; private set; }
        public DateTime MaxTransactionsTime { get; private set; }
        public byte[] WalletBackup { get; private set; }
        public DateTime BackupTime { get; private set; }

        [NotMapped] public bool IsOnline => (DateTime.Now - LastBlock).TotalMinutes < 11;
        // ReSharper disable once InconsistentNaming
#pragma warning disable 649
        private List<OutTransactionRequest> _OutTransactionRequests = new List<OutTransactionRequest>();
#pragma warning restore 649
        public virtual IReadOnlyList<OutTransactionRequest> OutTransactionRequests => _OutTransactionRequests;

        public BtcCoreWallet(string instanceUrl, DataDBContext db) : base(db)
        {
            InstanceUrl = instanceUrl;
            _InputAddresses = new List<InAddress>();
        }

        public BtcCoreWallet(DataDBContext db) : base(db)
        {
        }

        public void SetBackup(byte[] bytes)
        {
            WalletBackup = bytes;
            BackupTime = DateTime.Now;
        }

        public async Task Update(WalletData data)
        {
            Balance = data.Balance;
            if (data.Fee.HasValue)
                Fee = data.Fee.Value;
            else if (Fee == 0)
                Fee = 0.0002m;
            LastBlock = data.LastBlock;
            UnconfirmedBalance = data.UnconfirmedBalance;
            foreach (var transaction in data.Transactions)
            {
                if (transaction.IsInput)
                    await NewInTransaction(transaction);
                else
                    await NewOutTransaction(transaction);
            }

            try
            {
                MaxTransactionsTime = data.Transactions.Where(p => p.Confirmations >= 3).Max(p => p.Time);
            }
            catch (InvalidOperationException)
            {
                MaxTransactionsTime = DateTime.MinValue;
            }
        }

        private async Task NewInTransaction(TransactionData transaction)
        {
            var addr = InputAddresses.FirstOrDefault(p => p.Address == transaction.Address);
            if (addr == null)
                return;

            await addr.NewTransaction(transaction);
        }

        private async Task NewOutTransaction(TransactionData transaction)
        {
            var trans = OutTransactionRequests
                .FirstOrDefault(p => p.Transaction != null && p.Transaction.TxId == transaction.Id);
            if (trans == null)
            {
                db.Logger.LogWarning($"Orphaned transaction detected. txid={transaction.Id}");
                return;
            }

            trans.Transaction.Update(transaction);
        }

        public void NewOutTransaction(OutTransactionRequest request, TransactionData transaction)
        {
            var trans = new OutTransaction(this, request, transaction, db);
            request.End(trans);
        }

        public OutTransactionRequest NewOutRequest(decimal amount, string address, bool subtractFeeFromAmount)
        {
#if DEBUG_MOCK
            var p = new OutTransactionRequest(amount, Fee, address, subtractFeeFromAmount, db);
            _OutTransactionRequests.Add(p);
            return p;
#else
            if (Balance < amount + Fee)
                throw new Exception("Not enough money.");
            var req = new OutTransactionRequest(amount, Fee, address,
                subtractFeeFromAmount, db);
            _OutTransactionRequests.Add(req);
            return req;
#endif
        }

        public async Task<(InAddress lagacy, InAddress bech32)> GetInputAddresses()
        {
            using var channel = GrpcChannel.ForAddress(db.Config.BtcServiceUrl);
            Internal.InternalClient client = new Internal.InternalClient(channel);

            var bech32 = InputAddresses.FirstOrDefault(p =>
                p.IsBech32 && p.Owner == requester && (p.Transactions == null || !p.Transactions.Any()));
            var legacy = InputAddresses.FirstOrDefault(p =>
                !p.IsBech32 && p.Owner == requester && (p.Transactions == null || !p.Transactions.Any()));
            if (bech32 == null)
            {
                var resp = await client.CreateBtcInputAddressAsync(new CreateBtcInputAddressRequest {IsBech32 = true});
                bech32 = new InAddress(resp.Address, this, true, db);
                _InputAddresses.Add(bech32);
            }

            if (legacy == null)
            {
                var resp = await client.CreateBtcInputAddressAsync(new CreateBtcInputAddressRequest {IsBech32 = false});
                legacy = new InAddress(resp.Address, this, false, db);
                _InputAddresses.Add(legacy);
            }

            return (legacy, bech32);
        }
    }
}