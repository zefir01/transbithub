using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CoreLib.Entitys;
using CoreLib.Entitys.Invoices;
using CoreLib.Entitys.LN;
using CoreLib.Entitys.UserDataParts;
using CoreLib.Services;
using Grpc.Core;
using Marques.EFCore.SnakeCase;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CoreLib
{
    public class DataDBContext : DbContext
    {
        public LndClient LndClient { get; set; }
        public CancellationToken CancellationToken { get; set; } = default;
        public ServerCallContext Context { get; set; }
        public Config Config { get; set; }
        public Calculator Calculator { get; set; }
        public Pgp Pgp { get; set; }
        public SourceType SourceType { get; set; }
        public UserData User { get; set; }
        public DbSet<YmId> YmIds { get; set; }
        public DbSet<YmIdsConnection> YmIdsConnections { get; set; }
        public DbSet<UserData> UserDatas { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; }
        public DbSet<CryptoExchangeVariable> CryptoExchangeVariables { get; set; }
        public DbSet<FiatExchangeVariable> FiatExchangeVariables { get; set; }
        public DbSet<AvgPrice> AvgPrices { get; set; }
        public DbSet<DealFeedBack> Feedbacks { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<BtcCoreWallet> BtcCoreWallets { get; set; }
        public DbSet<OutTransactionRequest> OutTransactionRequests { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<VariablesMetadata> VariablesMetadata { get; set; }
        public RetranslatorBuffer Retranslator { get; set; }
        public DbSet<Promise> Promises { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Entitys.LN.LNInvoice> LNInvoices { get; set; }
        public DbSet<Deal> Deals { get; set; }
        public DbSet<IpCountry> IpCountries { get; set; }
        public DbSet<Dispute> Disputes { get; set; }
        public DbSet<LnPaymentRequest> LnPaymentRequests { get; set; }

        public ILogger Logger { get; }
        private readonly IDataDbConfig config;

        public void Notify(IMyNotification notification, CancellationToken cancellationToken = default)
        {
            Retranslator.Notify(notification, cancellationToken);
        }

        public DataDBContext(IDataDbConfig config,
            IServiceProvider provider)
        {
            Logger = provider?.GetService<ILogger<DataDBContext>>();
            this.config = config;
            if (config is Config c)
                Config = c;

            Retranslator = provider?.GetService<RetranslatorBuffer>();
            Pgp = provider?.GetService<Pgp>();
            LndClient = provider?.GetService<LndClient>();

            /*
            if (mediator != null)
            {
                TransactionScope = new TransactionScope(
                    TransactionScopeOption.Required,
                    new TransactionOptions
                    {
                        IsolationLevel = IsolationLevel.ReadCommitted,
                    },
                    TransactionScopeAsyncFlowOption.Enabled
                );
            }
*/
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
            optionsBuilder.UseNpgsql(config.DataConnection, builder =>
            {
                builder.EnableRetryOnFailure();
                builder.MigrationsAssembly("Backend");
            });
/*
            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.EnableDetailedErrors();
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Log(CoreEventId.SaveChangesFailed));
            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Information)
                    .AddConsole();
            });
            optionsBuilder.UseLoggerFactory(loggerFactory);
            */
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserData>().HasMany(p => p.TrustedUsers).WithOne(p => p.Owner).IsRequired();
            modelBuilder.Entity<UserData>().HasMany(p => p.BlockedUsers).WithOne(p => p.Owner).IsRequired();
            modelBuilder.Entity<UserData>().HasMany(p => p.MyInvoices).WithOne(p => p.Owner).IsRequired();
            modelBuilder.Entity<UserData>().HasMany(p => p.ToMeInvoices).WithOne(p => p.TargetUser);
            modelBuilder.Entity<InvoicePayment>().HasOne(p => p.Invoice).WithMany(p => p.Payments);
            modelBuilder.Entity<UserData>().HasMany(p => p.MyPayments).WithOne(p => p.Owner);
            modelBuilder.Entity<InvoicePayment>().HasMany(p => p.Refunds);
            modelBuilder.Entity<Deal>().HasOne(p => p.Promise)
                .WithOne(p => p.Deal).OnDelete(DeleteBehavior.ClientSetNull).IsRequired(false);
            modelBuilder.Entity<InvoicePayment>().HasOne(p => p.OddPromise)
                .WithOne().OnDelete(DeleteBehavior.ClientSetNull).IsRequired(false);
            modelBuilder.Entity<Deal>().HasMany<DealMessage>().WithOne(p => p.Deal);
            modelBuilder.Entity<DealMessage>().HasMany(p => p.Images)
                .WithOne(p => p.DealMessage).IsRequired(false);
            modelBuilder.Entity<ConversationMessage>().HasMany(p => p.Images)
                .WithOne(p => p.ConversationMessage);
            modelBuilder.Entity<Conversation>().HasMany(p => p.Messages)
                .WithOne(p => p.Conversation);
            modelBuilder.Entity<Invoice>().HasMany(p => p.Conversations).WithOne(p => p.Invoice);
            modelBuilder.Entity<InvoicePayment>().HasOne(p => p.Conversation).WithOne(p => p.Payment);
            modelBuilder.Entity<Invoice>().HasMany(p => p.Images).WithOne(p => p.Invoice);
            modelBuilder.Entity<InvoiceSecret>().HasMany(p => p.Images)
                .WithOne(p => p.Secret).IsRequired(false);
            modelBuilder.Entity<InvoicePayment>().HasMany(p => p.Secrets)
                .WithOne(p => p.Payment).IsRequired(false);
            modelBuilder.Entity<InvoicePayment>().HasOne(p => p.LNInvoice).WithOne(p => p.Payment).IsRequired(false);

            modelBuilder.Entity<Invoice>().HasOne(p => p.Integration).WithOne(p => p.Invoice);
            modelBuilder.Entity<UserData>().HasMany(p => p.Images).WithOne(p => p.Owner);
            modelBuilder.Entity<UserData>().HasMany(p => p.Events).WithOne(p => p.Receiver);

            modelBuilder.Entity<UserData>().HasMany(p => p.DealsInitiator).WithOne(p => p.Initiator);
            modelBuilder.Entity<UserData>().HasMany(p => p.DealsAdOwner).WithOne(p => p.AdOwner);
            modelBuilder.Entity<UserData>().HasMany(p => p.LNInvoices).WithOne(p => p.Owner);
            modelBuilder.Entity<UserData>().HasMany(p => p.InAddresses).WithOne(p => p.Owner);
            modelBuilder.Entity<UserData>().HasMany(p => p.OutTransactions).WithOne(p => p.Owner);
            modelBuilder.Entity<UserData>().HasMany(p => p.DealsFeedbacksToMe).WithOne(p => p.To);
            modelBuilder.Entity<UserData>().HasMany(p => p.PaymentsFeedbacksToMe).WithOne(p => p.To);
            modelBuilder.Entity<UserData>().HasOne(p => p.LastOnline).WithOne(p => p.Owner);
            //modelBuilder.Entity<Promise>().Property(p=>p.Id).HasDefaultValueSql("uuid_generate_v4()");
            //modelBuilder.BuildIndexesFromAnnotations();
            modelBuilder.Entity<UserData>().HasMany(p => p.YmIdsConnections).WithOne(p => p.User);
            modelBuilder.Entity<UserData>().HasMany(p => p.LNPaymentRequests).WithOne(p => p.Owner);
            modelBuilder.Entity<Deal>().HasOne(p => p.FundingLnInvoice).WithOne(p => p.Deal);

            

            modelBuilder.Entity<ConversationMessage>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<Conversation>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<Invoice>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<InvoiceIntegration>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<InvoicePayment>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<InvoicePaymentFeedback>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<InvoiceSecret>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<LNInvoice>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<LnPaymentRequest>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<UserData>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<Advertisement>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<BtcCoreWallet>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<Deal>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<InAddress>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<InTransaction>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<Promise>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<OutTransaction>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<OutTransactionRequest>().UseXminAsConcurrencyToken();
            modelBuilder.Entity<UserBalance>().UseXminAsConcurrencyToken();


            modelBuilder.ToSnakeCase();
        }

        public async Task<IList<(string key, decimal value)>> GetVariables(CancellationToken cancellationToken)
        {
            var cryptoVars = await CryptoExchangeVariables.AsNoTracking().ToListAsync(cancellationToken);
            var fiatVars = await FiatExchangeVariables.AsNoTracking().ToListAsync(cancellationToken);
            var avgVars = await AvgPrices.AsNoTracking().ToListAsync(cancellationToken);
            var t1 = cryptoVars.Select(p => (p.Key.ToString(), p.Value));
            var t2 = fiatVars.Select(p => (p.Key.ToString(), p.Value));
            var t3 = avgVars.Select(p => (p.Name, p.Value));
            return t1.Concat(t2).Concat(t3).ToList();
        }
    }
}