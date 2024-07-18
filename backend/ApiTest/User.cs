using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using IdentityModel.Client;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Protos.TradeApi.V1;
using Shared;
using Shared.Protos;

namespace ApiTest
{
    public class User : IDisposable
    {
        private readonly Config config;
        public string UserId { get; private set; }
        public string UserName { get; private set; }
        public GrpcClients GrpcClients { get; private set; }
        private string refreshToken;
        private readonly Task refreshTokenTask;
        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
        private readonly ILogger<User> logger;
        private Dictionary<string, decimal> vars = null;
        private readonly Task varsTask;
        private readonly Task eventsTask;
        public MyProfileResponse Profile { get; private set; }
        public List<Advertisement> Ads { get; private set; } = new List<Advertisement>();
        public List<Invoice> Invoices { get; private set; } = new List<Invoice>();
        public List<InvoicePayment> Payments { get; private set; } = new List<InvoicePayment>();

        public User(IServiceProvider provider, string userName, string password)
        {
            logger = provider.GetService<ILogger<User>>();
            config = provider.GetService<Config>();
            GrpcClients = provider.GetRequiredService<GrpcClients>();
            Login(userName, password, "", cancellationTokenSource.Token).ConfigureAwait(false).GetAwaiter().GetResult();
            refreshTokenTask = RefreshToken(cancellationTokenSource.Token);
            varsTask = SubscribeVars();
            eventsTask = SubscribeEvents();
            Init().ConfigureAwait(false).GetAwaiter().GetResult();
            logger.LogWarning($"User {userName} loaded.");
        }
        
        public User(IServiceProvider provider, string token)
        {
            logger = provider.GetService<ILogger<User>>();
            config = provider.GetService<Config>();
            GrpcClients = provider.GetRequiredService<GrpcClients>();
            GrpcClients.UpdateToken(token);
            //varsTask = SubscribeVars();
            //eventsTask = SubscribeEvents();
            Init().ConfigureAwait(false).GetAwaiter().GetResult();
            logger.LogWarning($"User {UserName} loaded.");
        }

        public async Task Login(string username, string password, string twoFa = "",
            CancellationToken cancellationToken = default)
        {
            var chandler = new HttpClientHandler();
            chandler.ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            using var client = new HttpClient(chandler);
            var scopes = MyResources.GetApiResources().First().Scopes;
            var scopesStr = string.Join(" ", scopes) + " offline_access";
            var response = await client.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = $"https://{config.Host}:{config.HttpPort}/connect/token",
                GrantType = GrantType.ResourceOwnerPassword,

                ClientId = "browser",
                ClientSecret = "secret",
                UserName = username,
                Password = password,
                Scope = scopesStr,

                Parameters =
                {
                    {"two_fa", twoFa},
                }
            }, cancellationToken: cancellationToken);
            if (response.IsError)
            {
                if (response.Error == "Need two_fa pin.")
                    throw new NeedTwoFaException();
                throw new ModelException(response.ErrorDescription);
            }

            var jwt = response.AccessToken;
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwt);
            UserId = token.Claims.First(p => p.Type == "sub").Value;
            GrpcClients.UpdateToken(response.AccessToken);
            refreshToken = response.RefreshToken;
            logger.LogDebug("Login success.");
        }

        private async Task RefreshToken(CancellationToken cancellationToken = default)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(120000, cancellationToken);
                if (refreshToken.IsNullOrEmpty())
                    return;
                var chandler = new HttpClientHandler();
                chandler.ServerCertificateCustomValidationCallback =
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
                using var client = new HttpClient(chandler);
                var response = await client.RequestRefreshTokenAsync(new RefreshTokenRequest
                {
                    Address = $"https://{config.Host}:{config.HttpPort}/connect/token",

                    ClientId = "browser",
                    ClientSecret = "secret",
                    RefreshToken = refreshToken,
                }, cancellationToken: cancellationToken);
                if (response.IsError)
                {
                    if (response.Error == "Need two_fa pin.")
                        throw new NeedTwoFaException();
                    throw new ModelException(response.ErrorDescription);
                }

                GrpcClients.UpdateToken(response.AccessToken);
                logger.LogDebug("Token updated.");
            }
        }

        private async Task SubscribeVars()
        {
            var stream = GrpcClients.TradeClient.SubscribeVariables(new Empty(),
                Metadata.Empty, DateTime.MaxValue, cancellationTokenSource.Token);

            await foreach (var response in stream.ResponseStream.ReadAllAsync())
            {
                if (response.KeepAlive)
                    continue;
                vars = response.Variables_.ToDictionary(p => p.Key, p => p.Value.FromPb());
                logger.LogDebug($"Variables received {vars.Count}");
            }
        }

        private async Task SubscribeEvents()
        {
            var stream = GrpcClients.TradeClient.SubscribeNewEvents(new Empty(),
                Metadata.Empty, DateTime.MaxValue, cancellationTokenSource.Token);
            await foreach (var response in stream.ResponseStream.ReadAllAsync())
            {
                if (response.KeepAlive)
                    continue;
                logger.LogDebug("New event received.");
                if (response.InvoiceNew != null)
                {
                    Invoices.Add(response.InvoiceNew);
                }
                else if (response.InvoicePayed != null)
                {
                    var inv = Invoices.FirstOrDefault(p => p.Id == response.InvoicePayed.Id);
                    if (inv != null)
                        Invoices.Remove(inv);
                    Invoices.Add(response.InvoicePayed);
                }
                else if (response.InvoicePaymentNew != null)
                {
                    Payments.Add(response.InvoicePaymentNew);
                }
                else if (response.InvoicePaymentUpdated != null)
                {
                    var payment = Payments.FirstOrDefault(p => p.Id == response.InvoicePaymentUpdated.Id);
                    if (payment != null)
                        Payments.Remove(payment);
                    Payments.Add(response.InvoicePaymentUpdated);
                }
            }
        }

        public void Dispose()
        {
            try
            {
                cancellationTokenSource.Cancel();
                Task.WaitAll(refreshTokenTask, varsTask, eventsTask);
                refreshTokenTask?.Dispose();
                cancellationTokenSource?.Dispose();
                varsTask?.Dispose();
                eventsTask?.Dispose();
            }
            catch
            {
                // ignored
            }
        }

        public async Task<List<Advertisement>> GetMyAds()
        {
            var ads = await GrpcClients.TradeClient.GetMyAdvertisementsAsync(new Empty());
            Ads = ads.Advertisements.ToList();
            return Ads;
        }

        public async Task<List<Invoice>> GetInvoices(bool isMy, Invoice.Types.InvoiceStatus status, bool isPrivate)
        {
            int received;
            ulong minId = 0;
            do
            {
                var t = from inv in Invoices
                    where (inv.Owner.Id == UserId) == isMy
                          && inv.Status == status
                          && inv.IsPrivate == isPrivate
                    select inv;
                if (t.Any())
                {
                    minId = t.Min(p => p.Id);
                }

                var req = new GetInvoicesRequest
                {
                    IsOwner = isMy,
                    IsOwnerHasValue = true,
                    Count = 100,
                    Id = 0,
                    IsPrivate = isPrivate,
                    IsPrivateHasValue = true,
                    LastId = minId,
                    ToUser = ""
                };
                req.Statuses.Add(status);
                var resp = await GrpcClients.TradeClient.GetInvoicesAsync(req);
                received = resp.Invoices.Count;
                if (received > 0)
                    Invoices.AddRange(resp.Invoices.ToList());
            } while (received != 0);

            return Invoices;
        }

        public async Task<MyProfileResponse> GetProfile()
        {
            var prof = await GrpcClients.TradeClient.GetMyProfileAsync(new Empty());
            Profile = prof;
            UserId = Profile.UserId;
            UserName = Profile.Username;
            return prof;
        }

        public async Task<List<InvoicePayment>> GetMyPayments()
        {
            int received;
            ulong minId = 0;
            do
            {
                if (Payments.Any())
                    minId = Payments.Min(p => p.Id);
                var req = new GetInvoicePaymentsRequest
                {
                    PaymentId = 0,
                    IsToMe = false,
                    IsToMeHasValue = false,
                    LastId = minId,
                    Count = 100
                };
                var resp = await GrpcClients.TradeClient.GetInvoicePaymentsAsync(req);
                received = resp.Payments.Count;
                if (received > 0)
                    Payments.AddRange(resp.Payments.ToList());
            } while (received != 0);

            return Payments;
        }

        private async Task Init()
        {
            await GetProfile();
            await GetMyAds();
            await GetInvoices(true, Invoice.Types.InvoiceStatus.Active, true);
            await GetInvoices(false, Invoice.Types.InvoiceStatus.Active, true);
            await GetInvoices(true, Invoice.Types.InvoiceStatus.Active, false);
            await GetMyPayments();
        }
    }
}