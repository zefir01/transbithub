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
    public class PrivateInvoicesScenario
    {
        private readonly List<User> users;
        private readonly ILogger<PrivateInvoicesScenario> logger;
        private readonly List<Task> tasks = new List<Task>();

        public PrivateInvoicesScenario(List<User> users, IServiceProvider provider)
        {
            logger = provider.GetService<ILogger<PrivateInvoicesScenario>>();
            this.users = users;
        }

        private async Task CreateInvoices(User user, int count = 10)
        {
            foreach (var targetUser in users)
            {
                if (user.Profile.Username == targetUser.Profile.Username)
                    continue;
                for (int i = 0; i < count; i++)
                {
                    var req = new CreateInvoiceRequest
                    {
                        IsPrivate = true,
                        IsBaseCrypto = false,
                        UserName = targetUser.Profile.Username,
                        Price = 10m.ToPb(),
                        FiatCurrency = "RUB",
                        PriceVariable = "Average",
                        TtlMinutes = 30,
                        Comment = "Test1",
                        PiecesMin = 1,
                        PiecesMax = 1,
                        LimitLiquidity = true,
                        NoIntegration = true
                    };
                    var invoice = await user.GrpcClients.TradeClient.CreateInvoiceAsync(req);
                    user.Invoices.Add(invoice);
                    logger.LogWarning($"Invoice created {invoice.Id}");
                }
            }
        }

        private async Task PayInvoices(User user)
        {
            foreach (var invoice in user.Invoices.Where(p => p.Owner.Id != user.UserId).ToList())
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
                var task = CreateInvoices(user);
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());
            tasks.Clear();
            
            
            foreach (var user in users)
            {
                var task = Task.Run(async () => { await PayInvoices(user); });
                tasks.Add(task);
            }

            Task.WaitAll(tasks.ToArray());
            tasks.Clear();
            
        }
    }
}