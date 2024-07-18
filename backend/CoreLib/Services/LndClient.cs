using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services.Exceptions;
using Grpc.Core;
using LND;
using LND.Router;
using Microsoft.Extensions.Logging;
using Shared;
using Channel = Grpc.Core.Channel;

namespace CoreLib.Services
{
    public class LndClient
    {
        private readonly Lightning.LightningClient client;
        private readonly Router.RouterClient router;
        private readonly ILogger<LndClient> logger;

        public LndClient(ILnConfig config, ILogger<LndClient> logger)
        {
            try
            {
                this.logger = logger;

                Environment.SetEnvironmentVariable("GRPC_SSL_CIPHER_SUITES", "HIGH+ECDSA");
                var cert = File.ReadAllText(config.LndCertPath);
                var sslCreds = new SslCredentials(cert);

                byte[] macaroonBytes = File.ReadAllBytes(config.LndMacaroonPath);
                var macaroon =
                    BitConverter.ToString(macaroonBytes).Replace("-", ""); // hex format stripped of "-" chars

                Task AddMacaroon(AuthInterceptorContext context, Metadata metadata)
                {
                    metadata.Add(new Metadata.Entry("macaroon", macaroon));
                    return Task.CompletedTask;
                }

                var macaroonInterceptor = new AsyncAuthInterceptor(AddMacaroon);
                var combinedCreds =
                    ChannelCredentials.Create(sslCreds, CallCredentials.FromInterceptor(macaroonInterceptor));


                var channel = new Channel(config.LndUrl, combinedCreds);
                client = new Lightning.LightningClient(channel);
                router = new Router.RouterClient(channel);
                logger.LogInformation("Lnd connected. Url: " + config.LndUrl);
                var info = client.GetInfo(new GetInfoRequest());
                logger.LogInformation(info.ToString());
            }
            catch (Exception e)
            {
                logger.LogError(e, e.Message);
            }
        }

        public async Task<Invoice> CreateInvoice(string description, decimal amount, int expirySeconds)
        {
            Invoice inv = new Invoice
            {
                Memo = description,
                ValueMsat = Convert.ToInt64(amount / Config.Satoshi * 1000),
                Expiry = expirySeconds,
            };
            logger.LogDebug($"Creating invoice:\n{inv}");
            var resp = await client.AddInvoiceAsync(inv);
            inv = await client.LookupInvoiceAsync(new PaymentHash
            {
                RHash = resp.RHash
            });
            logger.LogDebug($"Invoice created:\n{inv}");
            return inv;
        }

        public async Task<List<Invoice>> GetInvoices(long minIndex)
        {
            var invoices = await client.ListInvoicesAsync(new ListInvoiceRequest
            {
                IndexOffset = (ulong) minIndex,
                NumMaxInvoices = ulong.MaxValue
            });
            return invoices.Invoices.ToList();
        }

        public async Task<(PayReq decoded, Payment payment)> Pay(UserData user, string bolt11, decimal? amount)
        {
            logger.LogDebug($"LN pay: {bolt11} amount: {amount} user: {user.UserName}");
            PayReq decoded = await Decode(bolt11);

            long amountMsat;
            if (decoded.NumMsat != 0)
                amountMsat = decoded.NumMsat;
            else if (amount.HasValue)
                amountMsat = Convert.ToInt64(Math.Round(amount.Value / Config.Satoshi * 1000));
            else
                throw new ArgumentNullException(nameof(amount));

            var dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(decoded.Timestamp).ToLocalTime();
            var expiryTime = dtDateTime.AddSeconds(decoded.Expiry);
            if (expiryTime <= DateTime.Now)
                throw new UserException("Invoice expired.");

            //byte[] bytes = Encoding.ASCII.GetBytes(decoded.PaymentHash);  

            long maxFeeMsat = Convert.ToInt64(Math.Round(amountMsat * 0.01m));
            if (maxFeeMsat <= 20000)
                maxFeeMsat = 20000;


            if (decoded.NumMsat != 0)
                amountMsat = 0;

            try
            {
                router.SendPaymentV2(new SendPaymentRequest
                {
                    AmtMsat = amountMsat,
                    PaymentRequest = bolt11,
                    AllowSelfPayment = true,
                    TimeoutSeconds = 60,
                    FeeLimitMsat = maxFeeMsat,
                    MaxParts = uint.MaxValue,
                    NoInflightUpdates = true
                });
                Payment payment;
                do
                {
                    payment = await GetPayment(decoded.PaymentHash);
                } while (payment == null);

                return (decoded, payment);
            }
            catch (RpcException e) when (e.StatusCode == StatusCode.AlreadyExists)
            {
                var found = await GetPayment(decoded.PaymentHash);
                if (found == null)
                    throw new UserException(e.Status.Detail);
                return (decoded, found);
            }
            catch (RpcException e) when (e.Status.Detail == "payment is in transition")
            {
                var p = await GetPayment(decoded.PaymentHash);
                return (decoded, p);
            }
            catch (RpcException e)
            {
                throw new UserException(e.Status.Detail);
            }
            catch (Exception e)
            {
                throw new UserException(e.Message);
            }
        }

        public async Task<PayReq> Decode(string bolt11)
        {
            try
            {
                var decoded = await client.DecodePayReqAsync(new PayReqString
                {
                    PayReq = bolt11
                });
                logger.LogDebug($"Decoded bolt11:\n {decoded}");
                return decoded;
            }
            catch (Exception e)
            {
                throw new UserException(e.Message);
            }
        }

        public async Task<Payment> GetPayment(string hash)
        {
            var results = await client.ListPaymentsAsync(new ListPaymentsRequest
            {
                IncludeIncomplete = true,
                IndexOffset = 0,
                MaxPayments = ulong.MaxValue,
                Reversed = true
            });
            var payment = results.Payments.FirstOrDefault(p => p.PaymentHash == hash);
            return payment;
        }

        public async Task<List<Payment>> GetPayments()
        {
            var results = await client.ListPaymentsAsync(new ListPaymentsRequest
            {
                IncludeIncomplete = true,
                IndexOffset = 0,
                MaxPayments = ulong.MaxValue,
                Reversed = true
            });
            return results.Payments.ToList();
        }
    }
}