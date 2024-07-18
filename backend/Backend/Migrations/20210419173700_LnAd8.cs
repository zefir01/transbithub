using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class LnAd8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ln_payment_request_deals_deal_fk",
                table: "ln_payment_request");

            migrationBuilder.DropForeignKey(
                name: "fk_ln_payment_request_user_datas_owner_fk",
                table: "ln_payment_request");

            migrationBuilder.DropPrimaryKey(
                name: "pk_ln_payment_request",
                table: "ln_payment_request");

            migrationBuilder.RenameTable(
                name: "ln_payment_request",
                newName: "ln_payment_requests");

            migrationBuilder.RenameIndex(
                name: "ix_ln_payment_request_owner_fk",
                table: "ln_payment_requests",
                newName: "ix_ln_payment_requests_owner_fk");

            migrationBuilder.RenameIndex(
                name: "ix_ln_payment_request_deal_fk",
                table: "ln_payment_requests",
                newName: "ix_ln_payment_requests_deal_fk");

            migrationBuilder.AddColumn<string>(
                name: "payment_hash",
                table: "ln_payment_requests",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "pk_ln_payment_requests",
                table: "ln_payment_requests",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_ln_payment_requests_deals_deal_fk",
                table: "ln_payment_requests",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_ln_payment_requests_user_datas_owner_fk",
                table: "ln_payment_requests",
                column: "owner_fk",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ln_payment_requests_deals_deal_fk",
                table: "ln_payment_requests");

            migrationBuilder.DropForeignKey(
                name: "fk_ln_payment_requests_user_datas_owner_fk",
                table: "ln_payment_requests");

            migrationBuilder.DropPrimaryKey(
                name: "pk_ln_payment_requests",
                table: "ln_payment_requests");

            migrationBuilder.DropColumn(
                name: "payment_hash",
                table: "ln_payment_requests");

            migrationBuilder.RenameTable(
                name: "ln_payment_requests",
                newName: "ln_payment_request");

            migrationBuilder.RenameIndex(
                name: "ix_ln_payment_requests_owner_fk",
                table: "ln_payment_request",
                newName: "ix_ln_payment_request_owner_fk");

            migrationBuilder.RenameIndex(
                name: "ix_ln_payment_requests_deal_fk",
                table: "ln_payment_request",
                newName: "ix_ln_payment_request_deal_fk");

            migrationBuilder.AddPrimaryKey(
                name: "pk_ln_payment_request",
                table: "ln_payment_request",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_ln_payment_request_deals_deal_fk",
                table: "ln_payment_request",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_ln_payment_request_user_datas_owner_fk",
                table: "ln_payment_request",
                column: "owner_fk",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
