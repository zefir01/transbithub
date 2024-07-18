using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class LnAd5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "initiator_ln_disable_balance",
                table: "deals");

            migrationBuilder.DropColumn(
                name: "initiator_ln_enabled",
                table: "deals");

            migrationBuilder.AddColumn<long>(
                name: "deal_fk",
                table: "out_transaction_requests",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "deal_fk",
                table: "lnpayment",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "withdrawal_error",
                table: "deals",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "withdrawal_status",
                table: "deals",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_requests_deal_fk",
                table: "out_transaction_requests",
                column: "deal_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_lnpayment_deal_fk",
                table: "lnpayment",
                column: "deal_fk",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_lnpayment_deals_deal_fk",
                table: "lnpayment",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_out_transaction_requests_deals_deal_fk",
                table: "out_transaction_requests",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_lnpayment_deals_deal_fk",
                table: "lnpayment");

            migrationBuilder.DropForeignKey(
                name: "fk_out_transaction_requests_deals_deal_fk",
                table: "out_transaction_requests");

            migrationBuilder.DropIndex(
                name: "ix_out_transaction_requests_deal_fk",
                table: "out_transaction_requests");

            migrationBuilder.DropIndex(
                name: "ix_lnpayment_deal_fk",
                table: "lnpayment");

            migrationBuilder.DropColumn(
                name: "deal_fk",
                table: "out_transaction_requests");

            migrationBuilder.DropColumn(
                name: "deal_fk",
                table: "lnpayment");

            migrationBuilder.DropColumn(
                name: "withdrawal_error",
                table: "deals");

            migrationBuilder.DropColumn(
                name: "withdrawal_status",
                table: "deals");

            migrationBuilder.AddColumn<bool>(
                name: "initiator_ln_disable_balance",
                table: "deals",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "initiator_ln_enabled",
                table: "deals",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
