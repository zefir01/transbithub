﻿// <auto-generated />
using System;
using Aggregator;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Aggregator.Migrations
{
    [DbContext(typeof(DataDbContext))]
    [Migration("20210527081529_init1")]
    partial class init1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.5")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("Aggregator.Entitys.Ad", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<long>("AdId")
                        .HasColumnType("bigint")
                        .HasColumnName("ad_id");

                    b.Property<string>("City")
                        .HasColumnType("text")
                        .HasColumnName("city");

                    b.Property<int?>("Country")
                        .HasColumnType("integer")
                        .HasColumnName("country");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<int>("CryptoCurrency")
                        .HasColumnType("integer")
                        .HasColumnName("crypto_currency");

                    b.Property<DateTime?>("DisabledAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("disabled_at");

                    b.Property<int>("FiatCurrency")
                        .HasColumnType("integer")
                        .HasColumnName("fiat_currency");

                    b.Property<bool>("IsBuy")
                        .HasColumnType("boolean")
                        .HasColumnName("is_buy");

                    b.Property<decimal>("MaxAmount")
                        .HasColumnType("numeric")
                        .HasColumnName("max_amount");

                    b.Property<decimal>("MinAmount")
                        .HasColumnType("numeric")
                        .HasColumnName("min_amount");

                    b.Property<long>("OwnerId")
                        .HasColumnType("bigint")
                        .HasColumnName("owner_id");

                    b.Property<int>("PaymentType")
                        .HasColumnType("integer")
                        .HasColumnName("payment_type");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric")
                        .HasColumnName("price");

                    b.Property<DateTime>("PriceUpdatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("price_updated_at");

                    b.Property<string>("Terms")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("terms");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updated_at");

                    b.Property<int?>("Window")
                        .HasColumnType("integer")
                        .HasColumnName("window");

                    b.Property<int>("source_type")
                        .HasColumnType("integer")
                        .HasColumnName("source_type");

                    b.HasKey("Id")
                        .HasName("pk_ad");

                    b.HasIndex("AdId")
                        .HasDatabaseName("ix_ad_ad_id");

                    b.HasIndex("CryptoCurrency")
                        .HasDatabaseName("ix_ad_crypto_currency");

                    b.HasIndex("DisabledAt")
                        .HasDatabaseName("ix_ad_disabled_at");

                    b.HasIndex("FiatCurrency")
                        .HasDatabaseName("ix_ad_fiat_currency");

                    b.HasIndex("IsBuy")
                        .HasDatabaseName("ix_ad_is_buy");

                    b.HasIndex("MaxAmount")
                        .HasDatabaseName("ix_ad_max_amount");

                    b.HasIndex("MinAmount")
                        .HasDatabaseName("ix_ad_min_amount");

                    b.HasIndex("OwnerId")
                        .HasDatabaseName("ix_ad_owner_id");

                    b.HasIndex("PaymentType")
                        .HasDatabaseName("ix_ad_payment_type");

                    b.HasIndex("Price")
                        .HasDatabaseName("ix_ad_price");

                    b.HasIndex("PriceUpdatedAt")
                        .HasDatabaseName("ix_ad_price_updated_at");

                    b.HasIndex("UpdatedAt")
                        .HasDatabaseName("ix_ad_updated_at");

                    b.HasIndex("source_type");

                    b.ToTable("ad");

                    b.HasDiscriminator<int>("source_type").HasValue(0);
                });

            modelBuilder.Entity("Aggregator.Entitys.Trader", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<DateTime>("LastActivity")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("last_activity");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<DateTime?>("RegisteredAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("registered_at");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updated_at");

                    b.Property<int>("source_type")
                        .HasColumnType("integer")
                        .HasColumnName("source_type");

                    b.HasKey("Id")
                        .HasName("pk_trader");

                    b.HasIndex("Name")
                        .HasDatabaseName("ix_trader_name");

                    b.HasIndex("source_type");

                    b.ToTable("trader");

                    b.HasDiscriminator<int>("source_type").HasValue(0);
                });

            modelBuilder.Entity("Aggregator.Entitys.TraderSnapshot", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<decimal?>("Amount")
                        .HasColumnType("numeric")
                        .HasColumnName("amount");

                    b.Property<int>("BlockedCount")
                        .HasColumnType("integer")
                        .HasColumnName("blocked_count");

                    b.Property<int>("CanceledDeals")
                        .HasColumnType("integer")
                        .HasColumnName("canceled_deals");

                    b.Property<int>("CompletedDeals")
                        .HasColumnType("integer")
                        .HasColumnName("completed_deals");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<int>("NegativeFeedbacks")
                        .HasColumnType("integer")
                        .HasColumnName("negative_feedbacks");

                    b.Property<long>("OwnerId")
                        .HasColumnType("bigint")
                        .HasColumnName("owner_id");

                    b.Property<int>("PositiveFeedbacks")
                        .HasColumnType("integer")
                        .HasColumnName("positive_feedbacks");

                    b.Property<decimal>("Rating")
                        .HasColumnType("numeric")
                        .HasColumnName("rating");

                    b.Property<int>("TradesCount")
                        .HasColumnType("integer")
                        .HasColumnName("trades_count");

                    b.Property<int>("TrustedCount")
                        .HasColumnType("integer")
                        .HasColumnName("trusted_count");

                    b.Property<int>("source_type")
                        .HasColumnType("integer")
                        .HasColumnName("source_type");

                    b.HasKey("Id")
                        .HasName("pk_trader_snapshot");

                    b.HasIndex("OwnerId")
                        .HasDatabaseName("ix_trader_snapshot_owner_id");

                    b.HasIndex("source_type");

                    b.ToTable("trader_snapshot");

                    b.HasDiscriminator<int>("source_type").HasValue(0);
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.BzParams", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<DateTime>("LastFullUpdate")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("last_full_update");

                    b.HasKey("Id")
                        .HasName("pk_bz_params");

                    b.ToTable("bz_params");
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.TraderVolumes", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<decimal>("Amount")
                        .HasColumnType("numeric")
                        .HasColumnName("amount");

                    b.Property<int>("CryptoCurrency")
                        .HasColumnType("integer")
                        .HasColumnName("crypto_currency");

                    b.Property<long>("DealsCount")
                        .HasColumnType("bigint")
                        .HasColumnName("deals_count");

                    b.Property<long>("SnapshotId")
                        .HasColumnType("bigint")
                        .HasColumnName("snapshot_id");

                    b.HasKey("Id")
                        .HasName("pk_bz_trader_volumes");

                    b.HasIndex("SnapshotId")
                        .HasDatabaseName("ix_bz_trader_volumes_snapshot_id");

                    b.ToTable("bz_trader_volumes");
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.Ad", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.Ad");

                    b.HasDiscriminator().HasValue(1);
                });

            modelBuilder.Entity("Aggregator.Services.LocalBitcoins.Entitys.Ad", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.Ad");

                    b.Property<string>("BankName")
                        .HasColumnType("text")
                        .HasColumnName("bank_name");

                    b.Property<decimal>("RequireFeedbackScore")
                        .HasColumnType("numeric")
                        .HasColumnName("require_feedback_score");

                    b.Property<decimal>("RequireTradeVolume")
                        .HasColumnType("numeric")
                        .HasColumnName("require_trade_volume");

                    b.HasDiscriminator().HasValue(2);
                });

            modelBuilder.Entity("Aggregator.Services.Paxful.Entitys.Ad", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.Ad");

                    b.Property<string>("PxAdId")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("px_ad_id");

                    b.HasIndex("PxAdId")
                        .HasDatabaseName("ix_ad_px_ad_id");

                    b.HasDiscriminator().HasValue(3);
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.Trader", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.Trader");

                    b.Property<bool>("Verified")
                        .HasColumnType("boolean")
                        .HasColumnName("verified");

                    b.HasDiscriminator().HasValue(1);
                });

            modelBuilder.Entity("Aggregator.Services.LocalBitcoins.Entitys.Trader", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.Trader");

                    b.HasDiscriminator().HasValue(2);
                });

            modelBuilder.Entity("Aggregator.Services.Paxful.Entitys.Trader", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.Trader");

                    b.HasDiscriminator().HasValue(3);
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.TraderSnapshot", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.TraderSnapshot");

                    b.Property<int>("DisputeLoose")
                        .HasColumnType("integer")
                        .HasColumnName("dispute_loose");

                    b.HasDiscriminator().HasValue(1);
                });

            modelBuilder.Entity("Aggregator.Services.LocalBitcoins.Entitys.TraderSnapshot", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.TraderSnapshot");

                    b.HasDiscriminator().HasValue(2);
                });

            modelBuilder.Entity("Aggregator.Services.Paxful.Entitys.TraderSnapshot", b =>
                {
                    b.HasBaseType("Aggregator.Entitys.TraderSnapshot");

                    b.Property<int>("Partners")
                        .HasColumnType("integer")
                        .HasColumnName("partners");

                    b.HasDiscriminator().HasValue(3);
                });

            modelBuilder.Entity("Aggregator.Entitys.Ad", b =>
                {
                    b.HasOne("Aggregator.Entitys.Trader", "Owner")
                        .WithMany("Ads")
                        .HasForeignKey("OwnerId")
                        .HasConstraintName("fk_ad_trader_owner_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Aggregator.Entitys.TraderSnapshot", b =>
                {
                    b.HasOne("Aggregator.Entitys.Trader", "Owner")
                        .WithMany("Snapshots")
                        .HasForeignKey("OwnerId")
                        .HasConstraintName("fk_trader_snapshot_trader_owner_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.TraderVolumes", b =>
                {
                    b.HasOne("Aggregator.Services.BitZlato.Entitys.TraderSnapshot", "Snapshot")
                        .WithMany("Volumes")
                        .HasForeignKey("SnapshotId")
                        .HasConstraintName("fk_bz_trader_volumes_trader_snapshot_snapshot_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Snapshot");
                });

            modelBuilder.Entity("Aggregator.Entitys.Trader", b =>
                {
                    b.Navigation("Ads");

                    b.Navigation("Snapshots");
                });

            modelBuilder.Entity("Aggregator.Services.BitZlato.Entitys.TraderSnapshot", b =>
                {
                    b.Navigation("Volumes");
                });
#pragma warning restore 612, 618
        }
    }
}
