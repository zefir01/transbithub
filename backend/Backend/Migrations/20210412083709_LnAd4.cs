using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class LnAd4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "fee_from_balance",
                table: "lnpayment",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fee_from_balance",
                table: "lnpayment");
        }
    }
}
