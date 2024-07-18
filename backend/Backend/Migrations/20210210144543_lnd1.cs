using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Backend.Migrations
{
    public partial class lnd1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "error",
                table: "lninvoices");

            migrationBuilder.DropColumn(
                name: "is_processed",
                table: "lninvoices");

            migrationBuilder.DropColumn(
                name: "expires_in",
                table: "lninvoices");

            migrationBuilder.AddColumn<DateTime>(
                name: "expires_in",
                table: "lninvoices",
                type: "timestamp without time zone",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "bolt11",
                table: "lninvoices",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "id",
                table: "lninvoices");
            migrationBuilder.AddColumn<long>(
                    name: "id",
                    table: "lninvoices",
                    type: "bigint",
                    nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "lnd_add_index",
                table: "lninvoices",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<byte[]>(
                name: "rhash",
                table: "lninvoices",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateIndex(
                name: "ix_lninvoices_lnd_add_index",
                table: "lninvoices",
                column: "lnd_add_index");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_lninvoices_lnd_add_index",
                table: "lninvoices");

            migrationBuilder.DropColumn(
                name: "lnd_add_index",
                table: "lninvoices");

            migrationBuilder.DropColumn(
                name: "rhash",
                table: "lninvoices");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "expires_in",
                table: "lninvoices",
                type: "interval",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.DropColumn(
                name: "expires_in",
                table: "lninvoices");

            migrationBuilder.AddColumn<DateTime>(
                name: "expires_in",
                table: "lninvoices",
                type: "timestamp without time zone",
                nullable: false
            );

            migrationBuilder.AlterColumn<string>(
                name: "bolt11",
                table: "lninvoices",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.DropColumn(
                name: "id",
                table: "lninvoices");
            migrationBuilder.AddColumn<Guid>(
                    name: "id",
                    table: "lninvoices",
                    type: "uuid",
                    nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "error",
                table: "lninvoices",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_processed",
                table: "lninvoices",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}