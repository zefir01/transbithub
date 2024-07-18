using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys;
using CoreLib.Entitys.BtcCore;
using BitcoinLib.ExceptionHandling.Rpc;
using BitcoinLib.Responses;
using BitcoinLib.Services.Coins.Base;
using BitcoinLib.Services.Coins.Bitcoin;
using CoreLib;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

#pragma warning disable 1998

namespace BtcService.Services
{
    public class BtcCoreService : IHostedService
    {
        private readonly ILogger<BtcCoreService> logger;
        private readonly IServiceProvider provider;
        private readonly int confirmedWhen = 3;
        private readonly int delaySec = 30;
        private Task task;
        private readonly CancellationTokenSource tokenSource = new CancellationTokenSource();
        private readonly Config config;
        private readonly BitcoinService coinService;

        public BtcCoreService(ILogger<BtcCoreService> logger, IServiceProvider provider, Config config, BitcoinService coinService)
        {
            this.logger = logger;
            this.provider = provider;
            this.config = config;
            this.coinService = coinService;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
            SyncKeys(db, cancellationToken).ConfigureAwait(false).GetAwaiter().GetResult();

            task = DoWork(tokenSource.Token);
        }

        private async Task SyncKeys(DataDBContext db, CancellationToken cancellationToken)
        {
            var wallet = await db.BtcCoreWallets.FirstOrDefaultAsync(p => p.InstanceUrl == config.BtcUrl,
                cancellationToken);
            if (wallet == null)
            {
                wallet = new BtcCoreWallet(config.BtcUrl, db);
                await db.BtcCoreWallets.AddAsync(wallet, cancellationToken);
                await db.SaveChangesAsync(cancellationToken);
            }
        }

        private async Task DoWork(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    var wallet = await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var w = await db.BtcCoreWallets.FirstAsync(p => p.InstanceUrl == config.BtcUrl, token);
                        var fee = coinService.EstimateSmartFee(1).FeeRate;
                        if (!fee.HasValue)
                        {
                            var e = new Exception("Unable to get fee.");
                            logger.LogError(e, e.Message);
                            fee = w.Fee;
                        }
                        else
                        {
                            //https://bitcoinops.org/en/tools/calc-size/
                            fee = Math.Round(fee.Value / 1024 * 142, 8);
                        }

                        var lastBlock = GetDelay();
                        var balance = coinService.GetBalance("", 3, null);
                        var unconfirmed = coinService.GetUnconfirmedBalance();
                        var maxTime = w.MaxTransactionsTime;
                        var trans = GetTransactions(maxTime);
                        var wallet = new WalletData
                        {
                            Transactions = trans,
                            Fee = fee,
                            LastBlock = lastBlock,
                            Balance = balance,
                            UnconfirmedBalance = unconfirmed
                        };

                        await w.Update(wallet);
                        await db.SaveChangesAsync(token);
                        return w;
                    }, provider, 5, cancellationToken, null, "Update btcCore input data.", logger);

                    if (wallet != null)
                    {
                        OutTransactionRequest req;
                        do
                        {
                            req = await MyExtensions.ConcurrentRetries(async (token, scope) =>
                                {
                                    var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                                    var w = await db.BtcCoreWallets.FirstAsync(p => p.InstanceUrl == config.BtcUrl, token);
                                    var request = await db.OutTransactionRequests
                                        .Where(p => p.Transaction == null && !p.IsStarted).FirstOrDefaultAsync(token);

                                    if (request == null)
                                        return null;
                                    request.Start();
                                    await db.SaveChangesAsync(token);

                                    TransactionData tt;
                                    try
                                    {
#if DEBUG_MOCK
                                        tt = new TransactionData
                                        {
                                            Id = "Test transaction",
                                            Time = DateTime.Now,
                                            Address = request.Address,
                                            Amount = request.Amount,
                                            Confirmations = 6,
                                            IsInput = false,
                                            Fee = db.BtcCoreWallets.First().Fee
                                        };
#else                                        
                                        string id;
                                        if (request.SubtractFeeFromAmount)
                                            id = coinService.SendToAddress(request.Address, request.Amount, "", "",
                                                true, true);
                                        else
                                            id = coinService.SendToAddress(request.Address, request.Amount, "", "",
                                                false, true);
                                        var t = coinService.GetTransaction(id, true);
                                        tt = new TransactionData
                                        {
                                            Id = t.TxId,
                                            Time = ToDateTime(t.Time),
                                            Address = request.Address,
                                            Amount = t.Amount,
                                            Confirmations = t.Confirmations > confirmedWhen
                                                ? (byte) confirmedWhen
                                                : (byte) t.Confirmations,
                                            IsInput = false,
                                            Fee = t.Fee
                                        };
#endif
                                    }
                                    catch (Exception e)
                                    {
                                        if (request.Deal != null)
                                        {
                                            request.Deal.WithdrawalStatus = DealWithdrawalStatus.Failed;
                                            request.Deal.WithdrawalError =
                                                $"Send error. Address: {request.Address}, Amount: {request.Amount}, Fee: {request.Fee}";
                                        }
                                        logger.LogError(e, $"Send error. Owner: {request.Owner}, Address: {request.Address}, Amount: {request.Amount}, Fee: {request.Fee} {e.Message}");
                                        throw;
                                    }

                                    w.NewOutTransaction(request, tt);
                                    await db.SaveChangesAsync(token);

                                    return request;
                                }, provider, 5, cancellationToken, null, "BtcCore out transactions",
                                logger);
                        } while (req != null);
                    }

                    using (var scope = provider.CreateScope())
                    {
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var brokenRequests = db.OutTransactionRequests
                            .Where(p => p.Transaction == null && p.IsStarted).ToList();
                        foreach (var brokenRequest in brokenRequests)
                        {
                            logger.LogError($"Founded broken request {brokenRequest.Id}. Need admin actions.");
                        }
                    }
                }
                catch (Exception e)
                {
                    logger.LogError($"Error in BtcCore service: {e.GetType().Name} {e.Message}\n{e.StackTrace}");
                }

                await Task.Delay(delaySec * 1000, cancellationToken);
            }
        }

        private HashSet<string> GetPrivateKeys()
        {
            HashSet<string> privateKeys = new HashSet<string>();
            Dictionary<string, GetAddressesByLabelResponse> addrs;
            try
            {
                addrs = coinService.GetAddressesByLabel("");
            }
            catch (RpcInternalServerErrorException)
            {
                return privateKeys;
            }
            catch (RpcException)
            {
                coinService.GetNewAddress();
                addrs = coinService.GetAddressesByLabel("");
            }

            foreach (var pair in addrs)
            {
                if (pair.Value.Purpose == "receive")
                {
                    var key = coinService.DumpPrivKey(pair.Key);
                    privateKeys.Add(key);
                }
            }

            return privateKeys;
        }

        private List<TransactionData> GetTransactions(DateTime startTime)
        {
            DateTime minTime;
            List<TransactionData> transactions = new List<TransactionData>();
            int skip = 0;
            int count = 0;
            do
            {
                var trans = coinService.ListTransactions(account: null, 100, skip, false);
                count = trans.Count;
                if (trans.Count > 0)
                {
                    minTime = ToDateTime(trans.Min(p => p.Time));
                    skip += trans.Count;
                    foreach (var t in trans)
                    {
                        var tt = new TransactionData
                        {
                            Id = t.TxId,
                            Time = ToDateTime(t.Time),
                            Address = t.Address,
                            Amount = t.Amount,
                            Confirmations = t.Confirmations > confirmedWhen
                                ? (byte) confirmedWhen
                                : (byte) t.Confirmations,
                            IsInput = t.Category == "receive",
                            Fee = t.Fee
                        };
                        transactions.Add(tt);
                    }
                }
                else
                    minTime = DateTime.MinValue;
            } while (minTime >= startTime && count == 100);

            if (startTime != DateTime.MinValue)
                transactions = transactions.Where(p => p.Time > startTime.AddSeconds(-1)).ToList();

            return transactions;
        }

        private DateTime GetDelay()
        {
            var count = coinService.GetBlockCount();
            var hash = coinService.GetBlockHash(count);
            var block = coinService.GetBlock(hash, true);
            return ToDateTime(block.Time);
        }

        private DateTime ToDateTime(int timestamp)
        {
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(timestamp).ToLocalTime();
            return dtDateTime;
        }

        private DateTime ToDateTime(double timestamp)
        {
            DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(timestamp).ToLocalTime();
            return dtDateTime;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            tokenSource.Cancel();
            task?.Wait(cancellationToken);
        }
    }
}