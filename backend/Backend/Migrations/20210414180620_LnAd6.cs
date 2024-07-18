using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class LnAd6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "fee_from_balance", table: "lnpayment");
            migrationBuilder.AddColumn<decimal>(
                name: "fee_from_balance",
                table: "lnpayment",
                type: "numeric",
                nullable: false,
                defaultValue: 0
                );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "fee_from_balance", table: "lnpayment");
            migrationBuilder.AddColumn<bool>(
                name: "fee_from_balance",
                table: "lnpayment",
                type: "boolean",
                nullable: false);
        }
    }
}
