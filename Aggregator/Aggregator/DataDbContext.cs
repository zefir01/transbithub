using System;
using Aggregator.Services.BitZlato;
using Aggregator.Services.BitZlato.Entitys;
using Marques.EFCore.SnakeCase;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Aggregator
{
    public enum SpurceTypes
    {
        None,
        BitZlato,
        LocalBitcoins,
        Paxful
    }
    public class DataDbContext: DbContext
    {
        private readonly IDataDbConfig config;
        public ILogger? Logger { get; }
        
        public DbSet<Trader> BzTraders { get; set; }
        public DbSet<Ad> BzAds { get; set; }
        public DbSet<BzParams> BzParams { get; set; }
        public DbSet<Services.Paxful.Entitys.Trader> PxTraders { get; set; }
        public DbSet<Services.Paxful.Entitys.Ad> PxAds { get; set; }
        public DbSet<Services.LocalBitcoins.Entitys.Trader> LbTraders { get; set; }
        public DbSet<Services.LocalBitcoins.Entitys.Ad> LbAds { get; set; }
        
#pragma warning disable 8618
        public DataDbContext(IDataDbConfig config,
#pragma warning restore 8618
            IServiceProvider? provider)
        {
            Logger = provider?.GetRequiredService<ILogger<DataDbContext>>();
            this.config = config;
            Database.SetCommandTimeout(3*60*1000);
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
            optionsBuilder.UseNpgsql(config.DataConnection, builder =>
            {
                builder.EnableRetryOnFailure();
                builder.MigrationsAssembly("Aggregator");
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

            modelBuilder.Entity<Aggregator.Entitys.Trader>().HasMany(p => p.Snapshots).WithOne(p => p.Owner);
            modelBuilder.Entity<Aggregator.Entitys.Trader>().HasMany(p => p.Ads).WithOne(p => p.Owner);

            modelBuilder.Entity<Aggregator.Entitys.Trader>()
                .HasDiscriminator<SpurceTypes>("source_type")
                .HasValue<Aggregator.Entitys.Trader>(SpurceTypes.None)
                .HasValue<Aggregator.Services.BitZlato.Entitys.Trader>(SpurceTypes.BitZlato)
                .HasValue<Aggregator.Services.LocalBitcoins.Entitys.Trader>(SpurceTypes.LocalBitcoins)
                .HasValue<Aggregator.Services.Paxful.Entitys.Trader>(SpurceTypes.Paxful);
            modelBuilder.Entity<Aggregator.Entitys.TraderSnapshot>()
                .HasDiscriminator<SpurceTypes>("source_type")
                .HasValue<Aggregator.Entitys.TraderSnapshot>(SpurceTypes.None)
                .HasValue<Aggregator.Services.BitZlato.Entitys.TraderSnapshot>(SpurceTypes.BitZlato)
                .HasValue<Aggregator.Services.LocalBitcoins.Entitys.TraderSnapshot>(SpurceTypes.LocalBitcoins)
                .HasValue<Aggregator.Services.Paxful.Entitys.TraderSnapshot>(SpurceTypes.Paxful);
            modelBuilder.Entity<Aggregator.Entitys.Ad>()
                .HasDiscriminator<SpurceTypes>("source_type")
                .HasValue<Aggregator.Entitys.Ad>(SpurceTypes.None)
                .HasValue<Aggregator.Services.BitZlato.Entitys.Ad>(SpurceTypes.BitZlato)
                .HasValue<Aggregator.Services.LocalBitcoins.Entitys.Ad>(SpurceTypes.LocalBitcoins)
                .HasValue<Aggregator.Services.Paxful.Entitys.Ad>(SpurceTypes.Paxful);
            
            modelBuilder.Entity<Aggregator.Services.BitZlato.Entitys.Ad>().HasBaseType<Aggregator.Entitys.Ad>();
            modelBuilder.Entity<Aggregator.Services.LocalBitcoins.Entitys.Ad>().HasBaseType<Aggregator.Entitys.Ad>();
            modelBuilder.Entity<Aggregator.Services.Paxful.Entitys.Ad>().HasBaseType<Aggregator.Entitys.Ad>();
            
            modelBuilder.Entity<Aggregator.Services.BitZlato.Entitys.Trader>().HasBaseType<Aggregator.Entitys.Trader>();
            modelBuilder.Entity<Aggregator.Services.LocalBitcoins.Entitys.Trader>().HasBaseType<Aggregator.Entitys.Trader>();
            modelBuilder.Entity<Aggregator.Services.Paxful.Entitys.Trader>().HasBaseType<Aggregator.Entitys.Trader>();

            modelBuilder.Entity<Aggregator.Services.BitZlato.Entitys.TraderSnapshot>()
                .HasBaseType<Aggregator.Entitys.TraderSnapshot>();
            modelBuilder.Entity<Aggregator.Services.LocalBitcoins.Entitys.TraderSnapshot>()
                .HasBaseType<Aggregator.Entitys.TraderSnapshot>();
            modelBuilder.Entity<Aggregator.Services.Paxful.Entitys.TraderSnapshot>()
                .HasBaseType<Aggregator.Entitys.TraderSnapshot>();

            modelBuilder.ToSnakeCase();
            
            modelBuilder.Entity<Aggregator.Entitys.Ad>().HasIndex("source_type");
            modelBuilder.Entity<Aggregator.Entitys.Trader>().HasIndex("source_type");
            modelBuilder.Entity<Aggregator.Entitys.TraderSnapshot>().HasIndex("source_type");
        }
    }
}