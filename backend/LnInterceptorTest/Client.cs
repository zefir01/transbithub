using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Grpc.Core;
using LND;
using LND.Router;
using Channel = Grpc.Core.Channel;
using System.Security.Cryptography;
using System.Text;
using Google.Protobuf;
using LND.Invoices;

namespace LnInterceptorTest
{
    public class Client
    {
        private Lightning.LightningClient client;
        private Router.RouterClient router;
        private LND.Invoices.Invoices.InvoicesClient invoices;
        private byte[] hash;
        private byte[] preimage;
        private object locker = new();

        public Client()
        {
            Environment.SetEnvironmentVariable("GRPC_SSL_CIPHER_SUITES", "HIGH+ECDSA");
            var cert = File.ReadAllText("lnd.cert");
            var sslCreds = new SslCredentials(cert);

            byte[] macaroonBytes = File.ReadAllBytes("admin.macaroon");
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


            var channel = new Channel("lnd:10009", combinedCreds);
            client = new Lightning.LightningClient(channel);
            router = new Router.RouterClient(channel);
            invoices = new Invoices.InvoicesClient(channel);
            var info = client.GetInfo(new GetInfoRequest());
        }

        public async Task Start()
        {
            var stream = router.HtlcInterceptor(null, DateTime.MaxValue, CancellationToken.None);
            await foreach (var htlc in stream.ResponseStream.ReadAllAsync())
            {
                Console.WriteLine("New htlc:");
                Console.WriteLine($"{nameof(htlc.PaymentHash)}: {htlc.PaymentHash}");
                Console.WriteLine($"{nameof(htlc.IncomingCircuitKey)}: {htlc.IncomingCircuitKey}");
                Console.WriteLine($"{nameof(htlc.IncomingAmountMsat)}: {htlc.IncomingAmountMsat}");
                Console.WriteLine($"{nameof(htlc.OutgoingAmountMsat)}: {htlc.OutgoingAmountMsat}");
                Console.WriteLine($"{nameof(htlc.OutgoingRequestedChanId)}: {htlc.OutgoingRequestedChanId}");

                await stream.RequestStream.WriteAsync(new ForwardHtlcInterceptResponse
                {
                    Action = ResolveHoldForwardAction.Resume,
                    IncomingCircuitKey = htlc.IncomingCircuitKey,
                    Preimage = htlc.PaymentHash
                });
            }
        }

        public async Task Start1()
        {
            var stream = router.SubscribeHtlcEvents(new SubscribeHtlcEventsRequest());
            await foreach (var evt in stream.ResponseStream.ReadAllAsync())
            {
                Console.WriteLine("New event:");
                Console.WriteLine($"{nameof(evt.EventType)}: {evt.EventType}");
            }
        }

        private async Task<(byte[] preimage, byte[] hash)> GetPreimage()
        {
            Byte[] r = new Byte[32];
            Random rnd = new Random();
            rnd.NextBytes(r);
            var hash = await GetHash(r);
            return (r, hash);
        }

        private async Task<byte[]> GetHash(byte[] data)
        {
            using SHA256 mySha256 = SHA256.Create();
            MemoryStream stream = new MemoryStream(data);
            var hash = await mySha256.ComputeHashAsync(stream);
            return hash;
        }

        public async Task<(string bolt11, byte[] preimage, byte[] hash)> CreateHoldInvoice(string desc, decimal amount)
        {
            var (r, hash) = await GetPreimage();
            var resp = await invoices.AddHoldInvoiceAsync(new AddHoldInvoiceRequest
            {
                Memo = desc,
                Hash = ByteString.CopyFrom(hash),
                Value = Convert.ToInt64(amount / 0.00000001m),
                Expiry = 60 * 10,
                FallbackAddr = "",
                CltvExpiry = 5*24*6,
                Private = false
            });
            return (resp.PaymentRequest, r, hash);
        }

        public async Task SettleInvoice(byte[] preimage)
        {
            await invoices.SettleInvoiceAsync(new SettleInvoiceMsg
            {
                Preimage = ByteString.CopyFrom(preimage)
            });
        }

        public async Task CancelInvoice(byte[] hash)
        {
            await invoices.CancelInvoiceAsync(new CancelInvoiceMsg
            {
                PaymentHash = ByteString.CopyFrom(hash)
            });
        }

        public async Task SubscribeInvoices()
        {
            var stream = client.SubscribeInvoices(new InvoiceSubscription
            {
                AddIndex = 0,
                SettleIndex = 0
            });
            await foreach (var invoice in stream.ResponseStream.ReadAllAsync())
            {
                lock (locker)
                {
                    Console.WriteLine("All invoices stream:");
                    Console.WriteLine($"{nameof(invoice.State)}: {invoice.State}");
                    Console.WriteLine($"{nameof(invoice.RHash)}: {BytesToString(invoice.RHash.ToByteArray())}");
                    Console.WriteLine($"{nameof(invoice.RPreimage)}: {BytesToString(invoice.RPreimage.ToByteArray())}");
                    Console.WriteLine($"{nameof(invoice.AmtPaidSat)}: {invoice.AmtPaidSat}");
                    Console.WriteLine("\n\n");
                }
            }
        }

        public async Task SubscribeInvoice(byte[] hash)
        {
            var stream = invoices.SubscribeSingleInvoice(new SubscribeSingleInvoiceRequest
            {
                RHash = ByteString.CopyFrom(hash)
            });
            await foreach (var invoice in stream.ResponseStream.ReadAllAsync())
            {
                lock (locker)
                {
                    Console.WriteLine("Single invoice stream:");
                    Console.WriteLine($"{nameof(invoice.State)}: {invoice.State}");
                    Console.WriteLine($"{nameof(invoice.RHash)}: {BytesToString(invoice.RHash.ToByteArray())}");
                    Console.WriteLine($"{nameof(invoice.RPreimage)}: {BytesToString(invoice.RPreimage.ToByteArray())}");
                    Console.WriteLine($"{nameof(invoice.AmtPaidSat)}: {invoice.AmtPaidSat}");
                    Console.WriteLine("\n\n");
                }

                if (invoice.State == Invoice.Types.InvoiceState.Accepted)
                    await RequestAction(invoice.RHash.ToByteArray());
            }
        }

        private string BytesToString(byte[] bytes)
        {
            StringBuilder hex = new StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }

        public async Task RequestAction(byte[] hash)
        {
            if (!hash.SequenceEqual(this.hash))
                return;
            Console.WriteLine("Action:\nSettle: 1\nCancel: 2");
            var line = Console.ReadLine();
            switch (line)
            {
                case "1":
                    await SettleInvoice(preimage);
                    Console.WriteLine("Settled.");
                    return;
                case "2":
                    await CancelInvoice(hash);
                    Console.WriteLine("Canceled.");
                    return;
            }
        }

        public async Task Test1()
        {
#pragma warning disable 4014
            SubscribeInvoices();
#pragma warning restore 4014
            var (bolt11, preimage, hash) = await CreateHoldInvoice("test1", 0.00001m);
            this.preimage = preimage;
            this.hash = hash;
#pragma warning disable 4014
            SubscribeInvoice(hash);
#pragma warning restore 4014
            lock (locker)
            {
                Console.WriteLine(
                    $"Invoice created:\nPreimage: {BytesToString(preimage)}\nHash: {BytesToString(hash)}");
                Console.WriteLine($"Bolt11: {bolt11}\n\n");
            }

            await Task.Delay(int.MaxValue);
        }
    }
}