using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Shared.Protos;

namespace ApiTest
{
    public class PublicInvoicesScenario
    {
        private readonly List<User> users;
        private readonly ILogger<PublicInvoicesScenario> logger;
        private readonly List<Task> tasks = new List<Task>();
        private readonly int count = 300;
        private readonly List<Invoice> invoices=new List<Invoice>();

        public PublicInvoicesScenario(List<User> users, IServiceProvider provider)
        {
            logger = provider.GetService<ILogger<PublicInvoicesScenario>>();
            this.users = users;
        }

        private async Task CreatePublicInvoices(User user)
        {
            for (int i = 0; i < count; i++)
            {
                var req = new CreateInvoiceRequest
                {
                    IsPrivate = false,
                    IsBaseCrypto = false,
                    UserName = "",
                    Price = 10m.ToPb(),
                    FiatCurrency = "RUB",
                    PriceVariable = "Average",
                    TtlMinutes = 30,
                    Comment = "Test1",
                    PiecesMin = 1,
                    PiecesMax = 10,
                    LimitLiquidity = false,
                    NoIntegration = true
                };
                var invoice = await user.GrpcClients.TradeClient.CreateInvoiceAsync(req);
                user.Invoices.Add(invoice);
                invoices.Add(invoice);
                logger.LogWarning($"Invoice created {invoice.Id}");
            }
        }
        private async Task PayInvoices(User user)
        {
            foreach (var invoice in invoices.Where(p => p.Owner.Id != user.UserId).ToList())
            {
                var req = new PayInvoiceFromBalanceRequest
                {
                    InvoiceId = invoice.Id,
                    Pieces = 1
                };
                var payment = await user.GrpcClients.TradeClient.PayInvoiceFromBalanceAsync(req);
                user.Payments.Add(payment);
                logger.LogWarning($"Invoice {invoice.Id} paid. Payment: {payment.Id}");
            }
        }

        public void Run()
        {
            foreach (var user in users)
            {
                var task = CreatePublicInvoices(user);
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());
            tasks.Clear();
            
            /*
            foreach (var user in users)
            {
                var task = PayInvoices(user);
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());
            tasks.Clear();
            */
        }
    }
}