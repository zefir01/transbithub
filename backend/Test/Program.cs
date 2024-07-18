using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Grpc.Core;
using Grpc.Net.Client;
using LND;
using Serilog;
using Serilog.Exceptions;
using Serilog.Formatting.Compact;
using Serilog.Formatting.Elasticsearch;
using Serilog.Formatting.Json;

namespace Test
{
    class Program
    {
        private async Task SubscribeInvoices(Lightning.LightningClient client)
        {
            var stream = client.SubscribeInvoices(new InvoiceSubscription());
            await foreach (var response in stream.ResponseStream.ReadAllAsync())
            {
                Console.WriteLine(response.ToString());
            }
        }
        static async Task Main(string[] args)
        {
            var test = new LndTest();
            await test.Run();

        }
    }
}