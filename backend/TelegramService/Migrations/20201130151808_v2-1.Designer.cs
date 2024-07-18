﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using TelegramService;

namespace TelegramService.Migrations
{
    [DbContext(typeof(TgmDbContext))]
    [Migration("20201130151808_v2-1")]
    partial class v21
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityByDefaultColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("TelegramService.Entitys.TelegramImage", b =>
                {
                    b.Property<Guid>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("image_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("TelegramFileId")
                        .HasColumnType("text")
                        .HasColumnName("telegram_file_id");

                    b.HasKey("ImageId")
                        .HasName("pk_telegram_images");

                    b.HasIndex("TelegramFileId")
                        .HasDatabaseName("ix_telegram_images_telegram_file_id");

                    b.ToTable("telegram_images");
                });

            modelBuilder.Entity("TelegramService.Entitys.TelegramState", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("AnonymousUserId")
                        .HasColumnType("text")
                        .HasColumnName("anonymous_user_id");

                    b.Property<string>("Data")
                        .HasColumnType("text")
                        .HasColumnName("data");

                    b.Property<int>("Lang")
                        .HasColumnType("integer")
                        .HasColumnName("lang");

                    b.Property<List<int>>("LastMessages")
                        .HasColumnType("integer[]")
                        .HasColumnName("last_messages");

                    b.Property<string>("LoginUserId")
                        .HasColumnType("text")
                        .HasColumnName("login_user_id");

                    b.Property<int>("TelegramUserId")
                        .HasColumnType("integer")
                        .HasColumnName("telegram_user_id");

                    b.HasKey("Id")
                        .HasName("pk_telegram_states");

                    b.HasIndex("AnonymousUserId")
                        .HasDatabaseName("ix_telegram_states_anonymous_user_id");

                    b.HasIndex("LoginUserId")
                        .HasDatabaseName("ix_telegram_states_login_user_id");

                    b.HasIndex("TelegramUserId")
                        .HasDatabaseName("ix_telegram_states_telegram_user_id");

                    b.ToTable("telegram_states");
                });

            modelBuilder.Entity("TelegramService.Entitys.WaitingImage", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<long?>("StateId")
                        .HasColumnType("bigint")
                        .HasColumnName("state_id");

                    b.HasKey("Id")
                        .HasName("pk_waiting_image");

                    b.HasIndex("StateId")
                        .HasDatabaseName("ix_waiting_image_state_id");

                    b.ToTable("waiting_image");
                });

            modelBuilder.Entity("TelegramService.Entitys.WaitingImage", b =>
                {
                    b.HasOne("TelegramService.Entitys.TelegramState", "State")
                        .WithMany("WaitingImages")
                        .HasForeignKey("StateId")
                        .HasConstraintName("fk_waiting_image_telegram_states_state_id");

                    b.Navigation("State");
                });

            modelBuilder.Entity("TelegramService.Entitys.TelegramState", b =>
                {
                    b.Navigation("WaitingImages");
                });
#pragma warning restore 612, 618
        }
    }
}
