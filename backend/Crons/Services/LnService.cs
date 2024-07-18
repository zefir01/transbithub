using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib;
using CoreLib.Entitys.LN;
using CoreLib.Services;
using LND;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Shared;

namespace Crons.Services
{
    public class LnService : IHostedService
    {
        private readonly ILogger<LnService> logger;
        private readonly IServiceProvider provider;
        private Task taskInvoices;
        private Task taskPendingPayments;
        private Task taskStartedPayments;
        private readonly CancellationTokenSource cancellationTokenSource = new();
        private readonly int delaySec = 10;

        public LnService(ILogger<LnService> logger, IServiceProvider provider)
        {
            this.logger = logger;
            this.provider = provider;
        }

        private async Task WorkInvoices()
        {
            while (!cancellationTokenSource.IsCancellationRequested)
            {
                try
                {
                    await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var lnClient = provider.GetRequiredService<LndClient>();
                        var unpaid = db.LNInvoices.Where(p => p.Status == LNInvoice.LNInvoiceStatus.Unpaid).ToList();
                        if (!unpaid.Any())
                            return new object();

                        long minIndex = unpaid.Min(p => p.LndAddIndex);
                        minIndex -= 1;
                        if (minIndex < 0)
                            minIndex = 0;
                        var invoices = await lnClient.GetInvoices(minIndex);

                        foreach (var invoice in invoices)
                        {
                            var inv = unpaid.FirstOrDefault(p => p.RHash.SequenceEqual(invoice.RHash));
#if DEBUG_MOCK
                            if (inv != null && inv.CreatedAt < DateTime.Now.AddMinutes(-1))
                            {
                                await inv.Paid();
                            }
#else
                            if (inv != null && invoice.State == Invoice.Types.InvoiceState.Settled)
                            {
                                await inv.Paid();
                            }
#endif
                        }

                        await db.SaveChangesAsync(token);


                        return new object();
                    }, provider, 3, cancellationTokenSource.Token, null, "Pay LNInvoices", logger);

                    await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        var time = DateTime.Now;
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var expired = db.LNInvoices.Where(p => p.Status == LNInvoice.LNInvoiceStatus.Unpaid)
                            .Where(p => p.ExpiresIn < time).ToList();
                        foreach (var invoice in expired)
                        {
                            await invoice.Cancel();
                            logger.LogDebug($"Invoice expired and cleared: {invoice.Bolt11}");
                        }

                        db.LNInvoices.RemoveRange(expired);
                        await db.SaveChangesAsync(token);

                        return new object();
                    }, provider, 3, cancellationTokenSource.Token, null, "Clean LNInvoices", logger);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Error in ln invoices: " + e.Message);
                }

                await Task.Delay(delaySec * 1000);
            }
        }

        private async Task WorkPendingPayments()
        {
            while (!cancellationTokenSource.IsCancellationRequested)
            {
                try
                {
                    await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var payments=await db.LnPaymentRequests
                            .Where(p => p.Status == LnPaymentRequest.LnPaymentRequestStatus.Pending)
                            .ToListAsync(token);
                        if (!payments.Any())
                            return new object();
                        var lnClient = provider.GetRequiredService<LndClient>();
                        var lnPayments = await lnClient.GetPayments();
                        foreach (var payment in payments)
                        {
                            var p = lnPayments.FirstOrDefault(z => z.PaymentHash == payment.PaymentHash);
                            if (p == null)
                            {
                                logger.LogWarning($"Payment hash: {payment.PaymentHash} not found in lnd.");
                                continue;
                            }

                            switch (p.Status)
                            {
                                case Payment.Types.PaymentStatus.Unknown:
                                    break;
                                case Payment.Types.PaymentStatus.InFlight:
                                    break;
                                case Payment.Types.PaymentStatus.Succeeded:
                                    payment.Status = LnPaymentRequest.LnPaymentRequestStatus.Success;
                                    break;
                                case Payment.Types.PaymentStatus.Failed:
                                    payment.Error = p.FailureReason switch
                                    {
                                        PaymentFailureReason.FailureReasonNone => "",
                                        PaymentFailureReason.FailureReasonTimeout => "Timeout.",
                                        PaymentFailureReason.FailureReasonNoRoute => "Not suitable route.",
                                        PaymentFailureReason.FailureReasonError => "LND error.",
                                        PaymentFailureReason.FailureReasonIncorrectPaymentDetails => "Incorrect payment details.",
                                        PaymentFailureReason.FailureReasonInsufficientBalance => "Insufficient liquidity.",
                                        _ => throw new ArgumentOutOfRangeException()
                                    };
                                    payment.Status = LnPaymentRequest.LnPaymentRequestStatus.Failed;
                                    break;
                                default:
                                    throw new ArgumentOutOfRangeException();
                            }
                        }

                        await db.SaveChangesAsync(token);
                        return new object();
                    }, provider, 3, cancellationTokenSource.Token, null, "Update LN pending payments statuses", logger);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Error in ln payments: " + e.Message);
                }
                await Task.Delay(delaySec * 1000);
            }
        }

        public async Task WorkStartedPayments()
        {
            while (!cancellationTokenSource.IsCancellationRequested)
            {
                try
                {
                    await MyExtensions.ConcurrentRetries(async (token, scope) =>
                    {
                        var db = scope.ServiceProvider.GetRequiredService<DataDBContext>();
                        var payments = await db.LnPaymentRequests
                            .Where(p => p.Status == LnPaymentRequest.LnPaymentRequestStatus.Started)
                            .ToListAsync(token);
                        if (!payments.Any())
                            return new object();

                        foreach (var payment in payments)
                        {
                            try
                            {
                                await payment.Pay();
                                await db.SaveChangesAsync(token);
                            }
                            catch(Exception e)
                            {
                                logger.LogError(e, e.Message);
                            }
                        }

                        return new object();
                    }, provider, 3, cancellationTokenSource.Token, null, "Pay LN payments", logger);
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Error in ln payments: " + e.Message);
                }

                await Task.Delay(delaySec * 1000);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            taskInvoices = WorkInvoices();
            taskPendingPayments = WorkPendingPayments();
            taskStartedPayments = WorkStartedPayments();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            cancellationTokenSource.Cancel();
            taskInvoices?.Wait(cancellationToken);
            taskPendingPayments?.Wait(cancellationToken);
            taskStartedPayments?.Wait(cancellationToken);
            return Task.CompletedTask;
        }
    }
}