using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class LnAd2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ln_enabled",
                table: "deals",
                newName: "initiator_ln_enabled");

            migrationBuilder.RenameColumn(
                name: "ln_disable_balance",
                table: "deals",
                newName: "initiator_ln_disable_balance");

            migrationBuilder.AddColumn<long>(
                name: "deal_fk",
                table: "lninvoices",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_lninvoices_deal_fk",
                table: "lninvoices",
                column: "deal_fk",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_lninvoices_deals_deal_fk",
                table: "lninvoices",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_lninvoices_deals_deal_fk",
                table: "lninvoices");

            migrationBuilder.DropIndex(
                name: "ix_lninvoices_deal_fk",
                table: "lninvoices");

            migrationBuilder.DropColumn(
                name: "deal_fk",
                table: "lninvoices");

            migrationBuilder.RenameColumn(
                name: "initiator_ln_enabled",
                table: "deals",
                newName: "ln_enabled");

            migrationBuilder.RenameColumn(
                name: "initiator_ln_disable_balance",
                table: "deals",
                newName: "ln_disable_balance");
        }
    }
}
