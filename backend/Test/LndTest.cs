using System;
using System.Net.Http;
using System.Threading.Tasks;
using Google.Protobuf;
using Grpc.Core;
using Grpc.Net.Client;
using LND;
using LND.Router;

namespace Test
{
    /*
     * входящие платежи:
создать инвоис  AddInvoiceAsync
получить статус инвоиса LookupInvoice

исходящие платежи:
получить комиссию DecodePayReq->pub_key->QueryRoutes ->Route-> total_fees_msat
совершить платеж Route->SendToRouteV2
     */
    public class LndTest
    {
        private async Task SubscribeInvoices(Lightning.LightningClient client)
        {
            var stream = client.SubscribeInvoices(new InvoiceSubscription
            {
                AddIndex = 0,
                SettleIndex = 0
            });
            await foreach (var response in stream.ResponseStream.ReadAllAsync())
            {
                Console.WriteLine(response.ToString());
            }
        }

        private async Task LookupInvoice(Invoice invoice, Router.RouterClient client)
        {
            var stream = client.TrackPaymentV2(new TrackPaymentRequest
            {
                NoInflightUpdates = false,
                PaymentHash = invoice.RPreimage
            });
            await foreach (var response in stream.ResponseStream.ReadAllAsync())
            {
                Console.WriteLine(response.ToString());
            }
        }

        public async Task Run()
        {
            Task newInvoicesTask;
            Task lookupTask;

            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2Support", true);
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback =
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
            var channelOptions = new GrpcChannelOptions
            {
                HttpHandler = handler,
            };
            using var channel = GrpcChannel.ForAddress("https://lnd.docker:1009", channelOptions);
            LND.Lightning.LightningClient client = new Lightning.LightningClient(channel);
            var info = client.GetInfo(new GetInfoRequest());
            var router = new LND.Router.Router.RouterClient(channel);
            Console.WriteLine(info.Version);

            newInvoicesTask = SubscribeInvoices(client);

            Invoice inv = new Invoice
            {
                Memo = "Test2",
                ValueMsat = 1000,
                Expiry = 60,
            };
            var resp = await client.AddInvoiceAsync(inv);
            //Console.WriteLine(resp.PaymentRequest);//bolt11

            var invoices = await client.ListInvoicesAsync(new ListInvoiceRequest
            {
                IndexOffset = 0,
                NumMaxInvoices = ulong.MaxValue,
                PendingOnly = true
            });
            foreach (var invoice in invoices.Invoices)
            {
                //Console.WriteLine(invoices.ToString());
            }

            lookupTask = LookupInvoice(inv, router);

            await Task.Delay(1000 * 60 * 1000);
        }
    }
}