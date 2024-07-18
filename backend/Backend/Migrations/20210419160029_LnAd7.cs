using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Backend.Migrations
{
    public partial class LnAd7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "lnpayment");

            migrationBuilder.CreateTable(
                name: "ln_payment_request",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    error = table.Column<string>(type: "text", nullable: false),
                    deal_fk = table.Column<long>(type: "bigint", nullable: true),
                    owner_fk = table.Column<long>(type: "bigint", nullable: false),
                    fee_from_balance = table.Column<decimal>(type: "numeric", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    bolt11 = table.Column<string>(type: "text", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ln_payment_request", x => x.id);
                    table.ForeignKey(
                        name: "fk_ln_payment_request_deals_deal_fk",
                        column: x => x.deal_fk,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_ln_payment_request_user_datas_owner_fk",
                        column: x => x.owner_fk,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_ln_payment_request_deal_fk",
                table: "ln_payment_request",
                column: "deal_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_ln_payment_request_owner_fk",
                table: "ln_payment_request",
                column: "owner_fk");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ln_payment_request");

            migrationBuilder.CreateTable(
                name: "lnpayment",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    bolt11 = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    fee_from_balance = table.Column<decimal>(type: "numeric", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    deal_fk = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lnpayment", x => x.id);
                    table.ForeignKey(
                        name: "fk_lnpayment_deals_deal_fk",
                        column: x => x.deal_fk,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_lnpayment_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_lnpayment_deal_fk",
                table: "lnpayment",
                column: "deal_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_lnpayment_owner_id",
                table: "lnpayment",
                column: "owner_id");
        }
    }
}
